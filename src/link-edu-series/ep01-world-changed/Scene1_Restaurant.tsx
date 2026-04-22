import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep01SceneLayout } from "./Ep01SceneLayout";
import { BEATS_RESTAURANT } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_RESTAURANT;

/**
 * 씬 1: 여의도 식당 — 쓸쓸함
 *
 * 🏢 빌딩 이모지 5~6개가 줄지어 있다가 하나씩 불이 꺼짐 (opacity dim).
 * "8시" 숫자가 크게. 마지막에 "회식이 사라졌어요" 키워드.
 */

const BUILDINGS = [
  { x: 12, emoji: "🏢" },
  { x: 28, emoji: "🏬" },
  { x: 44, emoji: "🏢" },
  { x: 60, emoji: "🏬" },
  { x: 76, emoji: "🏢" },
  { x: 92, emoji: "🏬" },
] as const;

export const Scene1_Restaurant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 빌딩 등장
  const buildingsIn = spring({
    frame: Math.max(0, frame - B.BUILDINGS_IN),
    fps,
    config: SPRING.smooth,
  });

  // "8시" 숫자
  const timeIn = spring({
    frame: Math.max(0, frame - B.TIME_NUMBER),
    fps,
    config: SPRING.bouncy,
  });

  // 불 꺼짐: 순차적으로 dim
  const lightsOffProgress = frame >= B.LIGHTS_OFF
    ? interpolate(
        frame,
        [B.LIGHTS_OFF, B.LIGHTS_OFF + 60],
        [0, 1],
        { extrapolateRight: "clamp" }
      )
    : 0;

  // 키워드 등장
  const keywordIn = spring({
    frame: Math.max(0, frame - B.KEYWORD_IN),
    fps,
    config: SPRING.smooth,
  });

  const keywordFull = spring({
    frame: Math.max(0, frame - B.KEYWORD_FULL),
    fps,
    config: SPRING.bouncy,
  });

  // 키워드 등장 시 윗부분 dim
  const preDim = frame >= B.KEYWORD_IN
    ? interpolate(frame, [B.KEYWORD_IN, B.KEYWORD_IN + 15], [1, 0.4], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <Ep01SceneLayout pageTitle="요즘 여의도">
      {/* 빌딩 줄 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 16,
          width: "100%",
          opacity: buildingsIn * preDim,
        }}
      >
        {BUILDINGS.map((b, i) => {
          // 순차적으로 불이 꺼짐
          const dimThreshold = i / BUILDINGS.length;
          const thisDim = lightsOffProgress > dimThreshold
            ? interpolate(
                lightsOffProgress,
                [dimThreshold, Math.min(dimThreshold + 0.2, 1)],
                [1, 0.2],
                { extrapolateRight: "clamp" }
              )
            : 1;

          return (
            <div
              key={i}
              style={{
                fontSize: 80,
                lineHeight: 1,
                opacity: thisDim,
                transform: `translateY(${interpolate(buildingsIn, [0, 1], [30, 0])}px)`,
                filter: thisDim < 0.5 ? "grayscale(0.8)" : "none",
                transition: "filter 0.3s",
              }}
            >
              {b.emoji}
            </div>
          );
        })}
      </div>

      {/* "8시" 숫자 */}
      <div
        style={{
          marginTop: 40,
          opacity: timeIn * preDim,
          transform: `scale(${interpolate(timeIn, [0, 1], [0.6, 1])})`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 120,
            fontWeight: 900,
            color: palette.accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          8시
        </span>
      </div>

      {/* 키워드 — "회식이 사라졌어요" */}
      <div
        style={{
          marginTop: 32,
          opacity: keywordIn,
          transform: `scale(${interpolate(keywordFull, [0, 1], [0.85, 1])})`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 800,
            color: palette.text,
          }}
        >
          회식이 사라졌어요
        </span>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={400}
        x="50%"
        y="40%"
        delay={B.TIME_NUMBER}
      />
    </Ep01SceneLayout>
  );
};
