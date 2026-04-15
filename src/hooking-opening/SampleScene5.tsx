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

const palette = PALETTES.orange;

/**
 * 장면 5: [비교] — 드라마/홈쇼핑 스플릿스크린
 * 카드 크기 줄이고 여유 확보
 */
export const SampleScene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const splitStart = 8;
  const leftContentStart = 18;
  const rightContentStart = 45;
  const highlightStart = Math.floor(durationInFrames * 0.6);

  const splitProgress = spring({
    frame: Math.max(0, frame - splitStart),
    fps,
    config: SPRING.heavy,
  });

  const leftIn = spring({
    frame: Math.max(0, frame - leftContentStart),
    fps,
    config: SPRING.smooth,
  });

  const rightIn = spring({
    frame: Math.max(0, frame - rightContentStart),
    fps,
    config: SPRING.smooth,
  });

  const isHighlighted = frame >= highlightStart;
  const highlightProgress = isHighlighted
    ? spring({
        frame: Math.max(0, frame - highlightStart),
        fps,
        config: SPRING.smooth,
      })
    : 0;

  const leftDim = isHighlighted
    ? interpolate(highlightProgress, [0, 1], [1, 0.3])
    : 1;

  return (
    <SceneLayout pageTitle="채널 돌림 vs 손이 멈춤">
      {/* 콘텐츠 영역 — 중앙 정렬, 카드 크기 제한 */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          padding: "20px 0",
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
              opacity: leftIn,
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
              delay={highlightStart}
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
              opacity: rightIn,
            }}
          >
            ✋ 손이 멈춤
          </div>
        </div>
      </div>
    </SceneLayout>
  );
};
