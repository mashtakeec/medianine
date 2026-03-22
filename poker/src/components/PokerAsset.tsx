import React from "react";
import { AbsoluteFill } from "remotion";

export const PokerAsset: React.FC<{ title: string }> = ({ title }) => {
  return (
    <AbsoluteFill className="pointer-events-none">
      {/* 左上のメインタイトル */}
      <div className="absolute top-12 left-12 flex flex-col">
        <div className="bg-red-700/80 px-4 py-1 text-white text-sm font-bold skew-x-[-12deg] tracking-widest uppercase">
          Live Poker TV
        </div>
        <div className="bg-white/90 px-6 py-2 text-black text-3xl font-black skew-x-[-12deg] shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          {title}
        </div>
      </div>

      {/* 右上のサイド装飾 */}
      <div className="absolute top-12 right-12 flex items-center bg-black/40 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
        <span className="text-white text-lg font-bold">RECORDING</span>
      </div>

      {/* 画面端のカードマークアクセント */}
      <div className="absolute bottom-12 right-12 opacity-20">
        <span className="text-8xl text-white font-serif">♠</span>
      </div>
      <div className="absolute bottom-12 left-12 opacity-20">
        <span className="text-8xl text-red-600 font-serif">♦</span>
      </div>
    </AbsoluteFill>
  );
};
