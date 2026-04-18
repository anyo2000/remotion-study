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
import { BEATS_DRAMA } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_DRAMA;

/**
 * 장면 7: 드라마 끊기면
 * 오디오: "드라마 애매한 데서 끊기면" → "다음 편 보게 되는 거랑 똑같아요"
 */

type Phase = {
  emoji: string;
  delay: number;
};

const PHASES: Phase[] = [
  { emoji: "📺", delay: B.PHASE_TV },
  { emoji: "📡", delay: B.PHASE_CUT },
  { emoji: "🤔", delay: B.PHASE_THINK },
  { emoji: "▶️", delay: B.PHASE_PLAY },
];

export const Scene7_DramaCliff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 현재 활성 단계 결정
  const activeIndex = PHASES.reduce((acc, phase, i) => {
    return frame >= phase.delay ? i : acc;
  }, 0);

  return (
    <SceneLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
        }}
      >
        {PHASES.map((phase, i) => {
          const phaseIn = spring({
            frame: Math.max(0, frame - phase.delay),
            fps,
            config: SPRING.bouncy,
          });

          const isActive = i === activeIndex;
          const isPast = i < activeIndex;

          // 화살표 (마지막 단계 제외)
          const arrowIn =
            i < PHASES.length - 1
              ? spring({
                  frame: Math.max(0, frame - phase.delay - 10),
                  fps,
                  config: SPRING.smooth,
                })
              : 0;

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  opacity: phaseIn * (isPast ? 0.35 : 1),
                  transform: `scale(${isActive ? interpolate(phaseIn, [0, 1], [0.5, 1.1]) : phaseIn})`,
                }}
              >
                <div
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 28,
                    backgroundColor: isActive
                      ? "rgba(255, 140, 56, 0.1)"
                      : "rgba(255, 255, 255, 0.04)",
                    border: `2px solid ${isActive ? palette.accent : "rgba(255,255,255,0.08)"}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 80,
                    lineHeight: 1,
                  }}
                >
                  {phase.emoji}
                </div>
              </div>

              {/* 화살표 */}
              {i < PHASES.length - 1 && (
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    color: palette.sub,
                    opacity: arrowIn * 0.5,
                    transform: `translateX(${interpolate(arrowIn, [0, 1], [-10, 0])}px)`,
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={400}
        x="50%"
        y="50%"
        delay={10}
      />
    </SceneLayout>
  );
};
