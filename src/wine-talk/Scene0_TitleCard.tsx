import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY } from "../constants";
import { W } from "./WineLayout";

/**
 * 씬0: 타이틀카드 — 프레임 0부터 완성 상태, 애니메이션 없음 (표준 규칙)
 */
export const Scene0_TitleCard: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(110% 80% at 50% 25%, #F7EEDF 0%, ${W.bg} 55%, #E3D2B8 100%)`,
      fontFamily: FONT_FAMILY,
      justifyContent: "center",
      alignItems: "center",
      gap: 44,
    }}
  >
    <div style={{ fontSize: 130, lineHeight: 1 }}>🍷</div>
    <div
      style={{
        fontSize: 64,
        fontWeight: 700,
        letterSpacing: 22,
        color: W.sub,
      }}
    >
      YRC
    </div>
    <div
      style={{
        fontSize: 148,
        fontWeight: 900,
        letterSpacing: 6,
        color: W.accent,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
      }}
    >
      WINE TALK
    </div>
    <div
      style={{
        fontSize: 60,
        fontWeight: 600,
        color: W.text,
        marginTop: 10,
      }}
    >
      7월 스페셜데이
    </div>
  </AbsoluteFill>
);
