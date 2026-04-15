import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY, PALETTES } from "../constants";
import { GradientBackground } from "../components";

const palette = PALETTES.coolBlue;

/**
 * SceneA — "보장분석" 키워드 장면
 * 모든 전환 효과의 Before 장면으로 사용
 */
export const SceneA: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ fontSize: 120, lineHeight: 1 }}>🔍</div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 800,
            color: palette.text,
            letterSpacing: 4,
          }}
        >
          보장분석
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * SceneB — "계약 체결" 키워드 장면
 * 모든 전환 효과의 After 장면으로 사용
 */
export const SceneB: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ fontSize: 120, lineHeight: 1 }}>✅</div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 800,
            color: palette.text,
            letterSpacing: 4,
          }}
        >
          계약 체결
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
