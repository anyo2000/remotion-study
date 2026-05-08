import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S5 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S5;

export const Scene5_Reaction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coffeeIn = spring({ frame: Math.max(0, frame - B.COFFEE_DOWN), fps, config: SPRING.smooth });
  const reactionIn = spring({ frame: Math.max(0, frame - B.REACTION), fps, config: SPRING.bouncy });
  const stoppedIn = spring({ frame: Math.max(0, frame - B.STOPPED), fps, config: SPRING.smooth });

  return (
    <Ep05SceneLayout hideHeader>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ fontSize: 100, lineHeight: 1, opacity: coffeeIn }}>☕</div>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: coffeeIn * 0.7 }}>
          커피잔 내려놓고 쳐다봐요
        </div>
        <div
          style={{
            padding: "24px 48px", borderRadius: 20,
            backgroundColor: "rgba(78, 205, 196, 0.08)", border: "1px solid rgba(78, 205, 196, 0.25)",
            opacity: reactionIn, transform: `scale(${interpolate(reactionIn, [0, 1], [0.8, 1])})`,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 800, color: "#4ECDC4", textAlign: "center" }}>
            "…네? 그게 뭐예요?"
          </div>
        </div>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 700, color: palette.accent, opacity: stoppedIn }}>
          반응이 멈췄어요
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
