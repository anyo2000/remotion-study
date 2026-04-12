import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { XOMarker, CharacterReveal, GlowOrb } from "../../components";
import type { Palette } from "../../constants";
import type { ComparisonSceneProps, AudioSync } from "../types";

type Props = ComparisonSceneProps &
  AudioSync & { palette: Palette; durationInFrames?: number };

const ComparisonCard: React.FC<{
  side: ComparisonSceneProps["wrong"];
  type: "wrong" | "right";
  delay: number;
  palette: Palette;
  dimmed?: boolean;
}> = ({ side, type, delay, palette, dimmed = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.smooth,
  });

  const isWrong = type === "wrong";
  const borderColor = isWrong ? "#E05A5A" : "#4ECDC4";
  const bgColor = isWrong
    ? "rgba(224, 90, 90, 0.06)"
    : "rgba(78, 205, 196, 0.06)";

  // 이모지 → 텍스트 stagger
  const emojiDelay = delay + 5;
  const textDelay = delay + (side.emoji ? 12 : 5);

  return (
    <div
      style={{
        opacity: cardIn * (dimmed ? 0.4 : 1),
        transform: `translateY(${interpolate(cardIn, [0, 1], [20, 0])}px)`,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transition: "opacity 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <XOMarker type={isWrong ? "x" : "o"} delay={delay + 3} size={70} />
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 60,
            fontWeight: 800,
            color: borderColor,
          }}
        >
          {side.label}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "32px 32px",
          borderRadius: 24,
          backgroundColor: bgColor,
          border: `3px solid ${borderColor}`,
          textAlign: "center",
        }}
      >
        {side.emoji && (
          <div style={{ fontSize: 64, marginBottom: 12 }}>
            {side.emoji}
          </div>
        )}
        <CharacterReveal
          text={side.text}
          delay={textDelay}
          stagger={2}
          fontSize={64}
          fontWeight={700}
          color={palette.text}
        />
      </div>
    </div>
  );
};

export const ComparisonScene: React.FC<Props> = ({
  wrong,
  right,
  headline,
  palette,
  cues,
  durationInFrames: dur,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  const wrongDelay = cues?.wrong ?? 3;
  const rightDelay = cues?.right ?? 30;

  // HIGHLIGHT: 60% 지점에서 wrong dim, right 강조
  const highlightStart = Math.floor(duration * 0.6);
  const isHighlighted = frame >= highlightStart;

  return (
    <AbsoluteFill>
      {headline && (
        <div
          style={{
            position: "absolute",
            top: SAFE.top + 20,
            left: SAFE.side,
            right: SAFE.side,
            textAlign: "center",
          }}
        >
          <CharacterReveal
            text={headline}
            delay={0}
            stagger={2}
            fontSize={72}
            fontWeight={900}
            color={palette.text}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: headline ? SAFE.top + 140 : SAFE.top + 40,
          bottom: SAFE.bottom,
          left: SAFE.side + 10,
          right: SAFE.side + 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <ComparisonCard
          side={wrong}
          type="wrong"
          delay={wrongDelay}
          palette={palette}
          dimmed={isHighlighted}
        />

        {/* right 카드 뒤에 글로우 */}
        <div style={{ position: "relative" }}>
          {isHighlighted && (
            <GlowOrb
              color="#4ECDC4"
              opacity={0.06}
              size={500}
              x="50%"
              y="50%"
              delay={highlightStart}
            />
          )}
          <ComparisonCard
            side={right}
            type="right"
            delay={rightDelay}
            palette={palette}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
