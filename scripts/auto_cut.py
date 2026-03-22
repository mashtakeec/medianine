import json
from pathlib import Path

WORDS_PATH = Path(__file__).parent / "words.json"
SILENCE_PATH = Path(__file__).parent / "silence_ranges.json"
SEGMENTS_PATH = Path(__file__).parent / "subtitles_background.json"
OUTPUT_PATH = Path(__file__).parent / "cut_candidates.json"
SUBTITLES_OUTPUT = Path(__file__).parent / "subtitles_adjusted.json"

FPS = 60
MAX_SUBTITLE_CHARS = 25  # テロップ1つの最大文字数


def sec_to_frame(sec: float) -> int:
    return round(sec * FPS)


def load_words():
    with open(WORDS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_silence():
    with open(SILENCE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)["silence_ranges"]


def load_segments():
    with open(SEGMENTS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)["segments"]


# ============================================================
# 1. フィラー検出: Whisperが検出しなかった音声区間を特定
# ============================================================

def detect_unrecognized_audio(words, silence_ranges):
    """
    「無音でもない、Whisperの単語でもない」区間 = フィラー候補
    音声の開始(0s)から終了まで、単語と無音で埋まらない隙間を探す
    """
    # 全ての「埋まっている」区間を集める
    covered = []
    for w in words:
        covered.append((w["start"], w["end"]))
    for s in silence_ranges:
        covered.append((s["start"], s["end"]))

    # ソートしてマージ
    covered.sort()
    merged_covered = []
    for start, end in covered:
        if merged_covered and start <= merged_covered[-1][1] + 0.01:
            merged_covered[-1] = (merged_covered[-1][0], max(merged_covered[-1][1], end))
        else:
            merged_covered.append((start, end))

    # 隙間を検出（最初の単語の開始から最後の単語の終了まで）
    if not words:
        return []

    audio_start = 0.0
    audio_end = max(w["end"] for w in words)

    fillers = []
    cursor = audio_start
    for cov_start, cov_end in merged_covered:
        if cov_start > cursor + 0.1:  # 0.1秒以上の隙間
            fillers.append({
                "start": cursor,
                "end": cov_start,
                "duration": round(cov_start - cursor, 3),
                "type": "filler",
            })
        cursor = max(cursor, cov_end)

    if audio_end > cursor + 0.1:
        fillers.append({
            "start": cursor,
            "end": audio_end,
            "duration": round(audio_end - cursor, 3),
            "type": "filler",
        })

    return fillers


# ============================================================
# カット区間を単語境界にクリップ
# ============================================================

def clip_to_word_boundaries(ranges, words):
    """単語が発声されている区間は絶対にカットしない"""
    clipped = []
    for r in ranges:
        start = r["start"]
        end = r["end"]

        for w in words:
            ws, we = w["start"], w["end"]
            if ws < start < we:
                start = we
            if ws < end < we:
                end = ws

        if end > start + 0.05:
            clipped.append(dict(r, start=start, end=end))

    return clipped


def merge_ranges(ranges, words):
    """カット区間を単語境界にクリップしてからマージ"""
    if not ranges:
        return []

    clipped = clip_to_word_boundaries(ranges, words)
    sorted_ranges = sorted(clipped, key=lambda r: r["start"])
    if not sorted_ranges:
        return []

    merged = []
    current = dict(sorted_ranges[0])
    current["types"] = [current.get("type", "unknown")]

    for r in sorted_ranges[1:]:
        if r["start"] <= current["end"] + 0.05:
            current["end"] = max(current["end"], r["end"])
            if r.get("type") and r["type"] not in current["types"]:
                current["types"].append(r["type"])
        else:
            if current["end"] > current["start"]:
                merged.append(current)
            current = dict(r)
            current["types"] = [r.get("type", "unknown")]

    if current["end"] > current["start"]:
        merged.append(current)

    return merged


# ============================================================
# カット後のタイミング計算
# ============================================================

def calc_offset(sec, cut_ranges):
    """元の秒数をカット後の秒数に変換"""
    offset = 0
    for c in cut_ranges:
        if c["end"] <= sec:
            offset += c["end"] - c["start"]
        elif c["start"] < sec:
            offset += sec - c["start"]
    return sec - offset


# ============================================================
# 2. テロップ生成: セグメントベース + 長いテロップの自動分割
# ============================================================

def split_long_subtitle(kept_words, cut_ranges_sec, max_chars=MAX_SUBTITLE_CHARS):
    """
    kept_wordsのリストから、max_chars以下のテロップに分割する。
    分割点は単語の境界で行う。
    """
    if not kept_words:
        return []

    subtitles = []
    current_words = []
    current_text = ""

    for w in kept_words:
        word_text = w["word"]
        test_text = current_text + word_text

        # 文末（。）で強制分割
        if current_words and any(current_text.rstrip().endswith(p) for p in ["。", "でした。", "ます。"]):
            new_start = calc_offset(current_words[0]["start"], cut_ranges_sec)
            new_end = calc_offset(current_words[-1]["end"], cut_ranges_sec)
            subtitles.append({
                "text": current_text.strip(),
                "startFrame": sec_to_frame(new_start),
                "endFrame": sec_to_frame(new_end),
            })
            current_words = [w]
            current_text = word_text
            continue

        # 最大文字数を超えたら、自然な区切りで分割
        if len(test_text) > max_chars and current_words:
            new_start = calc_offset(current_words[0]["start"], cut_ranges_sec)
            new_end = calc_offset(current_words[-1]["end"], cut_ranges_sec)
            subtitles.append({
                "text": current_text.strip(),
                "startFrame": sec_to_frame(new_start),
                "endFrame": sec_to_frame(new_end),
            })
            current_words = [w]
            current_text = word_text
        else:
            current_words.append(w)
            current_text = test_text

    # 残り
    if current_words:
        text = current_text.strip()
        if text:
            new_start = calc_offset(current_words[0]["start"], cut_ranges_sec)
            new_end = calc_offset(current_words[-1]["end"], cut_ranges_sec)
            subtitles.append({
                "text": text,
                "startFrame": sec_to_frame(new_start),
                "endFrame": sec_to_frame(new_end),
            })

    return subtitles


def generate_subtitles_from_words(words, cut_ranges_sec):
    """セグメントベースでテロップ生成 + 長いテロップは自動分割"""
    segments = load_segments()
    all_subtitles = []

    for seg in segments:
        seg_start = seg["start"]
        seg_end = seg["end"]

        # このセグメントに属する単語を取得
        seg_words = [
            w for w in words
            if w["start"] >= seg_start - 0.5 and w["end"] <= seg_end + 0.5
        ]

        # カット区間に含まれない単語だけ残す
        kept_words = []
        for w in seg_words:
            word_mid = (w["start"] + w["end"]) / 2
            is_cut = any(c["start"] <= word_mid <= c["end"] for c in cut_ranges_sec)
            if not is_cut:
                kept_words.append(w)

        if not kept_words:
            continue

        # 長いテロップは自動分割
        subs = split_long_subtitle(kept_words, cut_ranges_sec)
        all_subtitles.extend(subs)

    # テロップ重複禁止: 前のテロップのendFrameより後にstartFrameを設定
    for i in range(1, len(all_subtitles)):
        prev_end = all_subtitles[i - 1]["endFrame"]
        if all_subtitles[i]["startFrame"] < prev_end:
            all_subtitles[i]["startFrame"] = prev_end

    return all_subtitles


# ============================================================
# メイン処理
# ============================================================

def generate_cut_candidates():
    print("カット候補を生成中...")

    words = load_words()
    silence_ranges = load_silence()

    # フィラー検出（Whisperが検出しなかった音声区間）
    fillers = detect_unrecognized_audio(words, silence_ranges)
    print(f"  フィラー候補（未認識音声）: {len(fillers)}件")
    for f in fillers:
        print(f"    {f['start']:.2f}s ~ {f['end']:.2f}s ({f['duration']:.2f}s)")

    # 無音区間
    print(f"  無音区間: {len(silence_ranges)}件")

    # 全候補をマージ（単語境界にクリップ）
    all_ranges = silence_ranges + fillers
    merged = merge_ranges(all_ranges, words)

    # カット区間（秒単位）
    cut_ranges_sec = [{"start": r["start"], "end": r["end"]} for r in merged]

    # Remotion用のフレーム数に変換
    cut_ranges = []
    for r in merged:
        from_frame = sec_to_frame(r["start"])
        to_frame = sec_to_frame(r["end"])
        if to_frame > from_frame:
            label_parts = []
            if "silence" in r["types"]:
                label_parts.append("無音")
            if "filler" in r["types"]:
                label_parts.append("フィラー")
            label = "+".join(label_parts) if label_parts else "カット"

            cut_ranges.append({
                "fromFrame": from_frame,
                "toFrame": to_frame,
                "label": f"{label} ({r['start']:.1f}s~{r['end']:.1f}s)",
                "startSec": r["start"],
                "endSec": r["end"],
                "types": r["types"],
            })

    # カット後のテロップを再生成（自動分割込み）
    subtitles = generate_subtitles_from_words(words, cut_ranges_sec)

    # JSON出力
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "fps": FPS,
            "filler_detected": len(fillers),
            "silence_detected": len(silence_ranges),
            "total_cuts": len(cut_ranges),
            "cut_ranges": cut_ranges,
        }, f, ensure_ascii=False, indent=2)

    with open(SUBTITLES_OUTPUT, "w", encoding="utf-8") as f:
        json.dump({"subtitles": subtitles}, f, ensure_ascii=False, indent=2)

    total_cut_sec = sum((c["endSec"] - c["startSec"]) for c in cut_ranges)
    print(f"\n結果:")
    print(f"  カット: {len(cut_ranges)}件 (合計 {total_cut_sec:.1f}秒)")
    for c in cut_ranges:
        print(f"    {c['startSec']:.1f}s ~ {c['endSec']:.1f}s : {c['label']}")

    print(f"\nテロップ: {len(subtitles)}件")
    for s in subtitles:
        print(f"    [{s['startFrame']}~{s['endFrame']}] {s['text']}")


if __name__ == "__main__":
    generate_cut_candidates()
