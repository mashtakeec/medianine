/**
 * ストーリーボード一括生成
 *
 * スライドの要素構成をもとに、要素ごとのナレーション付きストーリーボードをAI生成
 * → TTS音声生成 → 文字数比率でタイミング計算 → storyboard.json出力
 */
require("dotenv/config");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai").default;
const mp3Duration = require("mp3-duration");

const BASE_DIR = path.join(__dirname, "..");
const SLIDES_PATH = path.join(BASE_DIR, "src", "data", "slides_lesson1.json");
const ANIM_PLAN_PATH = path.join(BASE_DIR, "src", "data", "animation_cues.json");
const AUDIO_DIR = path.join(BASE_DIR, "public", "audio");
const STORYBOARD_PATH = path.join(BASE_DIR, "src", "data", "storyboard.json");
const TIMELINE_PATH = path.join(BASE_DIR, "src", "data", "timeline.json");

const FPS = 60;
const TRANSITION_FRAMES = 30;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- 各ステップの実際の表示テキストをHTML DOMから抽出 ---
function extractStepTexts(slideContent, animSteps) {
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM(slideContent);
  const doc = dom.window.document;

  return animSteps.map((step) => {
    const el = doc.querySelector(step.selector);
    if (!el) return step.label;
    // テキストを抽出（長すぎる場合は切り詰め）
    const text = el.textContent.replace(/\s+/g, " ").trim();
    return text.substring(0, 150) || step.label;
  });
}

// --- ストーリーボード生成（AI） ---
async function generateStoryboard(slide, animSteps) {
  // 各ステップが実際に画面に表示するテキストを取得
  const stepTexts = extractStepTexts(slide.content, animSteps);

  const stepsDescription = animSteps
    .map((s, i) => `  ステップ${i + 1}: [${s.label}]\n    画面表示内容: 「${stepTexts[i]}」`)
    .join("\n");

  const prompt = `プレゼン動画のナレーション。各ステップで画面に要素が1つ出る。そのタイミングで話す内容を書け。

絶対ルール:
- ステップNのナレーション = ステップNの「画面表示内容」についてのみ話す。他のステップの内容に触れない。
- 各ステップ15〜35文字。短く簡潔に。
- ${animSteps.length}個のステップ全部書く。
- JSON配列のみ出力。

スライド: ${slide.title}（${slide.chapter || "オープニング"}）

ステップ:
${stepsDescription}

出力:
[{"step":0,"narration":"..."},{"step":1,"narration":"..."}]`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content.trim();
  try {
    const parsed = JSON.parse(raw);
    // 配列 or オブジェクトの値から配列を見つける
    let arr;
    if (Array.isArray(parsed)) {
      arr = parsed;
    } else {
      // オブジェクトのvalueから配列を探す
      for (const val of Object.values(parsed)) {
        if (Array.isArray(val)) { arr = val; break; }
      }
      // 単一オブジェクト（stepが1つだけ）の場合は配列に包む
      if (!arr && parsed.narration) {
        arr = [parsed];
      }
      // まだ見つからない場合、valuesを配列として扱う
      if (!arr) {
        const vals = Object.values(parsed);
        if (vals.length > 0 && typeof vals[0] === 'string') {
          arr = vals.map((v, i) => ({ step: i, narration: v }));
        }
      }
    }
    if (!arr || !Array.isArray(arr)) throw new Error("配列が見つからない: " + raw.substring(0, 100));
    return arr.map((item) => item.narration || item.text || item.content || String(item));
  } catch (e) {
    console.error(`  JSON解析エラー: ${e.message}`);
    console.error(`  生出力: ${raw.substring(0, 200)}`);
    // フォールバック: ステップ数分のダミー
    return animSteps.map((s) => `${s.label}について説明します。`);
  }
}

