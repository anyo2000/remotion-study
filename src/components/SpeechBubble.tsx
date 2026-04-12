import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY } from "../constants";
import type { Palette } from "../constants";

type Props = {
  speaker: "customer" | "fp";
  text: string;
  emoji?: string;
  delay: number;
  palette: Palette;
};

// 강제 최소 폰트 크기
const FONT = {
  TEXT: 60,       // 말풍선 본문 — 최소 60
  EMOJI: 56,      // 이모지
  LABEL: 52,      // 화자 라벨
} as const;

export const SpeechBubble: React.FC<Props> = ({
  speaker,
  text,
  emoji,
  delay,
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.smooth,
  });

  const isFP = speaker === "fp";
  const slideX = interpolate(progress, [0, 1], [isFP ? 40 : -40, 0]);

  const bubbleBg = isFP ? palette.accent : palette.card;
  const bubbleBorder = isFP ? "transparent" : palette.cardBorder;
  const textColor = isFP ? "#FFFFFF" : palette.text;

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateX(${slideX}px)`,
        display: "flex",
        flexDirection: isFP ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 12,
        width: "100%",
      }}
    >
      {/* 화자 아이콘 */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: isFP ? palette.accentDark : "rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 52 }}>
          {isFP ? "🧑‍💼" : "👤"}
        </span>
      </div>

      {/* 말풍선 */}
      <div
        style={{
          flex: 1,
          padding: "28px 36px",
          borderRadius: 28,
          borderTopLeftRadius: isFP ? 28 : 8,
          borderTopRightRadius: isFP ? 8 : 28,
          backgroundColor: bubbleBg,
          border: `2px solid ${bubbleBorder}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {emoji && <span style={{ fontSize: FONT.EMOJI, flexShrink: 0 }}>{emoji}</span>}
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: FONT.TEXT,
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.4,
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};
