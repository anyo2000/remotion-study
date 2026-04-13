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

const PARTICLE_COUNT = 18;
const HG_W = 260;
const HG_H = 440;
const HG_CX = 540; // horizontal center
const HG_CY = 960; // vertical center (mid-screen)
const NECK_W = 24;
const NECK_H = 40;

// Hourglass SVG clip path points
// Top triangle: wide top, narrows to neck
// Bottom triangle: wide bottom, narrows from neck
function hourglassTopPath() {
  const top = HG_CY - HG_H / 2;
  const mid = HG_CY - NECK_H / 2;
  return `M ${HG_CX - HG_W / 2} ${top} L ${HG_CX + HG_W / 2} ${top} L ${HG_CX + NECK_W / 2} ${mid} L ${HG_CX - NECK_W / 2} ${mid} Z`;
}

function hourglassBottomPath() {
  const bot = HG_CY + HG_H / 2;
  const mid = HG_CY + NECK_H / 2;
  return `M ${HG_CX - NECK_W / 2} ${mid} L ${HG_CX + NECK_W / 2} ${mid} L ${HG_CX + HG_W / 2} ${bot} L ${HG_CX - HG_W / 2} ${bot} Z`;
}

function hourglassFrame() {
  const top = HG_CY - HG_H / 2;
  const bot = HG_CY + HG_H / 2;
  const mid_top = HG_CY - NECK_H / 2;
  const mid_bot = HG_CY + NECK_H / 2;
  return [
    `M ${HG_CX - HG_W / 2} ${top}`,
    `L ${HG_CX + HG_W / 2} ${top}`,
    `L ${HG_CX + NECK_W / 2} ${mid_top}`,
    `L ${HG_CX + NECK_W / 2} ${mid_bot}`,
    `L ${HG_CX + HG_W / 2} ${bot}`,
    `L ${HG_CX - HG_W / 2} ${bot}`,
    `L ${HG_CX - NECK_W / 2} ${mid_bot}`,
    `L ${HG_CX - NECK_W / 2} ${mid_top}`,
    `Z`,
  ].join(" ");
}

