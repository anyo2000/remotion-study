import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S9 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S9;

export const Scene9_ObjectionHandle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const askIn = spring({ frame: Math.max(0, frame - B.CUSTOMER_ASK), fps, config: SPRING.bouncy });
  const keepIn = spring({ frame: Math.max(0, frame - B.KEEP_ASKING), fps, config: SPRING.smooth });
  const rejectIn = spring({ frame: Math.max(0, frame - B.REJECTION), fps, config: SPRING.smooth });
  const counterIn = spring({ frame: Math.max(0, frame - B.COUNTER), fps, config: SPRING.bouncy });
  const noLossIn = spring({ frame: Math.max(0, frame - B.NO_LOSS), fps, config: SPRING.smooth });

  // Phase 1→2 전환
  const phase1Dim = frame >= B.REJECTION ? interpolate(frame, [B.REJECTION, B.REJECTION + 15], [1, 0], { extrapolateRight: "clamp" }) : 1;
  const rejectDim = frame >= B.COUNTER ? interpolate(frame, [B.COUNTER, B.COUNTER + 15], [1, 0.35], { extrapolateRight: "clamp" }) : 1;

  return (
    <Ep05SceneLayout pageTitle="거절이 와도" dense>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, width: "100%" }}>
        {/* Phase 1: 가능해요? */}
        <div style={{ opacity: phase1Dim, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 60, fontWeight: 800, color: "#4ECDC4", opacity: askIn, transform: `scale(${interpolate(askIn, [0, 1], [0.9, 1])})` }}>
            😮 "그게 가능해요?"
          </div>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: keepIn }}>
            부담 주지 않으니까 고객이 자꾸 물어봐요
          </div>
        </div>

        {/* Phase 2: 거절 → 받아치기 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
          <div
            style={{
              padding: "24px 40px", borderRadius: 20,
              backgroundColor: "rgba(224, 90, 90, 0.06)", border: "1px solid rgba(224, 90, 90, 0.15)",
              textAlign: "center", opacity: rejectIn * rejectDim, whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}>😐</div>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.text }}>
              "결혼 생각 없는데요"
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", opacity: counterIn }}>
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 700, color: palette.accent }}>→</span>
          </div>
          <div
            style={{
              padding: "24px 40px", borderRadius: 20,
              backgroundColor: "rgba(78, 205, 196, 0.08)", border: `1px solid rgba(78, 205, 196, ${counterIn > 0 ? 0.3 : 0.1})`,
              textAlign: "center", opacity: counterIn, whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}>😊</div>
            <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 700, color: palette.text }}>
              "오히려 더 좋아요"
            </div>
          </div>
        </div>
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: noLossIn }}>
          "손해는 없습니다"
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
