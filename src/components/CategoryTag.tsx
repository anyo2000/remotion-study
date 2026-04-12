import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SPRING, FONT_FAMILY, LINK_CATEGORY_COLORS } from "../constants";
import type { LinkCategory } from "../link-edu/types";

type Props = {
  category: LinkCategory;
  delay?: number;
  size?: "sm" | "md";
};

export const CategoryTag: React.FC<Props> = ({
  category,
  delay = 0,
  size = "md",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.bouncy,
  });

  const color = LINK_CATEGORY_COLORS[category];
  const fontSize = size === "sm" ? 32 : 44;
  const padding = size === "sm" ? "6px 20px" : "10px 32px";

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${progress})`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding,
        borderRadius: 30,
        backgroundColor: color,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: 2,
        }}
      >
        {category}
      </span>
    </div>
  );
};
