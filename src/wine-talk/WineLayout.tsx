import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PALETTES, FONT_FAMILY } from "../constants";

export const W = PALETTES.wineTalk;

/**
 * 공통 레이아웃 — 웜베이지 radial 배경 + (옵션) 밝은 워시 오버레이
 * washFrom: 해당 로컬 프레임부터 배경이 반 톤 밝아짐 (씬5 전용)
 */
export const WineLayout: React.FC<{
  washFrom?: number;
  children: React.ReactNode;
}> = ({ washFrom, children }) => {
  const frame = useCurrentFrame();
  const washOp =
    washFrom === undefined
      ? 0
      : interpolate(frame, [washFrom, washFrom + 25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 80% at 50% 25%, #F7EEDF 0%, ${W.bg} 55%, #E3D2B8 100%)`,
        fontFamily: FONT_FAMILY,
        color: W.text,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(110% 80% at 50% 25%, #FBF5EA 0%, #F6EDDD 55%, #EBDDC6 100%)",
          opacity: washOp,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/**
 * WINE 뱃지 + 진행점 (●○○○○) — 씬 상단 맥락 라벨
 */
export const WineBadge: React.FC<{
  label: string;
  current: number;
  appear: number; // 로컬 프레임
}> = ({ label, current, appear }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [appear, appear + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [appear, appear + 12], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: "50%",
        transform: `translate(-50%, ${y}px)`,
        opacity: op,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          background: W.card,
          border: `2px solid ${W.cardBorder}`,
          borderRadius: 50,
          padding: "14px 44px",
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: 4,
          color: W.text,
          whiteSpace: "nowrap",
          boxShadow: "0 6px 0 rgba(58,44,34,0.08)",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background:
                i < current ? W.text : "rgba(58, 44, 34, 0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

/** 페이퍼 칩 (키워드 알약) */
export const WineChip: React.FC<{
  text: string;
  progress: number; // spring 값
  tilt?: number;
  fontSize?: number;
}> = ({ text, progress, tilt = 0, fontSize = 58 }) => (
  <div
    style={{
      background: W.card,
      border: `2px solid ${W.cardBorder}`,
      borderRadius: 60,
      padding: "22px 46px",
      fontSize,
      fontWeight: 700,
      color: W.text,
      whiteSpace: "nowrap",
      transform: `scale(${progress}) rotate(${tilt}deg)`,
      boxShadow: "0 6px 0 rgba(58,44,34,0.08)",
    }}
  >
    {text}
  </div>
);
