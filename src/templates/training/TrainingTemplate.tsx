import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import timelineData from "../../data/timeline.json";
import slidesParsed from "../../data/slides_parsed.json";
import storyboardData from "../../data/storyboard.json";

const TRANSITION_FRAMES = 30;

type SlideType =
  | "cover"
  | "phase-divider"
  | "lesson-title"
  | "learning-objectives"
  | "content-cards"
  | "summary";

// アニメーション種別
type AnimType =
  | "zoomIn"
  | "slideDown"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "fadeUp"
  | "expandWidth";

interface TimelineSlide {
  id: string;
  title: string;
  type: SlideType;
  chapter: string | null;
  fromFrame: number;
  durationInFrames: number;
  audioDurationMs: number;
  audioFile: string;
}

interface StoryboardStep {
  selector: string;
  label: string;
  narration: string;
  startMs: number;
  startFrame: number;
}

interface StoryboardEntry {
  title: string;
  type: string;
  audioDurationMs: number;
  steps: StoryboardStep[];
}

interface ParsedSlide {
  id: string;
  title: string;
  type: string;
  css: string;
  links: string;
  bodyHTML: string;
}

// データマップ
const parsedMap: Record<string, ParsedSlide> = {};
for (const s of slidesParsed as ParsedSlide[]) {
  parsedMap[s.id] = s;
}
const storyboard = storyboardData as Record<string, StoryboardEntry>;

/**
 * セレクタにアニメーション種別を割り当て
 * スライドタイプとセレクタのパターンで判定
 */
function getAnimType(selector: string, slideType: string, stepIndex: number): AnimType {
  // ヘッダー → 上から降りてくる
  if (selector === ".header") return "slideDown";

  // フッター/バナー → 下から上がってくる
  if (selector.includes("footer") || selector.includes("banner") || selector.includes("goal")) {
    return "slideUp";
  }

  // 左カラム → 左からスライド
  if (selector.includes("left-col") || selector.includes("left-panel")) return "slideLeft";

  // 右カラム → 右からスライド
  if (selector.includes("right-col") || selector.includes("right-heading") ||
      selector.includes("right-panel >")) return "slideRight";

  // カバー/タイトル → ズームイン
  if (slideType === "cover" || slideType === "lesson-title") return "zoomIn";

  // フェーズカラム → 下から順次
  if (selector.includes("phase-col")) return "slideUp";

  // カード系・アイテム系 → スケールアップ
  if (selector.includes("cards-area") || selector.includes("content-area >") ||
      selector.includes("item-card")) return "scaleUp";

  return "fadeUp";
}

/**
 * アニメーション種別に応じたCSS transform/opacity を計算
 */
