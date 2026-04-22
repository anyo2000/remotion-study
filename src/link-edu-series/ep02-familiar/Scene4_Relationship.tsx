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
import { Ep02SceneLayout } from "./Ep02SceneLayout";
import { BEATS_RELATIONSHIP } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_RELATIONSHIP;

/**
 * 씬 4: 딱 하나, 관계 [반전]
 *
 * 좌우 분할: 왼쪽 "관계" 대형 / 오른쪽 가족·성향·걱정 배지
 * 하단: "컴퓨터로 못 찾거든요" → "우리가 아는 거예요"
 * pageTitle 없음 (반전 장면)
 */
export const Scene4_Relationship: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oneLeftIn = spring({
    frame: Math.max(0, frame - B.ONE_LEFT),
    fps,
    config: SPRING.smooth,
  });

  const keywordIn = spring({
    frame: Math.max(0, frame - B.KEYWORD),
    fps,
    config: SPRING.bouncy,
  });

  const prefaceDim = interpolate(
    frame,
    [B.KEYWORD, B.KEYWORD + 10],
    [1, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const familyIn = spring({
    frame: Math.max(0, frame - B.FAMILY),
    fps,
    config: SPRING.smooth,
  });

  const tendencyIn = spring({
    frame: Math.max(0, frame - B.TENDENCY),
    fps,
    config: SPRING.smooth,
  });

  const worryIn = spring({
    frame: Math.max(0, frame - B.WORRY),
    fps,
    config: SPRING.smooth,
  });

  const cantComputeIn = spring({
    frame: Math.max(0, frame - B.CANT_COMPUTE),
    fps,
    config: SPRING.smooth,
  });

  const weKnowIn = spring({
    frame: Math.max(0, frame - B.WE_KNOW),
    fps,
    config: SPRING.smooth,
  });

  const glowPulse =
    frame >= B.KEYWORD
      ? 0.07 + Math.sin((frame - B.KEYWORD) * 0.05) * 0.025
      : 0;

  return (
    <Ep02SceneLayout pageTitle="FP는 어떻게 하지?">
      <GlowOrb
        color={palette.accent}
        opacity={glowPulse * keywordIn}
        size={800}
        x="35%"
        y="45%"
        delay={B.KEYWORD}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 120px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 80,
            width: "100%",
          }}
        >
          {/* 왼쪽: "딱 하나 남아요" + "관계" 대형 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                opacity: oneLeftIn * prefaceDim,
                transform: `translateY(${interpolate(oneLeftIn, [0, 1], [16, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 56,
                  fontWeight: 600,
                  color: palette.sub,
                }}
              >
                딱 하나 남아요.
              </span>
            </div>

            <div
              style={{
                opacity: keywordIn,
                transform: `scale(${interpolate(keywordIn, [0, 1], [0.5, 1])})`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 240,
                  fontWeight: 900,
                  color: palette.accent,
                  lineHeight: 1,
                  letterSpacing: -4,
                }}
              >
                관계
              </span>
            </div>
          </div>

          {/* 오른쪽: 배지 3개 + 하단 텍스트 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}
          >
            {/* 배지 3개 — 세로 배치로 크게 */}
            {[
              { emoji: "👨‍👩‍👧", label: "가족", progress: familyIn, delay: -30 },
              { emoji: "🧠", label: "성향", progress: tendencyIn, delay: 0 },
              { emoji: "😟", label: "걱정", progress: worryIn, delay: 30 },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  opacity: item.progress,
                  transform: `translateX(${interpolate(item.progress, [0, 1], [item.delay, 0])}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 36px",
                  borderRadius: 18,
                  backgroundColor: "rgba(232, 168, 56, 0.08)",
                  border: "1.5px solid rgba(232, 168, 56, 0.2)",
                  width: 340,
                }}
              >
                <span style={{ fontSize: 56, lineHeight: 1 }}>{item.emoji}</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 56,
                    fontWeight: 700,
                    color: palette.text,
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}

            {/* "컴퓨터로 못 찾거든요" + "우리가 아는 거예요" */}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  opacity: cantComputeIn,
                  transform: `translateY(${interpolate(cantComputeIn, [0, 1], [12, 0])}px)`,
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
                  컴퓨터로 못 찾거든요.
                </span>
              </div>

              <div
                style={{
                  opacity: weKnowIn,
                  transform: `translateY(${interpolate(weKnowIn, [0, 1], [12, 0])}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 64,
                    fontWeight: 800,
                    color: palette.text,
                  }}
                >
                  우리가 아는 거예요.
                </span>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Ep02SceneLayout>
  );
};
