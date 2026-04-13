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

const FILM_FRAMES = 5;
const FRAME_W = 160;
const FRAME_H = 120;
const FRAME_GAP = 20;
const STRIP_PADDING = 40;
const PERFORATION_R = 8;
const PERFORATION_COUNT = 6; // per strip side

export const FilmStripScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    SCROLL_START: 0,
    STRIP_STOP: 25,
    TEAR_APPEAR: 30,
    QUESTION_IN: 38,
    HAND_IN: 50,
    NEXT_TEXT_IN: 65,
  };

  // Scroll offset: strip moves left-to-right (translateX increases)
  const scrollProgress = interpolate(
    frame,
    [BEATS.SCROLL_START, BEATS.STRIP_STOP],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scrollX = interpolate(scrollProgress, [0, 1], [-120, 40]);

  // Tear: gap widens between frame 2 and 3
  const tearProgress = spring({
    frame: Math.max(0, frame - BEATS.TEAR_APPEAR),
    fps,
    config: SPRING.bouncy,
  });
  const tearGap = interpolate(tearProgress, [0, 1], [0, 80]);

  // Question mark spring
  const questionIn = spring({
    frame: Math.max(0, frame - BEATS.QUESTION_IN),
    fps,
    config: SPRING.bouncy,
  });

  // Hand emoji
  const handIn = spring({
    frame: Math.max(0, frame - BEATS.HAND_IN),
    fps,
    config: SPRING.smooth,
  });
  const handX = interpolate(handIn, [0, 1], [-80, 20]);

  // "다음 편 →" text
  const nextTextIn = spring({
    frame: Math.max(0, frame - BEATS.NEXT_TEXT_IN),
    fps,
    config: SPRING.smooth,
  });

  const STRIP_Y = 960 - (FRAME_H / 2) - 40; // vertically centered
  const totalStripW =
    FILM_FRAMES * FRAME_W + (FILM_FRAMES - 1) * FRAME_GAP + STRIP_PADDING * 2;

  // Centered base X
  const baseX = (1080 - totalStripW) / 2 + scrollX;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${palette.glow} 0%, transparent 70%), ${palette.bg}`,
      }}
    >
      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 40,
          left: SAFE.side,
          right: SAFE.side,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 72,
          fontWeight: 900,
          color: palette.text,
        }}
      >
        다음엔 뭘 배울까?
      </div>

      {/* Film strip SVG */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Strip background bar */}
        <rect
          x={baseX}
          y={STRIP_Y - FRAME_H / 2 - 32}
          width={totalStripW + tearGap}
          height={FRAME_H + 64}
          rx={12}
          fill="#1a1a1a"
          stroke={palette.sub}
          strokeWidth={2}
        />

        {/* Perforations — top row */}
        {Array.from({ length: PERFORATION_COUNT }).map((_, i) => {
          const px =
            baseX +
            STRIP_PADDING / 2 +
            (i * (totalStripW - STRIP_PADDING)) / (PERFORATION_COUNT - 1);
          // shift right perforations after tear point
          const perfX = i >= Math.ceil(PERFORATION_COUNT / 2) ? px + tearGap : px;
          return (
            <circle
              key={`top-${i}`}
              cx={perfX}
              cy={STRIP_Y - FRAME_H / 2 - 20}
              r={PERFORATION_R}
              fill={palette.bg}
              stroke={palette.sub}
              strokeWidth={1}
            />
          );
        })}

        {/* Perforations — bottom row */}
        {Array.from({ length: PERFORATION_COUNT }).map((_, i) => {
          const px =
            baseX +
            STRIP_PADDING / 2 +
            (i * (totalStripW - STRIP_PADDING)) / (PERFORATION_COUNT - 1);
          const perfX = i >= Math.ceil(PERFORATION_COUNT / 2) ? px + tearGap : px;
          return (
            <circle
              key={`bot-${i}`}
              cx={perfX}
              cy={STRIP_Y + FRAME_H / 2 + 20}
              r={PERFORATION_R}
              fill={palette.bg}
              stroke={palette.sub}
              strokeWidth={1}
            />
          );
        })}

        {/* Film frames */}
        {Array.from({ length: FILM_FRAMES }).map((_, i) => {
          // frames after index 2 get shifted by tearGap
          const offsetX = i > 2 ? tearGap : 0;
          const fx = baseX + STRIP_PADDING + i * (FRAME_W + FRAME_GAP) + offsetX;
          const fy = STRIP_Y - FRAME_H / 2;

          // frame 3 (index 2) is the "torn" one — hide it behind tear
          const isTorn = i === 2;
          const frameOpacity = isTorn ? Math.max(0, 1 - tearProgress) : 1;

          return (
            <g key={i} opacity={frameOpacity}>
              <rect
                x={fx}
                y={fy}
                width={FRAME_W}
                height={FRAME_H}
                rx={8}
                fill={palette.card}
                stroke={palette.cardBorder}
                strokeWidth={2}
              />
              {/* Simple scene content inside frame */}
              {!isTorn && (
                <>
                  <rect
                    x={fx + 16}
                    y={fy + 20}
                    width={FRAME_W - 32}
                    height={8}
                    rx={4}
                    fill={palette.sub}
                    opacity={0.4}
                  />
                  <rect
                    x={fx + 16}
                    y={fy + 40}
                    width={(FRAME_W - 32) * 0.7}
                    height={8}
                    rx={4}
                    fill={palette.sub}
                    opacity={0.25}
                  />
                  <circle
                    cx={fx + FRAME_W / 2}
                    cy={fy + FRAME_H - 28}
                    r={16}
                    fill={palette.accent}
                    opacity={0.3}
                  />
                </>
              )}
            </g>
          );
        })}

        {/* Tear jagged edges — left side */}
        {tearProgress > 0.1 && (() => {
          const tearX =
            baseX + STRIP_PADDING + 3 * (FRAME_W + FRAME_GAP) - FRAME_GAP / 2;
          const ty = STRIP_Y - FRAME_H / 2 - 30;
          const th = FRAME_H + 60;
          const jaggedness = 12;
          const steps = 8;
          const leftPoints = Array.from({ length: steps + 1 }).map((_, j) => {
            const y = ty + (j * th) / steps;
            const x = tearX + (j % 2 === 0 ? 0 : -jaggedness);
            return `${x},${y}`;
          });
          const rightPoints = Array.from({ length: steps + 1 }).map((_, j) => {
            const y = ty + (j * th) / steps;
            const x = tearX + tearGap + (j % 2 === 0 ? jaggedness : 0);
            return `${x},${y}`;
          });
          return (
            <>
              <polyline
                points={leftPoints.join(" ")}
                stroke={palette.sub}
                strokeWidth={2}
                fill="none"
                opacity={tearProgress}
              />
              <polyline
                points={rightPoints.join(" ")}
                stroke={palette.sub}
                strokeWidth={2}
                fill="none"
                opacity={tearProgress}
              />
            </>
          );
        })()}
      </svg>

      {/* "?" in the torn gap */}
      {questionIn > 0.05 && (() => {
        const tearCenterX =
          baseX +
          STRIP_PADDING +
          3 * (FRAME_W + FRAME_GAP) -
          FRAME_GAP / 2 +
          tearGap / 2;
        return (
          <div
            style={{
              position: "absolute",
              left: tearCenterX,
              top: STRIP_Y,
              transform: `translate(-50%, -50%) scale(${questionIn})`,
              fontFamily: FONT_FAMILY,
              fontSize: 100,
              fontWeight: 900,
              color: palette.accent,
              opacity: questionIn,
            }}
          >
            ?
          </div>
        );
      })()}

      {/* Hand emoji reaching toward next frame */}
      {handIn > 0.05 && (() => {
        const nextFrameX =
          baseX +
          STRIP_PADDING +
          4 * (FRAME_W + FRAME_GAP) +
          tearGap;
        return (
          <div
            style={{
              position: "absolute",
              left: nextFrameX + handX,
              top: STRIP_Y + 80,
              transform: "translate(-50%, -50%)",
              fontSize: 80,
              opacity: handIn,
            }}
          >
            👆
          </div>
        );
      })()}

      {/* "다음 편 →" text below strip */}
      <div
        style={{
          position: "absolute",
          left: SAFE.side,
          right: SAFE.side,
          top: STRIP_Y + FRAME_H / 2 + 80,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 64,
          fontWeight: 700,
          color: palette.accent,
          opacity: nextTextIn,
          transform: `translateY(${interpolate(nextTextIn, [0, 1], [20, 0])}px)`,
        }}
      >
        다음 편 →
      </div>
    </AbsoluteFill>
  );
};
