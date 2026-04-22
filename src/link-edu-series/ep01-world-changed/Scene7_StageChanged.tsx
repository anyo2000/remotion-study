import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep01SceneLayout } from "./Ep01SceneLayout";
import { BEATS_STAGE_CHANGED } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_STAGE_CHANGED;

/**
 * 씬 7: 반전 — 무대가 바뀌었다
 *
 * hideHeader. 텍스트 크기 변화 자체가 비주얼.
 * "실력 문제일까요?" → "아니에요." → "진짜 여러분 잘못 아니에요"
 * → "무대가 통째로 바뀐 거예요" (shake + glow flash)
 * → "더 억울하실 거예요" sub
 */
export const Scene7_StageChanged: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionIn = spring({
    frame: Math.max(0, frame - B.QUESTION),
    fps,
    config: SPRING.smooth,
  });

  const denyIn = spring({
    frame: Math.max(0, frame - B.DENY),
    fps,
    config: SPRING.bouncy,
  });

  const empathyIn = spring({
    frame: Math.max(0, frame - B.EMPATHY),
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
    frame: Math.max(0, frame - B.SUB),
    fps,
    config: SPRING.smooth,
  });

  // 키워드 등장 시 이전 요소 dim
  const preDim = frame >= B.KEYWORD_START
    ? interpolate(frame, [B.KEYWORD_START, B.KEYWORD_START + 15], [1, 0.2], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 스크린 셰이크 (키워드 임팩트 0.5초)
  const shakeAmount =
    frame >= B.KEYWORD_FULL && frame < B.KEYWORD_FULL + 15
      ? 8 *
        Math.sin((frame - B.KEYWORD_FULL) * 6) *
        Math.exp(-(frame - B.KEYWORD_FULL) * 0.3)
      : 0;

  // glow flash (순간 반짝 후 소멸)
  const glowFlash =
    frame >= B.KEYWORD_FULL && frame < B.KEYWORD_FULL + 15
      ? interpolate(
          frame,
          [B.KEYWORD_FULL, B.KEYWORD_FULL + 5, B.KEYWORD_FULL + 15],
          [0, 0.4, 0],
          { extrapolateRight: "clamp" }
        )
      : 0;

  const coolGray = "rgba(240, 237, 232, 0.7)";

  return (
    <Ep01SceneLayout hideHeader>
      <AbsoluteFill
        style={{
          transform: `translateX(${shakeAmount}px)`,
          justifyContent: "center",
          alignItems: "center",
          padding: "0 140px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* "실력 문제일까요?" */}
          <div
            style={{
              opacity: questionIn * preDim,
              transform: `translateY(${interpolate(questionIn, [0, 1], [20, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 64,
                fontWeight: 600,
                color: coolGray,
              }}
            >
              실력 문제일까요?
            </span>
          </div>

          {/* "아니에요." */}
          <div
            style={{
              opacity: denyIn * preDim,
              transform: `scale(${interpolate(denyIn, [0, 1], [0.75, 1])})`,
              textAlign: "center",
              marginTop: 8,
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

          {/* "진짜 여러분 잘못 아니에요" */}
          <div
            style={{
              opacity: empathyIn * preDim,
              transform: `translateY(${interpolate(empathyIn, [0, 1], [12, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 60,
                fontWeight: 600,
                color: coolGray,
              }}
            >
              진짜 여러분 잘못 아니에요
            </span>
          </div>

          {/* "무대가 통째로 바뀐 거예요" */}
          <div
            style={{
              marginTop: 40,
              opacity: keywordIn,
              transform: `scale(${interpolate(keywordFull, [0, 1], [0.8, 1])})`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 116,
                fontWeight: 900,
                color: palette.accent,
                textShadow: `0 0 80px rgba(232, 168, 56, ${glowFlash})`,
                lineHeight: 1.3,
              }}
            >
              무대가 통째로
            </span>
            <br />
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 116,
                fontWeight: 900,
                color: palette.accent,
                textShadow: `0 0 80px rgba(232, 168, 56, ${glowFlash})`,
                lineHeight: 1.3,
              }}
            >
              바뀐 거예요
            </span>
          </div>

          {/* "더 억울하실 거예요" */}
          <div
            style={{
              marginTop: 20,
              opacity: subIn,
              transform: `translateY(${interpolate(subIn, [0, 1], [12, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 600,
                color: coolGray,
              }}
            >
              더 억울하실 거예요
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Ep01SceneLayout>
  );
};
