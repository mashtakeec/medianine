/**
 * 正確な音声長でtimeline.jsonを再生成
 */
require("dotenv/config");
const fs = require("fs");
const path = require("path");
const mp3Duration = require("mp3-duration");

const BASE_DIR = path.join(__dirname, "..");
const SLIDES_PATH = path.join(BASE_DIR, "src", "data", "slides.json");
const TIMELINE_PATH = path.join(BASE_DIR, "src", "data", "timeline.json");
const AUDIO_DIR = path.join(BASE_DIR, "public", "audio");

const FPS = 60;
const TRANSITION_FRAMES = 30;

async function main() {
  const allSlides = JSON.parse(fs.readFileSync(SLIDES_PATH, "utf-8"));
  const targetSlides = allSlides.filter((s) => s.slideNumber >= 1 && s.slideNumber <= 15);

  const timelineSlides = [];
  let currentFrame = 0;

  for (const slide of targetSlides) {
    const audioPath = path.join(AUDIO_DIR, `${slide.id}.mp3`);
    if (!fs.existsSync(audioPath)) {
      console.warn(`${slide.id}: 音声ファイルなし、スキップ`);
      continue;
    }

    const durationSec = await mp3Duration(audioPath);
    const durationMs = Math.round(durationSec * 1000);
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

    console.log(`${slide.id}: ${durationSec.toFixed(1)}s → ${totalDuration}f (from ${currentFrame})`);
    currentFrame += totalDuration;
  }

  const timeline = {
    fps: FPS,
    totalDurationFrames: currentFrame,
    totalDurationSeconds: (currentFrame / FPS).toFixed(1),
    slides: timelineSlides,
  };

  fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timeline, null, 2), "utf-8");
  console.log(`\n完了: ${currentFrame}f = ${timeline.totalDurationSeconds}秒 (${(currentFrame / FPS / 60).toFixed(1)}分)`);
}

main().catch(console.error);
