import os
import json
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

AUDIO_PATH = Path(__file__).parent / "audio.mp3"
OUTPUT_PATH = Path(__file__).parent / "subtitles.json"


def transcribe():
    print(f"文字起こし中: {AUDIO_PATH.name}")

    with open(AUDIO_PATH, "rb") as audio_file:
        result = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="ja",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"],
        )

    segments = []
    for seg in result.segments:
        segments.append({
            "id": seg.id,
            "text": seg.text.strip(),
            "start": seg.start,
            "end": seg.end,
        })

    output = {
        "source": AUDIO_PATH.name,
        "language": "ja",
        "full_text": result.text,
        "segments": segments,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"完了! {len(segments)}件のセグメント")
    print(f"出力: {OUTPUT_PATH}")
    print(f"\n全文:\n{result.text}")


if __name__ == "__main__":
    transcribe()