function computeAnimStyle(
  animType: AnimType,
  progress: number // 0→1 (ease済み)
): { opacity: number; transform: string } {
  switch (animType) {
    case "zoomIn":
      return {
        opacity: progress,
        transform: `scale(${0.7 + progress * 0.3})`,
      };
    case "slideDown":
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * -30}px)`,
      };
    case "slideUp":
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 30}px)`,
      };
    case "slideLeft":
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * -40}px)`,
      };
    case "slideRight":
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * 40}px)`,
      };
    case "scaleUp":
      return {
        opacity: progress,
        transform: `scale(${0.85 + progress * 0.15}) translateY(${(1 - progress) * 12}px)`,
      };
    case "expandWidth":
      return {
        opacity: progress,
        transform: `scaleX(${0.3 + progress * 0.7})`,
      };
    case "fadeUp":
    default:
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 20}px)`,
      };
  }
}

// spring風イージング (overshoot付き)
function springEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c4 = (2 * Math.PI) / 4.5;
  return t < 0.5
    ? 1 - Math.pow(1 - 2 * t, 3)
    : 1 + Math.pow(2 * t - 2, 3) * 0.15 * Math.sin((2 * t - 2) * c4); // slight bounce
}

// cubic ease out
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

// スライド全体のトランジション
function getSlideTransition(
  type: SlideType,
  frame: number,
  durationInFrames: number
): React.CSSProperties {
  const enterProgress = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exitStart = durationInFrames - TRANSITION_FRAMES;
  const exitProgress = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
  );
  const opacity = Math.min(enterProgress, exitProgress);

  switch (type) {
    case "cover":
      return { opacity, transform: `scale(${interpolate(enterProgress, [0, 1], [0.95, 1])})` };
    case "phase-divider":
      return { opacity, transform: `translateX(${interpolate(enterProgress, [0, 1], [-40, 0])}px)` };
    case "lesson-title":
      return { opacity, transform: `scale(${interpolate(enterProgress, [0, 1], [0.98, 1])})` };
    case "summary":
      return { opacity, transform: `scale(${interpolate(exitProgress, [0, 1], [0.95, 1])})` };
    default:
      return { opacity };
  }
}

/**
 * 要素アニメーションCSS生成
 * ★重要: セレクタは必ず .scope-PXX で修飾してスコープ分離
 */
function buildElementAnimCSS(slideId: string, frame: number): string {
  const entry = storyboard[slideId];
  if (!entry?.steps?.length) return "";

  const audioStart = TRANSITION_FRAMES;
  let css = "";
  const scope = `.scope-${slideId}`;

  entry.steps.forEach((step, index) => {
    const triggerFrame = audioStart + step.startFrame;
    const elapsed = frame - triggerFrame;

    // アニメーション種別を決定
    const animType = getAnimType(step.selector, entry.type, index);

    // アニメーション時間: 種別で変える
    const animDuration = animType === "zoomIn" ? 24 : animType === "scaleUp" ? 20 : 18;
    const rawProgress = Math.max(0, Math.min(1, elapsed / animDuration));

    // イージング: スケール系はspring, それ以外はcubic
    const progress =
      animType === "scaleUp" || animType === "zoomIn"
        ? springEase(rawProgress)
        : easeOutCubic(rawProgress);

    const { opacity, transform } = computeAnimStyle(animType, progress);

    // ★ スコープ付きセレクタ
    css += `${scope} ${step.selector} {
  opacity: ${opacity.toFixed(3)};
  transform: ${transform};
}
`;
  });

  return css;
}

/**
 * ベースCSSをスコープ化
 * 各CSSルールの先頭にスコープIDを追加
 */
function scopeCSS(css: string, scopeClass: string): string {
  // ルールを1つずつパースしてスコープを付与
  return css.replace(
    /([^{}]+)\{/g,
    (match, selectors: string) => {
      const scoped = selectors
        .split(",")
        .map((sel: string) => {
          const s = sel.trim();
          if (!s) return s;
          // :root → .scope-xxx
          if (s === ":root") return `.${scopeClass}`;
          // body → .scope-xxx
          if (s === "body") return `.${scopeClass}`;
          // * → .scope-xxx *
          if (s === "*") return `.${scopeClass} *`;
          // @media等はそのまま
          if (s.startsWith("@")) return s;
          // それ以外 → .scope-xxx .selector
          return `.${scopeClass} ${s}`;
        })
        .join(", ");
      return `${scoped} {`;
    }
  );
}

// SlideRenderer: dangerouslySetInnerHTML + スコープCSS + アニメーション
const SlideRenderer: React.FC<{
  slideId: string;
  type: SlideType;
  durationInFrames: number;
}> = ({ slideId, type, durationInFrames }) => {
  const frame = useCurrentFrame();
  const parsed = parsedMap[slideId];
  if (!parsed) return null;

  const scopeClass = `scope-${slideId}`;
  const slideTransition = getSlideTransition(type, frame, durationInFrames);

  // スコープ付きベースCSS（静的）
  const scopedCSS = useMemo(
    () => scopeCSS(parsed.css, scopeClass),
    [parsed.css, scopeClass]
  );

  // 要素アニメーションCSS（スコープ済み、フレームごと）
  const animCSS = buildElementAnimCSS(slideId, frame);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#DCDCDC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...slideTransition,
      }}
    >
      {/* スコープCSS + アニメーションCSS */}
      <style dangerouslySetInnerHTML={{ __html: scopedCSS + "\n" + animCSS }} />

      {/* スライド本体: scale(2) で 960x540 → 1920x1080 */}
      <div
        className={scopeClass}
        style={{
          width: 960,
          height: 540,
          transform: "scale(2)",
          transformOrigin: "center center",
          overflow: "hidden",
          fontFamily: '"Noto Sans JP", sans-serif',
          background: "#FFFFFF",
        }}
      >
        <div
          className="slide"
          style={{
            width: 960,
            height: 540,
            position: "relative",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: parsed.bodyHTML }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ProgressBar
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = timelineData.totalDurationFrames;
  const progress = frame / totalFrames;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 4,
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          backgroundColor: "#C8232C",
        }}
      />
    </div>
  );
};

// メインコンポジション
export const TrainingTemplate: React.FC<{ showSubtitles: boolean }> = () => {
  const slides = timelineData.slides as TimelineSlide[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#DCDCDC" }}>
      {slides.map((slide) => (
        <Sequence
          key={slide.id}
          name={`${slide.id} — ${slide.title}`}
          from={slide.fromFrame}
          durationInFrames={slide.durationInFrames}
        >
          <SlideRenderer
            slideId={slide.id}
            type={slide.type}
            durationInFrames={slide.durationInFrames}
          />
          <Audio
            src={staticFile(slide.audioFile)}
            startFrom={0}
            volume={1}
          />
        </Sequence>
      ))}
      <ProgressBar />
    </AbsoluteFill>
  );
};
