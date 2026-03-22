import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

export const PokerScene: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  return (
    <AbsoluteFill className="bg-slate-900">
      <OffthreadVideo
        src={staticFile(videoSrc)}
        className="w-full h-full object-cover opacity-60"
        volume={0}
      />
      {/* 画面端にポーカーらしいアクセント（赤と黒の縁取りなど） */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-red-600 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-red-600 to-transparent" />
    </AbsoluteFill>
  );
};
