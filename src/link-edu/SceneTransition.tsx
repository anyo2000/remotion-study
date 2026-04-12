import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

type Props = {
  children: React.ReactNode;
  durationInFrames: number;
  /** 입장 페이드 프레임 (0이면 즉시) */
  fadeInFrames?: number;
  /** 퇴장 페이드 프레임 (0이면 안 함) */
  fadeOutFrames?: number;
};

export const SceneTransition: React.FC<Props> = ({
  children,
  durationInFrames,
  fadeInFrames = 12,
  fadeOutFrames = 15,
}) => {
  const frame = useCurrentFrame();

  // 입장
  const fadeIn =
    fadeInFrames > 0
      ? interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateRight: "clamp",
        })
      : 1;

  // 퇴장
  const fadeOut =
    fadeOutFrames > 0
      ? interpolate(
          frame,
          [durationInFrames - fadeOutFrames, durationInFrames],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 1;

  const opacity = fadeIn * fadeOut;
  const translateY =
    fadeInFrames > 0
      ? interpolate(frame, [0, fadeInFrames], [8, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
