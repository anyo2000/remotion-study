import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S4 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S4;

export const Scene4_HookLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const contextIn = spring({ frame: Math.max(0, frame - B.FP_CONTEXT), fps, config: SPRING.smooth });
  const hookIn = spring({ frame: Math.max(0, frame - B.HOOK_TEXT), fps, config: SPRING.bouncy });
  const contextDim = frame >= B.HOOK_TEXT ? interpolate(frame, [B.HOOK_TEXT, B.HOOK_TEXT + 15], [1, 0.3], { extrapolateRight: "clamp" }) : 1;

  return (
    <Ep05SceneLayout pageTitle="FP의 한마디">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: contextIn * contextDim, textAlign: "center" }}>
          🧑‍💼 자료 한 장 꺼내지 않고
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY, fontSize: 68, fontWeight: 900, color: palette.accent,
            opacity: hookIn, transform: `scale(${interpolate(hookIn, [0, 1], [0.8, 1])})`,
            textAlign: "center", lineHeight: 1.4, padding: "0 40px",
          }}
        >
          "임신하면 돈 받고,{"\n"}임신 못 해도 돈 받는{"\n"}보험 아세요?"
        </div>
      </div>
      <GlowOrb color={palette.accent} opacity={0.06 * hookIn} size={600} x="50%" y="45%" delay={B.HOOK_TEXT} />
    </Ep05SceneLayout>
  );
};
