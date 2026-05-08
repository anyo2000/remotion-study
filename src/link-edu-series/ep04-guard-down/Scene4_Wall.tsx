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
import { BEATS_WALL } from "./ep04-beats";

const palette = PALETTES.ep01;
const B = BEATS_WALL;

const BRICKS = [
  { text: "보장분석 해드릴게요", delay: B.BRICK_1 },
  { text: "부족한 거 채워드릴게요", delay: B.BRICK_2 },
  { text: "갈아타시면 좋아요", delay: B.BRICK_3 },  // 대본: "이번기회에 갈아타시면 좋아요" — 축약
] as const;

/**
 * 씬 4: 벽의 정체
 * "보장 분석" 큰 텍스트 → 벽돌 3개 쌓임 → 🛡️ 방어모드 → 금 가는 효과
 */
export const Scene4_Wall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introIn = spring({
    frame: Math.max(0, frame - B.NOT_OUR_FAULT),
    fps,
    config: SPRING.smooth,
  });

  const wallNameIn = spring({
    frame: Math.max(0, frame - B.WALL_NAME),
    fps,
    config: SPRING.bouncy,
  });

  const defenseIn = spring({
    frame: Math.max(0, frame - B.DEFENSE_MODE),
    fps,
    config: SPRING.bouncy,
  });

  const contaminatedIn = spring({
    frame: Math.max(0, frame - B.CONTAMINATED),
    fps,
    config: SPRING.smooth,
  });

  // 벽돌 등장 시 좌측 dim
  const leftDim = frame >= B.BRICK_1
    ? interpolate(frame, [B.BRICK_1, B.BRICK_1 + 15], [1, 0.4], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 방어모드 시 전체 dim
  const allDim = frame >= B.DEFENSE_MODE
    ? interpolate(frame, [B.DEFENSE_MODE, B.DEFENSE_MODE + 15], [1, 0.25], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 금 가는 효과 (오염 발언 시)
  const crackOpacity = contaminatedIn * 0.6;

  const glowFlash =
    frame >= B.DEFENSE_MODE && frame < B.DEFENSE_MODE + 20
      ? interpolate(frame, [B.DEFENSE_MODE, B.DEFENSE_MODE + 20], [0.15, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <Ep04SceneLayout pageTitle="벽의 이름" wide>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: 60,
          opacity: allDim,
        }}
      >
        {/* 좌측: 텍스트 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            opacity: leftDim,
          }}
        >
          {/* 도입: "누구나 겪는 일" — 벽 이름 나오기 전 */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 700,
              color: palette.text,
              opacity: introIn * (1 - wallNameIn),
              transform: `translateY(${interpolate(introIn, [0, 1], [10, 0])}px)`,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            1년차도, 10년차도{"\n"}누구나 겪는 일
          </div>

          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 88,
              fontWeight: 900,
              color: palette.accent,
              opacity: wallNameIn,
              transform: `scale(${interpolate(wallNameIn, [0, 1], [0.8, 1])})`,
              textAlign: "center",
            }}
          >
            보장 분석
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              opacity: wallNameIn * 0.8,
              textAlign: "center",
            }}
          >
            이 네 글자가 벽이 됐다
          </div>
        </div>

        {/* 우측: 벽돌 쌓기 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            gap: 16,
            position: "relative",
          }}
        >
          {BRICKS.map((brick, i) => {
            const brickIn = spring({
              frame: Math.max(0, frame - brick.delay),
              fps,
              config: SPRING.heavy,
            });

            // 취소선 진행률
            const strikeProgress = spring({
              frame: Math.max(0, frame - brick.delay - 15),
              fps,
              config: SPRING.smooth,
            });

            return (
              <div
                key={i}
                style={{
                  minWidth: 480,
                  padding: "24px 36px",
                  borderRadius: 12,
                  backgroundColor: `rgba(232, 168, 56, ${0.06 + i * 0.03})`,
                  border: `2px solid rgba(232, 168, 56, ${0.12 + i * 0.06})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: brickIn,
                  transform: `translateX(${interpolate(brickIn, [0, 1], [60, 0])}px)`,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 52, flexShrink: 0 }}>🧱</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    fontWeight: 700,
                    color: palette.text,
                  }}
                >
                  {brick.text}
                </span>
                {/* 취소선 */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 80,
                    right: 36,
                    height: 3,
                    backgroundColor: "#E05A5A",
                    transform: `scaleX(${strikeProgress})`,
                    transformOrigin: "left",
                    opacity: strikeProgress * 0.7,
                  }}
                />
              </div>
            );
          })}

          {/* 금 가는 효과 */}
          <svg
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              opacity: crackOpacity,
            }}
          >
            <line
              x1="30%"
              y1="10%"
              x2="70%"
              y2="90%"
              stroke="#E05A5A"
              strokeWidth={3}
              strokeDasharray="8 4"
            />
            <line
              x1="50%"
              y1="5%"
              x2="45%"
              y2="95%"
              stroke="#E05A5A"
              strokeWidth={2}
              strokeDasharray="6 6"
            />
          </svg>
        </div>
      </div>

      {/* 🛡️ 방어모드 */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: defenseIn,
          transform: `scale(${interpolate(defenseIn, [0, 1], [0.8, 1])})`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 88,
            fontWeight: 900,
            color: palette.accent,
            textShadow: `0 0 50px rgba(232, 168, 56, ${glowFlash})`,
          }}
        >
          🛡️ 방어모드
        </span>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={500}
        x="70%"
        y="50%"
        delay={B.BRICK_1}
      />
    </Ep04SceneLayout>
  );
};
