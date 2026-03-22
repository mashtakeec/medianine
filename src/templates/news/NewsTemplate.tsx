import { AbsoluteFill, Audio, Sequence, staticFile, OffthreadVideo } from "remotion";
import { Subtitles } from "./NewsSubtitles";
import { Logo } from "./NewsLogo";
import { Header } from "./NewsHeader";
import { z } from "zod";

export const subtitleSchema = z.object({
  text: z.string(),
  startFrame: z.number(),
  endFrame: z.number(),
});

export const cutRangeSchema = z.object({
  fromFrame: z.number(),
  toFrame: z.number(),
  label: z.string(),
});

export const compositionSchema = z.object({
  showVideo: z.boolean(),
  showAudio: z.boolean(),
  showSubtitles: z.boolean(),
  showOverlay: z.boolean(),
  showLogo: z.boolean(),
  showHeader: z.boolean(),
  showLabels: z.boolean(),
  headerTitle: z.string(),
  headerSubtitle: z.string(),
  cutRanges: z.array(cutRangeSchema),
  // subtitlesはカット後のタイミングで渡される（auto_cut.pyで計算済み）
  subtitles: z.array(subtitleSchema),
  totalDuration: z.number(),
});

export type CompositionProps = z.infer<typeof compositionSchema>;

export type CutRange = { fromFrame: number; toFrame: number; label: string };

// カット区間を除いた「残す区間」を計算
function getKeepSegments(cuts: CutRange[], totalDuration: number) {
  const sorted = [...cuts].sort((a, b) => a.fromFrame - b.fromFrame);
  const segments: { srcFrom: number; srcTo: number; outFrom: number }[] = [];
  let cursor = 0;
  let outCursor = 0;

  for (const cut of sorted) {
    if (cut.fromFrame > cursor) {
      const dur = cut.fromFrame - cursor;
      segments.push({ srcFrom: cursor, srcTo: cut.fromFrame, outFrom: outCursor });
      outCursor += dur;
    }
    cursor = cut.toFrame;
  }
  if (cursor < totalDuration) {
    segments.push({ srcFrom: cursor, srcTo: totalDuration, outFrom: outCursor });
  }
  return segments;
}

export const MyComposition: React.FC<CompositionProps> = ({
  showVideo,
  showAudio,
  showSubtitles,
  showOverlay,
  showLogo,
  showHeader,
  showLabels,
  headerTitle,
  headerSubtitle,
  cutRanges,
  subtitles,
  totalDuration,
}) => {
  const segments = getKeepSegments(cutRanges, totalDuration);

  const Content: React.FC = () => (
    <>
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      )}
      {showLogo && <Logo />}
      {showHeader && (
        <Header title={headerTitle} subtitle={headerSubtitle} />
      )}
      {showLabels && (
        <>
          <div className="absolute top-40 left-10 text-white text-3xl font-bold drop-shadow-md">
            Remotion Studio より
          </div>
          <div className="absolute bottom-40 left-10 text-white text-3xl font-bold drop-shadow-md">
            Antigravity
          </div>
        </>
      )}
    </>
  );

  return (
    <AbsoluteFill className="bg-black">
      {/* 各セグメント（カットを除いた区間）を詰めて配置 */}
      {segments.map((seg, i) => {
        const dur = seg.srcTo - seg.srcFrom;
        return (
          <Sequence
            key={`seg-${i}`}
            name={`📎 区間${i + 1} (${(seg.srcFrom / 60).toFixed(1)}s〜${(seg.srcTo / 60).toFixed(1)}s)`}
            from={seg.outFrom}
            durationInFrames={dur}
            layout="none"
          >
            {showVideo && (
              <OffthreadVideo
                src={staticFile("background.mp4")}
                className="absolute inset-0 w-full h-full object-cover"
                volume={0}
                startFrom={seg.srcFrom}
              />
            )}

            {showAudio && (
              <Audio
                src={staticFile("background.mp4")}
                startFrom={seg.srcFrom}
              />
            )}

            <Content />
          </Sequence>
        );
      })}

      {/* テロップ（auto_cut.pyでカット後タイミング計算済み、そのまま使う） */}
      {showSubtitles && <Subtitles subtitles={subtitles} />}
    </AbsoluteFill>
  );
};
