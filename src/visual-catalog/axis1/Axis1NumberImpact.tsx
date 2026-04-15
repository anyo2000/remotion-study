import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE_WIDE, FONT_FAMILY, PALETTES } from "../../constants";
import { CountUpNumber, GradientBackground, GlowOrb } from "../../components";

/**
 * 축1-5: 숫자 임팩트
 * "보장분석 후 계약 전환율" → 73% 카운트업
 */
export const Axis1NumberImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = PALETTES.coolBlue;

  const labelIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb
        color={palette.accent}
        opacity={0.06}
        size={600}
        x="50%"
        y="45%"
        delay={20}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: `0 ${SAFE_WIDE.side}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* 라벨 */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 600,
              color: palette.sub,
              opacity: labelIn,
              transform: `translateY(${interpolate(labelIn, [0, 1], [10, 0])}px)`,
              textAlign: "center",
            }}
          >
            보장분석 후 계약 전환율
          </div>

          {/* 숫자 */}
          <CountUpNumber
            from={0}
            to={73}
            startFrame={15}
            duration={45}
            fontSize={180}
            color={palette.accent}
            fontWeight={900}
            suffix="%"
          />

          {/* 부가 설명 */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 500,
              color: palette.sub,
              opacity: interpolate(
                spring({ frame: Math.max(0, frame - 50), fps, config: SPRING.heavy }),
                [0, 1],
                [0, 1]
              ),
              textAlign: "center",
            }}
          >
            고객이 직접 빈틈을 확인한 경우
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
