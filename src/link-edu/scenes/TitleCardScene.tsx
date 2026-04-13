import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { FONT_FAMILY, LINK_CATEGORY_COLORS } from "../../constants";
import type { Palette } from "../../constants";
import type { LinkCategory } from "../types";

type Props = {
  category: LinkCategory;
  categoryLabel: string;
  episodeTitle: string;
  palette: Palette;
  startFrame: number;
  durationInFrames?: number;
};

export const TitleCardScene: React.FC<Props> = ({
  category,
  categoryLabel,
  episodeTitle,
  palette,
  durationInFrames: dur,
}) => {
  const frame = useCurrentFrame();
  const duration = dur ?? 60;
  const categoryColor = LINK_CATEGORY_COLORS[category];

  // 마지막 10프레임만 fade out — 나머지 시간은 완전 정적
  const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity: fadeOut,
      }}
    >
      {/* LINK Consulting — 상단 */}
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 52,
          fontWeight: 600,
          color: palette.sub,
        }}
      >
        LINK Consulting
      </span>

      {/* 구분선 */}
      <div
        style={{
          width: 120,
          height: 4,
          backgroundColor: categoryColor,
        }}
      />

      {/* 카테고리 뱃지 */}
      <div
        style={{
          padding: "14px 44px",
          borderRadius: 30,
          backgroundColor: categoryColor,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          {category}단계 — {categoryLabel}
        </span>
      </div>

      {/* 에피소드 제목 — 크게 */}
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 100,
          fontWeight: 900,
          color: palette.text,
          textAlign: "center",
        }}
      >
        {episodeTitle}
      </span>
    </AbsoluteFill>
  );
};
