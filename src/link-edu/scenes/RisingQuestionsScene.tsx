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

// 물음표 위치를 시드 기반으로 결정 (매번 같은 위치 보장)
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const QUESTION_COUNT = 13;
// x 위치는 safe zone 안에서 랜덤 (60 ~ 1020)
const Q_POSITIONS = Array.from({ length: QUESTION_COUNT }, (_, i) => ({
  x: 80 + seededRandom(i * 7) * 860,
  stagger: i * 5,
  // sin drift 진폭과 위상 다양화
  driftAmp: 18 + seededRandom(i * 13) * 24,
  driftPhase: seededRandom(i * 3) * Math.PI * 2,
  driftFreq: 0.04 + seededRandom(i * 17) * 0.04,
  size: 80 + seededRandom(i * 11) * 20, // 80~100px
}));

// 물선 y 위치 — 화면 60%
const WATER_LINE_PERCENT = 0.60;

export const RisingQuestionsScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  cues,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur, height } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    Q_START: cues?.qStart ?? 0,
    WATER_LINE_IN: cues?.waterLine ?? 40,
    TEXT_IN: cues?.textIn ?? 55,
  };

  // 물선 나타나기
  const waterLineIn = interpolate(
    frame,
    [BEATS.WATER_LINE_IN, BEATS.WATER_LINE_IN + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "궁금하죠?" 등장
  const textIn = spring({
    frame: Math.max(0, frame - BEATS.TEXT_IN),
    fps,
    config: SPRING.bouncy,
  });

  const waterLineY = height * WATER_LINE_PERCENT;

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

      {/* 물음표들 */}
      {Q_POSITIONS.map((q, i) => {
        const localFrame = Math.max(0, frame - BEATS.Q_START - q.stagger);

        // 위에서 내려오는 속도 — 화면 아래에서 시작해 waterLine 근처로 올라옴
        const riseProgress = spring({
          frame: localFrame,
          fps,
          config: SPRING.smooth,
        });

        // y: 화면 아래 (height + 60) → waterLine 근처 (waterLine - 각자 위치 오프셋)
        const stackOffset = (i % 4) * 30; // 수위선에서 약간 쌓임
        const targetY = waterLineY - q.size * 0.5 - stackOffset;
        const startY = (height as number) + 80;

        const y = interpolate(riseProgress, [0, 1], [startY, targetY]);

        // sin 드리프트 (수평 흔들림)
        const drift = q.driftAmp * Math.sin(frame * q.driftFreq + q.driftPhase);

        // 물선 도달 후 opacity 살짝 낮춤 (쌓인 느낌)
        const opacity = riseProgress > 0.95 ? 0.6 + stackOffset * 0.005 : riseProgress;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: q.x + drift,
              top: y,
              fontSize: q.size,
              opacity,
              transform: `translateX(-50%)`,
              lineHeight: 1,
              color: palette.text,
              userSelect: "none",
            }}
          >
            ?
          </div>
        );
      })}

      {/* 수위선 — 수평 그라디언트 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: waterLineY,
          height: 3,
          background: `linear-gradient(to right, transparent 0%, ${palette.accent}80 20%, ${palette.accent} 50%, ${palette.accent}80 80%, transparent 100%)`,
          opacity: waterLineIn,
          boxShadow: `0 0 16px 4px ${palette.accent}40`,
        }}
      />

      {/* 수위선 위 글로우 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: waterLineY - 80,
          height: 80,
          background: `linear-gradient(to top, ${palette.accent}10, transparent)`,
          opacity: waterLineIn,
        }}
      />

      {/* 궁금하죠? */}
      <div
        style={{
          position: "absolute",
          left: SAFE.side,
          right: SAFE.side,
          top: waterLineY - 240,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: textIn,
          transform: `scale(${textIn})`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 100,
            fontWeight: 900,
            color: palette.accent,
            textAlign: "center",
            textShadow: `0 0 30px ${palette.accent}60`,
          }}
        >
          궁금하죠?
        </span>
      </div>
    </AbsoluteFill>
  );
};
