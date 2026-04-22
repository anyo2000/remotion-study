import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep01SceneLayout } from "./Ep01SceneLayout";
import { BEATS_LOYALTY_END } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_LOYALTY_END;

/**
 * 씬 4a: 의리 가입 종말 — 씁쓸
 *
 * 화면 가득 🤝 → 💔 전환. "끝났어요" accent bounce.
 */
export const Scene4a_LoyaltyEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const loyaltyIn = spring({
    frame: Math.max(0, frame - B.LOYALTY_TEXT),
    fps,
    config: SPRING.smooth,
  });

  const endIn = spring({
    frame: Math.max(0, frame - B.END_TEXT),
    fps,
    config: SPRING.bouncy,
  });

  const heartbreakIn = frame >= B.END_TEXT
    ? spring({
        frame: Math.max(0, frame - B.END_TEXT),
        fps,
        config: SPRING.bouncy,
      })
    : 0;

  const preDim = frame >= B.END_TEXT
    ? interpolate(frame, [B.END_TEXT, B.END_TEXT + 15], [1, 0.25], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <Ep01SceneLayout pageTitle="두 번째 변화" wide>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
        }}
      >
        {/* 왼쪽: 이모지 전환 — 크게 */}
        <div
          style={{
            position: "relative",
            width: 240,
            height: 240,
            flexShrink: 0,
          }}
        >
          {/* 🤝 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 180,
              lineHeight: 1,
              opacity: loyaltyIn * (1 - heartbreakIn * 0.9),
              transform: `scale(${interpolate(loyaltyIn, [0, 1], [0.4, 1])})`,
            }}
          >
            🤝
          </div>
          {/* 💔 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 180,
              lineHeight: 1,
              opacity: heartbreakIn,
              transform: `scale(${interpolate(heartbreakIn, [0, 1], [0.3, 1.1])}) rotate(${interpolate(heartbreakIn, [0, 1], [-10, 0])}deg)`,
            }}
          >
            💔
          </div>
        </div>

        {/* 오른쪽: 텍스트 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* "의리로 가입해주는 시대" */}
          <div
            style={{
              opacity: loyaltyIn * preDim,
              transform: `translateX(${interpolate(loyaltyIn, [0, 1], [30, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 64,
                fontWeight: 700,
                color: palette.text,
                lineHeight: 1.4,
              }}
            >
              의리로 가입해주는 시대
            </span>
          </div>

          {/* "끝났어요" */}
          <div
            style={{
              opacity: endIn,
              transform: `scale(${interpolate(endIn, [0, 1], [0.6, 1])})`,
              transformOrigin: "left center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 100,
                fontWeight: 900,
                color: palette.accent,
              }}
            >
              끝났어요
            </span>
          </div>
        </div>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.05}
        size={500}
        x="35%"
        y="50%"
        delay={B.END_TEXT}
      />
    </Ep01SceneLayout>
  );
};
