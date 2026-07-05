import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WineBottle } from "./wine-shared";

// ═════════════════════════════════════════════
// 2안 — "이 와인 얼마일까요?" 블라인드 게임형
// 딥버건디 배경 + 스포트라이트, 퀴즈쇼 UI
// 문제 → 선택지 → 정답 → 반전(1위) → 01 02 03 04 ?
// ═════════════════════════════════════════════

export const STRUCTURE2_FRAMES = 400;

const BG = "#150A10";
const CREAM = "#F2E8DC";
const GOLD = "#D9B36C";
const CORAL = "#FF8E7A";
const INK = "#241018";

const BURST_PIECES = [
  { angle: 15, dist: 300, color: GOLD, w: 34 },
  { angle: 65, dist: 340, color: CORAL, w: 26 },
  { angle: 110, dist: 310, color: CREAM, w: 30 },
  { angle: 160, dist: 330, color: GOLD, w: 24 },
  { angle: 205, dist: 320, color: CORAL, w: 32 },
  { angle: 250, dist: 300, color: CREAM, w: 26 },
  { angle: 295, dist: 340, color: GOLD, w: 30 },
  { angle: 340, dist: 310, color: CORAL, w: 24 },
];

export const Structure2Quiz: React.FC = () => {
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

  // ── 무대: 스포트라이트 + 병 (전 구간 유지) ──
  const spotOp = fadeIn(0, 22);
  const bottleY = interpolate(pop(8, 15), [0, 1], [140, 0]);
  const bottleDim = interpolate(frame, [148, 162], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 비트1: 문제 + 선택지 ──
  const quizOp = fade(0, 1, 148, 160);
  // 3번 버튼 누름
  const pressDip = interpolate(frame, [112, 119, 128], [0, -0.07, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pressFill = fadeIn(114, 124);

  // ── 비트2: 정답 공개 ──
  const answerOp = fade(150, 158, 214, 226);
  const burstT = pop(156, 16);

  // ── 비트3: 반전 (1위) ──
  const rankOp = fade(224, 232, 282, 294);
  const ribbonX = interpolate(pop(238, 13), [0, 1], [900, 0]);

  // ── 비트4: 01 02 03 04 ? ──
  const finalOp = fadeIn(292, 302);

  const choice = (num: string, label: string, at: number, pressed: boolean) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: pressed
          ? `rgba(217,179,108,${pressFill})`
          : "rgba(242,232,220,0.08)",
        border: `3px solid ${pressed && pressFill > 0.5 ? GOLD : "rgba(242,232,220,0.35)"}`,
        borderRadius: 70,
        padding: "20px 44px",
        transform: `scale(${pop(at) + (pressed ? pressDip : 0)})`,
        width: 620,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          background: pressed && pressFill > 0.5 ? INK : CREAM,
          color: pressed && pressFill > 0.5 ? GOLD : INK,
          fontSize: 52,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontSize: 62,
          fontWeight: 700,
          color: pressed && pressFill > 0.5 ? INK : CREAM,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* 스포트라이트 */}
      <AbsoluteFill
        style={{
          opacity: spotOp,
          background:
            "radial-gradient(55% 38% at 50% 40%, rgba(242,232,220,0.16) 0%, rgba(242,232,220,0.04) 55%, transparent 100%)",
        }}
      />

      {/* 병 실루엣 (무대 중앙, 전 구간) */}
      <div
        style={{
          position: "absolute",
          top: 470,
          left: "50%",
          transform: `translate(-50%, ${bottleY}px)`,
          opacity: bottleDim,
        }}
      >
        <WineBottle
          width={250}
          fill="#08040B"
          label={false}
          stroke="rgba(217,179,108,0.5)"
        />
      </div>

      {/* ── 비트1: 문제 + 선택지 ── */}
      <AbsoluteFill style={{ opacity: quizOp, alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 230,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(26)})`,
            fontSize: 76,
            fontWeight: 900,
            color: CREAM,
            lineHeight: 1.35,
            whiteSpace: "pre-line",
          }}
        >
          이 샴페인,{"\n"}호텔 와인바 가격은?
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 210,
            display: "flex",
            flexDirection: "column",
            gap: 30,
            alignItems: "center",
          }}
        >
          {choice("1", "10만원", 62, false)}
          {choice("2", "20만원", 74, false)}
          {choice("3", "30만원", 86, true)}
        </div>
      </AbsoluteFill>

      {/* ── 비트2: 정답 공개 ── */}
      <AbsoluteFill
        style={{ opacity: answerOp, alignItems: "center", justifyContent: "center" }}
      >
        {/* 버스트 */}
        {BURST_PIECES.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const d = p.dist * burstT;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "44%",
                left: "50%",
                width: p.w,
                height: 12,
                borderRadius: 6,
                background: p.color,
                opacity: 1 - burstT * 0.7,
                transform: `translate(${Math.cos(rad) * d}px, ${
                  Math.sin(rad) * d
                }px) rotate(${p.angle + burstT * 90}deg)`,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            top: 560,
            width: "100%",
            textAlign: "center",
            opacity: fadeIn(152, 164),
            fontSize: 60,
            fontWeight: 600,
            color: "rgba(242,232,220,0.75)",
          }}
        >
          정답은
        </div>
        <div
          style={{
            position: "absolute",
            top: 660,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(158, 9)})`,
            fontSize: 200,
            fontWeight: 900,
            color: GOLD,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
          }}
        >
          30만원
        </div>
        <div
          style={{
            position: "absolute",
            top: 960,
            width: "100%",
            textAlign: "center",
            fontSize: 130,
            transform: `scale(${pop(176, 8)})`,
          }}
        >
          😳
        </div>
      </AbsoluteFill>

      {/* ── 비트3: 반전 (블라인드 1위) ── */}
      <AbsoluteFill style={{ opacity: rankOp, alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 300,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(228)})`,
            fontSize: 64,
            fontWeight: 600,
            color: CREAM,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
          }}
        >
          근데 점장들이{"\n"}이름 가리고 마셔도
        </div>
        {/* 눈가리개 리본 */}
        <div
          style={{
            position: "absolute",
            top: 840,
            left: "50%",
            transform: `translateX(calc(-50% + ${ribbonX}px)) rotate(-8deg)`,
            background: CREAM,
            color: INK,
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: 20,
            padding: "14px 70px",
            borderRadius: 14,
            whiteSpace: "nowrap",
          }}
        >
          ? ? ?
        </div>
        <div
          style={{
            position: "absolute",
            top: 1080,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(250, 9)})`,
            fontSize: 220,
            fontWeight: 900,
            color: GOLD,
            lineHeight: 1.05,
          }}
        >
          1위
        </div>
        <div
          style={{
            position: "absolute",
            top: 1390,
            width: "100%",
            textAlign: "center",
            fontSize: 110,
            transform: `scale(${pop(262, 8)})`,
          }}
        >
          🏆
        </div>
      </AbsoluteFill>

      {/* ── 비트4: 01 02 03 04 ? ── */}
      <AbsoluteFill
        style={{ opacity: finalOp, alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            position: "absolute",
            top: 480,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(298)})`,
            fontSize: 72,
            fontWeight: 900,
            color: CREAM,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
          }}
        >
          이런 와인이{"\n"}다섯 병
        </div>
        <div
          style={{
            position: "absolute",
            top: 880,
            display: "flex",
            gap: 26,
          }}
        >
          {["01", "02", "03", "04", "?"].map((t, i) => {
            const isQ = t === "?";
            return (
              <div
                key={i}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  background: isQ ? GOLD : "rgba(242,232,220,0.1)",
                  border: `3px solid ${isQ ? GOLD : "rgba(242,232,220,0.4)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 62,
                  fontWeight: 900,
                  color: isQ ? INK : CREAM,
                  fontVariantNumeric: "tabular-nums",
                  transform: `scale(${pop(304 + i * 7, 9)})`,
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 420,
            width: "100%",
            textAlign: "center",
            opacity: fadeIn(336, 352),
            fontSize: 60,
            fontWeight: 700,
            color: GOLD,
          }}
        >
          몇 번이 제일 궁금해요?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
