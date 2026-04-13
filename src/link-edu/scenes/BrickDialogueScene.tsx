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

type Exchange = {
  speaker: "customer" | "fp";
  text: string;
  emoji?: string;
  delay: number;
};

type Props = AudioSync & {
  palette: Palette;
  durationInFrames?: number;
  exchanges: Exchange[];
};

const BRICK_COUNT = 15;
const BRICK_W = 160;
const BRICK_H = 60;
const BRICKS_PER_ROW = 4;
const BRICK_GAP = 8;
const STAGGER = 3; // frames between bricks

// Pseudo-random seeded by index
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const BrickDialogueScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  exchanges,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  // Derive from exchanges delays or use defaults
  const exchange0Delay = exchanges[0]?.delay ?? 0;
  const exchange1Delay = exchanges[1]?.delay ?? 20;
  const exchange2Delay = exchanges[2]?.delay ?? 60;
  const exchange3Delay = exchanges[3]?.delay ?? 85;

  const BEATS = {
    BRICKS_START: 0,
    WALL_COMPLETE: BRICK_COUNT * STAGGER + 10,
    EX0_IN: exchange0Delay,
    EX1_IN: exchange1Delay,
    DIM_START: exchange1Delay + 15,
    FLASH_IN: exchange2Delay - 8,
    FLASH_OUT: exchange2Delay + 20,
    EX2_IN: exchange2Delay,
    EX3_IN: exchange3Delay,
    CRACK_IN: exchange2Delay + 10,
    COLLAPSE_IN: exchange3Delay + 15,
  };

  const W = 1080;
  const H = 1920;

  // ── Brick wall build (staggered, bottom to top) ──
  const brickRows = Math.ceil(BRICK_COUNT / BRICKS_PER_ROW);
  const wallBaseY = H * 0.72;

  // ── Dim progress (before phase → grey) ──
  const dimProgress = interpolate(
    frame,
    [BEATS.DIM_START, BEATS.DIM_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Flash text ──
  const flashOpacity =
    frame >= BEATS.FLASH_IN && frame <= BEATS.FLASH_OUT
      ? interpolate(
          frame,
          [BEATS.FLASH_IN, BEATS.FLASH_IN + 6, BEATS.FLASH_OUT - 6, BEATS.FLASH_OUT],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 0;

  // ── After phase: background shifts back ──
  const afterProgress = spring({
    frame: Math.max(0, frame - BEATS.EX2_IN),
    fps,
    config: SPRING.heavy,
  });

  // ── Collapse progress ──
  const collapseProgress = spring({
    frame: Math.max(0, frame - BEATS.COLLAPSE_IN),
    fps,
    config: { damping: 8, stiffness: 80 },
  });

  // ── Speech bubbles visibility ──
  const visibleExchanges = exchanges.filter((ex) => frame >= ex.delay);
  const isBefore = (ex: Exchange) => exchanges.indexOf(ex) < 2;
  const isAfter = (ex: Exchange) => exchanges.indexOf(ex) >= 2;

  return (
    <AbsoluteFill>
      {/* Background: grey in before phase, returns to palette in after */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${palette.glow} 0%, transparent 65%), ${palette.bg}`,
        }}
      />
      {/* Dim overlay */}
      <AbsoluteFill
        style={{
          background: `rgba(30,30,30,${0.55 * dimProgress * (1 - afterProgress)})`,
        }}
      />

      {/* ── Brick Wall ── */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {Array.from({ length: BRICK_COUNT }).map((_, i) => {
          const brickIn = spring({
            frame: Math.max(0, frame - BEATS.BRICKS_START - i * STAGGER),
            fps,
            config: SPRING.heavy,
          });

          // layout: bottom row first
          const row = Math.floor(i / BRICKS_PER_ROW);
          const col = i % BRICKS_PER_ROW;
          const rowOffsetX = row % 2 === 0 ? 0 : BRICK_W / 2;
          const totalW = BRICKS_PER_ROW * BRICK_W + (BRICKS_PER_ROW - 1) * BRICK_GAP;
          const startX = (W - totalW) / 2;

          const bx = startX + col * (BRICK_W + BRICK_GAP) + rowOffsetX;
          const by = wallBaseY - row * (BRICK_H + BRICK_GAP);

          // Slam effect: drops from above
          const slamOffsetY = interpolate(brickIn, [0, 1], [-120, 0]);

          // Collapse: bricks fly outward
          const collapseAngle = seededRand(i) * Math.PI * 2;
          const collapseRadius = 400 + seededRand(i + 100) * 300;
          const collapseX = Math.cos(collapseAngle) * collapseRadius * collapseProgress;
          const collapseY =
            Math.sin(collapseAngle) * collapseRadius * collapseProgress +
            500 * collapseProgress * collapseProgress; // gravity
          const collapseRot = seededRand(i + 50) * 720 * collapseProgress;
          const collapseOpacity = 1 - collapseProgress * 0.9;

          const brickColor = dimProgress > 0.5 ? "#555555" : palette.card;
          const brickBorderColor = dimProgress > 0.5 ? "#666666" : palette.cardBorder;

          if (brickIn < 0.01) return null;

          return (
            <g
              key={i}
              transform={`
                translate(${bx + BRICK_W / 2 + collapseX}, ${by + BRICK_H / 2 + slamOffsetY + collapseY})
                rotate(${collapseRot})
                translate(${-BRICK_W / 2}, ${-BRICK_H / 2})
              `}
              opacity={brickIn * collapseOpacity}
            >
              <rect
                x={0}
                y={0}
                width={BRICK_W}
                height={BRICK_H}
                rx={8}
                fill={brickColor}
                stroke={brickBorderColor}
                strokeWidth={1.5}
              />
            </g>
          );
        })}

        {/* Crack lines on wall after EX2 */}
        {frame >= BEATS.CRACK_IN && (
          <>
            <line
              x1={W / 2 - 60}
              y1={wallBaseY - BRICK_COUNT / BRICKS_PER_ROW * (BRICK_H + BRICK_GAP) * 0.5}
              x2={W / 2 + 40}
              y2={wallBaseY - BRICK_COUNT / BRICKS_PER_ROW * (BRICK_H + BRICK_GAP) * 0.9}
              stroke={palette.accent}
              strokeWidth={3}
              opacity={interpolate(frame, [BEATS.CRACK_IN, BEATS.CRACK_IN + 10], [0, 1], { extrapolateRight: "clamp" })}
            />
            <line
              x1={W / 2 + 40}
              y1={wallBaseY - BRICK_COUNT / BRICKS_PER_ROW * (BRICK_H + BRICK_GAP) * 0.9}
              x2={W / 2 + 100}
              y2={wallBaseY - BRICK_COUNT / BRICKS_PER_ROW * (BRICK_H + BRICK_GAP) * 0.7}
              stroke={palette.accent}
              strokeWidth={2}
              opacity={interpolate(frame, [BEATS.CRACK_IN + 2, BEATS.CRACK_IN + 12], [0, 1], { extrapolateRight: "clamp" })}
            />
            <line
              x1={W / 2 - 30}
              y1={wallBaseY - BRICK_COUNT / BRICKS_PER_ROW * (BRICK_H + BRICK_GAP) * 0.6}
              x2={W / 2 - 110}
              y2={wallBaseY - BRICK_COUNT / BRICKS_PER_ROW * (BRICK_H + BRICK_GAP) * 0.4}
              stroke={palette.accent}
              strokeWidth={2}
              opacity={interpolate(frame, [BEATS.CRACK_IN + 4, BEATS.CRACK_IN + 14], [0, 1], { extrapolateRight: "clamp" })}
            />
          </>
        )}
      </svg>

      {/* ── Speech bubbles ── */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 40,
          left: SAFE.side,
          right: SAFE.side,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {visibleExchanges.map((exchange, idx) => {
          const exIdx = exchanges.indexOf(exchange);
          const isCustomer = exchange.speaker === "customer";
          const beforePhase = exIdx < 2;

          const enterSpring = spring({
            frame: Math.max(0, frame - exchange.delay),
            fps,
            config: SPRING.smooth,
          });

          // Before phase bubbles dim out
          const bubbleOpacity = beforePhase
            ? enterSpring * (1 - dimProgress * 0.7)
            : enterSpring;

          // After phase: accent bubble for fp
          const bubbleBg = beforePhase
            ? `rgba(80, 80, 80, ${0.4 + dimProgress * 0.3})`
            : isCustomer
            ? palette.card
            : palette.accent;
          const bubbleText = beforePhase
            ? dimProgress > 0.5
              ? "#888888"
              : palette.text
            : isCustomer
            ? palette.text
            : palette.bg;

          return (
            <div
              key={`${exIdx}-${exchange.delay}`}
              style={{
                opacity: bubbleOpacity,
                transform: `translateY(${interpolate(enterSpring, [0, 1], [16, 0])}px)`,
                display: "flex",
                justifyContent: isCustomer ? "flex-start" : "flex-end",
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  background: bubbleBg,
                  border: beforePhase
                    ? `1px solid rgba(120,120,120,0.3)`
                    : isCustomer
                    ? `1px solid ${palette.cardBorder}`
                    : `2px solid ${palette.accent}`,
                  borderRadius: isCustomer ? "6px 20px 20px 20px" : "20px 6px 20px 20px",
                  padding: "18px 24px",
                  boxShadow:
                    !beforePhase && !isCustomer
                      ? `0 0 20px ${palette.accent}40`
                      : "none",
                }}
              >
                {exchange.emoji && (
                  <span style={{ fontSize: 52, marginRight: 8 }}>
                    {exchange.emoji}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 56,
                    fontWeight: 700,
                    color: bubbleText,
                    lineHeight: 1.45,
                  }}
                >
                  {exchange.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Flash: "첫마디만 바꿨을 뿐" ── */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(0,0,0,${0.6 * flashOpacity})`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 900,
              color: palette.accent,
              opacity: flashOpacity,
              transform: `scale(${0.8 + flashOpacity * 0.2})`,
              textAlign: "center",
              padding: `0 ${SAFE.side}px`,
              textShadow: `0 0 40px ${palette.accent}`,
            }}
          >
            첫마디만 바꿨을 뿐
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
