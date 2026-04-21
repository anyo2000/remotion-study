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
import { BEATS_STAGE_CHANGED } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_STAGE_CHANGED;

/**
 * 씬 7: 무대가 바뀌었다 [반전]
 *
 * "실력 문제일까요?" → "아니에요" → "무대가 통째로 바뀐 거예요"
 * 반전 태그: 헤드라인 생략, 감정 전환점에서 키워드 등장
 */
export const Scene7_StageChanged: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── 스프링 ──
  const questionIn = spring({
    frame: Math.max(0, frame - B.QUESTION_IN),
    fps,
    config: SPRING.smooth,
  });

  const denyIn = spring({
    frame: Math.max(0, frame - B.DENY_IN),
    fps,
    config: SPRING.bouncy,
  });

  const empathyIn = spring({
    frame: Math.max(0, frame - B.EMPATHY_IN),
    fps,
    config: SPRING.smooth,
  });

  const keywordIn = spring({
    frame: Math.max(0, frame - B.KEYWORD_START),
    fps,
    config: SPRING.bouncy,
  });

  const keywordFull = spring({
    frame: Math.max(0, frame - B.KEYWORD_FULL),
    fps,
    config: SPRING.smooth,
  });

  const subIn = spring({
    frame: Math.max(0, frame - B.SUB_IN),
    fps,
    config: SPRING.smooth,
  });

  // 키워드 등장 시 이전 요소 dim
  const preDim =
    frame >= B.KEYWORD_START
      ? interpolate(
          frame,
          [B.KEYWORD_START, B.KEYWORD_START + 20],
          [1, 0.25],
          { extrapolateRight: "clamp" }
        )
      : 1;

  // 스크린 셰이크 (키워드 임팩트)
  const shakeAmount =
    frame >= B.KEYWORD_FULL && frame < B.KEYWORD_FULL + 15
      ? 6 *
        Math.sin((frame - B.KEYWORD_FULL) * 5) *
        Math.exp(-(frame - B.KEYWORD_FULL) * 0.35)
      : 0;

  return (
    <Ep01SceneLayout hideHeader>
      <AbsoluteFill
        style={{
          transform: `translateX(${shakeAmount}px)`,
          justifyContent: "center",
          alignItems: "center",
          padding: "0 120px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* 질문 — "실력 문제일까요?" */}
          <div
            style={{
              opacity: questionIn * preDim,
              transform: `translateY(${interpolate(questionIn, [0, 1], [15, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 72,
                fontWeight: 700,
                color: palette.sub,
                lineHeight: 1.4,
              }}
            >
              실력 문제일까요?
            </span>
          </div>

          {/* 부정 — "아니에요" */}
          <div
            style={{
              opacity: denyIn * preDim,
              transform: `scale(${interpolate(denyIn, [0, 1], [0.8, 1])})`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 88,
                fontWeight: 900,
                color: palette.text,
              }}
            >
              아니에요.
            </span>
          </div>

          {/* 공감 — "진짜 여러분 잘못 아니에요" */}
          <div
            style={{
              opacity: empathyIn * preDim,
              transform: `translateY(${interpolate(empathyIn, [0, 1], [10, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 64,
                fontWeight: 600,
                color: palette.sub,
              }}
            >
              진짜 여러분 잘못 아니에요
            </span>
          </div>

          {/* ── 핵심 키워드 ── "무대가 통째로 바뀐 거예요" */}
          <div
            style={{
              marginTop: 32,
              opacity: keywordIn,
              transform: `scale(${interpolate(keywordFull, [0, 1], [0.85, 1])})`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 110,
                fontWeight: 900,
                color: palette.accent,
                textShadow: `0 0 60px rgba(232, 168, 56, ${0.3 * keywordFull})`,
              }}
            >
              무대가 통째로
            </span>
            <br />
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 110,
                fontWeight: 900,
                color: palette.accent,
                textShadow: `0 0 60px rgba(232, 168, 56, ${0.3 * keywordFull})`,
              }}
            >
              바뀐 거예요
            </span>
          </div>

          {/* 보조 — "예전 방식일수록 더 억울하실 거예요" */}
          <div
            style={{
              marginTop: 16,
              opacity: subIn,
              transform: `translateY(${interpolate(subIn, [0, 1], [10, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 600,
                color: palette.sub,
                lineHeight: 1.5,
              }}
            >
              예전 방식일수록 더 억울하실 거예요
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <GlowOrb
        color={palette.accent}
        opacity={0.06}
        size={700}
        x="50%"
        y="45%"
        delay={B.KEYWORD_START}
      />
    </Ep01SceneLayout>
  );
};
