import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY } from "../../constants";
import type { Palette } from "../../constants";
import type { AudioSync } from "../types";

type Props = AudioSync & {
  palette: Palette;
  durationInFrames?: number;
  /** 떨어지는 이모지/기호 */
  dropEmoji: string;
  /** 포인트 단어 (1~2단어) */
  headline: string;
  /** 보조 설명 텍스트 */
  sub?: string;
  accentWord?: string;
};

export const ImpactScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  dropEmoji,
  headline,
  sub,
  accentWord,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // BEATS
  const BEATS = {
    DROP_START: 5,
    LAND: 18,
    TEXT_IN: 22,
    GLOW: 30,
    SUB_IN: 35,
  };

  // ❗ 떨어지는 모션 — 위에서 중앙으로
  const dropProgress = spring({
    frame: Math.max(0, frame - BEATS.DROP_START),
    fps,
    config: { damping: 8, stiffness: 120 },
  });

  const dropY = interpolate(dropProgress, [0, 1], [-600, 0]);

  // 착지 순간 화면 shake
  const hasLanded = frame >= BEATS.LAND;
  const shakeIntensity = hasLanded
    ? 8 * Math.sin((frame - BEATS.LAND) * 4) *
      Math.exp(-(frame - BEATS.LAND) * 0.4)
    : 0;

  // 착지 순간 원형 충격파
  const impactRing = hasLanded
    ? spring({
        frame: Math.max(0, frame - BEATS.LAND),
        fps,
        config: { damping: 20, stiffness: 60 },
      })
    : 0;

  // 텍스트 등장
  const textIn = spring({
    frame: Math.max(0, frame - BEATS.TEXT_IN),
    fps,
    config: SPRING.bouncy,
  });

  // 보조 텍스트
  const subIn = spring({
    frame: Math.max(0, frame - BEATS.SUB_IN),
    fps,
    config: SPRING.smooth,
  });

  // 배경 글로우
  const glowIn = spring({
    frame: Math.max(0, frame - BEATS.GLOW),
    fps,
    config: SPRING.heavy,
  });

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${shakeIntensity}px)`,
      }}
    >
      {/* 배경 글로우 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 600 * glowIn,
          height: 600 * glowIn,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.accent}15, transparent)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 착지 충격파 링 */}
      {hasLanded && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            width: 300 * impactRing,
            height: 300 * impactRing,
            borderRadius: "50%",
            border: `3px solid ${palette.accent}`,
            opacity: 1 - impactRing,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* 떨어지는 이모지 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: `translate(-50%, -50%) translateY(${dropY}px)`,
          fontSize: 180,
        }}
      >
        {dropEmoji}
      </div>

      {/* 포인트 텍스트 — 이모지 아래 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: "55%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* 메인 키워드 */}
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 120,
            fontWeight: 900,
            color: accentWord ? palette.accent : palette.text,
            opacity: textIn,
            transform: `scale(${textIn})`,
          }}
        >
          {headline}
        </span>

        {/* 보조 텍스트 (sub) */}
        {sub && (
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 600,
              color: palette.sub,
              opacity: subIn,
              transform: `translateY(${interpolate(subIn, [0, 1], [15, 0])}px)`,
              textAlign: "center",
            }}
          >
            {sub}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};
