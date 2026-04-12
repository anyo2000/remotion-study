import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, LINK_CATEGORY_COLORS } from "../../constants";
import { CharacterReveal, BlurText } from "../../components";
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
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  const categoryColor = LINK_CATEGORY_COLORS[category];

  // 뱃지 spring
  const badgeIn = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: SPRING.smooth,
  });

  // 구분선 확장
  const lineIn = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING.smooth,
  });

  // 퇴장 (마지막 10프레임)
  const fadeOut =
    duration > 20
      ? interpolate(frame, [duration - 10, duration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity: fadeOut,
      }}
    >
      {/* 카테고리 뱃지 */}
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

      {/* 구분선 — 중앙에서 좌우로 확장 */}
      <div
        style={{
          width: 120,
          height: 4,
          backgroundColor: categoryColor,
          transform: `scaleX(${lineIn})`,
          transformOrigin: "center",
        }}
      />

      {/* 에피소드 제목 — CharacterReveal */}
      <CharacterReveal
        text={episodeTitle}
        delay={6}
        stagger={3}
        fontSize={100}
        fontWeight={900}
        color={palette.text}
        blur
      />

      {/* LINK Consulting — BlurText */}
      <div style={{ marginTop: 20 }}>
        <BlurText
          text="LINK Consulting"
          delay={12}
          stagger={5}
          fontSize={52}
          fontWeight={600}
          color={palette.sub}
        />
      </div>
    </AbsoluteFill>
  );
};
