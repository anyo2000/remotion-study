import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SPRING } from "../constants";

type Props = {
  fromRatio: number;
  toRatio: number;
  startFrame?: number;
  barColor: string;
  bgColor?: string;
  height?: number;
  width?: number;
  borderRadius?: number;
};

export const GaugeBar: React.FC<Props> = ({
  fromRatio,
  toRatio,
  startFrame = 0,
  barColor,
  bgColor = "rgba(0,0,0,0.06)",
  height = 48,
  width = 800,
  borderRadius = 24,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: SPRING.chart,
  });

  const currentRatio = fromRatio + (toRatio - fromRatio) * progress;

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: bgColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${currentRatio * 100}%`,
          height: "100%",
          borderRadius,
          backgroundColor: barColor,
          transition: "none",
        }}
      />
    </div>
  );
};
