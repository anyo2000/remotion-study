import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import type { Palette } from "../constants";
import type { EpisodeMeta } from "./types";

type Props = {
  meta: EpisodeMeta;
  sceneIndex: number;
  totalScenes: number;
  palette: Palette;
  durationInFrames?: number;
  children: React.ReactNode;
};

export const EpisodeLayout: React.FC<Props> = ({
  meta,
  sceneIndex,
  totalScenes,
  palette,
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut =
    durationInFrames && durationInFrames > 30
      ? interpolate(
          frame,
          [durationInFrames - 15, durationInFrames],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 1;

  const opacity = fadeIn * fadeOut;
  const progress = (sceneIndex + 1) / totalScenes;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 장면 콘텐츠 — 화면 전체 활용 */}
      {children}

      {/* 하단 프로그레스 바 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            backgroundColor: palette.accent,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
