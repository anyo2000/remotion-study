import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { FONT_FAMILY, PALETTES, SPRING } from "../constants";

type Props = {
  /** 메인 라벨 (예: "키워드 강조") */
  label: string;
  /** 상위 카테고리 (예: "축 1") */
  category?: string;
  /** 부가 설명 */
  sub?: string;
};

export const LabelCard: React.FC<Props> = ({ label, category, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = PALETTES.coolBlue;

  const fadeIn = spring({
    frame,
    fps,
    config: SPRING.heavy,
  });

  const lineWidth = interpolate(fadeIn, [0, 1], [0, 120]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 카테고리 (축 번호) */}
      {category && (
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: palette.sub,
            opacity: fadeIn,
            marginBottom: 16,
            letterSpacing: 2,
          }}
        >
          {category}
        </div>
      )}

      {/* 구분선 */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          backgroundColor: palette.accent,
          marginBottom: 24,
          borderRadius: 2,
        }}
      />

      {/* 메인 라벨 */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 72,
          fontWeight: 900,
          color: palette.text,
          opacity: fadeIn,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [15, 0])}px)`,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>

      {/* 부가 설명 */}
      {sub && (
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 500,
            color: palette.sub,
            opacity: interpolate(fadeIn, [0, 0.5, 1], [0, 0, 1]),
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};
