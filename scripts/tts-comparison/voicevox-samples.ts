/**
 * VOICEVOX サンプル生成（研修動画向けの声を厳選）
 */
import "dotenv/config";
import fs from "fs";
import path from "path";

const SAMPLES_DIR = path.join(__dirname, "samples");
const BASE = "http://localhost:50021";

const SAMPLE_TEXT =
  "皆さん、こんにちは。Ai-BOW AIスクール2026へようこそ。このコースでは、AIライティングを活用してYouTube台本案件を獲得する方法を学んでいきます。全8レッスン、4つのフェーズで構成されています。それでは、一緒に始めましょう。";

// 研修動画向けに厳選した声
const VOICES = [
  // 男性系（落ち着いた声）
  { id: 13, name: "青山龍星_ノーマル" },
  { id: 84, name: "青山龍星_しっとり" },
  { id: 11, name: "玄野武宏_ノーマル" },
  { id: 52, name: "雀松朱司_ノーマル" },
  // 女性系（アナウンサー系・落ち着き）
  { id: 2,  name: "四国めたん_ノーマル" },
  { id: 16, name: "九州そら_ノーマル" },
  { id: 30, name: "No7_アナウンス" },
  { id: 31, name: "No7_読み聞かせ" },
  { id: 46, name: "小夜SAYO_ノーマル" },
  { id: 47, name: "ナースロボT_ノーマル" },
  // 中性的
  { id: 21, name: "剣崎雌雄_ノーマル" },
  { id: 100, name: "黒沢冴白_ノーマル" },
];

async function generate(voice: { id: number; name: string }) {
  console.log(`  ${voice.name} (id=${voice.id}) ...`);

  const queryRes = await fetch(
    `${BASE}/audio_query?text=${encodeURIComponent(SAMPLE_TEXT)}&speaker=${voice.id}`,
    { method: "POST" }
  );
  const query = await queryRes.json();

  // スピード少し調整（研修向けにやや遅め）
  query.speedScale = 1.0;
  query.pitchScale = 0.0;

  const synthRes = await fetch(`${BASE}/synthesis?speaker=${voice.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const buffer = Buffer.from(await synthRes.arrayBuffer());
  const outPath = path.join(SAMPLES_DIR, `voicevox_${voice.name}.wav`);
  fs.writeFileSync(outPath, buffer);
  console.log(`  → ${outPath}`);
}

async function main() {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
  console.log(`\nサンプルテキスト:\n  "${SAMPLE_TEXT}"\n`);
  console.log(`=== VOICEVOX 研修動画向け ${VOICES.length}声 ===\n`);

  for (const voice of VOICES) {
    try {
      await generate(voice);
    } catch (e: any) {
      console.error(`  ${voice.name} failed:`, e.message);
    }
  }

  console.log("\n完了! samples/ フォルダで聴き比べてください。");
  const files = fs.readdirSync(SAMPLES_DIR).filter((f) => f.startsWith("voicevox_"));
  console.log(`\nVOICEVOXサンプル (${files.length}件):`);
  files.forEach((f) => console.log(`  - ${f}`));
}

main().catch(console.error);
