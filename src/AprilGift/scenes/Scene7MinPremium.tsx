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
const DUR = 423;

const STEPS = [
  { label: "7만원", y: 520, color: P.sub },
  { label: "6만원", y: 720, color: P.sub },
  { label: "5만원", y: 920, color: P.accent },
];

export const Scene7MinPremium: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 30, DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  const numIn = spring({ frame, fps, config: SPRING.bouncy });
  const headIn = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.smooth });

  const stepIns = STEPS.map((_, i) =>
    spring({ frame: Math.max(0, frame - (20 + i * 30)), fps, config: SPRING.snappy })
  );

  const ballStart = 120;
  const ballProgress = interpolate(
    frame, [ballStart, ballStart + 30, ballStart + 60, ballStart + 90], [0, 1, 2, 2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ballY = interpolate(ballProgress, [0, 1, 2], [STEPS[0].y - 60, STEPS[1].y - 60, STEPS[2].y - 60]);
  const ballX = interpolate(ballProgress, [0, 1, 2], [200, 440, 680]);

  const contextIn = spring({ frame: Math.max(0, frame - 40), fps, config: SPRING.smooth });
  const downIn = spring({ frame: Math.max(0, frame - 220), fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ opacity }}>
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
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 900, color: "#FFF" }}>06</span>
        </div>
        <div style={{ opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.text }}>
            최저보험료
          </span>
        </div>
        {/* 기준 설명 */}
        <div style={{ opacity: contextIn }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: P.sub }}>
            간병인 가입시
          </span>
        </div>
      </div>

      {/* 계단들 */}
      {STEPS.map((step, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: SAFE.side + 60 + i * 240,
            top: step.y,
            width: 280, height: 130, borderRadius: 20,
            backgroundColor: i === 2 ? "rgba(255, 107, 53, 0.12)" : "rgba(0,0,0,0.04)",
            border: i === 2 ? `3px solid ${P.accent}` : "2px solid rgba(0,0,0,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: stepIns[i],
            transform: `translateY(${interpolate(stepIns[i], [0, 1], [30, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: i === 2 ? 80 : 64,
              fontWeight: i === 2 ? 900 : 700,
              color: step.color,
            }}
          >
            {step.label}
          </span>
        </div>
      ))}

      {/* 공 마커 */}
      {frame >= ballStart && (
        <div
          style={{
            position: "absolute", left: ballX, top: ballY,
            width: 44, height: 44, borderRadius: "50%",
            backgroundColor: P.accent,
            boxShadow: "0 4px 16px rgba(255, 107, 53, 0.4)",
          }}
        />
      )}

      {/* 하단: DOWN! 크게 */}
      <div
        style={{
          position: "absolute", bottom: SAFE.bottom + 100, left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}
      >
        <div style={{ opacity: downIn, transform: `scale(${downIn})` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 100, fontWeight: 900, color: P.accent }}>
            DOWN!
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
