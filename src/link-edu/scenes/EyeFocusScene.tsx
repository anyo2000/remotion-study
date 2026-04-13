import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY } from "../../constants";
import type { Palette } from "../../constants";
import type { AudioSync } from "../types";

type Props = AudioSync & {
  palette: Palette;
  durationInFrames?: number;
  headline: string;
  accentWord?: string;
};

// 8개 눈 위치 — 화면 가장자리 타원형 배치 (1080x1920)
const CX = 540;
const CY = 880; // 약간 위쪽 중심
const RX = 420;
const RY = 550;
const EYE_COUNT = 8;
const EYES = Array.from({ length: EYE_COUNT }, (_, i) => {
  const angle = (i / EYE_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CX + RX * Math.cos(angle),
    y: CY + RY * Math.sin(angle),
    delay: i * 3,
  };
});

export const EyeFocusScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  headline,
  accentWord,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // BEATS
  const BEATS = {
    EYES_START: 0,
    LINES_START: 12,
    TEXT_IN: 25,
    HIGHLIGHT: Math.floor(duration * 0.5),
  };

  // 텍스트 등장
  const textIn = spring({
    frame: Math.max(0, frame - BEATS.TEXT_IN),
    fps,
    config: SPRING.bouncy,
  });

  // 하이라이트 — 텍스트 scale pulse
  const highlightPulse =
    frame >= BEATS.HIGHLIGHT
      ? 1 +
        0.08 *
          Math.sin((frame - BEATS.HIGHLIGHT) * 0.15) *
          Math.exp(-(frame - BEATS.HIGHLIGHT) * 0.03)
      : 1;

  return (
    <AbsoluteFill>
      {/* SVG 시선선 */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {EYES.map((eye, i) => {
          const lineProgress = spring({
            frame: Math.max(0, frame - BEATS.LINES_START - i * 2),
            fps,
            config: SPRING.smooth,
          });
          const len = Math.sqrt((eye.x - CX) ** 2 + (eye.y - CY) ** 2);
          return (
            <line
              key={`line-${i}`}
              x1={eye.x}
              y1={eye.y}
              x2={eye.x + (CX - eye.x) * lineProgress}
              y2={eye.y + (CY - eye.y) * lineProgress}
              stroke={palette.accent}
              strokeWidth={2}
              opacity={0.4 * lineProgress}
            />
          );
        })}
      </svg>

      {/* 눈 이모지들 */}
      {EYES.map((eye, i) => {
        const eyeIn = spring({
          frame: Math.max(0, frame - BEATS.EYES_START - eye.delay),
          fps,
          config: SPRING.bouncy,
        });
        return (
          <div
            key={`eye-${i}`}
            style={{
              position: "absolute",
              left: eye.x - 40,
              top: eye.y - 40,
              fontSize: 80,
              opacity: eyeIn,
              transform: `scale(${eyeIn})`,
            }}
          >
            👁️
          </div>
        );
      })}

      {/* 중앙 텍스트 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY - 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 140,
            fontWeight: 900,
            color: accentWord ? palette.accent : palette.text,
            opacity: textIn,
            transform: `scale(${textIn * highlightPulse})`,
            textAlign: "center",
          }}
        >
          {headline}
        </span>
      </div>
    </AbsoluteFill>
  );
};
