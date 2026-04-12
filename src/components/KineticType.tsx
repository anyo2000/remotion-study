import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from "remotion";
import { SPRING, FONT_FAMILY } from "../constants";

type WordConfig = {
  text: string;
  x?: number;
  y?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number | string;
  rotate?: number;
};

type Props = {
  /** 단어별 설정 배열 */
  words: WordConfig[];
  /** 등장 시작 프레임 */
  delay?: number;
  /** 단어 간 stagger (프레임) */
  stagger?: number;
  /** noise 흔들림 강도 (px, 0이면 끔) */
  noiseIntensity?: number;
  /** 기본 폰트 크기 */
  fontSize?: number;
  /** 기본 색상 */
  color?: string;
  style?: React.CSSProperties;
};

export const KineticType: React.FC<Props> = ({
  words,
  delay = 0,
  stagger = 5,
  noiseIntensity = 3,
  fontSize = 100,
  color = "#F0F0F0",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: FONT_FAMILY,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * stagger;
        const progress = spring({
          frame: Math.max(0, frame - wordDelay),
          fps,
          config: SPRING.bouncy,
        });

        // noise2D 대신 sin/cos + random seed로 유기적 흔들림
        const noiseX =
          noiseIntensity > 0
            ? Math.sin(frame * 0.05 + random(`nx-${i}`) * 100) *
              noiseIntensity
            : 0;
        const noiseY =
          noiseIntensity > 0
            ? Math.cos(frame * 0.04 + random(`ny-${i}`) * 100) *
              noiseIntensity
            : 0;

        const translateY = interpolate(progress, [0, 1], [40, 0]);
        const scale = interpolate(progress, [0, 1], [0.8, 1]);

        return (
          <div
            key={i}
            style={{
              position: word.x !== undefined ? "absolute" : "relative",
              left: word.x,
              top: word.y,
              fontSize: word.fontSize ?? fontSize,
              fontWeight: word.fontWeight ?? 900,
              color: word.color ?? color,
              opacity: progress,
              transform: [
                `translateX(${noiseX}px)`,
                `translateY(${translateY + noiseY}px)`,
                `scale(${scale})`,
                word.rotate ? `rotate(${word.rotate}deg)` : "",
              ].join(" "),
              whiteSpace: "nowrap",
            }}
          >
            {word.text}
          </div>
        );
      })}
    </div>
  );
};
