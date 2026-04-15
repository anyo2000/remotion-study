import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE_WIDE, FONT_FAMILY, PALETTES } from "../../constants";
import { CharacterReveal, GradientBackground, GlowOrb } from "../../components";

const palette = PALETTES.coolBlue;

/** 정돈 톤 비교 카드 */
const CleanCard: React.FC<{
  type: "wrong" | "right";
  label: string;
  text: string;
  icon: string;
  delay: number;
  dimmed?: boolean;
}> = ({ type, label, text, icon, delay, dimmed = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.heavy,
  });

  const isWrong = type === "wrong";
  const borderColor = isWrong ? "rgba(224, 90, 90, 0.3)" : "rgba(78, 205, 196, 0.3)";
  const iconColor = isWrong ? "#E05A5A" : "#4ECDC4";

  return (
    <div
      style={{
        flex: 1,
        opacity: cardIn * (dimmed ? 0.35 : 1),
        transform: `translateY(${interpolate(cardIn, [0, 1], [20, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* 라벨 */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 52,
          fontWeight: 700,
          color: iconColor,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>

      {/* 카드 — 정돈 톤: 얇은 border, 깔끔한 구조 */}
      <div
        style={{
          width: "100%",
          padding: "48px 40px",
          borderRadius: 16,
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: `1.5px solid ${borderColor}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* SVG 아이콘 영역 */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: `${iconColor}15`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 900,
            color: iconColor,
          }}
        >
          {icon}
        </div>

        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.text,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {text}
        </span>

        {/* 구분선 + 서브텍스트 */}
        <div
          style={{
            width: "60%",
            height: 1,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          }}
        />
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 500,
            color: palette.sub,
            textAlign: "center",
          }}
        >
          {isWrong ? "고객이 벽을 세움" : "고객이 스스로 발견"}
        </span>
      </div>
    </div>
  );
};

/**
 * 축3-1: 정돈 톤 비교
 * 컨테이너 + 얇은 border + 아이콘 + 텍스트 위계
 */
export const ToneCleanComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const highlightStart = Math.floor(durationInFrames * 0.6);
  const isHighlighted = frame >= highlightStart;

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
          text="정돈 톤 — 비교"
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
          top: SAFE_WIDE.top + 150,
          bottom: SAFE_WIDE.bottom,
          left: SAFE_WIDE.side + 60,
          right: SAFE_WIDE.side + 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <CleanCard
          type="wrong"
          label="BEFORE"
          text="설명부터 시작"
          icon="✕"
          delay={10}
          dimmed={isHighlighted}
        />
        <CleanCard
          type="right"
          label="AFTER"
          text="보장분석부터 시작"
          icon="✓"
          delay={30}
        />
      </div>
    </AbsoluteFill>
  );
};

/** 가벼운 톤 비교 카드 */
const PlayfulCard: React.FC<{
  type: "wrong" | "right";
  emoji: string;
  text: string;
  delay: number;
  dimmed?: boolean;
}> = ({ type, emoji, text, delay, dimmed = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.bouncy,
  });

  const isWrong = type === "wrong";
  const bgColor = isWrong
    ? "rgba(224, 90, 90, 0.12)"
    : "rgba(78, 205, 196, 0.12)";
  const borderColor = isWrong ? "#E05A5A" : "#4ECDC4";

  return (
    <div
      style={{
        flex: 1,
        opacity: cardIn * (dimmed ? 0.35 : 1),
        transform: `scale(${interpolate(cardIn, [0, 1], [0.7, 1])}) translateY(${interpolate(cardIn, [0, 1], [30, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "48px 32px",
          borderRadius: 32,
          backgroundColor: bgColor,
          border: `4px solid ${borderColor}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* 큰 이모지 */}
        <div style={{ fontSize: 100, lineHeight: 1 }}>{emoji}</div>

        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 60,
            fontWeight: 800,
            color: palette.text,
            textAlign: "center",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/**
 * 축3-2: 가벼운 톤 비교
 * 큰 이모지 + 컬러풀 배경 + 통통 spring + 둥근 모서리
 */
export const TonePlayfulComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const highlightStart = Math.floor(durationInFrames * 0.6);
  const isHighlighted = frame >= highlightStart;

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
          text="가벼운 톤 — 비교"
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
          top: SAFE_WIDE.top + 150,
          bottom: SAFE_WIDE.bottom,
          left: SAFE_WIDE.side + 60,
          right: SAFE_WIDE.side + 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <PlayfulCard
          type="wrong"
          emoji="😵"
          text="설명부터 시작"
          delay={10}
          dimmed={isHighlighted}
        />
        <PlayfulCard
          type="right"
          emoji="🎯"
          text="보장분석부터 시작"
          delay={25}
        />
      </div>
    </AbsoluteFill>
  );
};
