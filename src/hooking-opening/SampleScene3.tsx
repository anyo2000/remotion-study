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
import { BEATS_HOOK_RESULT } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_HOOK_RESULT;

/**
 * 장면 2: [키워드 강조] — "궁금하죠?"
 * 오디오: "지금 무슨 소리인가 싶으시죠?" → "그게 바로 후킹의 결과입니다"
 */
export const SampleScene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - B.EMOJI_IN),
    fps,
    config: SPRING.bouncy,
  });

  const keywordIn = spring({
    frame: Math.max(0, frame - B.KEYWORD_IN),
    fps,
    config: SPRING.smooth,
  });

  const subIn = spring({
    frame: Math.max(0, frame - B.SUB_IN),
    fps,
    config: SPRING.smooth,
  });

  return (
    <SceneLayout pageTitle="방금 그 느낌">
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
