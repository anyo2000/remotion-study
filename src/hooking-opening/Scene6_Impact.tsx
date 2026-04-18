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
import { BEATS_IMPACT } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_IMPACT;

/**
 * 장면 6: 왜 — 답을 안 줬으니까
 * 오디오: "왜 쳐다봤을까요?" → "답을 알려주지 않는 거예요" → "답답함을 느끼거든요"
 */
export const Scene6_Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ❗ 드롭 — "왜 쳐다봤을까요?" 시점
  const dropProgress = spring({
    frame: Math.max(0, frame - B.DROP_START),
    fps,
    config: SPRING.bouncy,
  });

  // 화면 흔들림 (문장 끝에 짧게)
  const shakeIntensity =
    frame >= B.SHAKE_START && frame < B.SHAKE_START + 12
      ? Math.sin((frame - B.SHAKE_START) * 2.5) *
        interpolate(frame, [B.SHAKE_START, B.SHAKE_START + 12], [8, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  // "답을" 시점에 텍스트 등장
  const textIn = spring({
    frame: Math.max(0, frame - B.TEXT_IN),
    fps,
    config: SPRING.smooth,
  });

  // "답답함을" 시점에 보조텍스트
  const subIn = spring({
    frame: Math.max(0, frame - B.SUB_IN),
    fps,
    config: SPRING.smooth,
  });

  return (
    <SceneLayout pageTitle="왜?">
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
          delay={B.DROP_START}
        />
      </div>
    </SceneLayout>
  );
};
