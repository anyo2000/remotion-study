import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY } from "../../constants";
import type { Palette } from "../../constants";
import type { AudioSync } from "../types";

type Props = AudioSync & {
  palette: Palette;
  durationInFrames?: number;
};

/**
 * Scene 7B: 드라마 끊기면 → 다음 편 보는 것과 같아요
 * 텍스트 없음 — 그림으로만 표현
 *
 * 시퀀스:
 * 0~30fr: 📺 TV 등장
 * 30~60fr: TV 화면 노이즈/깨짐
 * 60~90fr: 🧑 사람 + ❓ 머리 위
 * 90~끝: ▶️ 재생버튼 pulse
 */
export const VisualStoryScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // BEATS
  const BEATS = {
    TV_IN: 0,
    STATIC_START: 30,
    PERSON_IN: 55,
    QUESTION_IN: 65,
    PLAY_IN: 85,
  };

  // TV 등장
  const tvIn = spring({
    frame: Math.max(0, frame - BEATS.TV_IN),
    fps,
    config: SPRING.smooth,
  });

  // TV 정적(노이즈) — 프레임 기반 랜덤
  const isStatic = frame >= BEATS.STATIC_START && frame < BEATS.PERSON_IN + 20;
  const staticBars = isStatic
    ? Array.from({ length: 8 }, (_, i) => ({
        y: ((frame * 7 + i * 37) % 280) + 10,
        w: 40 + ((frame * 13 + i * 53) % 200),
        opacity: 0.15 + ((frame * 3 + i * 11) % 30) / 100,
      }))
    : [];

  // TV 화면 흔들림
  const tvShake =
    isStatic
      ? Math.sin(frame * 8) * 3 * Math.min(1, (frame - BEATS.STATIC_START) / 10)
      : 0;

  // 사람 등장
  const personIn = spring({
    frame: Math.max(0, frame - BEATS.PERSON_IN),
    fps,
    config: SPRING.smooth,
  });

  // ❓ float up
  const questionIn = spring({
    frame: Math.max(0, frame - BEATS.QUESTION_IN),
    fps,
    config: SPRING.bouncy,
  });
  const questionFloat =
    frame >= BEATS.QUESTION_IN
      ? Math.sin((frame - BEATS.QUESTION_IN) * 0.12) * 8
      : 0;

  // ▶️ 등장 + pulse
  const playIn = spring({
    frame: Math.max(0, frame - BEATS.PLAY_IN),
    fps,
    config: SPRING.bouncy,
  });
  const playPulse =
    frame >= BEATS.PLAY_IN
      ? 1 + 0.08 * Math.sin((frame - BEATS.PLAY_IN) * 0.2)
      : 1;

  // ❓ 사라짐 (▶️ 등장 후)
  const questionFade =
    frame >= BEATS.PLAY_IN
      ? interpolate(frame, [BEATS.PLAY_IN, BEATS.PLAY_IN + 15], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <AbsoluteFill>
      {/* TV 본체 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "35%",
          transform: `translate(-50%, -50%) scale(${tvIn}) translateX(${tvShake}px)`,
          opacity: tvIn,
        }}
      >
        {/* TV 화면 */}
        <div
          style={{
            width: 500,
            height: 300,
            borderRadius: 24,
            backgroundColor: "#1a2340",
            border: `4px solid ${palette.sub}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 정적 노이즈 바 */}
          {staticBars.map((bar, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: bar.y,
                width: bar.w,
                height: 3,
                backgroundColor: palette.text,
                opacity: bar.opacity,
              }}
            />
          ))}

          {/* ▶️ 재생버튼 — TV 화면 안 */}
          {frame >= BEATS.PLAY_IN && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${playIn * playPulse})`,
                fontSize: 100,
                opacity: playIn,
              }}
            >
              ▶️
            </div>
          )}
        </div>

        {/* TV 받침대 */}
        <div
          style={{
            width: 80,
            height: 30,
            backgroundColor: palette.sub,
            borderRadius: "0 0 12px 12px",
            margin: "0 auto",
          }}
        />
      </div>

      {/* 포인트 텍스트 — TV 아래 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: "56%",
          textAlign: "center",
        }}
      >
        {/* "끊기면?" — TV 노이즈와 동시 */}
        {frame >= BEATS.STATIC_START && (
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 800,
              color: palette.accent,
              opacity: interpolate(
                frame,
                [BEATS.STATIC_START, BEATS.STATIC_START + 10],
                [0, 1],
                { extrapolateRight: "clamp" }
              ),
            }}
          >
            끊기면?
          </span>
        )}

        {/* "다음 편 →" — ▶️와 동시 */}
        {frame >= BEATS.PLAY_IN && (
          <div style={{ marginTop: 20 }}>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 60,
                fontWeight: 700,
                color: palette.text,
                opacity: playIn,
              }}
            >
              다음 편 →
            </span>
          </div>
        )}
      </div>

      {/* 🧑 사람 — TV 오른쪽 */}
      <div
        style={{
          position: "absolute",
          left: "62%",
          top: "68%",
          opacity: personIn,
          transform: `translateY(${interpolate(personIn, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 120 }}>🧑</div>

        {/* ❓ 머리 위 */}
        <div
          style={{
            position: "absolute",
            top: -70,
            left: "50%",
            transform: `translate(-50%, ${-questionFloat}px)`,
            fontSize: 70,
            opacity: questionIn * questionFade,
          }}
        >
          ❓
        </div>
      </div>
    </AbsoluteFill>
  );
};
