import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S11 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S11;

const POINTS = [
  { num: "①", text: "보험 얘기 아닌 것처럼 질문", delay: B.POINT_1 },
  { num: "②", text: "궁금해할 때 한 발 물러남", delay: B.POINT_2 },
  { num: "③", text: '거절에도 "오히려 괜찮아요"', delay: B.POINT_3 },
] as const;

export const Scene11_Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Ep05SceneLayout pageTitle="세 가지">
      <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%" }}>
        {POINTS.map((p, i) => {
          const pointIn = spring({ frame: Math.max(0, frame - p.delay), fps, config: SPRING.smooth });
          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 24,
                padding: "24px 36px", borderRadius: 16,
                backgroundColor: palette.card, border: `1px solid ${palette.cardBorder}`,
                opacity: pointIn, transform: `translateX(${interpolate(pointIn, [0, 1], [40, 0])}px)`,
              }}
            >
              <span style={{ fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 900, color: palette.accent, flexShrink: 0 }}>{p.num}</span>
              <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 700, color: palette.text }}>{p.text}</span>
            </div>
          );
        })}
      </div>
    </Ep05SceneLayout>
  );
};
