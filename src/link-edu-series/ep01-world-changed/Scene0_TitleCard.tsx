import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GradientBackground, ParticleField, GlowOrb } from "../../components";

const palette = PALETTES.ep01;

/**
 * EP01 타이틀 카드 (0~120fr, 4초)
 *
 * LINK Consulting → OT 개론 뱃지 → "세상이 바뀌었다"
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
      <GradientBackground
        bgColor={palette.bg}
        glowColor={palette.glow}
        glowPosition={palette.glowPosition}
      />
      <ParticleField
        count={18}
        color={palette.accent}
        maxOpacity={0.10}
        speed={0.25}
        sizeRange={[2, 4]}
        seed="ep01-title"
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

          {/* OT 개론 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 24px",
              borderRadius: 20,
              backgroundColor: "rgba(232, 168, 56, 0.12)",
              border: "1px solid rgba(232, 168, 56, 0.25)",
              opacity: badgeIn,
              transform: `scale(${interpolate(badgeIn, [0, 1], [0.8, 1])})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 700,
                color: palette.accent,
              }}
            >
              OT
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
              }}
            >
              개론
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
            세상이 바뀌었다
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
