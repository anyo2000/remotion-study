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

export const QuestionSplitScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  startFrame,
  cues,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    Q_IN: cues?.qIn ?? 0,
    SPLIT: cues?.split ?? 28,
    WORDS_IN: cues?.wordsIn ?? 35,
  };

  // ❓ 등장 — 바운스
  const qIn = spring({
    frame: Math.max(0, frame - BEATS.Q_IN),
    fps,
    config: SPRING.bouncy,
  });

  // 분열 진행 (frame SPLIT~SPLIT+20)
  const splitProgress = spring({
    frame: Math.max(0, frame - BEATS.SPLIT),
    fps,
    config: SPRING.snappy,
  });

  // 왼쪽 반쪽이 왼쪽으로 밀려나는 양
  const splitOffsetLeft = interpolate(splitProgress, [0, 1], [0, -380]);
  // 오른쪽 반쪽이 오른쪽으로 밀려나는 양
  const splitOffsetRight = interpolate(splitProgress, [0, 1], [0, 380]);

  // 텍스트 등장
  const wordIn = spring({
    frame: Math.max(0, frame - BEATS.WORDS_IN),
    fps,
    config: SPRING.smooth,
  });

  const wordLeftX = interpolate(wordIn, [0, 1], [-120, 0]);
  const wordRightX = interpolate(wordIn, [0, 1], [120, 0]);

  // 중앙 선 펄싱 opacity
  const lineOpacity =
    frame >= BEATS.SPLIT
      ? 0.5 +
        0.5 *
          Math.sin(
            ((frame - BEATS.SPLIT) / duration) * Math.PI * 6
          )
      : 0;

  // 중앙 선 나타나는 진행
  const lineIn = interpolate(frame, [BEATS.SPLIT, BEATS.SPLIT + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const QFontSize = 300;
  // ❓ 이모지 너비 대략 절반씩 clip
  // 왼쪽 클립: 0 ~ 50%
  // 오른쪽 클립: 50% ~ 100%

  return (
    <AbsoluteFill
      style={{
        background: palette.bg,
        justifyContent: "center",
        alignItems: "center",
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

      {/* ❓ 왼쪽 반 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translateX(${splitOffsetLeft}px) scale(${qIn})`,
          fontSize: QFontSize,
          lineHeight: 1,
          clipPath: "inset(0 50% 0 0)",
          userSelect: "none",
          opacity: qIn,
        }}
      >
        ❓
      </div>

      {/* ❓ 오른쪽 반 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translateX(${splitOffsetRight}px) scale(${qIn})`,
          fontSize: QFontSize,
          lineHeight: 1,
          clipPath: "inset(0 0 0 50%)",
          userSelect: "none",
          opacity: qIn,
        }}
      >
        ❓
      </div>

      {/* 중앙 발광 수직선 */}
      {frame >= BEATS.SPLIT && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "30%",
            height: "40%",
            width: 3,
            transform: "translateX(-50%)",
            background: `linear-gradient(to bottom, transparent, ${palette.accent}, transparent)`,
            opacity: lineIn * lineOpacity,
            boxShadow: `0 0 12px 4px ${palette.accent}`,
          }}
        />
      )}

      {/* 왼쪽 텍스트: 파라고? */}
      <div
        style={{
          position: "absolute",
          left: SAFE.side + 40,
          top: "50%",
          transform: `translateY(-50%) translateX(${wordLeftX}px)`,
          opacity: wordIn,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 900,
            color: palette.accent,
          }}
        >
          파라고?
        </span>
      </div>

      {/* 오른쪽 텍스트: 말라고? */}
      <div
        style={{
          position: "absolute",
          right: SAFE.side + 40,
          top: "50%",
          transform: `translateY(-50%) translateX(${wordRightX}px)`,
          opacity: wordIn,
          textAlign: "right",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 900,
            color: palette.accent,
          }}
        >
          말라고?
        </span>
      </div>
    </AbsoluteFill>
  );
};
