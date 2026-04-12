import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY } from "../constants";

type Props = {
  /** 전체 텍스트 */
  children: React.ReactNode;
  /** 강조 배경 색상 */
  color?: string;
  /** 등장 시작 프레임 */
  delay?: number;
  /** 배경 바 기울기 (deg) */
  skew?: number;
  /** 배경 바 높이 비율 (0~1, 기본 0.35 = 밑줄 느낌) */
  heightRatio?: number;
  fontSize?: number;
  fontWeight?: number | string;
  textColor?: string;
  style?: React.CSSProperties;
};

export const WordHighlight: React.FC<Props> = ({
  children,
  color = "#FF8C38",
  delay = 0,
  skew = -2,
  heightRatio = 0.35,
  fontSize = 100,
  fontWeight = 900,
  textColor = "#F0F0F0",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.smooth,
  });

  const scaleX = interpolate(progress, [0, 1], [0, 1]);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color: textColor,
        ...style,
      }}
    >
      {/* 배경 바 */}
      <span
        style={{
          position: "absolute",
          left: "-4%",
          right: "-4%",
          bottom: 0,
          height: `${heightRatio * 100}%`,
          backgroundColor: color,
          opacity: 0.3,
          transform: `scaleX(${scaleX}) skewX(${skew}deg)`,
          transformOrigin: "left center",
          borderRadius: 4,
        }}
      />
      {/* 텍스트 */}
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};
