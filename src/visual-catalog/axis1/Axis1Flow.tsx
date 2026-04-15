import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE_WIDE, FONT_FAMILY, PALETTES } from "../../constants";
import { CharacterReveal, GradientBackground } from "../../components";

const STEPS = [
  { emoji: "🔍", label: "보장분석" },
  { emoji: "🕳️", label: "빈틈 발견" },
  { emoji: "🎯", label: "맞춤 제안" },
  { emoji: "✅", label: "계약" },
];

/**
 * 축1-3: 흐름도
 * 보장분석 → 빈틈 발견 → 맞춤 제안 → 계약
 */
export const Axis1Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = PALETTES.coolBlue;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />

      {/* 헤드라인 */}
      <div
        style={{
          position: "absolute",
          top: SAFE_WIDE.top + 20,
          left: SAFE_WIDE.side,
          right: SAFE_WIDE.side,
          textAlign: "center",
        }}
      >
        <CharacterReveal
          text="보장분석 프로세스"
          delay={0}
          stagger={2}
          fontSize={64}
          fontWeight={900}
          color={palette.text}
        />
      </div>

      {/* 흐름도 — 가로 배치 */}
      <div
        style={{
          position: "absolute",
          top: SAFE_WIDE.top + 150,
          bottom: SAFE_WIDE.bottom,
          left: SAFE_WIDE.side + 60,
          right: SAFE_WIDE.side + 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {STEPS.map((step, i) => {
          const stepDelay = 15 + i * 20;
          const nodeIn = spring({
            frame: Math.max(0, frame - stepDelay),
            fps,
            config: SPRING.smooth,
          });

          const arrowDelay = stepDelay + 12;
          const arrowIn = spring({
            frame: Math.max(0, frame - arrowDelay),
            fps,
            config: SPRING.heavy,
          });

          return (
            <React.Fragment key={i}>
              {/* 노드 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  opacity: nodeIn,
                  transform: `scale(${interpolate(nodeIn, [0, 1], [0.7, 1])})`,
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 24,
                    backgroundColor: palette.card,
                    border: `2px solid ${i === STEPS.length - 1 ? palette.accent : palette.cardBorder}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 64,
                  }}
                >
                  {step.emoji}
                </div>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    fontWeight: 700,
                    color: i === STEPS.length - 1 ? palette.accent : palette.text,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* 화살표 (마지막 제외) */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    opacity: arrowIn,
                    transform: `scaleX(${arrowIn})`,
                    marginTop: -30,
                  }}
                >
                  <svg width="80" height="40" viewBox="0 0 80 40">
                    <line
                      x1="0"
                      y1="20"
                      x2="55"
                      y2="20"
                      stroke={palette.accent}
                      strokeWidth="3"
                      strokeDasharray={`${interpolate(arrowIn, [0, 1], [0, 55])}`}
                    />
                    <polygon
                      points="55,10 75,20 55,30"
                      fill={palette.accent}
                      opacity={arrowIn}
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
