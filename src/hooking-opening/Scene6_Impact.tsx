import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GlowOrb } from "../components";
import { SceneLayout } from "./SceneLayout";

const palette = PALETTES.orange;

/**
 * 장면 6: 답이 안 나왔으니까 (T(31.9)~T(36.7), 4.8초)
 * ❗ 쿵 떨어짐 + 화면 shake + "답이" "안 나왔으니까"
 */
export const Scene6_Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DROP_START = 5;
  const SHAKE_START = 15;
  const TEXT_START = 22;
  const SUB_START = 35;

  // ❗ 드롭 — 위에서 떨어짐
  const dropProgress = spring({
    frame: Math.max(0, frame - DROP_START),
    fps,
    config: SPRING.bouncy,
  });

  // 화면 흔들림 (SHAKE_START 이후 짧게)
  const shakeIntensity =
    frame >= SHAKE_START && frame < SHAKE_START + 12
      ? Math.sin((frame - SHAKE_START) * 2.5) *
        interpolate(frame, [SHAKE_START, SHAKE_START + 12], [8, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  const textIn = spring({
    frame: Math.max(0, frame - TEXT_START),
    fps,
    config: SPRING.smooth,
  });

  const subIn = spring({
    frame: Math.max(0, frame - SUB_START),
    fps,
    config: SPRING.smooth,
  });

  return (
    <SceneLayout pageTitle="답을 안 알려줬으니까">
      <div
        style={{
          transform: `translateX(${shakeIntensity}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* ❗ 드롭 이모지 */}
        <div
          style={{
            fontSize: 160,
            lineHeight: 1,
            opacity: dropProgress,
            transform: `translateY(${interpolate(dropProgress, [0, 1], [-120, 0])}px)`,
          }}
        >
          ❗
        </div>

        {/* "답이" — accent 색상, 크게 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 100,
            fontWeight: 900,
            color: palette.accent,
            opacity: textIn,
            transform: `scale(${interpolate(textIn, [0, 1], [0.7, 1])})`,
            textAlign: "center",
          }}
        >
          답을 안 줬으니까
        </div>

        {/* 보조 설명 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 700,
            color: palette.sub,
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [10, 0])}px)`,
            textAlign: "center",
          }}
        >
          답답함
        </div>

        <GlowOrb
          color={palette.accent}
          opacity={0.05}
          size={500}
          x="50%"
          y="35%"
          delay={DROP_START}
        />
      </div>
    </SceneLayout>
  );
};
