import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GlowOrb } from "../components";
import { SceneLayout } from "./SceneLayout";
import { BEATS_COMPARISON } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_COMPARISON;

/**
 * 장면 8: [비교] — 홈쇼핑 스플릿스크린
 * 오디오: "홈쇼핑도 마찬가지예요" → BEFORE/AFTER 순차 공개
 */
export const SampleScene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitProgress = spring({
    frame: Math.max(0, frame - B.CARDS_IN),
    fps,
    config: SPRING.heavy,
  });

  const leftIn = spring({
    frame: Math.max(0, frame - B.BEFORE_TEXT),
    fps,
    config: SPRING.smooth,
  });

  const leftResultIn = spring({
    frame: Math.max(0, frame - B.BEFORE_RESULT),
    fps,
    config: SPRING.smooth,
  });

  const rightIn = spring({
    frame: Math.max(0, frame - B.AFTER_TEXT),
    fps,
    config: SPRING.smooth,
  });

  const rightResultIn = spring({
    frame: Math.max(0, frame - B.AFTER_RESULT),
    fps,
    config: SPRING.smooth,
  });

  const isHighlighted = frame >= B.HIGHLIGHT;
  const highlightProgress = isHighlighted
    ? spring({
        frame: Math.max(0, frame - B.HIGHLIGHT),
        fps,
        config: SPRING.smooth,
      })
    : 0;

  const leftDim = isHighlighted
    ? interpolate(highlightProgress, [0, 1], [1, 0.3])
    : 1;

  return (
    <SceneLayout pageTitle="채널 돌림 vs 손이 멈춤">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 왼쪽 — 설명형 (실패) */}
        <div
          style={{
            width: 560,
            height: 440,
            borderRadius: 24,
            backgroundColor: "rgba(224, 90, 90, 0.08)",
            border: "2px solid rgba(224, 90, 90, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            padding: "40px 36px",
            opacity: splitProgress * leftDim,
            transform: `translateX(${interpolate(splitProgress, [0, 1], [-30, 0])}px)`,
          }}
        >
          <div style={{ fontSize: 90, lineHeight: 1, opacity: leftIn }}>📺</div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 700,
              color: palette.text,
              textAlign: "center",
              opacity: leftIn,
              lineHeight: 1.5,
            }}
          >
            "여행 상품{"\n"}소개해드릴게요"
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: "#E05A5A",
              opacity: leftResultIn,
            }}
          >
            👋 채널 돌림
          </div>
        </div>

        {/* 오른쪽 — 질문형 (성공) */}
        <div
          style={{
            width: 560,
            height: 440,
            borderRadius: 24,
            backgroundColor: isHighlighted
              ? "rgba(78, 205, 196, 0.10)"
              : "rgba(78, 205, 196, 0.05)",
            border: `2px solid rgba(78, 205, 196, ${isHighlighted ? 0.45 : 0.2})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            padding: "40px 36px",
            opacity: splitProgress,
            transform: `translateX(${interpolate(splitProgress, [0, 1], [30, 0])}px)`,
            position: "relative",
          }}
        >
          {isHighlighted && (
            <GlowOrb
              color="#4ECDC4"
              opacity={0.06 * highlightProgress}
              size={350}
              x="50%"
              y="50%"
              delay={B.HIGHLIGHT}
            />
          )}
          <div style={{ fontSize: 90, lineHeight: 1, opacity: rightIn }}>❓</div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 700,
              color: palette.text,
              textAlign: "center",
              opacity: rightIn,
              lineHeight: 1.5,
            }}
          >
            "참기름은 바로 짠 게{"\n"}맛있을까요?"
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: "#4ECDC4",
              opacity: rightResultIn,
            }}
          >
            ✋ 손이 멈춤
          </div>
        </div>
      </div>
    </SceneLayout>
  );
};
