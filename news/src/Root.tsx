import "./index.css";
import { Composition } from "remotion";
import { MyComposition, compositionSchema } from "./NewsTemplate";

const ORIGINAL_DURATION = 2270;

const CUT_RANGES = [
  { fromFrame: 38, toFrame: 220, label: "無音+フィラー 0.6s~3.7s" },
  { fromFrame: 307, toFrame: 498, label: "無音+フィラー 5.1s~8.3s" },
  { fromFrame: 774, toFrame: 916, label: "無音+フィラー 12.9s~15.3s" },
  { fromFrame: 2197, toFrame: 2272, label: "無音 36.6s~37.9s" },
];
const CUT_TOTAL = CUT_RANGES.reduce((sum, c) => sum + (c.toFrame - c.fromFrame), 0);

const SUBTITLES = [
  { text: "はい、お疲れ様です。", startFrame: 0, endFrame: 126 },
  { text: "動画編集がこんなに簡単になるとは思いませんでした。", startFrame: 128, endFrame: 400 },
  { text: "生地を投げてこの動画を送るだけで", startFrame: 402, endFrame: 703 },
  { text: "無駄なカットもしてもらったりでき", startFrame: 703, endFrame: 1003 },
  { text: "るようになったらいいなと思ってて", startFrame: 1003, endFrame: 1304 },
  { text: "てあとテロップが下に入る感じに", startFrame: 1304, endFrame: 1472 },
  { text: "なったらいいかなと思ってます。", startFrame: 1472, endFrame: 1684 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="News"
        component={MyComposition}
        durationInFrames={ORIGINAL_DURATION - CUT_TOTAL}
        fps={60}
        width={1920}
        height={1080}
        schema={compositionSchema}
        defaultProps={{
          showVideo: true,
          showAudio: true,
          showSubtitles: true,
          showOverlay: true,
          showLogo: true,
          showHeader: true,
          showLabels: true,
          headerTitle: "動画編集がこんなに簡単になるとは？",
          headerSubtitle: "AIエージェントによる自動生成の衝撃",
          cutRanges: CUT_RANGES,
          subtitles: SUBTITLES,
          totalDuration: ORIGINAL_DURATION,
        }}
      />
    </>
  );
};
