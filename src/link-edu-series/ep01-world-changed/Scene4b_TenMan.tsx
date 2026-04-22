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
import { BEATS_TEN_MAN } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_TEN_MAN;

/**
 * 씬 4b: 10만원 — 충격적 현실
 *
 * 좌우 분할: 왼쪽에 숫자 "10만원" 카운트업 + 원형 게이지,
 * 오른쪽에 화법 텍스트 전체 문장.
 * Reference: SampleScene9 (timer) 느낌의 숫자 임팩트.
 */
export const Scene4b_TenMan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 숫자 등장
  const numberIn = spring({
    frame: Math.max(0, frame - B.NUMBER_IN),
    fps,
    config: SPRING.bouncy,
  });

  // 카운트업 0 → 10
  const countProgress = frame >= B.NUMBER_IN
    ? interpolate(frame, [B.NUMBER_IN, B.NUMBER_IN + 30], [0, 10], {
        extrapolateRight: "clamp",
      })
    : 0;

  // 화법 텍스트
  const quoteIn = spring({
    frame: Math.max(0, frame - B.QUOTE),
    fps,
    config: SPRING.smooth,
  });

  // 하단 sub
  const shakingIn = spring({
    frame: Math.max(0, frame - B.SHAKING),
    fps,
    config: SPRING.smooth,
  });

  // 원형 게이지
  const r = 120;
  const circumference = 2 * Math.PI * r;
  const gaugeProgress = numberIn * (countProgress / 10);
  const dashLen = circumference * gaugeProgress;

  // quote 등장 시 왼쪽 dim
  const leftDim = frame >= B.QUOTE
    ? interpolate(frame, [B.QUOTE, B.QUOTE + 15], [1, 0.5], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <Ep01SceneLayout pageTitle="10만 원의 현실">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
        }}
      >
        {/* 왼쪽: 원형 게이지 + 숫자 */}
        <div
          style={{
            position: "relative",
            width: 300,
            height: 300,
            flexShrink: 0,
            opacity: leftDim,
          }}
        >
          <svg width={300} height={300} viewBox="0 0 300 300">
            {/* 배경 링 */}
            <circle
              cx={150}
              cy={150}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={10}
            />
            {/* 진행 링 */}
            <circle
              cx={150}
              cy={150}
              r={r}
              fill="none"
              stroke={palette.accent}
              strokeWidth={10}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${palette.accent})`,
              }}
            />
          </svg>
          {/* 중앙 숫자 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 88,
                fontWeight: 900,
                color: palette.accent,
                fontVariantNumeric: "tabular-nums",
                opacity: numberIn,
              }}
            >
              {Math.round(countProgress)}만
            </span>
          </div>
        </div>

        {/* 오른쪽: 텍스트 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 600,
          }}
        >
          {/* 화법 텍스트 — 전체 문장 그대로 */}
          <div
            style={{
              opacity: quoteIn,
              transform: `translateY(${interpolate(quoteIn, [0, 1], [16, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 700,
                color: palette.text,
                lineHeight: 1.5,
                whiteSpace: "nowrap",
              }}
            >
              "형 때문에 내가 왜{"\n"}10만 원을 손해 봐?"
            </span>
          </div>

          {/* 하단 sub */}
          <div
            style={{
              opacity: shakingIn,
              transform: `translateY(${interpolate(shakingIn, [0, 1], [8, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
                whiteSpace: "nowrap",
              }}
            >
              의리로 버티던 계약들이 흔들리고
            </span>
          </div>
        </div>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.05}
        size={350}
        x="25%"
        y="50%"
        delay={B.NUMBER_IN}
      />
    </Ep01SceneLayout>
  );
};
