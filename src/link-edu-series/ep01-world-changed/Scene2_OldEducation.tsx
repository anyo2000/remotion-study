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
import { BEATS_OLD_EDUCATION } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_OLD_EDUCATION;

/**
 * 씬 2: 과거의 교육 — 향수 → 단절
 *
 * 좌우 분할:
 * 왼쪽 — 🤝만나라, 🎁선물, 📦택배 (3줄, 취소선)
 * 오른쪽 — "그때는 먹히던 시대" + "근데 이제 아니죠"
 */

const METHODS = [
  { emoji: "🤝", label: "만나라", delay: B.MEET },
  { emoji: "🎁", label: "선물 들고 가라", delay: B.GIFT },
  { emoji: "📦", label: "택배 보내라", delay: B.DELIVERY },
] as const;

export const Scene2_OldEducation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const workedIn = spring({
    frame: Math.max(0, frame - B.WORKED),
    fps,
    config: SPRING.smooth,
  });

  const notAnymore = spring({
    frame: Math.max(0, frame - B.NOT_ANYMORE),
    fps,
    config: SPRING.bouncy,
  });

  // 왼쪽 dim on "이제 아니죠"
  const leftDim = frame >= B.NOT_ANYMORE
    ? interpolate(frame, [B.NOT_ANYMORE, B.NOT_ANYMORE + 15], [1, 0.3], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 오른쪽 "먹히던 시대" dim on "이제 아니죠"
  const workedDim = frame >= B.NOT_ANYMORE
    ? interpolate(frame, [B.NOT_ANYMORE, B.NOT_ANYMORE + 15], [1, 0.4], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <Ep01SceneLayout pageTitle="5년 전 교육" wide>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
        }}
      >
        {/* 왼쪽: 3가지 방법 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            opacity: leftDim,
          }}
        >
          {METHODS.map((m, i) => {
            const prog = spring({
              frame: Math.max(0, frame - m.delay),
              fps,
              config: SPRING.smooth,
            });

            const strikeProgress = frame >= B.NOT_ANYMORE
              ? spring({
                  frame: Math.max(0, frame - B.NOT_ANYMORE - i * 5),
                  fps,
                  config: SPRING.heavy,
                })
              : 0;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: prog,
                  transform: `translateX(${interpolate(prog, [0, 1], [-30, 0])}px)`,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 80, lineHeight: 1 }}>{m.emoji}</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 68,
                    fontWeight: 700,
                    color: palette.text,
                  }}
                >
                  {m.label}
                </span>
                {/* 취소선 */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: palette.accent,
                    transform: `scaleX(${strikeProgress})`,
                    transformOrigin: "left center",
                    borderRadius: 2,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: 2,
            height: 280,
            backgroundColor: palette.cardBorder,
            opacity: workedIn * 0.4,
            borderRadius: 1,
          }}
        />

        {/* 오른쪽: 결론 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 500,
          }}
        >
          {/* "그때는 먹히던 시대" */}
          <div
            style={{
              opacity: workedIn * workedDim,
              transform: `translateX(${interpolate(workedIn, [0, 1], [20, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 600,
                color: palette.sub,
                whiteSpace: "nowrap",
              }}
            >
              그때는 먹히던 시대
            </span>
          </div>

          {/* "근데 이제 아니죠" */}
          <div
            style={{
              opacity: notAnymore,
              transform: `scale(${interpolate(notAnymore, [0, 1], [0.8, 1])})`,
              transformOrigin: "left center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 900,
                color: palette.accent,
                whiteSpace: "nowrap",
              }}
            >
              근데 이제 아니죠
            </span>
          </div>
        </div>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={400}
        x="65%"
        y="50%"
        delay={B.NOT_ANYMORE}
      />
    </Ep01SceneLayout>
  );
};
