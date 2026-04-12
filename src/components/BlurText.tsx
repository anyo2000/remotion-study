import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRING, FONT_FAMILY } from "../constants";

type Props = {
  /** 표시할 텍스트 (줄바꿈은 \n) */
  text: string;
  /** 등장 시작 프레임 */
  delay?: number;
  /** 단어 간 stagger (프레임) */
  stagger?: number;
  /** 강조할 단어 목록 */
  accentWords?: string[];
  /** 강조 색상 */
  accentColor?: string;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  /** 텍스트 정렬 */
  textAlign?: "left" | "center" | "right";
  style?: React.CSSProperties;
};

export const BlurText: React.FC<Props> = ({
  text,
  delay = 0,
  stagger = 4,
  accentWords = [],
  accentColor = "#FF8C38",
  fontSize = 72,
  fontWeight = 700,
  color = "#F0F0F0",
  textAlign = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = text.split("\n");
  let wordIndex = 0;

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        lineHeight: 1.5,
        textAlign,
        ...style,
      }}
    >
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <div key={li} style={{ marginBottom: li < lines.length - 1 ? 8 : 0 }}>
            {words.map((word, wi) => {
              const currentIndex = wordIndex++;
              const wordDelay = delay + currentIndex * stagger;

              const progress = spring({
                frame: Math.max(0, frame - wordDelay),
                fps,
                config: SPRING.smooth,
              });

              const blurVal = interpolate(progress, [0, 1], [12, 0]);
              const translateY = interpolate(progress, [0, 1], [15, 0]);
              const isAccent = accentWords.some(
                (aw) => word.replace(/[.,!?]/g, "") === aw
              );

              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    opacity: progress,
                    transform: `translateY(${translateY}px)`,
                    filter: blurVal > 0.2 ? `blur(${blurVal}px)` : "none",
                    color: isAccent ? accentColor : color,
                    marginRight: wi < words.length - 1 ? "0.3em" : 0,
                    whiteSpace: "pre",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
