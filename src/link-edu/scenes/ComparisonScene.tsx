import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { XOMarker } from "../../components/XOMarker";
import type { Palette } from "../../constants";
import type { ComparisonSceneProps, AudioSync } from "../types";

type Props = ComparisonSceneProps & AudioSync & { palette: Palette };

/**
 * 폰트 최소 기준 (CLAUDE.md)
 * - 헤드라인: 72px
 * - 라벨: 60px
 * - 카드 본문: 64px
 * Spring: 즉시 등장
 */

const ComparisonCard: React.FC<{
  side: ComparisonSceneProps["wrong"];
  type: "wrong" | "right";
  delay: number;
  palette: Palette;
}> = ({ side, type, delay, palette }) => {
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

  return (
    <div
      style={{
        opacity: cardIn,
        transform: `translateY(${interpolate(cardIn, [0, 1], [20, 0])}px)`,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
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
          width: "100%",
          padding: "32px 32px",
          borderRadius: 24,
          backgroundColor: bgColor,
          border: `3px solid ${borderColor}`,
          textAlign: "center",
        }}
      >
        {side.emoji && (
          <div style={{ fontSize: 64, marginBottom: 12 }}>{side.emoji}</div>
        )}
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 700,
            color: palette.text,
            lineHeight: 1.4,
          }}
        >
          {side.text}
        </span>
      </div>
    </div>
  );
};

export const ComparisonScene: React.FC<Props> = ({
  wrong,
  right,
  headline,
  palette,
}) => {
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
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 900,
              color: palette.text,
            }}
          >
            {headline}
          </span>
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
        <ComparisonCard side={wrong} type="wrong" delay={3} palette={palette} />
        <ComparisonCard side={right} type="right" delay={30} palette={palette} />
      </div>
    </AbsoluteFill>
  );
};
