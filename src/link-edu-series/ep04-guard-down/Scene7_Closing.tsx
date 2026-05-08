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
import { BEATS_CLOSING } from "./ep04-beats";

const palette = PALETTES.ep01;
const B = BEATS_CLOSING;

/**
 * 씬 7: 클로징
 * 도입: 입에 붙은 단어 → 신뢰→신호 반전 → 옛날 단어 자각
 * 핵심: "단어 한두 개만 빼도" → "첫 1분의 공기가 달라집니다"
 * 예고: 다음편 후킹 화법
 */
export const Scene7_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oldWordsIn = spring({
    frame: Math.max(0, frame - B.OLD_WORDS),
    fps,
    config: SPRING.smooth,
  });

  const trustIn = spring({
    frame: Math.max(0, frame - B.TRUST_SIGNAL),
    fps,
    config: SPRING.smooth,
  });

  const stillIn = spring({
    frame: Math.max(0, frame - B.STILL_USING),
    fps,
    config: SPRING.smooth,
  });

  const todayIn = spring({
    frame: Math.max(0, frame - B.TODAY_ONE),
    fps,
    config: SPRING.smooth,
  });

  const line1In = spring({
    frame: Math.max(0, frame - B.LINE_1),
    fps,
    config: SPRING.smooth,
  });

  const line2In = spring({
    frame: Math.max(0, frame - B.LINE_2),
    fps,
    config: SPRING.bouncy,
  });

  const previewIn = spring({
    frame: Math.max(0, frame - B.NEXT_PREVIEW),
    fps,
    config: SPRING.smooth,
  });

  // 도입부 → 핵심부 전환: LINE_1 등장 시 도입부 fade out
  const introFade = frame >= B.LINE_1
    ? interpolate(frame, [B.LINE_1, B.LINE_1 + 20], [1, 0], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <Ep04SceneLayout pageTitle="오늘 한 건">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          width: "100%",
        }}
      >
        {/* 도입부 — 핵심 메시지 전에 나오는 텍스트들 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            opacity: introFade,
          }}
        >
          {/* "입에 붙어 있는 단어들" */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 700,
              color: palette.text,
              opacity: oldWordsIn,
              transform: `translateY(${interpolate(oldWordsIn, [0, 1], [10, 0])}px)`,
              textAlign: "center",
            }}
          >
            입에 붙어 있는 단어들
          </div>

          {/* "신뢰의 시작 → 마음을 닫는 신호" */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: trustIn,
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
              신뢰의 시작
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 700,
                color: "#E05A5A",
              }}
            >
              → 닫히는 신호
            </span>
          </div>

          {/* "옛날 단어 그대로 쓰고 있는 거" */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              opacity: stillIn * 0.8,
              textAlign: "center",
            }}
          >
            자연스럽다고 느끼지만, 옛날 단어
          </div>

          {/* "오늘 통화 한 건이라도" */}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 700,
              color: palette.accent,
              opacity: todayIn,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            오늘 통화 한 건이라도 좋아요
          </div>
        </div>

        {/* 핵심 메시지 */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 700,
            color: palette.text,
            opacity: line1In,
            transform: `translateY(${interpolate(line1In, [0, 1], [15, 0])}px)`,
            textAlign: "center",
          }}
        >
          단어 한두 개만 빼도
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 80,
            fontWeight: 900,
            color: palette.accent,
            opacity: line2In,
            transform: `scale(${interpolate(line2In, [0, 1], [0.9, 1])})`,
            textAlign: "center",
          }}
        >
          첫 1분의 공기가 달라집니다
        </div>

        {/* 다음편 예고 */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: previewIn * 0.7,
            transform: `translateY(${interpolate(previewIn, [0, 1], [10, 0])}px)`,
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
            다음 편 →
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 700,
              color: palette.text,
            }}
          >
            진짜 후킹 화법
          </span>
        </div>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.05 * line2In}
        size={500}
        x="50%"
        y="45%"
        delay={B.LINE_2}
      />
    </Ep04SceneLayout>
  );
};
