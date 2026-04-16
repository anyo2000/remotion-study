import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GlowOrb } from "../components";
import { SceneLayout } from "./SceneLayout";

const palette = PALETTES.orange;

/**
 * 장면 3: [키워드 강조] — "궁금하죠?"
 * 이모지 + 핵심 키워드 크게 + 보조 텍스트
 */
export const SampleScene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.bouncy,
  });

  const keywordIn = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: SPRING.smooth,
  });

  const subIn = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: SPRING.smooth,
  });

  return (
    <SceneLayout pageTitle="궁금하죠?">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* 이모지 */}
        <div
          style={{
            fontSize: 120,
            lineHeight: 1,
            opacity: emojiIn,
            transform: `scale(${interpolate(emojiIn, [0, 1], [0.5, 1])})`,
          }}
        >
          🤨
        </div>

        {/* 핵심 키워드 — 크게 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 100,
            fontWeight: 900,
            color: palette.accent,
            opacity: keywordIn,
            transform: `translateY(${interpolate(keywordIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
          }}
        >
          궁금하죠?
        </div>

        {/* 보조 텍스트 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: palette.sub,
            opacity: subIn,
            textAlign: "center",
          }}
        >
          이게 후킹입니다
        </div>

        <GlowOrb
          color={palette.accent}
          opacity={0.04}
          size={500}
          x="50%"
          y="50%"
          delay={10}
        />
      </div>
    </SceneLayout>
  );
};
