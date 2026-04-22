import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb, CountUpNumber } from "../../components";
import { Ep02SceneLayout } from "./Ep02SceneLayout";
import { BEATS_HALF_GONE } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_HALF_GONE;

/**
 * 씬 3: FP 절반 소멸
 *
 * "50%" 카운트업 → 좌우 스플릿: 왼쪽 🤖 "1초" / 오른쪽 👤 dim
 * 왼쪽 하이라이트, 오른쪽 dim
 */
export const Scene3_HalfGone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "10년 안에" → 씬 시작, 헤드라인 등장
  const headlineIn = spring({
    frame: Math.max(0, frame - B.TEN_YEARS),
    fps,
    config: SPRING.smooth,
  });

  // "절반이 없어질 거다" → 50% 카운트업 시작
  const halfIn = spring({
    frame: Math.max(0, frame - B.HALF_TEXT),
    fps,
    config: SPRING.bouncy,
  });

  // "왜 그럴까요?" → 스플릿 카드 등장 준비
  const splitIn = spring({
    frame: Math.max(0, frame - B.WHY),
    fps,
    config: SPRING.heavy,
  });

  // "AI예요" → 왼쪽 카드 하이라이트
  const aiIn = spring({
    frame: Math.max(0, frame - B.AI_TEXT),
    fps,
    config: SPRING.smooth,
  });

  // "1초만에 해요" → 왼쪽 강조 텍스트
  const oneSecIn = spring({
    frame: Math.max(0, frame - B.ONE_SEC),
    fps,
    config: SPRING.bouncy,
  });

  // "GA의 장점이 없어질" → 오른쪽 dim 심화
  const gaGoneIn = spring({
    frame: Math.max(0, frame - B.GA_GONE),
    fps,
    config: SPRING.smooth,
  });

  const isAiHighlighted = frame >= B.AI_TEXT;

  // 오른쪽 dim: AI 등장 이후 점점 어두워짐
  const rightDim = isAiHighlighted
    ? interpolate(aiIn, [0, 1], [1, 0.25])
    : 1;

  // GA 없어짐 효과: 오른쪽 카드 더 dim
  const gaExtraDim = interpolate(gaGoneIn, [0, 1], [0, 0.15]);
  const rightFinalDim = Math.max(0, rightDim - gaExtraDim);

  return (
    <Ep02SceneLayout pageTitle="10년 뒤의 우리">
      <GlowOrb
        color={palette.accent}
        opacity={0.05 * aiIn}
        size={550}
        x="30%"
        y="55%"
        delay={B.AI_TEXT}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          width: "100%",
        }}
      >
        {/* 상단: "10년 안에 FP" + 50% 카운트업 */}
        <div
          style={{
            opacity: headlineIn,
            transform: `translateY(${interpolate(headlineIn, [0, 1], [16, 0])}px)`,
            textAlign: "center",
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
            10년 안에 FP의
          </span>
        </div>

        {/* 50% 카운트업 */}
        <div
          style={{
            opacity: halfIn,
            transform: `scale(${interpolate(halfIn, [0, 1], [0.6, 1])})`,
            textAlign: "center",
          }}
        >
          <CountUpNumber
            from={0}
            to={50}
            startFrame={B.HALF_TEXT}
            duration={35}
            fontSize={180}
            color={palette.accent}
            suffix="%"
            style={{ lineHeight: 1 }}
          />
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 64,
              fontWeight: 800,
              color: palette.text,
              marginTop: 4,
            }}
          >
            없어질 거다
          </div>
        </div>

        {/* AI 카드 — 중앙 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            opacity: splitIn,
          }}
        >
          <div
            style={{
              width: 500,
              borderRadius: 24,
              backgroundColor: isAiHighlighted
                ? "rgba(232, 168, 56, 0.12)"
                : "rgba(255, 255, 255, 0.05)",
              border: `2px solid rgba(232, 168, 56, ${isAiHighlighted ? 0.4 : 0.1})`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              padding: "40px 36px",
              transform: `translateY(${interpolate(splitIn, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* 이모지 */}
            <div
              style={{
                fontSize: 96,
                lineHeight: 1,
                opacity: aiIn,
              }}
            >
              🤖
            </div>

            {/* AI 텍스트 */}
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 64,
                fontWeight: 800,
                color: palette.text,
                textAlign: "center",
                opacity: aiIn,
              }}
            >
              AI
            </div>

            {/* "1초" 강조 */}
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 900,
                color: palette.accent,
                opacity: oneSecIn,
                transform: `scale(${interpolate(oneSecIn, [0, 1], [0.7, 1])})`,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              1초
            </div>
          </div>
        </div>
      </div>
    </Ep02SceneLayout>
  );
};
