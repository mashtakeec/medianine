import json
import subprocess
import re
from pathlib import Path

AUDIO_PATH = Path(__file__).parent / "background_audio.mp3"
OUTPUT_PATH = Path(__file__).parent / "silence_ranges.json"

# 設定
NOISE_THRESHOLD = "-30dB"  # 無音と判定する音量閾値
MIN_SILENCE_DURATION = 0.5  # 最小無音時間（秒）


def detect_silence():
    print(f"無音検出中: {AUDIO_PATH.name}")
    print(f"  閾値: {NOISE_THRESHOLD}, 最小無音: {MIN_SILENCE_DURATION}秒")

    # npx remotion ffmpeg 経由で実行
    remotion_dir = str(Path(__file__).parent.parent / "remotion-project")

    cmd = [
        "npx", "remotion", "ffmpeg",
        "-i", str(AUDIO_PATH),
        "-af", f"silencedetect=noise={NOISE_THRESHOLD}:d={MIN_SILENCE_DURATION}",
        "-f", "null",
        "-"
    ]

    import os
    original_dir = os.getcwd()
    os.chdir(remotion_dir)

    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    os.chdir(original_dir)
    output = result.stderr

    # silencedetectの出力をパース
    silence_starts = re.findall(r"silence_start: ([\d.]+)", output)
    silence_ends = re.findall(r"silence_end: ([\d.]+)", output)

    ranges = []
    for i, start in enumerate(silence_starts):
        start_sec = float(start)
        end_sec = float(silence_ends[i]) if i < len(silence_ends) else None

        if end_sec is None:
            continue

        ranges.append({
            "start": round(start_sec, 3),
            "end": round(end_sec, 3),
            "duration": round(end_sec - start_sec, 3),
            "type": "silence",
        })

    output_data = {
        "source": AUDIO_PATH.name,
        "settings": {
            "noise_threshold": NOISE_THRESHOLD,
            "min_silence_duration": MIN_SILENCE_DURATION,
        },
        "silence_ranges": ranges,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"完了! {len(ranges)}件の無音区間を検出")
    for r in ranges:
        print(f"  {r['start']:.1f}s ~ {r['end']:.1f}s ({r['duration']:.1f}s)")
    print(f"出力: {OUTPUT_PATH}")


if __name__ == "__main__":
    detect_silence()
