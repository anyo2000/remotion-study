import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SPRING } from "../constants";

type Props = {
  type: "x" | "o";
  delay?: number;
  size?: number;
};

export const XOMarker: React.FC<Props> = ({
  type,
  delay = 0,
  size = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.bouncy,
  });

  const color = type === "x" ? "#E05A5A" : "#4ECDC4";
  const strokeWidth = size * 0.15;

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: progress,
        transform: `scale(${progress}) rotate(${type === "x" ? progress * 0 : 0}deg)`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {type === "x" ? (
          <>
            <line
              x1={size * 0.2}
              y1={size * 0.2}
              x2={size * 0.8}
              y2={size * 0.8}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <line
              x1={size * 0.8}
              y1={size * 0.2}
              x2={size * 0.2}
              y2={size * 0.8}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        ) : (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.35}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};
