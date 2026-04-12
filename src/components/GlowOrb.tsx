import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING } from "../constants";

type Props = {
  /** 글로우 색상 */
  color?: string;
  /** 위치 X (%, 기본 50) */
  x?: string;
  /** 위치 Y (%, 기본 40) */
  y?: string;
  /** 글로우 크기 (px) */
  size?: number;
  /** 최대 opacity */
  opacity?: number;
  /** 등장 프레임 */
  delay?: number;
  /** sin 파동 스케일 (0이면 정적) */
  pulse?: number;
  style?: React.CSSProperties;
};

export const GlowOrb: React.FC<Props> = ({
  color = "#FF8C38",
  x = "50%",
  y = "40%",
  size = 600,
  opacity = 0.05,
  delay = 0,
  pulse = 0.1,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.heavy,
  });

  const pulseScale = pulse > 0
    ? 1 + Math.sin(frame * 0.03) * pulse
    : 1;

  const scale = interpolate(enterProgress, [0, 1], [0.5, 1]) * pulseScale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${scale})`,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: opacity * enterProgress,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
