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

const PANEL_COUNT = 5;
const HEAD_RADIUS = 50;
const PHONE_W = 32;
const PHONE_H = 52;
const STAGGER = 5;

export const SubwayFrameScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  cues,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur, width, height } = useVideoConfig();
  const duration = dur ?? configDur;

  const BEATS = {
    PANELS_IN: cues?.panelsIn ?? 0,
    PULSE_START: cues?.pulseStart ?? STAGGER * PANEL_COUNT + 8,
  };

  // 패널 x 위치 계산 — 좌우 60px 패딩 내에서 균등 분할
  const padX = SAFE.side;
  const usableW = (width as number) - padX * 2;
  const panelW = usableW / PANEL_COUNT;

  const panels = Array.from({ length: PANEL_COUNT }, (_, i) => ({
    x: padX + panelW * i + panelW / 2,
    lineX: padX + panelW * i,
  }));

  const circleY = (height as number) * 0.5;
  const phoneY = circleY + HEAD_RADIUS + 20;

  // 부드러운 펄스 (sin 기반)
  const pulseOpacity =
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

      {/* SVG — 수직 분할선 + 원호 */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        width={width as number}
        height={height as number}
      >
        {/* 수직 구분선 (패널 경계) */}
        {panels.slice(1).map((p, i) => {
          const panelProgress = spring({
            frame: Math.max(0, frame - (BEATS.PANELS_IN + i * STAGGER)),
            fps,
            config: SPRING.smooth,
          });
          const lineH = interpolate(panelProgress, [0, 1], [0, height as number]);
          return (
            <line
              key={i}
              x1={p.lineX}
              y1={0}
              x2={p.lineX}
              y2={lineH}
              stroke={palette.sub}
              strokeWidth={2}
              opacity={0.3}
            />
          );
        })}
      </svg>

      {/* 패널별 — 머리 원 + 폰 */}
      {panels.map((p, i) => {
        const panelProgress = spring({
          frame: Math.max(0, frame - (BEATS.PANELS_IN + i * STAGGER)),
          fps,
          config: SPRING.smooth,
        });

        const glowOpacity = frame >= BEATS.PULSE_START ? pulseOpacity * 0.8 : 0;

        return (
          <div key={i}>
            {/* 머리 원 — rotate 15deg 고개 숙임 */}
            <div
              style={{
                position: "absolute",
                left: p.x - HEAD_RADIUS,
                top: circleY - HEAD_RADIUS,
                width: HEAD_RADIUS * 2,
                height: HEAD_RADIUS * 2,
                borderRadius: "50%",
                background: palette.sub,
                opacity: panelProgress,
                transform: "rotate(15deg)",
                transformOrigin: "bottom center",
              }}
            />

            {/* 폰 — 파란 직사각형 + accent glow */}
            <div
              style={{
                position: "absolute",
                left: p.x - PHONE_W / 2,
                top: phoneY,
                width: PHONE_W,
                height: PHONE_H,
                borderRadius: 5,
                background: palette.accent,
                opacity: panelProgress * 0.9,
                boxShadow: `0 0 ${interpolate(glowOpacity, [0, 1], [8, 24])}px ${interpolate(glowOpacity, [0, 1], [3, 10])}px ${palette.accent}${Math.round(glowOpacity * 180).toString(16).padStart(2, "0")}`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
