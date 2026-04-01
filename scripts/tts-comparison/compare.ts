/**
 * TTS比較スクリプト
 * VOICEVOX / OpenAI TTS / Google TTS のサンプル音声を生成して聴き比べる
 *
 * 使い方:
 *   npx tsx scripts/tts-comparison/compare.ts
 *
 * 環境変数:
 *   OPENAI_API_KEY  - OpenAI APIキー
 */

import "dotenv/config";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const SAMPLES_DIR = path.join(__dirname, "samples");

// P01表紙を想定したサンプルナレーション
const SAMPLE_TEXT =
  "皆さん、こんにちは。Ai-BOW AIスクール2026へようこそ。このコースでは、AIライティングを活用してYouTube台本案件を獲得する方法を学んでいきます。全8レッスン、4つのフェーズで構成されています。それでは、一緒に始めましょう。";

// =============================================
// 1. VOICEVOX
// =============================================
async function generateVoicevox() {
  const BASE = "http://localhost:50021";

  // 利用可能なスピーカー一覧を取得
  let speakersRes: Response;
  try {
    speakersRes = await fetch(`${BASE}/speakers`);
  } catch {
    console.error("  VOICEVOX Engine が起動していません。アプリを起動してから再実行してください。スキップします。");
    return;
  }
  if (!speakersRes.ok) {
    console.error("  VOICEVOX Engine との通信に失敗しました。スキップします。");
    return;
  }
  const speakers: any[] = await speakersRes.json();

  // 代表的な声を3つ選ぶ
  const voiceIds = [
    { id: 3, name: "ずんだもん_ノーマル" },
    { id: 1, name: "四国めたん_ノーマル" },
    { id: 13, name: "青山龍星_ノーマル" },
  ];

  for (const voice of voiceIds) {
    try {
      console.log(`  VOICEVOX: ${voice.name} (id=${voice.id}) ...`);

      // audio_query
      const queryRes = await fetch(
        `${BASE}/audio_query?text=${encodeURIComponent(SAMPLE_TEXT)}&speaker=${voice.id}`,
        { method: "POST" }
      );
      const query = await queryRes.json();

      // synthesis
      const synthRes = await fetch(
        `${BASE}/synthesis?speaker=${voice.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        }
      );
      const buffer = Buffer.from(await synthRes.arrayBuffer());
      const outPath = path.join(SAMPLES_DIR, `voicevox_${voice.name}.wav`);
      fs.writeFileSync(outPath, buffer);
      console.log(`  → ${outPath}`);
    } catch (e: any) {
      console.error(`  VOICEVOX ${voice.name} failed:`, e.message);
    }
  }
}

// =============================================
// 2. OpenAI TTS
// =============================================
async function generateOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("  OPENAI_API_KEY が設定されていません。スキップします。");
    return;
  }

  const client = new OpenAI({ apiKey });

  const voices: Array<{ voice: "alloy" | "nova" | "shimmer" | "onyx"; model: "tts-1" | "tts-1-hd" }> = [
    { voice: "alloy", model: "tts-1" },
    { voice: "nova", model: "tts-1" },
    { voice: "shimmer", model: "tts-1" },
    { voice: "onyx", model: "tts-1" },
    { voice: "nova", model: "tts-1-hd" },
  ];

  for (const { voice, model } of voices) {
    try {
      console.log(`  OpenAI: ${model}/${voice} ...`);
      const response = await client.audio.speech.create({
        model,
        voice,
        input: SAMPLE_TEXT,
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      const outPath = path.join(SAMPLES_DIR, `openai_${model}_${voice}.mp3`);
      fs.writeFileSync(outPath, buffer);
      console.log(`  → ${outPath}`);
    } catch (e: any) {
      console.error(`  OpenAI ${model}/${voice} failed:`, e.message);
    }
  }
}

// =============================================
// Main
// =============================================
async function main() {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });

  console.log("\nサンプルテキスト:");
  console.log(`  "${SAMPLE_TEXT}"\n`);

  console.log("=== VOICEVOX ===");
  await generateVoicevox();

  console.log("\n=== OpenAI TTS ===");
  await generateOpenAI();

  console.log("\n完了! samples/ フォルダの音声ファイルを聴き比べてください。");
  console.log(`  ${SAMPLES_DIR}/`);

  // ファイル一覧
  const files = fs.readdirSync(SAMPLES_DIR).filter((f) => f.endsWith(".wav") || f.endsWith(".mp3"));
  console.log(`\n生成されたファイル (${files.length}件):`);
  files.forEach((f) => console.log(`  - ${f}`));
}

main().catch(console.error);
