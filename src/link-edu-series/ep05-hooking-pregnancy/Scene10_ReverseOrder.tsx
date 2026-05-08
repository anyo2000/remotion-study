import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S10 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S10;

export const Scene10_ReverseOrder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const oldIn = spring({ frame: Math.max(0, frame - B.OLD_WAY), fps, config: SPRING.smooth });
  const privateIn = spring({ frame: Math.max(0, frame - B.PRIVATE_Q), fps, config: SPRING.smooth });
  const burdenIn = spring({ frame: Math.max(0, frame - B.BURDEN), fps, config: SPRING.smooth });
  const reverseIn = spring({ frame: Math.max(0, frame - B.REVERSE), fps, config: SPRING.bouncy });
  const openIn = spring({ frame: Math.max(0, frame - B.OPEN_DOOR), fps, config: SPRING.smooth });

  // Phase 전환: 옛날→새로운
  const oldDim = frame >= B.REVERSE ? interpolate(frame, [B.REVERSE, B.REVERSE + 15], [1, 0], { extrapolateRight: "clamp" }) : 1;

  return (
    <Ep05SceneLayout pageTitle="순서를 바꾸면" dense>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, width: "100%" }}>
        {/* Phase 1: 옛날 방식 */}
        <div style={{ opacity: oldDim, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: oldIn }}>
            ❌ 예전: "결혼 계획 있으세요?"
          </div>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: privateIn }}>
            사적인 질문부터 → 고객이 부담
          </div>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 700, color: "#E05A5A", opacity: burdenIn }}>
            문이 닫혀요
          </div>
        </div>

        {/* Phase 2: 새로운 방식 */}
        <div
          style={{
            fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 900, color: palette.accent,
            opacity: reverseIn, transform: `scale(${interpolate(reverseIn, [0, 1], [0.8, 1])})`, textAlign: "center",
          }}
        >
          순서가 반대입니다
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 700, color: palette.text,
            opacity: openIn, textAlign: "center", lineHeight: 1.5,
          }}
        >
          ✅ 먼저 문을 열어주면{"\n"}고객이 알아서 꺼내요
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
