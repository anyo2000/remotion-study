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

const palette = PALETTES.orange;

/**
 * 장면 1: [반전] — 귓구멍 질문
 * fullContent 모드 — 상단 바 없이 질문 자체가 화면 전부
 * (반전 태그: 헤드라인 생략)
 */
export const SampleScene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const EMOJI_IN = 5;
  const TEXT_IN = 30;
  const GLOW_PULSE_START = 15;

  const emojiProgress = spring({
    frame: Math.max(0, frame - EMOJI_IN),
    fps,
    config: SPRING.bouncy,
  });

  const leftProgress = spring({
    frame: Math.max(0, frame - TEXT_IN),
    fps,
    config: SPRING.smooth,
  });

  const rightProgress = spring({
    frame: Math.max(0, frame - TEXT_IN - 5),
    fps,
    config: SPRING.smooth,
  });

  const glowPulse =
    frame >= GLOW_PULSE_START
      ? 0.06 + Math.sin((frame - GLOW_PULSE_START) * 0.06) * 0.02
      : 0;

  return (
    <SceneLayout pageTitle="파라고? 말라고?" particles>
      <GlowOrb
        color={palette.accent}
        opacity={glowPulse}
        size={700}
        x="50%"
        y="48%"
        delay={EMOJI_IN}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
          }}
        >
          {/* ❓ 이모지 */}
          <div
            style={{
              fontSize: 200,
              lineHeight: 1,
              opacity: emojiProgress,
              transform: `scale(${emojiProgress})`,
            }}
          >
            ❓
          </div>

          {/* 양쪽 텍스트 대치 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 80,
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 900,
                color: palette.accent,
                opacity: leftProgress,
                transform: `translateX(${interpolate(leftProgress, [0, 1], [-60, 0])}px)`,
              }}
            >
              파라고?
            </div>

            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 600,
                color: palette.sub,
                opacity: Math.min(leftProgress, rightProgress),
              }}
            >
              vs
            </div>

            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 900,
                color: palette.accent,
                opacity: rightProgress,
                transform: `translateX(${interpolate(rightProgress, [0, 1], [60, 0])}px)`,
              }}
            >
              말라고?
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneLayout>
  );
};
