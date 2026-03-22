"""
テロップ手動修正スクリプト

使い方:
  python fix_subtitles.py list              # 現在のテロップ一覧
  python fix_subtitles.py set 1 text "新しいテキスト"
  python fix_subtitles.py set 1 start 100
  python fix_subtitles.py set 1 end 500
  python fix_subtitles.py split 3 15        # 3番を15文字目で分割
  python fix_subtitles.py merge 3 4         # 3番と4番を結合
  python fix_subtitles.py delete 5          # 5番を削除
"""

import json
import sys
from pathlib import Path

SUBTITLES_PATH = Path(__file__).parent / "subtitles_adjusted.json"


def load_subtitles():
    with open(SUBTITLES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)["subtitles"]


def save_subtitles(subtitles):
    with open(SUBTITLES_PATH, "w", encoding="utf-8") as f:
        json.dump({"subtitles": subtitles}, f, ensure_ascii=False, indent=2)
    print("保存しました。")


def show_list(subtitles):
    print(f"\nテロップ一覧 ({len(subtitles)}件):")
    print("-" * 70)
    for i, s in enumerate(subtitles):
        dur_sec = (s["endFrame"] - s["startFrame"]) / 60
        chars = len(s["text"])
        print(f"  {i+1}. [{s['startFrame']}~{s['endFrame']}] ({dur_sec:.1f}秒) {chars}文字")
        print(f"     「{s['text']}」")
    print("-" * 70)


def cmd_set(subtitles, args):
    idx = int(args[0]) - 1
    field = args[1]
    value = args[2]

    if field == "text":
        subtitles[idx]["text"] = value
    elif field == "start":
        subtitles[idx]["startFrame"] = int(value)
    elif field == "end":
        subtitles[idx]["endFrame"] = int(value)
    else:
        print(f"不明なフィールド: {field} (text, start, end のいずれか)")
        return subtitles

    print(f"  {idx+1}番を更新: {field} = {value}")
    save_subtitles(subtitles)
    return subtitles


def cmd_split(subtitles, args):
    idx = int(args[0]) - 1
    char_pos = int(args[1])

    sub = subtitles[idx]
    text = sub["text"]

    if char_pos >= len(text):
        print(f"文字位置 {char_pos} がテキスト長 {len(text)} を超えています")
        return subtitles

    text1 = text[:char_pos]
    text2 = text[char_pos:]

    total_frames = sub["endFrame"] - sub["startFrame"]
    ratio = char_pos / len(text)
    split_frame = sub["startFrame"] + round(total_frames * ratio)

    sub1 = {"text": text1, "startFrame": sub["startFrame"], "endFrame": split_frame}
    sub2 = {"text": text2, "startFrame": split_frame, "endFrame": sub["endFrame"]}

    subtitles[idx] = sub1
    subtitles.insert(idx + 1, sub2)

    print(f"  {idx+1}番を分割:")
    print(f"    {idx+1}. 「{text1}」 [{sub1['startFrame']}~{sub1['endFrame']}]")
    print(f"    {idx+2}. 「{text2}」 [{sub2['startFrame']}~{sub2['endFrame']}]")
    save_subtitles(subtitles)
    return subtitles


def cmd_merge(subtitles, args):
    idx1 = int(args[0]) - 1
    idx2 = int(args[1]) - 1

    merged = {
        "text": subtitles[idx1]["text"] + subtitles[idx2]["text"],
        "startFrame": subtitles[idx1]["startFrame"],
        "endFrame": subtitles[idx2]["endFrame"],
    }

    subtitles[idx1] = merged
    subtitles.pop(idx2)

    print(f"  結合: 「{merged['text']}」")
    save_subtitles(subtitles)
    return subtitles


def cmd_delete(subtitles, args):
    idx = int(args[0]) - 1
    removed = subtitles.pop(idx)
    print(f"  削除: 「{removed['text']}」")
    save_subtitles(subtitles)
    return subtitles


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    subtitles = load_subtitles()
    cmd = sys.argv[1]

    if cmd == "list":
        show_list(subtitles)
    elif cmd == "set" and len(sys.argv) >= 5:
        cmd_set(subtitles, sys.argv[2:5])
        show_list(subtitles)
    elif cmd == "split" and len(sys.argv) >= 4:
        cmd_split(subtitles, sys.argv[2:4])
        show_list(subtitles)
    elif cmd == "merge" and len(sys.argv) >= 4:
        cmd_merge(subtitles, sys.argv[2:4])
        show_list(subtitles)
    elif cmd == "delete" and len(sys.argv) >= 3:
        cmd_delete(subtitles, sys.argv[2:3])
        show_list(subtitles)
    else:
        print(f"不明なコマンド: {cmd}")
        print(__doc__)


if __name__ == "__main__":
    main()
