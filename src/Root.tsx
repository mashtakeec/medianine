import "./index.css";
import { Composition } from "remotion";
import { MyComposition, compositionSchema } from "./templates/news/NewsTemplate";
import { PokerShortsTemplate, pokerShortsSchema } from "./templates/poker/PokerShortsTemplate";
import { PhoneTemplate, phoneSchema } from "./templates/phone/PhoneTemplate";

const ORIGINAL_DURATION = 2270;

// auto_cut.py の cut_candidates.json から（無音+フィラー検出）
const CUT_RANGES = [
  { fromFrame: 38, toFrame: 220, label: "無音+フィラー 0.6s~3.7s" },
  { fromFrame: 307, toFrame: 498, label: "無音+フィラー 5.1s~8.3s" },
  { fromFrame: 774, toFrame: 916, label: "無音+フィラー 12.9s~15.3s" },
  { fromFrame: 2197, toFrame: 2272, label: "無音 36.6s~37.9s" },
];
const CUT_TOTAL = CUT_RANGES.reduce((sum, c) => sum + (c.toFrame - c.fromFrame), 0);

// auto_cut.py + fix_subtitles.py の subtitles_adjusted.json から
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
        id="PhoneUI"
        component={PhoneTemplate}
        durationInFrames={3600}
        fps={60}
        width={1920}
        height={1080}
        schema={phoneSchema}
        defaultProps={{}}
      />
      <Composition
        id="PokerShorts"
        component={PokerShortsTemplate}
        durationInFrames={600} // 10秒 (60fps * 10s) = 600フレーム等、動作確認用に適宜設定
        fps={60}
        width={1080}
        height={1920} // Shorts用 (9:16)
        schema={pokerShortsSchema}
        defaultProps={{
          backgroundUrl: "background.mp4",
          boardCards: [], // プレースホルダーを使用するため空配列
          handCards: [],  // プレースホルダーを使用するため空配列
          telops: {
            allIn: "All in 32,000",
            thinking: "(フラッシュあるよなぁ)",
            pot: "35,700",
            reaction: "(あかん、最強すぎるw)"
          },
          timings: {
            boardCards: 15,    // 場のカードが出るフレーム
            handCards: 25,     // 手札が出るフレーム
            allIn: 35,         // 上部テロップが出るフレーム
            thinking: 45,      // 中央心情テロップが出るフレーム
            pot: 15,           // POTが出るフレーム
            reaction: 55       // 下部テロップが出るフレーム
          }
        }}
      />
      <Composition
        id="MyComp"
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
