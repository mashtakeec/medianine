import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export type SubtitleSegment = {
  text: string;
  start: number; // 秒単位
  end: number;   // 秒単位
};

const KaraokeText: React.FC<{ text: string; progress: number }> = ({ text, progress }) => {
  // progress: 0 (開始) 〜 1 (完成)
  const characters = text.split("");
  const showCount = Math.floor(characters.length * progress);

  return (
    <div className="flex flex-wrap justify-center max-w-4xl mx-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
      {characters.map((char, i) => {
        const isShown = i < showCount;
        const isCurrent = i === showCount;

        return (
          <span
            key={i}
            className={`text-5xl font-black transition-all duration-75 ${isShown ? "text-white opacity-100 scale-100" : "text-white/20 opacity-0 scale-90"
              } ${isCurrent ? "text-yellow-400 scale-110" : ""}`}
            style={{
              WebkitTextStroke: "2px black",
              textShadow: "0 0 10px rgba(255,255,255,0.3)"
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const PokerSubtitles: React.FC<{
  subtitles: SubtitleSegment[];
  fps: number;
}> = ({ subtitles, fps }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill className="justify-end items-center pb-24">
      {subtitles.map((sub, i) => {
        const startFrame = sub.start * fps;
        const endFrame = sub.end * fps;
        const duration = endFrame - startFrame;

        if (frame < startFrame || frame > endFrame) return null;

        // タイピング進捗 (最初の1秒程度で出し切る、または区間全体で出す設定も可能)
        // ここでは区間の80%を使ってタイピングし、残りは静止させる
        const typingDuration = Math.min(duration * 0.8, 60); // 最大60フレーム(1s)でタイピング
        const progress = interpolate(
          frame,
          [startFrame, startFrame + typingDuration],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <KaraokeText text={sub.text} progress={progress} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
