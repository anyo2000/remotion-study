import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S6 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S6;

export const Scene6_CoverageCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const friendsIn = spring({ frame: Math.max(0, frame - B.FRIENDS_Q), fps, config: SPRING.smooth });
  const happyIn = spring({ frame: Math.max(0, frame - B.HAPPY_CARD), fps, config: SPRING.smooth });
  const sadIn = spring({ frame: Math.max(0, frame - B.SAD_CARD), fps, config: SPRING.smooth });

  return (
    <Ep05SceneLayout pageTitle="기쁠 때도, 힘들 때도" dense>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, width: "100%" }}>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: friendsIn }}>
          "결혼 준비하는 친구들 있으세요?"
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
          <div
            style={{
              width: 520, padding: "32px 28px", borderRadius: 24,
              backgroundColor: "rgba(78, 205, 196, 0.06)", border: "1px solid rgba(78, 205, 196, 0.2)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
              opacity: happyIn, transform: `translateX(${interpolate(happyIn, [0, 1], [-30, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 72, lineHeight: 1 }}>😊</div>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 800, color: "#4ECDC4" }}>기쁠 때</div>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.text, textAlign: "center", lineHeight: 1.5 }}>
              임신축하금{"\n"}출산축하금
            </div>
          </div>
          <div
            style={{
              width: 520, padding: "32px 28px", borderRadius: 24,
              backgroundColor: "rgba(232, 168, 56, 0.06)", border: "1px solid rgba(232, 168, 56, 0.2)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
              opacity: sadIn, transform: `translateX(${interpolate(sadIn, [0, 1], [30, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 72, lineHeight: 1 }}>😢</div>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 800, color: palette.accent }}>힘들 때</div>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.text, textAlign: "center", lineHeight: 1.5 }}>
              난임 진단비{"\n"}치료 비용
            </div>
          </div>
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
