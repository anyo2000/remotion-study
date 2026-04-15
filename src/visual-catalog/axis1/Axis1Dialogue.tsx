import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE_WIDE, PALETTES } from "../../constants";
import { CharacterReveal, SpeechBubble, GradientBackground } from "../../components";

/**
 * 축1-6: 대화 UI
 * 고객-FP 대화 말풍선
 */
export const Axis1Dialogue: React.FC = () => {
  const palette = PALETTES.coolBlue;

  const exchanges = [
    { speaker: "customer" as const, text: "보험 충분히 있는데요", emoji: "🤔", delay: 5 },
    { speaker: "fp" as const, text: "한번 같이 살펴볼까요?", emoji: "😊", delay: 40 },
    { speaker: "customer" as const, text: "어... 여기 빈틈이 있네요?", emoji: "😮", delay: 75 },
  ];

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
          text="보장분석 대화 예시"
          delay={0}
          stagger={2}
          fontSize={64}
          fontWeight={900}
          color={palette.text}
        />
      </div>

      {/* 대화 영역 */}
      <div
        style={{
          position: "absolute",
          top: SAFE_WIDE.top + 160,
          bottom: SAFE_WIDE.bottom + 40,
          left: SAFE_WIDE.side + 100,
          right: SAFE_WIDE.side + 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {exchanges.map((ex) => (
          <SpeechBubble
            key={`${ex.speaker}-${ex.delay}`}
            speaker={ex.speaker}
            text={ex.text}
            emoji={ex.emoji}
            delay={ex.delay}
            palette={palette}
            useTypewriter
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
