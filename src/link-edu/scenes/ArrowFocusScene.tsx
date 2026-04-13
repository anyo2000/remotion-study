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

const ARROW_COUNT = 10;
const APPEAR_STAGGER = 2;
const SHOOT_FRAME = 15;
const CONVERGE_FRAME = 22;

// 화살표 시작 위치 (화면 가장자리) + 방향
type ArrowDef = {
  fromX: number;
  fromY: number;
  angle: number; // degrees — 화살표가 향하는 방향 (중심 기준)
};

export const ArrowFocusScene: React.FC<Props> = ({
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
  const cx = W / 2;
  const cy = H * 0.5;

  const BEATS = {
    APPEAR_START: cues?.appearStart ?? 0,
    SHOOT: cues?.shoot ?? SHOOT_FRAME,
    CONVERGE: cues?.converge ?? CONVERGE_FRAME,
    TEXT_IN: cues?.textIn ?? CONVERGE_FRAME + 5,
  };

  // 10개 화살표 — 화면 가장자리에서 중심으로
  const arrows: ArrowDef[] = [
    // 상단
    { fromX: cx - 300, fromY: 0, angle: 110 },
    { fromX: cx, fromY: 0, angle: 90 },
    { fromX: cx + 300, fromY: 0, angle: 70 },
    // 하단
    { fromX: cx - 300, fromY: H, angle: -70 },
    { fromX: cx, fromY: H, angle: -90 },
    { fromX: cx + 300, fromY: H, angle: -110 },
    // 좌측
    { fromX: 0, fromY: cy - 250, angle: 30 },
    { fromX: 0, fromY: cy + 250, angle: -30 },
    // 우측
    { fromX: W, fromY: cy - 250, angle: 150 },
    { fromX: W, fromY: cy + 250, angle: 210 },
  ];

  // 폭발 원 — converge 이후 확장
  const explosionProgress = spring({
    frame: Math.max(0, frame - BEATS.CONVERGE),
    fps,
    config: SPRING.bouncy,
  });
  const explosionR = interpolate(explosionProgress, [0, 1], [0, 400]);
  const explosionOpacity =
    frame >= BEATS.CONVERGE ? interpolate(explosionProgress, [0, 0.3, 1], [0, 1, 0]) : 0;

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

      {/* SVG — 화살표 + 폭발 */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        width={W}
        height={H}
      >
        {arrows.map((a, i) => {
          const appearFrame = BEATS.APPEAR_START + i * APPEAR_STAGGER;

          // 등장 (가장자리에서 제자리)
          const appearProgress = spring({
            frame: Math.max(0, frame - appearFrame),
            fps,
            config: SPRING.smooth,
          });

          // 슛 — 가장자리 → 중심 (모두 동시에)
          const shootProgress =
            frame >= BEATS.SHOOT
              ? spring({
                  frame: Math.max(0, frame - BEATS.SHOOT),
                  fps,
                  config: SPRING.snappy,
                })
              : 0;

          // 화살표 현재 위치
          const x = interpolate(shootProgress, [0, 1], [a.fromX, cx]);
          const y = interpolate(shootProgress, [0, 1], [a.fromY, cy]);

          // converge 이후 사라짐
          const arrowOpacity =
            frame >= BEATS.CONVERGE
              ? interpolate(frame - BEATS.CONVERGE, [0, 4], [1, 0], {
                  extrapolateRight: "clamp",
                })
              : appearProgress;

          const rad = (a.angle * Math.PI) / 180;
          const tipX = x + Math.cos(rad) * 0;
          const tipY = y + Math.sin(rad) * 0;
          const arrowLen = 60;
          const tailX = tipX - Math.cos(rad) * arrowLen;
          const tailY = tipY - Math.sin(rad) * arrowLen;

          return (
            <g key={i} opacity={arrowOpacity}>
              <defs>
                <marker
                  id={`arrowhead-${i}`}
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L8,3 z" fill={palette.accent} />
                </marker>
              </defs>
              <line
                x1={tailX}
                y1={tailY}
                x2={tipX}
                y2={tipY}
                stroke={palette.accent}
                strokeWidth={3}
                markerEnd={`url(#arrowhead-${i})`}
                style={{ filter: `drop-shadow(0 0 6px ${palette.accent})` }}
              />
            </g>
          );
        })}

        {/* 폭발 원 */}
        {frame >= BEATS.CONVERGE && (
          <circle
            cx={cx}
            cy={cy}
            r={explosionR}
            fill={palette.accent}
            opacity={explosionOpacity * 0.35}
            style={{ filter: `blur(12px)` }}
          />
        )}
        {frame >= BEATS.CONVERGE && (
          <circle
            cx={cx}
            cy={cy}
            r={explosionR * 0.5}
            fill="none"
            stroke={palette.accent}
            strokeWidth={3}
            opacity={explosionOpacity * 0.7}
          />
        )}
      </svg>

      {/* 텍스트 */}
      {frame >= BEATS.TEXT_IN && (
        <div
          style={{
            position: "absolute",
            left: SAFE.side,
            right: SAFE.side,
            top: cy - 80,
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
