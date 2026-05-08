import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S12 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S12;

export const Scene12_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mainIn = spring({ frame: Math.max(0, frame - B.MAIN_MESSAGE), fps, config: SPRING.bouncy });
  const labelIn = spring({ frame: Math.max(0, frame - B.HOOKING_LABEL), fps, config: SPRING.smooth });
  const previewIn = spring({ frame: Math.max(0, frame - B.NEXT_PREVIEW), fps, config: SPRING.smooth });

  return (
    <Ep05SceneLayout hideHeader>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 76, fontWeight: 900, color: palette.accent, opacity: mainIn, transform: `scale(${interpolate(mainIn, [0, 1], [0.8, 1])})`, textAlign: "center", lineHeight: 1.4 }}>
          고객이 듣고 싶게{"\n"}만드는 거
        </div>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 600, color: palette.sub, opacity: labelIn * 0.7 }}>
          이게 후킹이에요
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 12, opacity: previewIn * 0.7, transform: `translateY(${interpolate(previewIn, [0, 1], [10, 0])}px)` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub }}>다음 편 →</span>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 700, color: palette.text }}>두 번째 후킹 화법</span>
        </div>
      </div>
      <GlowOrb color={palette.accent} opacity={0.06 * mainIn} size={600} x="50%" y="45%" delay={B.MAIN_MESSAGE} />
    </Ep05SceneLayout>
  );
};
