import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

type Props = {
  children: React.ReactNode;
  /** 시작 스케일 (기본 1.0) */
  from?: number;
  /** 끝 스케일 (기본 1.05) */
  to?: number;
  /** 줌 시작 프레임 (기본 0) */
  delay?: number;
  /** 줌 지속 프레임 (기본: 장면 전체) */
  duration?: number;
  style?: React.CSSProperties;
};

export const CameraZoom: React.FC<Props> = ({
  children,
  from = 1.0,
  to = 1.05,
  delay = 0,
  duration,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const totalDur = duration ?? durationInFrames;
  const elapsed = Math.max(0, frame - delay);

  const scale = interpolate(elapsed, [0, totalDur], [from, to], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
