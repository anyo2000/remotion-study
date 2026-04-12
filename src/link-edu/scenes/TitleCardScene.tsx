import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, LINK_CATEGORY_COLORS } from "../../constants";
import type { Palette } from "../../constants";
import type { LinkCategory } from "../types";

type Props = {
  category: LinkCategory;
  categoryLabel: string;
  episodeTitle: string;
  palette: Palette;
  startFrame: number;
};

export const TitleCardScene: React.FC<Props> = ({
  category,
  categoryLabel,
  episodeTitle,
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const categoryColor = LINK_CATEGORY_COLORS[category];

  // 즉시 등장 — 딜레이 최소
  const badgeIn = spring({ frame: Math.max(0, frame - 2), fps, config: SPRING.smooth });
  const titleIn = spring({ frame: Math.max(0, frame - 5), fps, config: SPRING.smooth });
  const subIn = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING.smooth });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          opacity: badgeIn,
          transform: `scale(${badgeIn})`,
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

      {/* 구분선 */}
      <div
        style={{
          opacity: titleIn,
          width: 120,
          height: 4,
          backgroundColor: categoryColor,
        }}
      />

      {/* 에피소드 제목 */}
      <div
        style={{
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [10, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 100,
            fontWeight: 900,
            color: palette.text,
          }}
        >
          {episodeTitle}
        </span>
      </div>

      <div style={{ opacity: subIn, marginTop: 20 }}>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: palette.sub,
            letterSpacing: 8,
          }}
        >
          LINK Consulting
        </span>
      </div>
    </AbsoluteFill>
  );
};
