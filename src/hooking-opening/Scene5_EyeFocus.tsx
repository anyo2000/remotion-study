import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GlowOrb } from "../components";
import { SceneLayout } from "./SceneLayout";
import { BEATS_EYE_FOCUS } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_EYE_FOCUS;

/**
 * 장면 5: 다들 쳐다봤어요
 * 오디오: "아무도 대답은 안 했어요" → "근데 다들 그 아저씨를 쳐다보게 되었어요"
 */

const EYES = [
  { x: 20, y: 30 },
  { x: 80, y: 25 },
  { x: 10, y: 60 },
  { x: 90, y: 55 },
  { x: 35, y: 80 },
  { x: 65, y: 75 },
  { x: 25, y: 50 },
  { x: 75, y: 50 },
] as const;

export const Scene5_EyeFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textIn = spring({
    frame: Math.max(0, frame - B.TEXT_IN),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <SceneLayout pageTitle="승객들의 반응">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* 시선선 — 각 눈에서 중앙으로 */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {EYES.map((eye, i) => {
            const eyeDelay = B.EYES_START + i * B.EYES_STAGGER;
            const lineIn = spring({
              frame: Math.max(0, frame - B.LINES_CONVERGE - i * 2),
              fps,
              config: SPRING.heavy,
            });
            return (
              <line
                key={`line-${i}`}
                x1={`${eye.x}%`}
                y1={`${eye.y}%`}
                x2="50%"
                y2="50%"
                stroke={palette.accent}
                strokeWidth={2}
                opacity={lineIn * 0.15}
                strokeDasharray="8 4"
              />
            );
          })}
        </svg>

        {/* 👁️ 눈 이모지들 */}
        {EYES.map((eye, i) => {
          const eyeDelay = B.EYES_START + i * B.EYES_STAGGER;
          const prog = spring({
            frame: Math.max(0, frame - eyeDelay),
            fps,
            config: SPRING.smooth,
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${eye.x}%`,
                top: `${eye.y}%`,
                transform: `translate(-50%, -50%) scale(${interpolate(prog, [0, 1], [0.3, 1])})`,
                fontSize: 64,
                lineHeight: 1,
                opacity: prog,
              }}
            >
              👁️
            </div>
          );
        })}

        {/* 중앙: "전원이" 텍스트 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(textIn, [0, 1], [0.6, 1])})`,
            opacity: textIn,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 100,
              fontWeight: 900,
              color: palette.accent,
              textAlign: "center",
              textShadow: `0 0 40px ${palette.accent}`,
            }}
          >
            다들 쳐다봤어요
          </div>
        </div>

        <GlowOrb
          color={palette.accent}
          opacity={0.06}
          size={400}
          x="50%"
          y="50%"
          delay={12}
        />
      </div>
    </SceneLayout>
  );
};
