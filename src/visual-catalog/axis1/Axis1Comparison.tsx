import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE_WIDE, FONT_FAMILY, PALETTES } from "../../constants";
import { CharacterReveal, XOMarker, GradientBackground, GlowOrb } from "../../components";

/**
 * 축1-2: 비교
 * ❌ "설명부터 시작" vs ✅ "보장분석부터 시작"
 */
export const Axis1Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const palette = PALETTES.coolBlue;

  const wrongDelay = 5;
  const rightDelay = 35;
  const highlightStart = Math.floor(durationInFrames * 0.6);
  const isHighlighted = frame >= highlightStart;

  const wrongIn = spring({
    frame: Math.max(0, frame - wrongDelay),
    fps,
    config: SPRING.smooth,
  });
  const rightIn = spring({
    frame: Math.max(0, frame - rightDelay),
    fps,
    config: SPRING.smooth,
  });

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
          text="어떻게 시작하시나요?"
          delay={0}
          stagger={2}
          fontSize={64}
          fontWeight={900}
          color={palette.text}
        />
      </div>

      {/* 카드 영역 — 가로 배치 (16:9) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_WIDE.top + 140,
          bottom: SAFE_WIDE.bottom,
          left: SAFE_WIDE.side + 40,
          right: SAFE_WIDE.side + 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* Wrong 카드 */}
        <div
          style={{
            flex: 1,
            opacity: wrongIn * (isHighlighted ? 0.4 : 1),
            transform: `translateY(${interpolate(wrongIn, [0, 1], [30, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <XOMarker type="x" delay={wrongDelay + 3} size={60} />
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 800,
                color: "#E05A5A",
              }}
            >
              이렇게 하면
            </span>
          </div>
          <div
            style={{
              width: "100%",
              padding: "40px 32px",
              borderRadius: 24,
              backgroundColor: "rgba(224, 90, 90, 0.06)",
              border: "3px solid #E05A5A",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 80,
                marginBottom: 16,
              }}
            >
              📋
            </div>
            <CharacterReveal
              text='"상품 설명부터 시작"'
              delay={wrongDelay + 8}
              stagger={2}
              fontSize={56}
              fontWeight={700}
              color={palette.text}
            />
          </div>
        </div>

        {/* Right 카드 */}
        <div
          style={{
            flex: 1,
            position: "relative",
            opacity: rightIn,
            transform: `translateY(${interpolate(rightIn, [0, 1], [30, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {isHighlighted && (
            <GlowOrb
              color="#4ECDC4"
              opacity={0.08}
              size={500}
              x="50%"
              y="50%"
              delay={highlightStart}
            />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <XOMarker type="o" delay={rightDelay + 3} size={60} />
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 800,
                color: "#4ECDC4",
              }}
            >
              이렇게 하면
            </span>
          </div>
          <div
            style={{
              width: "100%",
              padding: "40px 32px",
              borderRadius: 24,
              backgroundColor: "rgba(78, 205, 196, 0.06)",
              border: "3px solid #4ECDC4",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 80,
                marginBottom: 16,
              }}
            >
              🔍
            </div>
            <CharacterReveal
              text='"보장분석부터 시작"'
              delay={rightDelay + 8}
              stagger={2}
              fontSize={56}
              fontWeight={700}
              color={palette.text}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
