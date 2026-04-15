import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GradientBackground, GlowOrb } from "../../components";

/**
 * 축1-7: 반전
 * 헤드라인 없이. 어둠 → "빈틈" 글자만 크게 등장 → 임팩트
 */
export const Axis1Reversal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const palette = PALETTES.coolBlue;

  const revealStart = 25;
  const revealIn = spring({
    frame: Math.max(0, frame - revealStart),
    fps,
    config: SPRING.dramatic,
  });

  // 서브 텍스트
  const subStart = revealStart + 25;
  const subIn = spring({
    frame: Math.max(0, frame - subStart),
    fps,
    config: SPRING.heavy,
  });

  // 글로우 펄스
  const glowPulse = frame >= revealStart
    ? 0.06 + Math.sin((frame - revealStart) * 0.08) * 0.02
    : 0;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />

      {frame >= revealStart && (
        <GlowOrb
          color={palette.accent}
          opacity={glowPulse}
          size={800}
          x="50%"
          y="50%"
          delay={revealStart}
        />
      )}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 메인 키워드 — 크게 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: interpolate(revealIn, [0, 1], [60, 160]),
            fontWeight: 900,
            color: palette.accent,
            opacity: revealIn,
            transform: `scale(${interpolate(revealIn, [0, 1], [0.5, 1])})`,
            letterSpacing: interpolate(revealIn, [0, 1], [20, 8]),
            textAlign: "center",
          }}
        >
          빈틈
        </div>

        {/* 서브 — 아래 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 600,
            color: palette.sub,
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [20, 0])}px)`,
            marginTop: 32,
            textAlign: "center",
          }}
        >
          거기서부터 시작됩니다
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
