import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep01SceneLayout } from "./Ep01SceneLayout";
import { BEATS_WALL } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_WALL;

/**
 * 씬 5: 보장분석의 벽 — 막힘, 공포
 *
 * 화면 전체를 활용. 왼쪽에 "보장분석" 텍스트, 오른쪽에 벽돌이 쌓여 올라감.
 * 벽돌은 화면 오른쪽 절반을 차지하는 실제 블록 형태.
 * 마지막에 벽이 화면 전체를 가리고 "방어모드" 등장.
 */

const BRICKS = [
  { text: "받아 봤어요", emoji: "😐", delay: B.BRICK_1 },
  { text: "10번 받아 봤어요", emoji: "😤", delay: B.BRICK_2 },
  { text: "또 해약하라고?", emoji: "🙄", delay: B.BRICK_3 },
] as const;

export const Scene5_Wall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const analysisIn = spring({
    frame: Math.max(0, frame - B.ANALYSIS_TEXT),
    fps,
    config: SPRING.smooth,
  });

  const wallLabelIn = spring({
    frame: Math.max(0, frame - B.WALL_START),
    fps,
    config: SPRING.bouncy,
  });

  const defenseIn = spring({
    frame: Math.max(0, frame - B.DEFENSE_MODE),
    fps,
    config: SPRING.bouncy,
  });

  // 벽돌 등장 시 왼쪽 텍스트 dim
  const leftDim = frame >= B.BRICK_1
    ? interpolate(frame, [B.BRICK_1, B.BRICK_1 + 15], [1, 0.3], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 방어모드 시 전체 dim
  const allDim = frame >= B.DEFENSE_MODE
    ? interpolate(frame, [B.DEFENSE_MODE, B.DEFENSE_MODE + 15], [1, 0.25], {
        extrapolateRight: "clamp",
      })
    : 1;

  const glowFlash =
    frame >= B.DEFENSE_MODE && frame < B.DEFENSE_MODE + 20
      ? interpolate(frame, [B.DEFENSE_MODE, B.DEFENSE_MODE + 20], [0.15, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <Ep01SceneLayout pageTitle="세 번째, 제일 무서운 것" wide>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: 60,
          opacity: allDim,
        }}
      >
        {/* 왼쪽: 텍스트 영역 */}
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
          {/* "보장분석 해드릴게요" */}
          <div
            style={{
              opacity: analysisIn,
              transform: `translateX(${interpolate(analysisIn, [0, 1], [-30, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 60,
                fontWeight: 700,
                color: palette.text,
                lineHeight: 1.4,
              }}
            >
              "보장분석{"\n"}해드릴게요"
            </span>
          </div>

          {/* "이 말 자체가 벽이 돼버렸어요" */}
          <div
            style={{
              opacity: wallLabelIn,
              transform: `translateY(${interpolate(wallLabelIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
              }}
            >
              이 말 자체가{"\n"}벽이 돼버렸어요
            </span>
          </div>
        </div>

        {/* 오른쪽: 벽돌 영역 — 아래에서 위로 쌓임 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            gap: 16,
          }}
        >
          {BRICKS.map((brick, i) => {
            const brickIn = spring({
              frame: Math.max(0, frame - brick.delay),
              fps,
              config: SPRING.heavy,
            });

            return (
              <div
                key={i}
                style={{
                  minWidth: 440,
                  padding: "24px 36px",
                  borderRadius: 12,
                  backgroundColor: `rgba(232, 168, 56, ${0.06 + i * 0.03})`,
                  border: `2px solid rgba(232, 168, 56, ${0.12 + i * 0.06})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: brickIn,
                  transform: `translateX(${interpolate(brickIn, [0, 1], [60, 0])}px)`,
                }}
              >
                <span style={{ fontSize: 52, flexShrink: 0 }}>{brick.emoji}</span>
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
              </div>
            );
          })}
        </div>
      </div>

      {/* "방어모드" — 전체 위에 중앙 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
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
    </Ep01SceneLayout>
  );
};
