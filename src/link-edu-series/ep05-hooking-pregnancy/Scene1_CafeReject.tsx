import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S1 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S1;

export const Scene1_CafeReject: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cafeIn = spring({ frame: Math.max(0, frame - B.CAFE_IN), fps, config: SPRING.bouncy });
  const bubbleIn = spring({ frame: Math.max(0, frame - B.CUSTOMER_BUBBLE), fps, config: SPRING.smooth });
  const doorIn = spring({ frame: Math.max(0, frame - B.DOOR_CLOSED), fps, config: SPRING.smooth });

  return (
    <Ep05SceneLayout pageTitle="카페, 첫 만남">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ fontSize: 120, lineHeight: 1, opacity: cafeIn, transform: `scale(${interpolate(cafeIn, [0, 1], [0.5, 1])})` }}>☕</div>
        <div
          style={{
            maxWidth: 700, padding: "24px 32px", borderRadius: 20,
            backgroundColor: "rgba(224, 90, 90, 0.08)", border: "1px solid rgba(224, 90, 90, 0.2)",
            opacity: bubbleIn, transform: `translateY(${interpolate(bubbleIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, marginBottom: 8 }}>😐 고객</div>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.text, lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {"\"보험 관심 없거든요.\n길게는 못 있어요.\""}
          </div>
        </div>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: doorIn * 0.8 }}>
          🔒 벌써 문이 닫혀 있어요
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
