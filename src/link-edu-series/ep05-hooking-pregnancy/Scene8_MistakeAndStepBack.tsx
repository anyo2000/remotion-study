import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S8 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S8;

export const Scene8_MistakeAndStepBack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const warnIn = spring({ frame: Math.max(0, frame - B.MISTAKE_WARN), fps, config: SPRING.smooth });
  const closeIn = spring({ frame: Math.max(0, frame - B.DOOR_CLOSE), fps, config: SPRING.smooth });
  const stepIn = spring({ frame: Math.max(0, frame - B.STEP_BACK), fps, config: SPRING.bouncy });
  const reserveIn = spring({ frame: Math.max(0, frame - B.RESERVATION), fps, config: SPRING.smooth });

  // Phase 1 → Phase 2 전환
  const phase1Dim = frame >= B.STEP_BACK ? interpolate(frame, [B.STEP_BACK, B.STEP_BACK + 15], [1, 0], { extrapolateRight: "clamp" }) : 1;

  return (
    <Ep05SceneLayout pageTitle="한 발 뒤로" dense>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, width: "100%" }}>
        {/* Phase 1: 실수 경고 */}
        <div style={{ opacity: phase1Dim, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div
            style={{
              padding: "20px 36px", borderRadius: 16,
              backgroundColor: "rgba(224, 90, 90, 0.08)", border: "1px solid rgba(224, 90, 90, 0.15)",
              opacity: warnIn, display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <span style={{ fontSize: 52 }}>⚠️</span>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 700, color: palette.text }}>
              관심 보이면 → 상품 설명 본능
            </div>
          </div>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 700, color: "#E05A5A", opacity: closeIn }}>
            🚪 문이 다시 닫혀요
          </div>
        </div>

        {/* Phase 2: 물러남 + 예약 */}
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 68, fontWeight: 900, color: palette.accent, opacity: stepIn, transform: `scale(${interpolate(stepIn, [0, 1], [0.8, 1])})` }}>
          🔙 이 FP는 한 발 물러나요
        </div>
        <div
          style={{
            padding: "20px 36px", borderRadius: 16,
            backgroundColor: "rgba(78, 205, 196, 0.08)", border: "1px solid rgba(78, 205, 196, 0.2)",
            opacity: reserveIn, transform: `translateY(${interpolate(reserveIn, [0, 1], [10, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 700, color: palette.text, textAlign: "center" }}>
            "지금은 돈 안 내요. 결혼하시면 그때부터"
          </div>
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
