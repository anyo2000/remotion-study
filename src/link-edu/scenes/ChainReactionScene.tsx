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
const CIRCLE_RADIUS = 40;
const PHONE_W = 30;
const PHONE_H = 50;

// 파동이 옆 원에 닿는 프레임 간격
const WAVE_TRAVEL_FRAMES = 8;

export const ChainReactionScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  cues,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur, width, height } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    CIRCLES_IN: cues?.circlesIn ?? 0,
    TALKER_LIFTS: cues?.talkerLifts ?? 20,     // 3번째(index 2) 혼자 고개 듦
    WAVES_START: cues?.wavesStart ?? 25,        // 파동 시작
    TEXT_IN: cues?.textIn ?? 30,                // 텍스트 등장
    CHAIN_START: cues?.chainStart ?? 38,        // 체인 반응 — 나머지가 순서대로 고개 듦
  };

  // 원 배치 계산
  const safeLeft = SAFE.side + CIRCLE_RADIUS;
  const safeRight = (width as number) - SAFE.side - CIRCLE_RADIUS;
  const usableWidth = safeRight - safeLeft;
  const spacing = usableWidth / (CIRCLE_COUNT - 1);
  const circleY = (height as number) * 0.55;

  const circles = Array.from({ length: CIRCLE_COUNT }, (_, i) => ({
    x: safeLeft + i * spacing,
    y: circleY,
    isTalker: i === 2, // 3번째 원이 먼저 말함
  }));

  // 전체 원 등장 (스태거)
  const circlesInProgress = spring({
    frame: Math.max(0, frame - BEATS.CIRCLES_IN),
    fps,
    config: SPRING.smooth,
  });

  // "한 아저씨" — 3번째 원이 혼자 일어남
  const talkerLift = spring({
    frame: Math.max(0, frame - BEATS.TALKER_LIFTS),
    fps,
    config: SPRING.bouncy,
  });

  // 텍스트 등장
  const textIn = spring({
    frame: Math.max(0, frame - BEATS.TEXT_IN),
    fps,
    config: SPRING.smooth,
  });

  // 체인 반응 — 각 원이 talker로부터 거리만큼 딜레이 후 일어남
  const getChainLift = (i: number) => {
    if (i === 2) return talkerLift; // talker 자신
    const dist = Math.abs(i - 2);
    const chainFrame = BEATS.CHAIN_START + (dist - 1) * WAVE_TRAVEL_FRAMES;
    return spring({
      frame: Math.max(0, frame - chainFrame),
      fps,
      config: SPRING.bouncy,
    });
  };

  // 파동 SVG — talker 중심에서 3개 원호
  const talkerX = circles[2].x;
  const talkerTopY = circleY - CIRCLE_RADIUS;

  const waveProgress = (waveIdx: number) => {
    const waveDelay = BEATS.WAVES_START + waveIdx * 6;
    return spring({
      frame: Math.max(0, frame - waveDelay),
      fps,
      config: { damping: 20, stiffness: 40 },
    });
  };

  const wave1 = waveProgress(0);
  const wave2 = waveProgress(1);
  const wave3 = waveProgress(2);

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

      {/* SVG 레이어 — 파동 원호 */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        width={width as number}
        height={height as number}
      >
        {frame >= BEATS.WAVES_START &&
          [wave1, wave2, wave3].map((wp, wi) => {
            const r = 60 + wi * 55;
            const opacity = (1 - wp * 0.5) * wp;
            return (
              <path
                key={wi}
                d={`M ${talkerX - r * 0.8} ${talkerTopY - r * 0.4}
                    Q ${talkerX} ${talkerTopY - r}
                      ${talkerX + r * 0.8} ${talkerTopY - r * 0.4}`}
                fill="none"
                stroke={palette.accent}
                strokeWidth={3 - wi * 0.5}
                opacity={opacity}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 6px ${palette.accent})`,
                }}
              />
            );
          })}
      </svg>

      {/* 원(머리) + 폰 */}
      {circles.map((c, i) => {
        const liftProg = getChainLift(i);
        // 기울기: 고개 숙임(-15deg) → 일어남(0deg)
        const tilt = interpolate(liftProg, [0, 1], [15, 0]);
        // 폰 흐려짐 — 고개 들면 폰에서 눈 떼는 효과
        const phoneDim = interpolate(liftProg, [0, 1], [1, 0.3]);

        return (
          <div key={i}>
            {/* 원 (머리) */}
            <div
              style={{
                position: "absolute",
                left: c.x - CIRCLE_RADIUS,
                top: c.y - CIRCLE_RADIUS,
                width: CIRCLE_RADIUS * 2,
                height: CIRCLE_RADIUS * 2,
                borderRadius: "50%",
                background: c.isTalker ? palette.accent : palette.sub,
                opacity: circlesInProgress,
                transform: `rotate(${tilt}deg)`,
                transformOrigin: "bottom center",
                boxShadow: c.isTalker
                  ? `0 0 20px 6px ${palette.accent}60`
                  : "none",
              }}
            />

            {/* 폰 (사각형, 파란 빛) */}
            <div
              style={{
                position: "absolute",
                left: c.x - PHONE_W / 2,
                top: c.y + CIRCLE_RADIUS + 20,
                width: PHONE_W,
                height: PHONE_H,
                borderRadius: 4,
                background: "#2E5BFF",
                opacity: circlesInProgress * phoneDim,
                boxShadow: `0 0 10px 3px #2E5BFF60`,
              }}
            />
          </div>
        );
      })}

      {/* 텍스트 "귓구멍을 파라고 해요?" — talker 원 위 */}
      <div
        style={{
          position: "absolute",
          left: SAFE.side,
          right: SAFE.side,
          top: circleY - CIRCLE_RADIUS - 180,
          display: "flex",
          justifyContent: "center",
          opacity: textIn,
          transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            background: palette.card,
            border: `1.5px solid ${palette.cardBorder}`,
            borderRadius: 20,
            padding: "20px 36px",
            maxWidth: 820,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 64,
              fontWeight: 800,
              color: palette.text,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            "귓구멍을 파라고 해요?"
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
