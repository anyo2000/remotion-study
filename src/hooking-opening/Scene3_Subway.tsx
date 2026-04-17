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

const palette = PALETTES.orange;

/**
 * 장면 3: 지하철 — 다 폰만 봐요 (T(15.5)~T(20.6), 5.1초)
 * 📱 이모지만, 텍스트 없음. 여러 폰이 순차 등장 후 하나로 수렴.
 */

const PHONES = [
  { x: 25, y: 25, delay: 5, size: 72 },
  { x: 75, y: 20, delay: 8, size: 68 },
  { x: 15, y: 55, delay: 12, size: 76 },
  { x: 85, y: 50, delay: 10, size: 70 },
  { x: 40, y: 75, delay: 15, size: 64 },
  { x: 60, y: 80, delay: 18, size: 66 },
  { x: 50, y: 45, delay: 20, size: 120 }, // 중앙 큰 폰
] as const;

export const Scene3_Subway: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneLayout>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {PHONES.map((p, i) => {
          const isCenter = i === PHONES.length - 1;
          const prog = spring({
            frame: Math.max(0, frame - p.delay),
            fps,
            config: isCenter ? SPRING.bouncy : SPRING.smooth,
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate(-50%, -50%) scale(${interpolate(prog, [0, 1], [0.3, 1])})`,
                fontSize: p.size,
                lineHeight: 1,
                opacity: prog * (isCenter ? 1 : 0.6),
              }}
            >
              📱
            </div>
          );
        })}

        <GlowOrb
          color={palette.accent}
          opacity={0.04}
          size={400}
          x="50%"
          y="45%"
          delay={15}
        />
      </div>
    </SceneLayout>
  );
};
