import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep02SceneLayout } from "./Ep02SceneLayout";
import { BEATS_SFP_REALITY } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_SFP_REALITY;

/**
 * 씬 2: SFP의 현실
 *
 * "친해질 시간" ❌ → "선물" ❌ → "인사" ❌ 순차 등장
 * 마지막에 "SFP만의 얘기?" 질문
 */

type ItemProps = {
  emoji: string;
  label: string;
  opacity: number;
  translateY: number;
};

const DeniedItem: React.FC<ItemProps> = ({ emoji, label, opacity, translateY }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 28,
      opacity,
      transform: `translateY(${translateY}px)`,
    }}
  >
    {/* 아이콘 박스 */}
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        border: "1.5px solid rgba(255, 255, 255, 0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 52,
        flexShrink: 0,
      }}
    >
      {emoji}
    </div>

    {/* 라벨 + ❌ */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        flex: 1,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 64,
          fontWeight: 700,
          color: palette.sub,
          textDecoration: "line-through",
          textDecorationColor: "rgba(232, 168, 56, 0.6)",
          textDecorationThickness: 3,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 52,
          lineHeight: 1,
        }}
      >
        ❌
      </span>
    </div>
  </div>
);

export const Scene2_SfpReality: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "친해질 시간" ❌ 등장 (NO_TIME)
  const item1In = spring({
    frame: Math.max(0, frame - B.NO_TIME),
    fps,
    config: SPRING.smooth,
  });

  // "선물" ❌ 등장 (NO_GIFT)
  const item2In = spring({
    frame: Math.max(0, frame - B.NO_GIFT),
    fps,
    config: SPRING.smooth,
  });

  // "인사" ❌ 등장 (NO_GREET)
  const item3In = spring({
    frame: Math.max(0, frame - B.NO_GREET),
    fps,
    config: SPRING.smooth,
  });

  // "SFP만의 얘기일까요?" 질문 등장
  const questionIn = spring({
    frame: Math.max(0, frame - B.QUESTION),
    fps,
    config: SPRING.smooth,
  });

  return (
    <Ep02SceneLayout pageTitle="SFP가 매일 겪는 현실">
      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={600}
        x="50%"
        y="50%"
        delay={B.NO_TIME}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 36,
          width: "100%",
          maxWidth: 860,
        }}
      >
        {/* 항목 1: 친해질 시간 */}
        <DeniedItem
          emoji="🤝"
          label="친해질 시간"
          opacity={item1In}
          translateY={interpolate(item1In, [0, 1], [24, 0])}
        />

        {/* 항목 2: 선물 */}
        <DeniedItem
          emoji="🎁"
          label="선물 들고 갈 기회"
          opacity={item2In}
          translateY={interpolate(item2In, [0, 1], [24, 0])}
        />

        {/* 항목 3: 인사 */}
        <DeniedItem
          emoji="👋"
          label="인사할 기회"
          opacity={item3In}
          translateY={interpolate(item3In, [0, 1], [24, 0])}
        />

        {/* 구분선 */}
        <div
          style={{
            width: interpolate(questionIn, [0, 1], [0, 860]),
            height: 1,
            backgroundColor: palette.cardBorder,
            marginTop: 8,
          }}
        />

        {/* 하단 질문 */}
        <div
          style={{
            opacity: questionIn,
            transform: `translateY(${interpolate(questionIn, [0, 1], [16, 0])}px)`,
            width: "100%",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 68,
              fontWeight: 800,
              color: palette.accent,
            }}
          >
            이게 SFP만의 얘기일까요?
          </span>
        </div>
      </div>
    </Ep02SceneLayout>
  );
};
