import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S7 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S7;

export const Scene7_CustomerCurious: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const faceIn = spring({ frame: Math.max(0, frame - B.FACE_CHANGE), fps, config: SPRING.bouncy });
  const nanimeIn = spring({ frame: Math.max(0, frame - B.NANIME), fps, config: SPRING.smooth });
  const keyIn = spring({ frame: Math.max(0, frame - B.KEY_POINT), fps, config: SPRING.bouncy });
  const topDim = frame >= B.KEY_POINT ? interpolate(frame, [B.KEY_POINT, B.KEY_POINT + 15], [1, 0.3], { extrapolateRight: "clamp" }) : 1;

  return (
    <Ep05SceneLayout pageTitle="고객의 변화">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ opacity: topDim, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 60, fontWeight: 800, color: palette.text, opacity: faceIn, transform: `scale(${interpolate(faceIn, [0, 1], [0.9, 1])})` }}>
            😮 "그런 게 있어요?"
          </div>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: nanimeIn }}>
            "친구가 난임 병원 다니는데…"
          </div>
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 900, color: palette.accent,
            opacity: keyIn, transform: `scale(${interpolate(keyIn, [0, 1], [0.8, 1])})`, textAlign: "center", lineHeight: 1.4,
          }}
        >
          고객이 먼저{"\n"}궁금해한 거예요
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
