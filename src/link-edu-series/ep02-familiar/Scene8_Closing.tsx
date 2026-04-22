import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep02SceneLayout } from "./Ep02SceneLayout";
import { BEATS_CLOSING } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_CLOSING;

const LETTERS = ["L", "I", "N", "K"] as const;
const LETTER_BEATS = [B.L, B.I, B.N, B.K] as const;

/**
 * 씬 8: 클로징
 *
 * "가능할까요?" → "가능해요." 전환
 * → "L·I·N·K" 글자 하나씩 stamp 등장
 * pageTitle 없음 (클로징)
 */
export const Scene8_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "이게 가능할까요?"
  const questionIn = spring({
    frame: Math.max(0, frame - B.QUESTION),
    fps,
    config: SPRING.smooth,
  });

  // "가능해요." — 반전
  const possibleIn = spring({
    frame: Math.max(0, frame - B.POSSIBLE),
    fps,
    config: SPRING.bouncy,
  });

  // "방법이 있으니까요"
  const methodIn = spring({
    frame: Math.max(0, frame - B.METHOD),
    fps,
    config: SPRING.smooth,
  });

  // "가능할까요?" — POSSIBLE 이후 dim
  const questionDim =
    frame >= B.POSSIBLE
      ? interpolate(frame, [B.POSSIBLE, B.POSSIBLE + 12], [1, 0.25], {
          extrapolateRight: "clamp",
        })
      : 1;

  // 각 글자 spring
  const letterSprings = LETTER_BEATS.map((beat) =>
    spring({
      frame: Math.max(0, frame - beat),
      fps,
      config: SPRING.bouncy,
    })
  );

  // 구분선 — POSSIBLE 직후
  const lineIn = spring({
    frame: Math.max(0, frame - B.POSSIBLE + 5),
    fps,
    config: SPRING.heavy,
  });
  const lineWidth = interpolate(lineIn, [0, 1], [0, 200]);

  return (
    <Ep02SceneLayout hideHeader>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlowOrb
          color={palette.accent}
          opacity={0.07}
          size={700}
          x="50%"
          y="45%"
          delay={B.POSSIBLE}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {/* "이게 가능할까요?" */}
          <div
            style={{
              opacity: questionIn * questionDim,
              transform: `translateY(${interpolate(questionIn, [0, 1], [12, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 68,
                fontWeight: 700,
                color: palette.sub,
              }}
            >
              이게 가능할까요?
            </span>
          </div>

          {/* "가능해요." — accent */}
          <div
            style={{
              opacity: possibleIn,
              transform: `translateY(${interpolate(possibleIn, [0, 1], [16, 0])}px) scale(${interpolate(possibleIn, [0, 1], [0.85, 1])})`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 96,
                fontWeight: 900,
                color: palette.accent,
              }}
            >
              가능해요.
            </span>
          </div>

          {/* "방법이 있으니까요" */}
          <div
            style={{
              opacity: methodIn * 0.75,
              transform: `translateY(${interpolate(methodIn, [0, 1], [8, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
              }}
            >
              방법이 있으니까요
            </span>
          </div>

          {/* 구분선 */}
          <div
            style={{
              width: lineWidth,
              height: 3,
              backgroundColor: palette.accent,
              borderRadius: 2,
              margin: "8px 0",
            }}
          />

          {/* L·I·N·K stamp 등장 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {LETTERS.map((letter, i) => (
              <div
                key={letter}
                style={{
                  opacity: letterSprings[i],
                  transform: `
                    scale(${interpolate(letterSprings[i], [0, 0.6, 1], [1.6, 0.85, 1])})
                    translateY(${interpolate(letterSprings[i], [0, 1], [-8, 0])}px)
                  `,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 120,
                    fontWeight: 900,
                    color: palette.accent,
                    letterSpacing: 0,
                    lineHeight: 1,
                    filter: `drop-shadow(0 0 20px ${palette.accent}66)`,
                  }}
                >
                  {letter}
                </span>
              </div>
            ))}
          </div>

          {/* 하단 브랜드 */}
          <div
            style={{
              opacity: letterSprings[3] * 0.6,
              transform: `translateY(${interpolate(letterSprings[3], [0, 1], [8, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
                letterSpacing: 2,
              }}
            >
              LINK Consulting
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Ep02SceneLayout>
  );
};
