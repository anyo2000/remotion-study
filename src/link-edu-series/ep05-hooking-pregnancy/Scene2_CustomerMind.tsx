import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep05SceneLayout } from "./Ep05SceneLayout";
import { BEATS_S2 } from "./ep05-beats";

const palette = PALETTES.ep01;
const B = BEATS_S2;

/**
 * 씬 2: 이러면 끝이에요
 * "보장 봐드릴게요 하면?" → "끝이에요" → "커피만 마시고 헤어지는 거예요"
 */
export const Scene2_CustomerMind: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const warnIn = spring({ frame: Math.max(0, frame - B.WARNING), fps, config: SPRING.smooth });
  const endIn = spring({ frame: Math.max(0, frame - B.END_TEXT), fps, config: SPRING.bouncy });
  const coffeeIn = spring({ frame: Math.max(0, frame - B.COFFEE), fps, config: SPRING.smooth });

  return (
    <Ep05SceneLayout hideHeader>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
        {/* "보장 봐드릴게요 하면?" */}
        <div
          style={{
            padding: "20px 36px", borderRadius: 16,
            backgroundColor: palette.card, border: `1px solid ${palette.cardBorder}`,
            opacity: warnIn, transform: `translateY(${interpolate(warnIn, [0, 1], [10, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.text, textAlign: "center" }}>
            "그래도 보장 한번 봐드릴게요" 하면?
          </div>
        </div>

        {/* "오늘 상담은 끝이에요" */}
        <div
          style={{
            fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: "#E05A5A",
            opacity: endIn, transform: `scale(${interpolate(endIn, [0, 1], [0.8, 1])})`,
          }}
        >
          오늘 상담은 끝이에요
        </div>

        {/* "커피만 마시고 헤어지는 거예요" */}
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub, opacity: coffeeIn * 0.8 }}>
          ☕ 커피만 마시고 헤어지는 거예요
        </div>
      </div>
    </Ep05SceneLayout>
  );
};
