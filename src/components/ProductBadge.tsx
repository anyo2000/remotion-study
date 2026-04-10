import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY } from "../constants";

type Props = {
  text: string;
  delay?: number;
  color?: string;
  bgColor?: string;
  fontSize?: number;
};

export const ProductBadge: React.FC<Props> = ({
  text,
  delay = 0,
  color = "#FFFFFF",
  bgColor = "#FF6B35",
  fontSize = 52,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.bouncy,
  });

  const scale = interpolate(s, [0, 1], [0, 1]);
  const rotate = interpolate(s, [0, 1], [-8, 0]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 32px",
        borderRadius: 16,
        backgroundColor: bgColor,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity: s,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight: 800,
          color,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};
