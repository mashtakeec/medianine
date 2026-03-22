import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, Img, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { z } from 'zod';

export const pokerShortsSchema = z.object({
  backgroundUrl: z.string(),
  boardCards: z.array(z.string()),
  handCards: z.array(z.string()),
  telops: z.object({
    allIn: z.string(),
    thinking: z.string(),
    pot: z.string(),
    reaction: z.string()
  }),
  timings: z.object({
    boardCards: z.number(),
    handCards: z.number(),
    allIn: z.number(),
    thinking: z.number(),
    pot: z.number(),
    reaction: z.number(),
  })
});

export type PokerShortsProps = z.infer<typeof pokerShortsSchema>;

export const PokerShortsTemplate: React.FC<PokerShortsProps> = ({
  backgroundUrl,
  boardCards,
  handCards,
  telops,
  timings
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // カードがポンッと出るアニメーション
  const cardScale = spring({ frame: frame - timings.boardCards, fps, config: { damping: 12 } });
  const handScale = spring({ frame: frame - timings.handCards, fps, config: { damping: 12 } });

  // CSS Styles for Telops
  const ytTelopStyle: React.CSSProperties = {
    backgroundColor: '#FFD700', // Yellow background
    color: '#000000',
    padding: '16px 48px',
    borderRadius: '16px',
    fontSize: '85px',
    fontWeight: 900,
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
    fontFamily: '"Noto Sans JP", sans-serif',
  };

  const thinkingTelopStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '65px',
    fontWeight: 900,
    WebkitTextStroke: '12px black',
    paintOrder: 'stroke fill',
    textShadow: '0 4px 8px rgba(0,0,0,0.8)',
    fontFamily: '"Noto Sans JP", sans-serif',
    margin: 0,
    textAlign: 'center',
  };

  const reactionTelopStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '60px',
    fontWeight: 900,
    WebkitTextStroke: '10px black',
    paintOrder: 'stroke fill',
    textShadow: '0 4px 8px rgba(0,0,0,0.8)',
    fontFamily: '"Noto Sans JP", sans-serif',
    margin: 0,
    textAlign: 'center',
  };

  const potStyle: React.CSSProperties = {
    backgroundColor: '#CC0000', // Red background
    color: '#FFFFFF',
    padding: '8px 24px',
    borderRadius: '12px',
    fontSize: '60px',
    fontWeight: 900,
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontFamily: '"Noto Sans JP", sans-serif',
  };

  // プレースホルダー用のカードコンポーネント（画像がない場合用）
  const PlaceholderCard = ({ text, isRed }: { text: string, isRed?: boolean }) => (
    <div style={{
      width: '180px', height: '260px', backgroundColor: 'white', borderRadius: '16px',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontSize: '80px', fontWeight: 'bold', color: isRed ? '#dc2626' : 'black',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '2px solid #e5e7eb'
    }}>
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* 1. 背景動画 (最背面) */}
      <OffthreadVideo
        src={staticFile(backgroundUrl)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        volume={0}
      />

      {/* 2. カードレイヤー (中間層) */}
      <AbsoluteFill>

        {/* ボード（場）のカード（4枚） */}
        <Sequence from={timings.boardCards}>
          <div style={{ position: 'absolute', top: '35%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              transform: `scale(${cardScale})`,
              display: 'flex', gap: '20px'
            }}>
              {boardCards.length > 0 ? boardCards.map((src, i) => <Img key={i} src={staticFile(src)} style={{ width: '180px' }} />) : (
                <>
                  <PlaceholderCard text="6♦" isRed />
                  <PlaceholderCard text="A♣" />
                  <PlaceholderCard text="K♦" isRed />
                  <PlaceholderCard text="7♦" isRed />
                </>
              )}
            </div>
          </div>
        </Sequence>

        {/* ハンド（手札）のカード（2枚） */}
        <Sequence from={timings.handCards}>
          <div style={{ position: 'absolute', bottom: '22%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              transform: `scale(${handScale})`,
              display: 'flex', gap: '30px'
            }}>
              {handCards.length > 0 ? handCards.map((src, i) => <Img key={i} src={staticFile(src)} style={{ width: '220px' }} />) : (
                <>
                  <PlaceholderCard text="A♥" isRed />
                  <PlaceholderCard text="K♥" isRed />
                </>
              )}
            </div>
          </div>
        </Sequence>

      </AbsoluteFill>

      {/* 3. テロップレイヤー (最前面) */}
      <AbsoluteFill>

        {/* 上部テロップ */}
        <Sequence from={timings.allIn}>
          <div style={{ position: 'absolute', top: '12%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <h1 style={ytTelopStyle}>{telops.allIn}</h1>
          </div>
        </Sequence>

        {/* 中央テロップ（心情） */}
        <Sequence from={timings.thinking}>
          <div style={{ position: 'absolute', top: '26%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <h2 style={thinkingTelopStyle}>{telops.thinking}</h2>
          </div>
        </Sequence>

        {/* POTテロップ */}
        <Sequence from={timings.pot}>
          <div style={{ position: 'absolute', top: '55%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={potStyle}>
              <span>POT</span>
              <span style={{ fontSize: '75px' }}>{telops.pot}</span>
            </div>
          </div>
        </Sequence>

        {/* 下部テロップ（囁き） */}
        <Sequence from={timings.reaction}>
          <div style={{ position: 'absolute', bottom: '8%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <h2 style={reactionTelopStyle}>{telops.reaction}</h2>
          </div>
        </Sequence>

      </AbsoluteFill>

    </AbsoluteFill>
  );
};
