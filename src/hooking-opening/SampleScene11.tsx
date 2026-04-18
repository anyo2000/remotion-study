import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GlowOrb } from "../components";
import { SceneLayout } from "./SceneLayout";
import { BEATS_CLOSING } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_CLOSING;

/**
 * 장면 11: [클로징] — 핵심 메시지 + CTA
 * 오디오: "답을 주지 마세요" → "질문을 던지세요" → "다음 시간엔..."
 */
export const SampleScene11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineIn = spring({
    frame: Math.max(0, frame - B.TOP_TEXT - 5),
    fps,
    config: SPRING.heavy,
  });

  const topTextIn = spring({
    frame: Math.max(0, frame - B.TOP_TEXT),
    fps,
    config: SPRING.smooth,
  });

  const accentIn = spring({
    frame: Math.max(0, frame - B.ACCENT_TEXT),
    fps,
    config: SPRING.smooth,
  });

  const ctaIn = spring({
    frame: Math.max(0, frame - B.CTA),
    fps,
    config: SPRING.smooth,
  });

  const lineWidth = interpolate(lineIn, [0, 1], [0, 120]);

  return (
    <SceneLayout pageTitle="핵심 메시지" particles>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlowOrb
          color={palette.accent}
          opacity={0.06}
          size={600}
          x="50%"
          y="45%"
          delay={10}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* 상단 텍스트 */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 64,
              fontWeight: 700,
              color: palette.sub,
              opacity: topTextIn,
              transform: `translateY(${interpolate(topTextIn, [0, 1], [12, 0])}px)`,
              textAlign: "center",
            }}
          >
            답을 주지 마세요
          </div>

          {/* 구분선 */}
          <div
            style={{
              width: lineWidth,
              height: 3,
              backgroundColor: palette.accent,
              borderRadius: 2,
              margin: "12px 0",
            }}
          />

          {/* 강조 텍스트 */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 88,
              fontWeight: 900,
              color: palette.accent,
              opacity: accentIn,
              transform: `translateY(${interpolate(accentIn, [0, 1], [12, 0])}px)`,
              textAlign: "center",
            }}
          >
            질문을 던지세요
          </div>

          {/* CTA */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              opacity: ctaIn * 0.7,
              marginTop: 60,
              textAlign: "center",
            }}
          >
            다음 시간 → 후킹 화법 실전
          </div>
        </div>
      </AbsoluteFill>
    </SceneLayout>
  );
};
