import "./index.css";
import { Composition } from "remotion";
import { PokerShortsTemplate, pokerShortsSchema } from "./PokerShortsTemplate";
import { PokerTemplate, pokerCompositionSchema } from "./PokerTemplate";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PokerShorts"
        component={PokerShortsTemplate}
        durationInFrames={600}
        fps={60}
        width={1080}
        height={1920}
        schema={pokerShortsSchema}
        defaultProps={{
          backgroundUrl: "background.mp4",
          boardCards: [],
          handCards: [],
          telops: {
            allIn: "All in 32,000",
            thinking: "(フラッシュあるよなぁ)",
            pot: "35,700",
            reaction: "(あかん、最強すぎるw)"
          },
          timings: {
            boardCards: 15,
            handCards: 25,
            allIn: 35,
            thinking: 45,
            pot: 15,
            reaction: 55
          }
        }}
      />
      <Composition
        id="Poker"
        component={PokerTemplate}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
        schema={pokerCompositionSchema}
        defaultProps={{
          title: "POKER NIGHT",
          videoSrc: "background.mp4",
          audioSrc: "audio.mp3",
          subtitles: []
        }}
      />
    </>
  );
};
