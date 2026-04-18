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
import { BEATS_SUBWAY } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_SUBWAY;

/**
 * 장면 3: 지하철 — 다 폰만 봐요
 * 오디오: "서울 지하철에서" → "아무도 안 봐요" → "다 휴대폰만 보죠?"
 * 📱 이모지 순차 등장, 음성 타이밍 연동
 */

// 첫 번째 그룹: "지하철에서" 시점 등장
// 두 번째 그룹: "뭐 파는 사람" 시점 등장
// 중앙 폰: "휴대폰만" 시점 강조
const PHONES = [
  { x: 25, y: 25, delay: B.FIRST_PHONES, size: 72, group: 1 },
  { x: 75, y: 20, delay: B.FIRST_PHONES + 5, size: 68, group: 1 },
  { x: 15, y: 55, delay: B.FIRST_PHONES + 10, size: 76, group: 1 },
  { x: 85, y: 50, delay: B.MORE_PHONES, size: 70, group: 2 },
  { x: 40, y: 75, delay: B.MORE_PHONES + 5, size: 64, group: 2 },
  { x: 60, y: 80, delay: B.MORE_PHONES + 10, size: 66, group: 2 },
  { x: 50, y: 45, delay: B.CENTER_PHONE, size: 120, group: 3 }, // 중앙 큰 폰
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
