import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE_WIDE, FONT_FAMILY, PALETTES } from "../../constants";
import { CharacterReveal, GradientBackground } from "../../components";

const CARDS = [
  { emoji: "📋", title: "현황 파악", sub: "기존 보험 전체 정리" },
  { emoji: "🎯", title: "빈틈 발견", sub: "부족한 보장 영역 특정" },
  { emoji: "💡", title: "맞춤 제안", sub: "고객 상황에 맞는 솔루션" },
];

/**
 * 축1-4: 카드 나열
 * 보장분석 3가지 효과
 */
export const Axis1Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = PALETTES.coolBlue;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />

      {/* 헤드라인 */}
      <div
        style={{
          position: "absolute",
          top: SAFE_WIDE.top + 20,
          left: SAFE_WIDE.side,
          right: SAFE_WIDE.side,
          textAlign: "center",
        }}
      >
        <CharacterReveal
          text="보장분석 3가지 효과"
          delay={0}
          stagger={2}
          fontSize={64}
          fontWeight={900}
          color={palette.text}
        />
      </div>

      {/* 카드 3장 — 가로 배치 */}
      <div
        style={{
          position: "absolute",
          top: SAFE_WIDE.top + 160,
          bottom: SAFE_WIDE.bottom,
          left: SAFE_WIDE.side + 60,
          right: SAFE_WIDE.side + 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {CARDS.map((card, i) => {
          const cardDelay = 15 + i * 15;
          const cardIn = spring({
            frame: Math.max(0, frame - cardDelay),
            fps,
            config: SPRING.smooth,
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                maxWidth: 450,
                opacity: cardIn,
                transform: `translateY(${interpolate(cardIn, [0, 1], [30, 0])}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                padding: "40px 24px",
                borderRadius: 24,
                backgroundColor: palette.card,
                border: `2px solid ${palette.cardBorder}`,
              }}
            >
              <div style={{ fontSize: 80, lineHeight: 1 }}>{card.emoji}</div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 56,
                  fontWeight: 800,
                  color: palette.text,
                  textAlign: "center",
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 52,
                  fontWeight: 500,
                  color: palette.sub,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {card.sub}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
