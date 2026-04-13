import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE, FONT_FAMILY } from "../../constants";
import type { Palette } from "../../constants";
import type { AudioSync } from "../types";

type Props = AudioSync & {
  palette: Palette;
  durationInFrames?: number;
};

const CIRCLE_COUNT = 6;
const HEAD_RADIUS = 45;
const PHONE_W = 30;
const PHONE_H = 50;
const TILT_STAGGER = 6;

export const SubwayLineScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  cues,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur, width, height } = useVideoConfig();
  const duration = dur ?? configDur;

  const BEATS = {
    CIRCLES_IN: cues?.circlesIn ?? 0,
    TILT_START: cues?.tiltStart ?? 15,
    PULSE_START: cues?.pulseStart ?? TILT_STAGGER * CIRCLE_COUNT + 20,
  };

  // 원 배치 — Safe Zone 내 균등 간격
  const safeLeft = SAFE.side + HEAD_RADIUS;
  const safeRight = (width as number) - SAFE.side - HEAD_RADIUS;
  const usableW = safeRight - safeLeft;
  const spacing = usableW / (CIRCLE_COUNT - 1);
  const lineY = (height as number) * 0.55;
  const circleY = lineY - HEAD_RADIUS;

  const circles = Array.from({ length: CIRCLE_COUNT }, (_, i) => ({
    x: safeLeft + i * spacing,
  }));

  // 전체 원 등장 (동시)
  const circlesIn = spring({
    frame: Math.max(0, frame - BEATS.CIRCLES_IN),
    fps,
    config: SPRING.smooth,
  });

  // 펄스 (sin 기반)
  const pulseBase =
    frame >= BEATS.PULSE_START
      ? 0.5 + 0.5 * Math.sin(((frame - BEATS.PULSE_START) / fps) * Math.PI * 2 * 1.2)
      : 0;

  return (
    <AbsoluteFill
      style={{
        background: palette.bg,
        overflow: "hidden",
      }}
    >
      {/* 배경 그라디언트 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${palette.glowPosition}, ${palette.glow} 0%, transparent 65%)`,
        }}
      />

      {/* SVG — 수평 좌석 라인 */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        width={width as number}
        height={height as number}
      >
        <line
          x1={SAFE.side}
          y1={lineY}
          x2={(width as number) - SAFE.side}
          y2={lineY}
          stroke={palette.sub}
          strokeWidth={3}
          opacity={circlesIn * 0.6}
        />
      </svg>

      {/* 원(머리) + 폰 */}
      {circles.map((c, i) => {
        // 고개 숙임: 0deg → 15deg (스태거)
        const tiltFrame = BEATS.TILT_START + i * TILT_STAGGER;
        const tiltProgress = spring({
          frame: Math.max(0, frame - tiltFrame),
          fps,
          config: SPRING.snappy,
        });
        const tilt = interpolate(tiltProgress, [0, 1], [0, 15]);

        // 폰 글로우 — 고개 숙이면서 등장
        const glowStrength = tiltProgress;
        const glowSize = interpolate(
          frame >= BEATS.PULSE_START ? pulseBase : glowStrength,
          [0, 1],
          [4, 18]
        );

        return (
          <div key={i}>
            {/* 머리 원 */}
            <div
              style={{
                position: "absolute",
                left: c.x - HEAD_RADIUS,
                top: circleY - HEAD_RADIUS,
                width: HEAD_RADIUS * 2,
                height: HEAD_RADIUS * 2,
                borderRadius: "50%",
                background: palette.sub,
                opacity: circlesIn,
                transform: `rotate(${tilt}deg)`,
                transformOrigin: "bottom center",
              }}
            />

            {/* 폰 */}
            <div
              style={{
                position: "absolute",
                left: c.x - PHONE_W / 2,
                top: lineY + 15,
                width: PHONE_W,
                height: PHONE_H,
                borderRadius: 5,
                background: palette.accent,
                opacity: circlesIn * glowStrength,
                boxShadow: `0 0 ${glowSize}px ${glowSize / 3}px ${palette.accent}88`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
