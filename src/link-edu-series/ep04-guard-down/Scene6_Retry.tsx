import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep04SceneLayout } from "./Ep04SceneLayout";
import { BEATS_RETRY } from "./ep04-beats";

const palette = PALETTES.ep01;
const B = BEATS_RETRY;

/**
 * 씬 6: 김영숙 FP 재도전 — 반전 장면
 * 벽 무너짐 → 📱 재등장 → "어, 뭐가 바뀌었는데요?"
 */
export const Scene6_Retry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 벽 무너지는 효과 (벽돌 조각 흩어짐)
  const wallBreak = spring({
    frame: Math.max(0, frame - B.WALL_BREAK),
    fps,
    config: SPRING.heavy,
  });

  const phoneReturn = spring({
    frame: Math.max(0, frame - B.PHONE_RETURN),
    fps,
    config: SPRING.bouncy,
  });

  const impactIn = spring({
    frame: Math.max(0, frame - B.IMPACT_TEXT),
    fps,
    config: SPRING.bouncy,
  });

  const worldChanged = spring({
    frame: Math.max(0, frame - B.WORLD_CHANGED),
    fps,
    config: SPRING.smooth,
  });

  // 벽돌 조각 위치 (흩어짐)
  const brickFragments = [
    { x: -200, y: -150, rot: -30 },
    { x: 180, y: -120, rot: 25 },
    { x: -150, y: 100, rot: -45 },
    { x: 200, y: 130, rot: 35 },
    { x: 0, y: -180, rot: 15 },
  ];

  return (
    <Ep04SceneLayout hideHeader>
      {/* 벽돌 조각 흩어짐 */}
      {brickFragments.map((frag, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            fontSize: 52,
            opacity: interpolate(wallBreak, [0, 0.3, 1], [0.6, 0.4, 0]),
            transform: `translate(${frag.x * wallBreak}px, ${frag.y * wallBreak}px) rotate(${frag.rot * wallBreak}deg)`,
          }}
        >
          🧱
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 📱 재등장 */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 120,
              lineHeight: 1,
              opacity: phoneReturn,
              transform: `scale(${interpolate(phoneReturn, [0, 1], [0.3, 1])})`,
            }}
          >
            📱
          </div>
          {/* 음파 다시 퍼짐 */}
          {[100, 160, 220].map((size, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `2px solid #4ECDC4`,
                opacity: phoneReturn * 0.15 * (1 - i * 0.3),
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* "어, 뭐가 바뀌었는데요?" — 임팩트 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 88,
            fontWeight: 900,
            color: "#4ECDC4",
            opacity: impactIn,
            transform: `scale(${interpolate(impactIn, [0, 1], [0.7, 1])})`,
            textAlign: "center",
          }}
        >
          "어, 뭐가 바뀌었는데요?"
        </div>

        {/* "세상이 변한 거예요" */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 600,
            color: palette.sub,
            opacity: worldChanged,
            transform: `translateY(${interpolate(worldChanged, [0, 1], [10, 0])}px)`,
          }}
        >
          세상이 변한 거예요
        </div>
      </div>

      <GlowOrb
        color="#4ECDC4"
        opacity={0.06 * impactIn}
        size={600}
        x="50%"
        y="45%"
        delay={B.IMPACT_TEXT}
      />
    </Ep04SceneLayout>
  );
};
