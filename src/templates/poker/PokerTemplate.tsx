import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { PokerSubtitles } from "./components/PokerSubtitles";
import { PokerScene } from "./components/PokerScene";
import { PokerAsset } from "./components/PokerAsset";
import { z } from "zod";

export const pokerCompositionSchema = z.object({
  title: z.string(),
  videoSrc: z.string(),
  audioSrc: z.string(),
  subtitles: z.array(
    z.object({
      text: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
});

export type PokerProps = z.infer<typeof pokerCompositionSchema>;

export const PokerTemplate: React.FC<PokerProps> = ({
  title,
  videoSrc,
  audioSrc,
  subtitles,
}) => {
  return (
    <AbsoluteFill className="bg-black font-sans">
      {/* 1. 背景シーン */}
      <PokerScene videoSrc={videoSrc} />

      {/* 2. 音声レイヤー */}
      <Audio src={staticFile(audioSrc)} />

      {/* 3. 装飾アセット（タイトル、サイドバー等） */}
      <PokerAsset title={title} />

      {/* 4. 字幕レイヤー（カラオケ・タイピング演出） */}
      <PokerSubtitles subtitles={subtitles} fps={60} />
    </AbsoluteFill>
  );
};
