import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GradientBackground, ParticleField, GlowOrb } from "../components";

const palette = PALETTES.orange;

/**
 * 장면 0: 타이틀 카드 (0~135fr, 4.5초)
 * LINK Consulting 브랜딩 + L후킹 뱃지 + "왜 후킹인가"
 */
export const Scene0_TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.smooth,
  });

  const lineIn = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: SPRING.heavy,
  });

  const badgeIn = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: SPRING.bouncy,
  });

  const titleIn = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: SPRING.smooth,
  });

  const lineWidth = interpolate(lineIn, [0, 1], [0, 200]);

  return (
    <AbsoluteFill>
      <GradientBackground palette="orange" />
      <ParticleField
        count={18}
        color={palette.accent}
        maxOpacity={0.12}
        speed={0.25}
        sizeRange={[2, 4]}
        seed="titlecard"
      />
      <GlowOrb
        color={palette.accent}
        opacity={0.06}
        size={800}
        x="50%"
        y="45%"
        delay={5}
      />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* LINK Consulting */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              opacity: logoIn,
              transform: `translateY(${interpolate(logoIn, [0, 1], [15, 0])}px)`,
            }}
          >
            LINK Consulting
          </div>

          {/* 구분선 */}
          <div
            style={{
              width: lineWidth,
              height: 2,
              backgroundColor: palette.accent,
              borderRadius: 1,
            }}
          />

          {/* L후킹 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 28px",
              borderRadius: 20,
              backgroundColor: "rgba(91, 155, 213, 0.12)",
              border: "1px solid rgba(91, 155, 213, 0.25)",
              opacity: badgeIn,
              transform: `scale(${interpolate(badgeIn, [0, 1], [0.8, 1])})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 700,
                color: "#5b9bd5",
              }}
            >
              L
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
              }}
            >
              후킹
            </span>
          </div>

          {/* 에피소드 제목 */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 88,
              fontWeight: 900,
              color: palette.text,
              opacity: titleIn,
              transform: `translateY(${interpolate(titleIn, [0, 1], [15, 0])}px)`,
              marginTop: 16,
            }}
          >
            왜 후킹인가
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
