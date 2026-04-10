import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { PALETTES, SPRING, SAFE, FONT_FAMILY } from "../../constants";

const P = PALETTES.aprilGift;
const DUR = 543;

const BENEFITS = [
  { label: "8대용종 수술비", before: "20만", after: "30만" },
  { label: "질병1-5종(1종)", before: "20만", after: "50만" },
  { label: "질병1-5종(2종)", before: "30만", after: "50만" },
];

export const Scene8Children: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 30, DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  const numIn = spring({ frame, fps, config: SPRING.bouncy });
  const headIn = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.smooth });
  const subIn = spring({ frame: Math.max(0, frame - 25), fps, config: SPRING.smooth });

  // 하단 메시지
  const ctaIn = spring({ frame: Math.max(0, frame - 350), fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 배경 원 */}
      <div
        style={{
          position: "absolute", top: "45%", left: "50%",
          width: 700, height: 700, borderRadius: "50%",
          backgroundColor: "rgba(255, 107, 53, 0.06)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 상단: 번호 + 제목 */}
      <div
        style={{
          position: "absolute", top: SAFE.top + 30, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}
      >
        <div
          style={{
            opacity: numIn, transform: `scale(${numIn})`,
            width: 80, height: 80, borderRadius: "50%", backgroundColor: P.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 900, color: "#FFF" }}>07</span>
        </div>
        <div style={{ opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.text }}>
            0540 어린이보험
          </span>
        </div>
        <div style={{ opacity: subIn }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: P.sub }}>
            5~15세 특별혜택
          </span>
        </div>
      </div>

      {/* 중앙: 혜택 카드들 — 더 크게, 중앙 배치 */}
      <div
        style={{
          position: "absolute",
          top: 520,
          left: SAFE.side,
          right: SAFE.side,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          alignItems: "center",
        }}
      >
        {BENEFITS.map((b, i) => {
          const cardIn = spring({
            frame: Math.max(0, frame - (80 + i * 40)), fps, config: SPRING.snappy,
          });
          return (
            <div
              key={i}
              style={{
                opacity: cardIn,
                transform: `translateX(${interpolate(cardIn, [0, 1], [60, 0])}px)`,
                backgroundColor: P.card,
                borderRadius: 28,
                border: `2px solid ${P.cardBorder}`,
                padding: "28px 44px",
                width: 920,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 700, color: P.text }}>
                {b.label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY, fontSize: 48, fontWeight: 600,
                    color: P.sub, textDecoration: "line-through",
                  }}
                >
                  {b.before}
                </span>
                <span style={{ fontFamily: FONT_FAMILY, fontSize: 48, color: P.sub }}>→</span>
                <span style={{ fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 900, color: P.accent }}>
                  {b.after}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단: 큰 CTA 텍스트 */}
      <div
        style={{
          position: "absolute", bottom: SAFE.bottom + 80, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}
      >
        <div style={{ opacity: ctaIn, transform: `scale(${ctaIn})` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 72, fontWeight: 900, color: P.accent }}>
            자녀보험도 지금!
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
