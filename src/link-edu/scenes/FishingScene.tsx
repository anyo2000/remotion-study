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

const WATER_Y = 0.38; // fraction of screen height

export const FishingScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    // Left line: hook drops, fish passes, X mark
    LEFT_HOOK_DOWN: 0,
    LEFT_FISH_ENTER: 15,
    LEFT_FISH_EXIT: 35,
    LEFT_FAIL: 38,
    // Right line: hook drops, fish bites, check mark + glow
    RIGHT_HOOK_DOWN: 40,
    RIGHT_FISH_ENTER: 52,
    RIGHT_FISH_BITE: 65,
    RIGHT_SUCCESS: 72,
    // Summary label
    LABEL_IN: 85,
  };

  const W = 1080;
  const H = 1920;
  const waterY = H * WATER_Y;

  // ── Left hook spring (drops into water) ──
  const leftHookIn = spring({
    frame: Math.max(0, frame - BEATS.LEFT_HOOK_DOWN),
    fps,
    config: SPRING.smooth,
  });
  const leftHookY = interpolate(leftHookIn, [0, 1], [waterY - 200, waterY + 120]);

  // ── Right hook spring (drops into water) ──
  const rightHookIn = spring({
    frame: Math.max(0, frame - BEATS.RIGHT_HOOK_DOWN),
    fps,
    config: SPRING.smooth,
  });
  const rightHookY = interpolate(rightHookIn, [0, 1], [waterY - 200, waterY + 120]);

  // ── Left fish position (swims L→R, exits without biting) ──
  const leftFishProgress = interpolate(
    frame,
    [BEATS.LEFT_FISH_ENTER, BEATS.LEFT_FISH_EXIT],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const leftFishX = interpolate(leftFishProgress, [0, 1], [-120, 500]);
  const leftFishY = waterY + 60;

  // ── Right fish position (approaches hook and bites) ──
  const rightFishApproach = interpolate(
    frame,
    [BEATS.RIGHT_FISH_ENTER, BEATS.RIGHT_FISH_BITE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rightFishX = interpolate(rightFishApproach, [0, 1], [W + 120, 720]);
  const rightFishY = waterY + 60;

  // Bite animation — fish mouth closes on hook
  const biteProgress = spring({
    frame: Math.max(0, frame - BEATS.RIGHT_FISH_BITE),
    fps,
    config: SPRING.bouncy,
  });
  // Fish moves slightly up toward hook when biting
  const biteOffsetY = interpolate(biteProgress, [0, 1], [0, -50]);

  // ── X mark (left fail) ──
  const xIn = spring({
    frame: Math.max(0, frame - BEATS.LEFT_FAIL),
    fps,
    config: SPRING.bouncy,
  });

  // ── ⭕ + glow (right success) ──
  const checkIn = spring({
    frame: Math.max(0, frame - BEATS.RIGHT_SUCCESS),
    fps,
    config: SPRING.bouncy,
  });
  const glowScale = interpolate(checkIn, [0, 1], [0, 1]);

  // ── Summary label ──
  const labelIn = spring({
    frame: Math.max(0, frame - BEATS.LABEL_IN),
    fps,
    config: SPRING.smooth,
  });

  // ── Water wave sin animation ──
  const wavePoints = Array.from({ length: 21 }).map((_, i) => {
    const x = (i / 20) * W;
    const y = waterY + Math.sin((i / 20) * Math.PI * 4 + frame * 0.08) * 8;
    return `${x},${y}`;
  });
  const wavePath = `M0,${waterY} ` + wavePoints.map((p) => `L${p}`).join(" ") + ` L${W},${H} L0,${H} Z`;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 35%, ${palette.glow} 0%, transparent 65%), ${palette.bg}`,
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
        홈쇼핑 = 질문
      </div>

      <svg
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Water area */}
        <path d={wavePath} fill={`${palette.accent}18`} />
        {/* Water surface line */}
        <polyline
          points={wavePoints.join(" ")}
          stroke={palette.accent}
          strokeWidth={2}
          fill="none"
          opacity={0.4}
        />

        {/* ── LEFT FISHING LINE ── */}
        {/* Line from top to hook */}
        <path
          d={`M ${270} ${SAFE.top + 120} Q ${260} ${leftHookY - 60} ${270} ${leftHookY}`}
          stroke={palette.sub}
          strokeWidth={2}
          fill="none"
        />
        {/* Hook shape */}
        <path
          d={`M ${270} ${leftHookY} Q ${285} ${leftHookY + 20} ${270} ${leftHookY + 35}`}
          stroke={palette.sub}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />

        {/* ── RIGHT FISHING LINE ── */}
        <path
          d={`M ${810} ${SAFE.top + 120} Q ${800} ${rightHookY - 60} ${810} ${rightHookY}`}
          stroke={palette.accent}
          strokeWidth={2}
          fill="none"
        />
        {/* Hook shape */}
        <path
          d={`M ${810} ${rightHookY} Q ${825} ${rightHookY + 20} ${810} ${rightHookY + 35}`}
          stroke={palette.accent}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />

        {/* ── LEFT FISH (passes without biting) ── */}
        {frame >= BEATS.LEFT_FISH_ENTER && frame <= BEATS.LEFT_FISH_EXIT + 5 && (
          <g transform={`translate(${leftFishX}, ${leftFishY})`}>
            <ellipse cx={0} cy={0} rx={52} ry={28} fill={palette.sub} opacity={0.7} />
            {/* Tail triangle */}
            <polygon points="-52,-18 -52,18 -80,0" fill={palette.sub} opacity={0.7} />
            {/* Eye */}
            <circle cx={30} cy={-6} r={6} fill={palette.bg} />
            <circle cx={32} cy={-7} r={3} fill={palette.text} />
          </g>
        )}

        {/* ── RIGHT FISH (bites hook) ── */}
        {frame >= BEATS.RIGHT_FISH_ENTER && (
          <g transform={`translate(${rightFishX}, ${rightFishY + biteOffsetY}) scale(-1,1)`}>
            <ellipse cx={0} cy={0} rx={52} ry={28} fill={palette.accent} opacity={0.85} />
            {/* Tail */}
            <polygon points="-52,-18 -52,18 -80,0" fill={palette.accent} opacity={0.85} />
            {/* Eye */}
            <circle cx={30} cy={-6} r={6} fill={palette.bg} />
            <circle cx={32} cy={-7} r={3} fill={palette.text} />
            {/* Mouth open or closed based on bite */}
            {biteProgress < 0.5 ? (
              // Open mouth
              <path d="M 46 4 Q 52 8 46 14" stroke={palette.bg} strokeWidth={3} fill="none" strokeLinecap="round" />
            ) : (
              // Closed mouth on hook
              <path d="M 44 8 L 52 8" stroke={palette.bg} strokeWidth={3} fill="none" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* ── SUCCESS GLOW (right) ── */}
        {checkIn > 0.05 && (
          <circle
            cx={810}
            cy={rightHookY + biteOffsetY}
            r={80 * glowScale}
            fill={`${palette.accent}30`}
          />
        )}
      </svg>

      {/* ── Left bait label ── */}
      {leftHookIn > 0.1 && (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: leftHookY - 80,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            background: palette.card,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 12,
            padding: "6px 18px",
          }}
        >
          여행 상품
        </div>
      )}

      {/* ── Right bait label ── */}
      {rightHookIn > 0.1 && (
        <div
          style={{
            position: "absolute",
            right: 120,
            top: rightHookY - 80,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.accent,
            background: palette.card,
            border: `2px solid ${palette.accent}`,
            borderRadius: 12,
            padding: "6px 18px",
          }}
        >
          참기름은?
        </div>
      )}

      {/* ── ❌ (left fail) ── */}
      {xIn > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: 180,
            top: leftFishY - 60,
            fontFamily: FONT_FAMILY,
            fontSize: 80,
            opacity: xIn,
            transform: `scale(${xIn})`,
          }}
        >
          ❌
        </div>
      )}

      {/* ── ⭕ (right success) ── */}
      {checkIn > 0.05 && (
        <div
          style={{
            position: "absolute",
            right: 160,
            top: rightFishY + biteOffsetY - 80,
            fontFamily: FONT_FAMILY,
            fontSize: 80,
            opacity: checkIn,
            transform: `scale(${checkIn})`,
            filter: `drop-shadow(0 0 16px ${palette.accent})`,
          }}
        >
          ⭕
        </div>
      )}

      {/* ── "질문 = 미끼" summary label ── */}
      <div
        style={{
          position: "absolute",
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom + 120,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 72,
          fontWeight: 900,
          color: palette.accent,
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [30, 0])}px)`,
        }}
      >
        질문 = 미끼
      </div>
    </AbsoluteFill>
  );
};
