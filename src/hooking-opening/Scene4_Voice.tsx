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
import { BEATS_VOICE } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_VOICE;

/**
 * 장면 4: 한 아저씨 질문
 * 오디오: "근데 한 아저씨가 이렇게 말한 거예요"
 *       → "자 여러분 의사가 귓구멍을 파라고 해요?"
 */
export const Scene4_Voice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - B.EMOJI_IN),
    fps,
    config: SPRING.bouncy,
  });

  const textIn = spring({
    frame: Math.max(0, frame - B.TEXT_IN),
    fps,
    config: SPRING.smooth,
  });

  const waveCount = 3;

  return (
    <SceneLayout pageTitle="지하철 안, 그 한마디">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 🗣️ + 음파 */}
        <div style={{ position: "relative" }}>
          {/* 음파 링 */}
          {Array.from({ length: waveCount }).map((_, i) => {
            const waveDelays = [B.WAVE_1, B.WAVE_2, B.WAVE_3];
            const waveDelay = waveDelays[i];
            const waveProgress = spring({
              frame: Math.max(0, frame - waveDelay),
              fps,
              config: SPRING.heavy,
            });
            const waveSize = 160 + i * 80;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: waveSize,
                  height: waveSize,
                  borderRadius: "50%",
                  border: `3px solid ${palette.accent}`,
                  opacity: waveProgress * (0.3 - i * 0.08),
                  transform: `translate(-50%, -50%) scale(${interpolate(waveProgress, [0, 1], [0.5, 1])})`,
                }}
              />
            );
          })}

          <div
            style={{
              fontSize: 160,
              lineHeight: 1,
              opacity: emojiIn,
              transform: `scale(${interpolate(emojiIn, [0, 1], [0.5, 1])})`,
              position: "relative",
              zIndex: 1,
            }}
          >
            🗣️
          </div>
        </div>

        {/* 질문 텍스트 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 80,
            fontWeight: 900,
            color: palette.accent,
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          귓구멍을{"\n"}파라고 해요?
        </div>

        <GlowOrb
          color={palette.accent}
          opacity={0.04}
          size={500}
          x="50%"
          y="40%"
          delay={10}
        />
      </div>
    </SceneLayout>
  );
};