export const HourglassScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    HG_IN: 0,         // hourglass appears
    SAND_FALL: 8,     // particles start falling
    COUNT_3: 10,      // "3" appears (lasts 30 frames)
    COUNT_2: 40,      // "2" appears
    COUNT_1: 70,      // "1" appears
    EMPTY: 100,       // top is empty
    RESULT_IN: 108,   // "결정" text forms
  };

  // ── Hourglass entrance spring ──
  const hgIn = spring({
    frame: Math.max(0, frame - BEATS.HG_IN),
    fps,
    config: SPRING.smooth,
  });

  // ── Countdown number springs ──
  const count3In = spring({ frame: Math.max(0, frame - BEATS.COUNT_3), fps, config: SPRING.bouncy });
  const count3Out = frame >= BEATS.COUNT_2
    ? interpolate(frame, [BEATS.COUNT_2, BEATS.COUNT_2 + 8], [1, 0], { extrapolateRight: "clamp" })
    : 1;
  const count2In = spring({ frame: Math.max(0, frame - BEATS.COUNT_2), fps, config: SPRING.bouncy });
  const count2Out = frame >= BEATS.COUNT_1
    ? interpolate(frame, [BEATS.COUNT_1, BEATS.COUNT_1 + 8], [1, 0], { extrapolateRight: "clamp" })
    : 1;
  const count1In = spring({ frame: Math.max(0, frame - BEATS.COUNT_1), fps, config: SPRING.bouncy });
  const count1Out = frame >= BEATS.EMPTY
    ? interpolate(frame, [BEATS.EMPTY, BEATS.EMPTY + 8], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // ── Sand level: top drains, bottom fills ──
  const sandProgress = interpolate(
    frame,
    [BEATS.SAND_FALL, BEATS.EMPTY],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Top sand height (starts full, drains to 0)
  const topH = HG_H / 2 - NECK_H / 2;
  const topSandH = topH * (1 - sandProgress);
  const topSandY = HG_CY - NECK_H / 2 - topSandH;

  // Bottom sand height (starts empty, fills to full)
  const botH = HG_H / 2 - NECK_H / 2;
  const botSandH = botH * sandProgress;
  const botSandY = HG_CY + HG_H / 2 - botSandH;

  // ── Sand particles falling through neck ──
  const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
    const stagger = i * (90 / PARTICLE_COUNT);
    const cycleFrame = Math.max(0, frame - BEATS.SAND_FALL - stagger);
    const cycleLength = 18;
    const t = (cycleFrame % cycleLength) / cycleLength;
    const yStart = HG_CY - NECK_H / 2;
    const yEnd = HG_CY + NECK_H / 2 + 60;
    const px = HG_CX + (i % 5 - 2) * 5;
    const py = yStart + t * (yEnd - yStart);
    const visible = cycleFrame > 0 && sandProgress < 1;
    return { px, py, visible, i };
  });

  // ── "결정" text spring ──
  const resultIn = spring({
    frame: Math.max(0, frame - BEATS.RESULT_IN),
    fps,
    config: SPRING.dramatic,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${palette.glow} 0%, transparent 70%), ${palette.bg}`,
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
        결정의 순간
      </div>

      {/* Countdown numbers — behind hourglass */}
      {frame >= BEATS.COUNT_3 && frame < BEATS.EMPTY + 8 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: HG_CY - 130,
            textAlign: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 200,
            fontWeight: 900,
            color: palette.accent,
            opacity: 0.12,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {frame >= BEATS.COUNT_1
            ? "1"
            : frame >= BEATS.COUNT_2
            ? "2"
            : "3"}
        </div>
      )}

      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <clipPath id="topClip">
            <path d={hourglassTopPath()} />
          </clipPath>
          <clipPath id="botClip">
            <path d={hourglassBottomPath()} />
          </clipPath>
        </defs>

        {/* Hourglass outline — scales in */}
        <g
          transform={`translate(${HG_CX}, ${HG_CY}) scale(${hgIn}) translate(${-HG_CX}, ${-HG_CY})`}
        >
          {/* Hourglass frame */}
          <path
            d={hourglassFrame()}
            stroke={palette.sub}
            strokeWidth={3}
            fill="none"
          />

          {/* Top horizontal bar */}
          <line
            x1={HG_CX - HG_W / 2 - 20}
            y1={HG_CY - HG_H / 2}
            x2={HG_CX + HG_W / 2 + 20}
            y2={HG_CY - HG_H / 2}
            stroke={palette.sub}
            strokeWidth={6}
            strokeLinecap="round"
          />
          {/* Bottom horizontal bar */}
          <line
            x1={HG_CX - HG_W / 2 - 20}
            y1={HG_CY + HG_H / 2}
            x2={HG_CX + HG_W / 2 + 20}
            y2={HG_CY + HG_H / 2}
            stroke={palette.sub}
            strokeWidth={6}
            strokeLinecap="round"
          />

          {/* Top sand fill */}
          <rect
            x={HG_CX - HG_W / 2 - 2}
            y={topSandY}
            width={HG_W + 4}
            height={topSandH + 2}
            fill={palette.accent}
            opacity={0.7}
            clipPath="url(#topClip)"
          />

          {/* Bottom sand fill */}
          <rect
            x={HG_CX - HG_W / 2 - 2}
            y={botSandY}
            width={HG_W + 4}
            height={botSandH + 2}
            fill={palette.accent}
            opacity={0.7}
            clipPath="url(#botClip)"
          />

          {/* Sand particles falling */}
          {particles.map(
            ({ px, py, visible, i }) =>
              visible && (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={4}
                  fill={palette.accent}
                  opacity={0.9}
                />
              )
          )}
        </g>
      </svg>

      {/* Countdown overlay numbers — foreground with opacity */}
      {frame >= BEATS.COUNT_3 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: HG_CY - 130,
            textAlign: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 200,
            fontWeight: 900,
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {/* 3 */}
          {frame >= BEATS.COUNT_3 && frame < BEATS.COUNT_2 + 8 && (
            <span
              style={{
                color: palette.accent,
                opacity: count3In * count3Out * 0.9,
                transform: `scale(${count3In})`,
                display: "inline-block",
              }}
            >
              3
            </span>
          )}
          {/* 2 */}
          {frame >= BEATS.COUNT_2 && frame < BEATS.COUNT_1 + 8 && (
            <span
              style={{
                color: palette.accent,
                opacity: count2In * count2Out * 0.9,
                transform: `scale(${count2In})`,
                display: "inline-block",
              }}
            >
              2
            </span>
          )}
          {/* 1 */}
          {frame >= BEATS.COUNT_1 && frame < BEATS.EMPTY + 8 && (
            <span
              style={{
                color: palette.accent,
                opacity: count1In * count1Out * 0.9,
                transform: `scale(${count1In})`,
                display: "inline-block",
              }}
            >
              1
            </span>
          )}
        </div>
      )}

      {/* "결정" text formed from sand */}
      {resultIn > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: SAFE.side,
            right: SAFE.side,
            bottom: SAFE.bottom + 100,
            textAlign: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 80,
            fontWeight: 900,
            color: palette.accent,
            opacity: resultIn,
            transform: `scale(${interpolate(resultIn, [0, 1], [0.6, 1])})`,
            letterSpacing: "0.08em",
          }}
        >
          결정
        </div>
      )}
    </AbsoluteFill>
  );
};
