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
  headline: string;
};

const CIRCLE_COUNT = 6;
const HEAD_RADIUS = 45;
const PHONE_W = 30;
const PHONE_H = 50;
const BEAM_STAGGER = 3;

export const WaveFocusScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  cues,
  headline,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur, width, height } = useVideoConfig();
  const duration = dur ?? configDur;

  const W = width as number;
  const H = height as number;

  const BEATS = {
    CIRCLES_IN: cues?.circlesIn ?? 0,
    WAVES_START: cues?.wavesStart ?? 5,
    WAVES_MAX: cues?.wavesMax ?? 15,
    ROTATE_START: cues?.rotateStart ?? 15,
    BEAMS_START: cues?.beamsStart ?? 18,
    GLOW_PULSE: cues?.glowPulse ?? 30,
    TEXT_IN: cues?.textIn ?? 36,
  };

  // 원 배치 — ChainReactionScene과 동일 레이아웃
  const safeLeft = SAFE.side + HEAD_RADIUS;
  const safeRight = W - SAFE.side - HEAD_RADIUS;
  const usableW = safeRight - safeLeft;
  const spacing = usableW / (CIRCLE_COUNT - 1);
  const lineY = H * 0.55;
  const circleY = lineY - HEAD_RADIUS;

  const circles = Array.from({ length: CIRCLE_COUNT }, (_, i) => ({
    x: safeLeft + i * spacing,
    y: lineY,
  }));

  // 원 라인 중심 X
  const lineCenterX = (safeLeft + safeRight) / 2;
  const lineCenterY = lineY;

  // 원 등장
  const circlesIn = spring({
    frame: Math.max(0, frame - BEATS.CIRCLES_IN),
    fps,
    config: SPRING.smooth,
  });

  // 동심원 파동 — 3개, 중심에서 퍼져나감
  const waveProgress = (idx: number) => {
    const waveDelay = BEATS.WAVES_START + idx * 5;
    return spring({
      frame: Math.max(0, frame - waveDelay),
      fps,
      config: { damping: 20, stiffness: 30 },
    });
  };
  const maxWaveR = Math.sqrt(W * W + H * H) * 0.7;

  const wave1 = waveProgress(0);
  const wave2 = waveProgress(1);
  const wave3 = waveProgress(2);

  // frame 15에서 파동이 최대로 채움 — 그 이후 opacity fade
  const waveFillProgress =
    frame >= BEATS.WAVES_MAX
      ? spring({
          frame: Math.max(0, frame - BEATS.WAVES_MAX),
          fps,
          config: SPRING.heavy,
        })
      : 0;

  // 중심 글로우 펄스
  const glowPulse =
    frame >= BEATS.GLOW_PULSE
      ? 0.5 + 0.5 * Math.sin(((frame - BEATS.GLOW_PULSE) / fps) * Math.PI * 2 * 1.5)
      : 0;

  // 텍스트 등장
  const textIn = spring({
    frame: Math.max(0, frame - BEATS.TEXT_IN),
    fps,
    config: SPRING.bouncy,
  });

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

      {/* SVG — 파동 + 빛줄기 + 글로우 */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        width={W}
        height={H}
      >
        {/* 동심원 파동 아크 */}
        {[
          { prog: wave1, idx: 0 },
          { prog: wave2, idx: 1 },
          { prog: wave3, idx: 2 },
        ].map(({ prog, idx }) => {
          const r = interpolate(prog, [0, 1], [0, maxWaveR * (0.4 + idx * 0.3)]);
          const waveOpacity = interpolate(prog, [0, 0.2, 1], [0, 0.6, 0.15]) *
            (1 - waveFillProgress * 0.8);
          return (
            <circle
              key={idx}
              cx={lineCenterX}
              cy={lineCenterY}
              r={r}
              fill="none"
              stroke={palette.accent}
              strokeWidth={2.5 - idx * 0.5}
              opacity={waveOpacity}
              style={{ filter: `drop-shadow(0 0 8px ${palette.accent})` }}
            />
          );
        })}

        {/* 각 원에서 중심으로 향하는 빛줄기 */}
        {circles.map((c, i) => {
          const beamDelay = BEATS.BEAMS_START + i * BEAM_STAGGER;
          const beamProgress = spring({
            frame: Math.max(0, frame - beamDelay),
            fps,
            config: SPRING.snappy,
          });

          if (beamProgress < 0.02) return null;

          // 빛줄기 끝점이 lineCenterX, lineCenterY
          const startX = c.x;
          const startY = c.y - HEAD_RADIUS;
          const endX = interpolate(beamProgress, [0, 1], [startX, lineCenterX]);
          const endY = interpolate(beamProgress, [0, 1], [startY, lineCenterY - 20]);

          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={palette.accent}
              strokeWidth={2}
              opacity={beamProgress * 0.8}
              style={{ filter: `drop-shadow(0 0 6px ${palette.accent})` }}
            />
          );
        })}

        {/* 중심 글로우 펄스 */}
        {frame >= BEATS.GLOW_PULSE && (
          <circle
            cx={lineCenterX}
            cy={lineCenterY - 20}
            r={interpolate(glowPulse, [0, 1], [20, 60])}
            fill={palette.accent}
            opacity={glowPulse * 0.5}
            style={{ filter: "blur(16px)" }}
          />
        )}
      </svg>

      {/* 원(머리) + 폰 — Scene 5 연속으로 처음부터 upright */}
      {circles.map((c, i) => {
        // frame 15에서 중심을 향해 회전
        const rotateProg = spring({
          frame: Math.max(0, frame - BEATS.ROTATE_START),
          fps,
          config: SPRING.snappy,
        });

        // 각 원의 중심 대비 방향 (deg) — 안쪽으로 기울기
        const directionSign = c.x < lineCenterX ? 1 : c.x > lineCenterX ? -1 : 0;
        const rotateAngle = interpolate(rotateProg, [0, 1], [0, directionSign * 20]);

        return (
          <div key={i}>
            {/* 머리 원 */}
            <div
              style={{
                position: "absolute",
                left: c.x - HEAD_RADIUS,
                top: c.y - HEAD_RADIUS * 2,
                width: HEAD_RADIUS * 2,
                height: HEAD_RADIUS * 2,
                borderRadius: "50%",
                background: palette.sub,
                opacity: circlesIn,
                transform: `rotate(${rotateAngle}deg)`,
                transformOrigin: "bottom center",
              }}
            />

            {/* 폰 */}
            <div
              style={{
                position: "absolute",
                left: c.x - PHONE_W / 2,
                top: c.y + 10,
                width: PHONE_W,
                height: PHONE_H,
                borderRadius: 5,
                background: palette.accent,
                opacity: circlesIn * 0.7,
              }}
            />
          </div>
        );
      })}

      {/* 텍스트 */}
      {frame >= BEATS.TEXT_IN && (
        <div
          style={{
            position: "absolute",
            left: SAFE.side,
            right: SAFE.side,
            top: lineY - HEAD_RADIUS * 2 - 220,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: textIn,
            transform: `scale(${interpolate(textIn, [0, 1], [0.7, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 140,
              fontWeight: 900,
              color: palette.accent,
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: `0 0 40px ${palette.accent}80`,
            }}
          >
            {headline}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
