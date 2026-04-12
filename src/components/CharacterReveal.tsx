import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY } from "../constants";

type Props = {
  /** 표시할 텍스트 (\n으로 줄바꿈) */
  text: string;
  /** 등장 시작 프레임 */
  delay?: number;
  /** 글자 간 stagger (프레임) */
  stagger?: number;
  /** 스프링 설정 */
  springConfig?: Record<string, number>;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  /** 그라디언트 텍스트 (두 색상) */
  gradient?: [string, string];
  /** blur 효과 포함 여부 */
  blur?: boolean;
  /** lineHeight (기본 1.3) */
  lineHeight?: number;
  style?: React.CSSProperties;
};

export const CharacterReveal: React.FC<Props> = ({
  text,
  delay = 0,
  stagger = 2,
  springConfig = SPRING.letter,
  fontSize = 100,
  fontWeight = 900,
  color = "#F0F0F0",
  gradient,
  blur = true,
  lineHeight = 1.3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // \n 기준으로 줄 분리 → 줄 내에서 글자 분리
  const lines = text.split("\n");
  let globalIndex = 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        lineHeight,
        ...style,
      }}
    >
      {lines.map((line, li) => {
        const chars = line.split("");
        const lineElement = (
          <div
            key={li}
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {chars.map((char, ci) => {
              const charIndex = globalIndex++;
              const charDelay = delay + charIndex * stagger;
              const progress = spring({
                frame: Math.max(0, frame - charDelay),
                fps,
                config: springConfig,
              });

              const translateY = interpolate(progress, [0, 1], [20, 0]);
              const blurVal = blur
                ? interpolate(progress, [0, 1], [8, 0])
                : 0;

              const charStyle: React.CSSProperties = {
                display: "inline-block",
                opacity: progress,
                transform: `translateY(${translateY}px)`,
                filter: blurVal > 0.1 ? `blur(${blurVal}px)` : "none",
                color: gradient ? undefined : color,
                ...(gradient && {
                  background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  padding: "0.15em 0",
                }),
                whiteSpace: char === " " ? "pre" : undefined,
              };

              return (
                <span key={ci} style={charStyle}>
                  {char}
                </span>
              );
            })}
          </div>
        );
        // 줄바꿈 문자도 globalIndex에 포함 (stagger 타이밍 일관성)
        if (li < lines.length - 1) globalIndex++;
        return lineElement;
      })}
    </div>
  );
};
