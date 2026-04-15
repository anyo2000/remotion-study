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

const palette = PALETTES.coolBlue;

const ITEMS = [
  { num: "01", emoji: "📋", title: "현황 파악", sub: "기존 보험 전체 정리" },
  { num: "02", emoji: "🎯", title: "빈틈 발견", sub: "부족한 보장 영역 특정" },
  { num: "03", emoji: "💡", title: "맞춤 제안", sub: "고객 상황에 맞는 솔루션" },
];

/**
 * 축3-3: 정돈 톤 카드 나열
 * 번호 + 구분선 + 절제된 텍스트
 */
export const ToneCleanCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />

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
          text="정돈 톤 — 카드 나열"
          delay={0}
          stagger={2}
          fontSize={64}
          fontWeight={900}
          color={palette.text}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: SAFE_WIDE.top + 160,
          bottom: SAFE_WIDE.bottom,
          left: SAFE_WIDE.side + 80,
          right: SAFE_WIDE.side + 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {ITEMS.map((item, i) => {
          const cardDelay = 15 + i * 18;
          const cardIn = spring({
            frame: Math.max(0, frame - cardDelay),
            fps,
            config: SPRING.heavy,
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                maxWidth: 420,
                opacity: cardIn,
                transform: `translateY(${interpolate(cardIn, [0, 1], [15, 0])}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                padding: "40px 28px",
                borderRadius: 16,
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              {/* 번호 */}
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 52,
                  fontWeight: 900,
                  color: palette.accent,
                  letterSpacing: 2,
                }}
              >
                {item.num}
              </span>

              {/* 구분선 */}
              <div
                style={{
                  width: 40,
                  height: 2,
                  backgroundColor: palette.accent,
                  opacity: 0.4,
                  borderRadius: 1,
                }}
              />

              {/* 타이틀 */}
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 56,
                  fontWeight: 700,
                  color: palette.text,
                  textAlign: "center",
                }}
              >
                {item.title}
              </span>

              {/* 설명 */}
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
                {item.sub}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 축3-4: 가벼운 톤 카드 나열
 * 큰 이모지 + 컬러 카드 + 바운스 등장
 */
export const TonePlayfulCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardColors = [
    "rgba(91, 155, 213, 0.12)",
    "rgba(78, 205, 196, 0.12)",
    "rgba(255, 140, 56, 0.12)",
  ];
  const borderColors = [
    "rgba(91, 155, 213, 0.4)",
    "rgba(78, 205, 196, 0.4)",
    "rgba(255, 140, 56, 0.4)",
  ];

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />

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
          text="가벼운 톤 — 카드 나열"
          delay={0}
          stagger={2}
          fontSize={64}
          fontWeight={900}
          color={palette.text}
        />
      </div>

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
        {ITEMS.map((item, i) => {
          const cardDelay = 12 + i * 12;
          const cardIn = spring({
            frame: Math.max(0, frame - cardDelay),
            fps,
            config: SPRING.bouncy,
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                maxWidth: 450,
                opacity: cardIn,
                transform: `scale(${interpolate(cardIn, [0, 1], [0.6, 1])})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                padding: "40px 24px",
                borderRadius: 32,
                backgroundColor: cardColors[i],
                border: `3px solid ${borderColors[i]}`,
              }}
            >
              {/* 큰 이모지 */}
              <div style={{ fontSize: 100, lineHeight: 1 }}>{item.emoji}</div>

              {/* 타이틀 */}
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 60,
                  fontWeight: 800,
                  color: palette.text,
                  textAlign: "center",
                }}
              >
                {item.title}
              </span>

              {/* 설명 */}
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 52,
                  fontWeight: 500,
                  color: palette.sub,
                  textAlign: "center",
                }}
              >
                {item.sub}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
