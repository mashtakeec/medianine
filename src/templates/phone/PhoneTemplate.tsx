import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { z } from "zod";

export const phoneSchema = z.object({});

const PRIMARY = "#8B5CF6";
const FONT_HEADLINE = "'Space Grotesk', 'Noto Sans JP', sans-serif";
const FONT_BODY = "'Manrope', 'Noto Sans JP', sans-serif";
const FONT_MONO = "'Courier New', monospace";

// --- シーン定義 ---
const SCENES = [
  { word: "MEMBERS\nCLUB", startFrame: 0, endFrame: 240, phoneLabel: "WELCOME", phoneSub: "メンバーズクラブへ\nようこそ" },
  { word: "CONNECT", startFrame: 240, endFrame: 480, phoneLabel: "MEMBERS", phoneSub: "次世代のクリエイティブ\nネットワークへ参加する" },
  { word: "COMMUNITY", startFrame: 480, endFrame: 720, phoneLabel: "NETWORK", phoneSub: "同じ志を持つ仲間と\nつながる場所" },
  { word: "SELECT", startFrame: 720, endFrame: 960, phoneLabel: "CURATED", phoneSub: "厳選されたコンテンツを\nあなたの手に" },
  { word: "EXCLUSIVE", startFrame: 960, endFrame: 1200, phoneLabel: "VIP", phoneSub: "限定イベントへの\n特別招待" },
  { word: "EXPERIENCE", startFrame: 1200, endFrame: 1440, phoneLabel: "EVENTS", phoneSub: "唯一無二の体験が\nここにある" },
  { word: "INSPIRE", startFrame: 1440, endFrame: 1680, phoneLabel: "STORIES", phoneSub: "インスピレーションを\n受け取る" },
  { word: "CREATE", startFrame: 1680, endFrame: 1920, phoneLabel: "STUDIO", phoneSub: "あなたの創造力を\n解き放つ" },
  { word: "ELEVATE", startFrame: 1920, endFrame: 2160, phoneLabel: "GROWTH", phoneSub: "次のステージへ\n駆け上がる" },
  { word: "BELONG", startFrame: 2160, endFrame: 2400, phoneLabel: "HOME", phoneSub: "あなたの居場所が\nここにある" },
  { word: "DISCOVER", startFrame: 2400, endFrame: 2640, phoneLabel: "EXPLORE", phoneSub: "まだ見ぬ世界を\n発見する" },
  { word: "TRANSFORM", startFrame: 2640, endFrame: 2880, phoneLabel: "EVOLVE", phoneSub: "変化を恐れず\n進化する" },
  { word: "UNITE", startFrame: 2880, endFrame: 3120, phoneLabel: "TOGETHER", phoneSub: "ひとつになって\n動き出す" },
  { word: "JOIN\nMEMBERS\nCLUB", startFrame: 3120, endFrame: 3600, phoneLabel: "JOIN NOW", phoneSub: "今すぐ参加して\n新しい世界へ" },
];

const SUBTEXTS: Record<string, string> = {
  CONNECT: "仲間とつながる",
  COMMUNITY: "コミュニティの力",
  SELECT: "特別な体験を選ぶ",
  EXCLUSIVE: "限定された世界",
  EXPERIENCE: "新しい体験",
  INSPIRE: "インスピレーション",
  CREATE: "創造する",
  ELEVATE: "高みへ",
  BELONG: "居場所がある",
  DISCOVER: "発見する",
  TRANSFORM: "変わる",
  UNITE: "ひとつになる",
};

// --- [1] BgTypography（全画面背景の巨大文字） ---
const BgTypography: React.FC<{ word: string; frame: number; sceneProgress: number }> = ({
  word,
  frame,
  sceneProgress,
}) => {
  const singleWord = word.split("\n")[0];
  const slide1 = interpolate(sceneProgress, [0, 0.4], [-150, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slide2 = interpolate(sceneProgress, [0, 0.5], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(sceneProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* 上部の巨大文字 */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: -100 + slide1,
          fontSize: 380,
          fontWeight: 900,
          color: "rgba(255,255,255,0.05)",
          whiteSpace: "nowrap",
          lineHeight: 0.8,
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
          pointerEvents: "none",
          fontFamily: FONT_HEADLINE,
          transform: "rotate(-12deg)",
          opacity,
        }}
      >
        {singleWord}
      </div>
      {/* 下部の巨大文字 */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: `calc(20% + ${slide2}px)`,
          fontSize: 320,
          fontWeight: 900,
          color: `${PRIMARY}1A`,
          whiteSpace: "nowrap",
          lineHeight: 0.8,
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
          pointerEvents: "none",
          fontFamily: FONT_HEADLINE,
          transform: "rotate(-6deg)",
          opacity,
        }}
      >
        NINEMEMBERCLUB
      </div>
      {/* 右側の縦文字 */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: -200,
          fontSize: 400,
          fontWeight: 900,
          color: "rgba(255,255,255,0.05)",
          whiteSpace: "nowrap",
          lineHeight: 0.8,
          letterSpacing: "-0.05em",
          textTransform: "uppercase",
          pointerEvents: "none",
          fontFamily: FONT_HEADLINE,
          transform: "rotate(90deg)",
          opacity: opacity * 0.5,
        }}
      >
        ARCHIVE
      </div>
    </>
  );
};

