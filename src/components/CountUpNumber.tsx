import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FONT_FAMILY } from "../constants";

type Props = {
  from: number;
  to: number;
  /** 카운트업 시작 프레임 (로컬) */
  startFrame?: number;
  /** 카운트업 지속 프레임 */
  duration?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number | string;
  /** 숫자 포맷 (기본: 쉼표 구분) */
  formatter?: (n: number) => string;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
};

const defaultFormatter = (n: number) => n.toLocaleString("ko-KR");

export const CountUpNumber: React.FC<Props> = ({
  from,
  to,
  startFrame = 0,
  duration = 40,
  fontSize = 160,
  color,
  fontWeight = 900,
  formatter = defaultFormatter,
  suffix = "",
  prefix = "",
  style,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [from, to],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        fontVariantNumeric: "tabular-nums",
        color,
        lineHeight: 1.1,
        ...style,
      }}
    >
      {prefix}
      {formatter(Math.round(value))}
      {suffix}
    </span>
  );
};
