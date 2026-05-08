import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S3 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S3;

const ROWS = [
  { fp: '"좋은 상품"', customer: '"팔려는 거구나" 😒', delay: B.ROW1 },
  { fp: '"혜택"', customer: '"돈 더 내라는 거지" 😒', delay: B.ROW2 },
] as const;

/**
 * 씬 3: 고객 머릿속 + 들어본 적 없는 조합 (sub-phases)
 * Phase 1: 왜? → 예측 패턴 2행
 * Phase 2: "들어본 적 없는 조합이어야 한다"
 */
export const Scene3_NewCombo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const whyIn = spring({ frame: Math.max(0, frame - B.WHY), fps, config: SPRING.smooth });
  const mindIn = spring({ frame: Math.max(0, frame - B.MIND_INTRO), fps, config: SPRING.smooth });
  const setupIn = spring({ frame: Math.max(0, frame - B.SETUP), fps, config: SPRING.smooth });
  const conclusionIn = spring({ frame: Math.max(0, frame - B.CONCLUSION), fps, config: SPRING.bouncy });

  // Phase 1 → Phase 2 전환
  const phase1Dim = frame >= B.SETUP
    ? interpolate(frame, [B.SETUP, B.SETUP + 15], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  return (
    <Ep05SceneLayout pageTitle="고객의 예측" dense>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, width: "100%" }}>
        {/* Phase 1: 예측 패턴 */}
        <div style={{ opacity: phase1Dim, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: mindIn, textAlign: "center" }}>
            고객 머릿속엔 이미 답이 있어요
          </div>
          {ROWS.map((row, i) => {
            const rowIn = spring({ frame: Math.max(0, frame - row.delay), fps, config: SPRING.smooth });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, opacity: rowIn }}>
                <div style={{ padding: "18px 36px", borderRadius: 16, backgroundColor: palette.card, border: `1px solid ${palette.cardBorder}`, textAlign: "center", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.text }}>{row.fp}</span>
                </div>
                <span style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 700, color: palette.accent }}>→</span>
                <div style={{ padding: "18px 36px", borderRadius: 16, backgroundColor: "rgba(224, 90, 90, 0.06)", border: "1px solid rgba(224, 90, 90, 0.15)", textAlign: "center", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.text }}>{row.customer}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase 2: 결론 */}
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: setupIn * (1 - phase1Dim > 0 ? 1 : setupIn), textAlign: "center" }}>
          답이 정해진 질문으로는 안 돼요
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY, fontSize: 72, fontWeight: 900, color: palette.accent,
            opacity: conclusionIn, transform: `scale(${interpolate(conclusionIn, [0, 1], [0.8, 1])})`,
            textAlign: "center", lineHeight: 1.4,
          }}
        >
          들어본 적 없는{"\n"}조합이어야 한다
        </div>
      </div>

      <GlowOrb color={palette.accent} opacity={0.06 * conclusionIn} size={600} x="50%" y="50%" delay={B.CONCLUSION} />
    </Ep05SceneLayout>
  );
};