// --- [10] GeometricShapes（スマホ内の幾何学装飾） ---
const GeometricShapes: React.FC<{ frame: number; sceneProgress: number }> = ({
  frame,
  sceneProgress,
}) => {
  const opacity = interpolate(sceneProgress, [0, 0.2, 0.8, 1], [0, 0.4, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotation = interpolate(frame, [0, 600], [0, 360], { extrapolateRight: "extend" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        zIndex: 0,
      }}
    >
      <div
        style={{
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: `2px solid ${PRIMARY}`,
          opacity: 0.2,
          transform: `rotate(${rotation}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          border: "2px solid rgba(255,255,255,0.1)",
          transform: `rotate(${-rotation + 45}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 40,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: PRIMARY,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 40,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
        }}
      />
    </div>
  );
};

// --- [11] ProgressBar ---
const ProgressBar: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = interpolate(frame, [0, 3600], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        left: 32,
        right: 32,
        height: 4,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 9999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: PRIMARY,
          borderRadius: 9999,
        }}
      />
    </div>
  );
};

// === メインコンポーネント ===
export const PhoneTemplate: React.FC<z.infer<typeof phoneSchema>> = () => {
  const frame = useCurrentFrame();

  const currentScene = SCENES.find((s) => frame >= s.startFrame && frame < s.endFrame) || SCENES[SCENES.length - 1];
  const sceneProgress = interpolate(
    frame,
    [currentScene.startFrame, currentScene.endFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mainWord = currentScene.word.split("\n")[0];
  const subtext = SUBTEXTS[mainWord] || "";

  // 左側アニメーション
  const leftY = interpolate(sceneProgress, [0, 0.2], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftOpacity = interpolate(sceneProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(sceneProgress, [0.15, 0.3, 0.8, 0.95], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(sceneProgress, [0.15, 0.3], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineWidth = interpolate(sceneProgress, [0.1, 0.4, 0.8, 1], [0, 500, 500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // スマホ内アニメーション
  const phoneWordOpacity = interpolate(sceneProgress, [0.05, 0.2, 0.85, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneWordScale = interpolate(sceneProgress, [0.05, 0.2], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const phoneWordY = interpolate(sceneProgress, [0.05, 0.2], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ctaOpacity = interpolate(sceneProgress, [0.3, 0.45, 0.8, 0.95], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(sceneProgress, [0.3, 0.45], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 左下メタ情報アニメーション
  const metaOpacity = interpolate(sceneProgress, [0.2, 0.35, 0.8, 0.95], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isEndScene = currentScene.startFrame >= 3120;

  return (
    <AbsoluteFill
      style={{
        width: 1920,
        height: 1080,
        background: "linear-gradient(135deg, #0c0f0f 0%, #1a0033 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* BGM */}
      <Audio src={staticFile("Tropical 地球.mp3")} volume={1} />

      {/* [1] BgTypography（全画面背景の巨大文字） */}
      <BgTypography word={currentScene.word} frame={frame} sceneProgress={sceneProgress} />

      {/* === [3][4][5] 左側：演出・メッセージエリア === */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: 96,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* [3] 左キーワード */}
        <div
          style={{
            transform: `translateY(${leftY}px)`,
            opacity: leftOpacity,
          }}
        >
          {currentScene.word.split("\n").map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: currentScene.word.includes("\n") ? 120 : 160,
                fontWeight: 900,
                fontStyle: "italic",
                color: "#ffffff",
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                fontFamily: FONT_HEADLINE,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* [4] 左サブテキスト */}
          {subtext && (
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: PRIMARY,
                letterSpacing: "-0.02em",
                opacity: subOpacity,
                transform: `translateY(${subY}px)`,
                fontFamily: FONT_HEADLINE,
              }}
            >
              {subtext}
            </div>
          )}

          {/* [5] 左装飾ライン */}
          <div
            style={{
              width: lineWidth,
              height: 8,
              backgroundColor: PRIMARY,
            }}
          />
        </div>

        {/* システムバージョンテキスト */}
        <div style={{ paddingTop: 48, opacity: metaOpacity }}>
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: FONT_MONO,
              fontSize: 20,
              letterSpacing: "0.2em",
            }}
          >
            SYSTEM_VERSION // 2.4.0
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.2)",
              fontFamily: FONT_MONO,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Voltage Noir Protocol Active
          </div>
        </div>
      </div>

      {/* === [6] スマホコンテナ（右側） === */}
      <div
        style={{
          width: 450,
          height: 900,
          borderRadius: 40,
          border: "12px solid #1a1a1a",
          position: "absolute",
          top: "50%",
          right: 150,
          transform: "translateY(-50%)",
          backgroundColor: "#000000",
          boxShadow: "0 50px 100px -20px rgba(0,0,0,0.8)",
          overflow: "hidden",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* [10] GeometricShapes */}
        <GeometricShapes frame={frame} sceneProgress={sceneProgress} />

        {/* [7] ステータスバー */}
        <div
          style={{
            padding: "16px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.9)",
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY }}>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Signal */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="0.5" opacity="1" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" opacity="1" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" opacity="1" />
              <rect x="13" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
            </svg>
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM4.5 8a5 5 0 017 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2 5.5a8 8 0 0112 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {/* Battery */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div
                style={{
                  width: 22,
                  height: 11,
                  borderRadius: 3,
                  border: "1.5px solid rgba(255,255,255,0.9)",
                  padding: 1.5,
                }}
              >
                <div style={{ width: "75%", height: "100%", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 1 }} />
              </div>
              <div style={{ width: 2, height: 5, backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* スマホ内メインコンテンツ */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 40px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* [8] KineticWord (スマホ内) */}
          <div
            style={{
              textAlign: "center",
              opacity: phoneWordOpacity,
              transform: `translateY(${phoneWordY}px) scale(${phoneWordScale})`,
            }}
          >
            {/* カテゴリラベル */}
            <div
              style={{
                color: PRIMARY,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                marginBottom: 16,
                fontFamily: FONT_HEADLINE,
              }}
            >
              Live Community
            </div>
            {/* メインワード */}
            <div
              style={{
                fontSize: 68,
                fontWeight: 900,
                fontStyle: "italic",
                color: "#ffffff",
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                marginBottom: 24,
                fontFamily: FONT_HEADLINE,
              }}
            >
              {currentScene.phoneLabel}
            </div>
            {/* [9] スマホ内サブテキスト */}
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 18,
                fontWeight: 500,
                lineHeight: 1.6,
                maxWidth: 280,
                margin: "0 auto",
                fontFamily: FONT_BODY,
              }}
            >
              {currentScene.phoneSub.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </div>
          </div>

          {/* CTA ボタン */}
          <div
            style={{
              marginTop: 64,
              width: "100%",
              opacity: ctaOpacity,
              transform: `translateY(${ctaY}px)`,
            }}
          >
            <div
              style={{
                backgroundColor: PRIMARY,
                padding: "16px 24px",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: `0 20px 40px ${PRIMARY}33`,
              }}
            >
              <span
                style={{
                  color: "#000000",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 20,
                  fontFamily: FONT_HEADLINE,
                }}
              >
                {isEndScene ? "JOIN NOW" : "JOIN NOW"}
              </span>
              <span style={{ color: "#000000", fontSize: 24, fontWeight: 700 }}>→</span>
            </div>
          </div>
        </div>

        {/* [11] ProgressBar */}
        <ProgressBar frame={frame} />

        {/* [12] ホームインジケーター */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 8,
            paddingTop: 12,
          }}
        >
          <div
            style={{
              width: 128,
              height: 6,
              borderRadius: 9999,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          />
        </div>
      </div>

      {/* === 左下メタ情報 === */}
      <div
        style={{
          position: "absolute",
          bottom: 64,
          left: 96,
          display: "flex",
          alignItems: "center",
          gap: 32,
          zIndex: 10,
          opacity: metaOpacity,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              fontFamily: FONT_MONO,
              textTransform: "uppercase",
              letterSpacing: "0.5em",
            }}
          >
            Authored By
          </span>
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 18, fontFamily: FONT_BODY }}>
            NM_CLUB LABS
          </span>
        </div>
        <div style={{ width: 1, height: 48, backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              fontFamily: FONT_MONO,
              textTransform: "uppercase",
              letterSpacing: "0.5em",
            }}
          >
            Encryption
          </span>
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 18, fontFamily: FONT_BODY }}>
            ALPHA_9_NOIR
          </span>
        </div>
      </div>

      {/* テクスチャオーバーレイ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)",
        }}
      />
    </AbsoluteFill>
  );
};