// --- TTS音声生成 ---
async function generateAudio(slideId, fullText) {
  const response = await client.audio.speech.create({
    model: "tts-1-hd",
    voice: "nova",
    input: fullText,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = path.join(AUDIO_DIR, `${slideId}.mp3`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

// --- メイン ---
async function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const slides = JSON.parse(fs.readFileSync(SLIDES_PATH, "utf-8"));
  const animPlan = JSON.parse(fs.readFileSync(ANIM_PLAN_PATH, "utf-8"));

  const storyboard = {};
  const timelineSlides = [];
  let currentFrame = 0;

  console.log("=== ストーリーボード生成 ===\n");

  for (const slide of slides) {
    const animSteps = animPlan[slide.id] || [];
    if (animSteps.length === 0) {
      console.log(`[${slide.id}] ${slide.title} — アニメーションステップなし、スキップ`);
      continue;
    }

    // 1. AI台本生成
    console.log(`[${slide.id}] ${slide.title} (${animSteps.length}ステップ)`);
    console.log("  台本生成中...");
    const narrations = await generateStoryboard(slide, animSteps);

    // ステップ数を合わせる
    while (narrations.length < animSteps.length) {
      narrations.push("続きを見ていきましょう。");
    }

    const steps = animSteps.map((anim, i) => ({
      selector: anim.selector,
      label: anim.label,
      narration: narrations[i] || "",
    }));

    steps.forEach((s, i) => {
      console.log(`  [${i}] ${s.selector} → "${s.narration.substring(0, 40)}..."`);
    });

    // 2. 全ナレーションを結合してTTS生成
    const fullText = steps.map((s) => s.narration).join(" ");
    console.log(`  TTS生成中... (${fullText.length}文字)`);
    const audioPath = await generateAudio(slide.id, fullText);

    // 3. 音声の長さ取得
    const durationSec = await mp3Duration(audioPath);
    const durationMs = Math.round(durationSec * 1000);
    console.log(`  → ${durationSec.toFixed(1)}秒`);

    // 4. 文字数比率でタイミング計算
    const totalChars = steps.reduce((sum, s) => sum + s.narration.length, 0);
    let charOffset = 0;

    const timedSteps = steps.map((s) => {
      const ratio = charOffset / totalChars;
      const startMs = Math.round(ratio * durationMs);
      const startFrame = Math.round(ratio * durationSec * FPS);
      charOffset += s.narration.length;
      return {
        ...s,
        startMs,
        startFrame,
      };
    });

    // 5. ストーリーボードに追加
    storyboard[slide.id] = {
      title: slide.title,
      type: slide.type,
      audioDurationMs: durationMs,
      steps: timedSteps,
    };

    // 6. タイムラインに追加
    const audioDurationFrames = Math.ceil(durationSec * FPS);
    const totalDuration = audioDurationFrames + TRANSITION_FRAMES * 2;

    timelineSlides.push({
      id: slide.id,
      title: slide.title,
      type: slide.type,
      chapter: slide.chapter,
      fromFrame: currentFrame,
      durationInFrames: totalDuration,
      audioDurationMs: durationMs,
      audioFile: `audio/${slide.id}.mp3`,
    });

    currentFrame += totalDuration;
    console.log(`  → フレーム: ${currentFrame - totalDuration}〜${currentFrame}\n`);
  }

  // 出力
  fs.writeFileSync(STORYBOARD_PATH, JSON.stringify(storyboard, null, 2), "utf-8");
  console.log(`ストーリーボード → ${STORYBOARD_PATH}`);

  const timeline = {
    fps: FPS,
    totalDurationFrames: currentFrame,
    totalDurationSeconds: (currentFrame / FPS).toFixed(1),
    slides: timelineSlides,
  };
  fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timeline, null, 2), "utf-8");

  console.log(`タイムライン → ${TIMELINE_PATH}`);
  console.log(`合計: ${timeline.totalDurationSeconds}秒 (${(currentFrame / FPS / 60).toFixed(1)}分)`);
}

main().catch(console.error);
