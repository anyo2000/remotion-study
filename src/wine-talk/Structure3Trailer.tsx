import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ═════════════════════════════════════════════
// 3안 — 와인 토크쇼 예고편형
// 따뜻한 베이지, 말풍선 대화 → 출연진 크레딧 → 키워드 몽타주
// ═════════════════════════════════════════════

export const STRUCTURE3_FRAMES = 360;

const BEIGE = "#F0E4D2";
const BROWN = "#3A2C22";
const TERRA = "#C96F4A";
const BURGUNDY = "#7A2434";
const PAPER = "#FFFDF8";

export const Structure3Trailer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (at: number, damping = 11) =>
    spring({ frame: frame - at, fps, config: { damping, mass: 0.8 } });
  const fade = (a: number, b: number, c: number, d: number) =>
    interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const fadeIn = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // ── 비트1: 말풍선 대화 ──
  const beat1Op = fade(0, 1, 92, 106);

  // ── 비트2: 출연진 크레딧 ──
  const beat2Op = fade(104, 114, 214, 228);
  const bar1X = interpolate(pop(114, 14), [0, 1], [-800, 0]);
  const bar2X = interpolate(pop(164, 14), [0, 1], [800, 0]);

  // ── 비트3: 키워드 몽타주 + 마무리 ──
  const beat3Op = fadeIn(226, 238);

  const bubble = (
    at: number,
    side: "left" | "right",
    emoji: string,
    text: string,
    bg: string,
    color: string
  ) => {
    const s = pop(at, 12);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: side === "left" ? "row" : "row-reverse",
          alignItems: "flex-start",
          gap: 24,
          alignSelf: side === "left" ? "flex-start" : "flex-end",
          transform: `scale(${s}) rotate(${side === "left" ? -1.5 : 1.5}deg)`,
          transformOrigin: side === "left" ? "bottom left" : "bottom right",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            background: PAPER,
            border: `3px solid ${BROWN}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
        <div
          style={{
            background: bg,
            color,
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.4,
            padding: "30px 44px",
            borderRadius: 40,
            borderTopLeftRadius: side === "left" ? 8 : 40,
            borderTopRightRadius: side === "right" ? 8 : 40,
            whiteSpace: "pre-line",
            boxShadow: "0 8px 0 rgba(58,44,34,0.12)",
          }}
        >
          {text}
        </div>
      </div>
    );
  };

  const credit = (
    x: number,
    role: string,
    name: string,
    sub: string,
    subAt: number,
    accent: string
  ) => (
    <div
      style={{
        transform: `translateX(${x}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          background: PAPER,
          border: `4px solid ${BROWN}`,
          borderRadius: 24,
          padding: "26px 60px",
          boxShadow: "10px 10px 0 rgba(58,44,34,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: 8,
            color: PAPER,
            background: accent,
            padding: "10px 28px",
            borderRadius: 14,
          }}
        >
          {role}
        </div>
        <div style={{ fontSize: 92, fontWeight: 900, color: BROWN, whiteSpace: "nowrap" }}>
          {name}
        </div>
      </div>
      <div
        style={{
          opacity: fadeIn(subAt, subAt + 14),
          fontSize: 54,
          fontWeight: 600,
          color: "rgba(58,44,34,0.7)",
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </div>
    </div>
  );

  const chip = (at: number, emoji: string, text: string, tilt: number) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        background: PAPER,
        border: `3px solid ${BROWN}`,
        borderRadius: 60,
        padding: "22px 46px",
        transform: `scale(${pop(at, 10)}) rotate(${tilt}deg)`,
        boxShadow: "6px 6px 0 rgba(58,44,34,0.12)",
      }}
    >
      <div style={{ fontSize: 60 }}>{emoji}</div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: BROWN,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 80% at 50% 20%, #F7EEDF 0%, ${BEIGE} 55%, #E3D2B8 100%)`,
      }}
    >
      {/* ── 비트1: 말풍선 대화 ── */}
      <AbsoluteFill
        style={{
          opacity: beat1Op,
          justifyContent: "center",
          paddingLeft: 70,
          paddingRight: 70,
          gap: 70,
        }}
      >
        {bubble(
          12,
          "left",
          "🙋‍♂️",
          "마트에서 와인,\n뭘 보고 골라요?",
          PAPER,
          BROWN
        )}
        {bubble(52, "right", "🤔", "비싸면 진짜\n더 맛있어요?", BURGUNDY, PAPER)}
      </AbsoluteFill>

      {/* ── 비트2: 출연진 크레딧 ── */}
      <AbsoluteFill
        style={{
          opacity: beat2Op,
          justifyContent: "center",
          alignItems: "center",
          gap: 90,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: 14,
            color: TERRA,
            opacity: fadeIn(110, 124),
          }}
        >
          COMING SOON
        </div>
        {credit(bar1X, "GUEST", "양윤철", "와인앤모어 삼성점 점장", 138, BURGUNDY)}
        {credit(bar2X, "HOST", "안효성", "시크릿 와인 1병 준비 중 👀", 188, TERRA)}
      </AbsoluteFill>

      {/* ── 비트3: 키워드 몽타주 ── */}
      <AbsoluteFill
        style={{
          opacity: beat3Op,
          justifyContent: "center",
          alignItems: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            fontSize: 66,
            fontWeight: 900,
            color: BROWN,
            transform: `scale(${pop(234)})`,
            marginBottom: 20,
          }}
        >
          이날 마시는 5잔 🍷
        </div>
        {chip(248, "🍾", "30만원 샴페인 · 블라인드 1위", -1.5)}
        {chip(264, "🥂", "가성비 뉴질랜드 소비뇽 블랑", 1.2)}
        {chip(280, "🍷", "부드러운 오레곤 피노누아", -1)}
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            color: BURGUNDY,
            transform: `scale(${pop(296, 9)}) rotate(1deg)`,
            background: "rgba(122,36,52,0.1)",
            padding: "24px 52px",
            borderRadius: 60,
            whiteSpace: "nowrap",
          }}
        >
          …그리고 시크릿 PICK 👀
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
