import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SAFE, FONT_FAMILY, LINK_CATEGORY_COLORS } from "../constants";
import type { Palette } from "../constants";
import type { EpisodeMeta, LinkCategory } from "./types";

const CATEGORY_LABELS: Record<string, string> = {
  L: "후킹",
  I: "진단",
  N: "설계",
  K: "클로징",
};

type Props = {
  meta: EpisodeMeta;
  sceneIndex: number;
  totalScenes: number;
  palette: Palette;
  children: React.ReactNode;
};

export const EpisodeLayout: React.FC<Props> = ({
  meta,
  sceneIndex,
  totalScenes,
  palette,
  children,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const progress = (sceneIndex + 1) / totalScenes;
  const categoryColor =
    LINK_CATEGORY_COLORS[meta.category as LinkCategory] ?? palette.accent;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* 고정 헤더 — 주황 키컬러 라인 + 큰 글씨 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "50px 0 20px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          borderBottom: `4px solid ${palette.accent}`,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        {/* 카테고리 — 크게 */}
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 900,
            color: palette.accent,
            letterSpacing: 4,
          }}
        >
          {meta.category}단계
        </span>

        {/* 소제목 */}
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: palette.sub,
          }}
        >
          {meta.title}
        </span>
      </div>

      {/* 프로그레스 바 — 헤더 바로 아래 */}
      <div
        style={{
          position: "absolute",
          top: 158,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            backgroundColor: palette.accent,
          }}
        />
      </div>

      {/* 장면 콘텐츠 */}
      {children}
    </AbsoluteFill>
  );
};
