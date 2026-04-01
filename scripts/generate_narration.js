/**
 * Phase 2: ナレーション台本生成 + TTS音声化 + タイムライン生成
 *
 * 使い方: node scripts/generate_narration.js
 * 環境変数: OPENAI_API_KEY (.envから読み込み)
 */
require("dotenv/config");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai").default;

const BASE_DIR = path.join(__dirname, "..");
const SLIDES_PATH = path.join(BASE_DIR, "src", "data", "slides.json");
const NARRATION_DIR = path.join(BASE_DIR, "public", "audio", "narration");
const AUDIO_DIR = path.join(BASE_DIR, "public", "audio");
const TIMELINE_PATH = path.join(BASE_DIR, "src", "data", "timeline.json");

const FPS = 60;
const TRANSITION_FRAMES = 30; // 0.5秒の入退場

// P01〜P15のみ対象
const TARGET_RANGE = { start: 1, end: 15 };

// スライドタイプ別のナレーション文字数目安
const CHAR_TARGETS = {
  cover: { min: 40, max: 60 },           // 10〜15秒
  "phase-divider": { min: 50, max: 80 }, // 12〜20秒
  "lesson-title": { min: 40, max: 60 },  // 10〜15秒
  "learning-objectives": { min: 80, max: 120 }, // 20〜30秒
  "content-cards": { min: 60, max: 100 },       // 15〜25秒
  summary: { min: 80, max: 120 },               // 20〜30秒
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- AI台本生成 ---
async function generateScript(slide) {
  const target = CHAR_TARGETS[slide.type] || CHAR_TARGETS["content-cards"];

  const prompt = `あなたは「Ai-BOW AI School 2026」の研修講師です。
受講者に寄り添い、わかりやすく丁寧に解説するプロの講師として、以下のスライドに対応するナレーション原稿を書いてください。

## ルール
- スライドの内容をそのまま読み上げるのではなく、自然な講義トークに膨らませてください
- 「では」「さて」「ここで大事なのは」など接続表現を自然に入れてください
- 文字数は${target.min}〜${target.max}文字程度（読み上げ約${Math.round(target.min / 4)}〜${Math.round(target.max / 4)}秒）
- 温かく、励ましのトーンで
- ナレーション原稿のみ出力（注釈や説明は不要）

## スライド情報
- スライド番号: ${slide.id}
- タイトル: ${slide.title}
- タイプ: ${slide.type}
- 章: ${slide.chapter || "オープニング"}
- テキスト内容:
${slide.extractedText.map((t) => `  - ${t}`).join("\n")}

ナレーション原稿:`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

// --- TTS音声生成 ---
async function generateAudio(slideId, text) {
  const response = await client.audio.speech.create({
    model: "tts-1-hd",
    voice: "nova",
    input: text,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = path.join(AUDIO_DIR, `${slideId}.mp3`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

// --- MP3の長さを取得（簡易版: ファイルサイズから推定、後でffprobeに置換可能） ---
function estimateDurationMs(filePath) {
  const stats = fs.statSync(filePath);
  // tts-1-hd nova の平均ビットレート: 約48kbps (MP3 Opus)
  // より正確にはffprobeを使うべきだが、まずは推定で進める
  const bytesPerSecond = 48000 / 8; // 6000 bytes/sec
  return Math.round((stats.size / bytesPerSecond) * 1000);
}

// --- ffprobeで正確な長さを取得（利用可能な場合） ---
function getDurationWithFfprobe(filePath) {
  try {
    const { execSync } = require("child_process");
    const result = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`,
      { encoding: "utf-8" }
    ).trim();
    return Math.round(parseFloat(result) * 1000);
  } catch {
    return null;
  }
}

// --- メイン ---
async function main() {
  fs.mkdirSync(NARRATION_DIR, { recursive: true });
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const allSlides = JSON.parse(fs.readFileSync(SLIDES_PATH, "utf-8"));
  const targetSlides = allSlides.filter(
    (s) => s.slideNumber >= TARGET_RANGE.start && s.slideNumber <= TARGET_RANGE.end
  );

  console.log(`\n=== ナレーション生成: ${targetSlides.length}スライド ===\n`);

  const timelineSlides = [];
  let currentFrame = 0;

  for (const slide of targetSlides) {
    // 1. 台本生成
    console.log(`[${slide.id}] ${slide.title} (${slide.type})`);
    console.log("  台本生成中...");
    const script = await generateScript(slide);
    console.log(`  → ${script.length}文字: "${script.substring(0, 50)}..."`);

    // 台本保存
    const scriptPath = path.join(NARRATION_DIR, `${slide.id}.txt`);
    fs.writeFileSync(scriptPath, script, "utf-8");

    // 2. TTS音声生成
    console.log("  TTS音声生成中...");
    const audioPath = await generateAudio(slide.id, script);

    // 3. 音声の長さ取得
    let durationMs = getDurationWithFfprobe(audioPath);
    if (!durationMs) {
      durationMs = estimateDurationMs(audioPath);
      console.log(`  → 音声生成完了 (推定 ${(durationMs / 1000).toFixed(1)}秒)`);
    } else {
      console.log(`  → 音声生成完了 (${(durationMs / 1000).toFixed(1)}秒)`);
    }

    // 4. フレーム計算
    const audioDurationFrames = Math.ceil((durationMs / 1000) * FPS);
    const totalDuration = audioDurationFrames + TRANSITION_FRAMES * 2; // 入場 + 余韻

    timelineSlides.push({
      id: slide.id,
      title: slide.title,
      type: slide.type,
      chapter: slide.chapter,
      fromFrame: currentFrame,
      durationInFrames: totalDuration,
      audioDurationMs: durationMs,
      audioFile: `audio/${slide.id}.mp3`,
      narrationFile: `audio/narration/${slide.id}.txt`,
    });

    currentFrame += totalDuration;
    console.log(`  → フレーム: ${timelineSlides[timelineSlides.length - 1].fromFrame}〜${currentFrame} (${totalDuration}f)\n`);
  }

  // タイムライン出力
  const timeline = {
    fps: FPS,
    totalDurationFrames: currentFrame,
    totalDurationSeconds: (currentFrame / FPS).toFixed(1),
    slides: timelineSlides,
  };

  fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timeline, null, 2), "utf-8");
  console.log(`=== タイムライン生成完了 ===`);
  console.log(`  総フレーム数: ${currentFrame}`);
  console.log(`  総時間: ${timeline.totalDurationSeconds}秒 (${(currentFrame / FPS / 60).toFixed(1)}分)`);
  console.log(`  出力: ${TIMELINE_PATH}`);
}

main().catch(console.error);
