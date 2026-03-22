import { Sequence } from "remotion";

export type Subtitle = {
  text: string;
  startFrame: number;
  endFrame: number;
};

const SubtitleDisplay: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="absolute bottom-16 w-full flex justify-center items-end px-12">
      <div
        className="text-white text-6xl font-black text-center tracking-tight leading-tight"
        style={{
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.8))",
          WebkitTextStroke: "2px black",
          paintOrder: "stroke fill",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Subtitles: React.FC<{ subtitles: Subtitle[] }> = ({
  subtitles,
}) => {
  return (
    <>
      {subtitles.map((s, i) => (
        <Sequence
          key={i}
          name={`テロップ: ${s.text.slice(0, 15)}...`}
          from={s.startFrame}
          durationInFrames={s.endFrame - s.startFrame}
          layout="none"
        >
          <SubtitleDisplay text={s.text} />
        </Sequence>
      ))}
    </>
  );
};
