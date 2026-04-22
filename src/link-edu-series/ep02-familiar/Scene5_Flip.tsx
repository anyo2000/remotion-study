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
import { BEATS_FLIP } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_FLIP;

/**
 * 씬 5: 순서를 바꾸다
 *
 * 왼쪽 "관계 → 전문성" dim, 🔄 중앙 회전, 오른쪽 "전문성 → 관계" accent 강조.
 * EP01 Scene8_Flip과 동일 구조, BEATS만 교체.
 */
export const Scene5_Flip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "순서를 바꾸기로" — 상단 타이틀
  const flipTextIn = spring({
    frame: Math.max(0, frame - B.FLIP_TEXT),
    fps,
    config: SPRING.smooth,
  });

  // OLD WAY 카드 등장
  const oldIn = spring({
    frame: Math.max(0, frame - B.OLD_WAY),
    fps,
    config: SPRING.smooth,
  });

  // 🔄 전환 순간
  const flipMoment = spring({
    frame: Math.max(0, frame - B.FLIP_MOMENT),
    fps,
    config: SPRING.bouncy,
  });

  // NEW WAY 카드 등장
  const newIn = spring({
    frame: Math.max(0, frame - B.NEW_WAY),
    fps,
    config: SPRING.smooth,
  });

  // "관계가 따라오게"
  const followIn = spring({
    frame: Math.max(0, frame - B.FOLLOW),
    fps,
    config: SPRING.smooth,
  });

  // "지금 시대에 맞는 답이에요"
  const answerIn = spring({
    frame: Math.max(0, frame - B.ANSWER),
    fps,
    config: SPRING.smooth,
  });

  // FLIP_MOMENT 이후 OLD WAY dim
  const oldDim =
    frame >= B.FLIP_MOMENT
      ? interpolate(frame, [B.FLIP_MOMENT, B.FLIP_MOMENT + 15], [1, 0.3], {
          extrapolateRight: "clamp",
        })
      : 1;

  // OLD_WAY 등장 시 상단 타이틀 dim
  const topDim =
    frame >= B.OLD_WAY
      ? interpolate(frame, [B.OLD_WAY, B.OLD_WAY + 15], [1, 0.5], {
          extrapolateRight: "clamp",
        })
      : 1;

  // 🔄 회전
  const flipRotation = interpolate(flipMoment, [0, 1], [0, 360]);

  return (
    <Ep02SceneLayout dense>
      {/* 상단: "순서를 바꾸기로" */}
      <div
        style={{
          opacity: flipTextIn * topDim,
          transform: `translateY(${interpolate(flipTextIn, [0, 1], [12, 0])}px)`,
          textAlign: "center",
          marginBottom: 36,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 800,
            color: palette.text,
          }}
        >
          순서를 바꾸자
        </span>
      </div>

      {/* 좌우 카드 + 중앙 🔄 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
          width: "100%",
        }}
      >
        {/* 왼쪽: OLD WAY — 관계 → 전문성 (dim) */}
        <div
          style={{
            width: 340,
            padding: "32px 24px",
            borderRadius: 20,
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: `2px solid rgba(255, 255, 255, 0.08)`,
            textAlign: "center",
            opacity: oldIn * oldDim,
            transform: `translateX(${interpolate(oldIn, [0, 1], [-20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 700,
              color: palette.sub,
              lineHeight: 1.6,
            }}
          >
            관계
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              color: palette.sub,
              margin: "8px 0",
            }}
          >
            ↓
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 700,
              color: palette.sub,
            }}
          >
            전문성
          </div>
        </div>

        {/* 중앙: 🔄 */}
        <div
          style={{
            fontSize: 80,
            lineHeight: 1,
            opacity: flipMoment,
            transform: `rotate(${flipRotation}deg)`,
          }}
        >
          🔄
        </div>

        {/* 오른쪽: NEW WAY — 전문성 → 관계 (accent) */}
        <div
          style={{
            width: 340,
            padding: "32px 24px",
            borderRadius: 20,
            backgroundColor: "rgba(232, 168, 56, 0.08)",
            border: `2px solid rgba(232, 168, 56, 0.25)`,
            textAlign: "center",
            opacity: newIn,
            transform: `translateX(${interpolate(newIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 800,
              color: palette.accent,
              lineHeight: 1.6,
            }}
          >
            전문성
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              color: palette.accent,
              margin: "8px 0",
            }}
          >
            ↓
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 800,
              color: palette.accent,
            }}
          >
            관계
          </div>
        </div>
      </div>

      {/* "관계가 따라오게" */}
      <div
        style={{
          marginTop: 28,
          opacity: followIn,
          transform: `translateY(${interpolate(followIn, [0, 1], [8, 0])}px)`,
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
          관계가 따라오게
        </span>
      </div>

      {/* "지금 시대에 맞는 답이에요" */}
      <div
        style={{
          marginTop: 16,
          opacity: answerIn,
          transform: `translateY(${interpolate(answerIn, [0, 1], [8, 0])}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 700,
            color: palette.accent,
          }}
        >
          지금 시대에 맞는 답이에요
        </span>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.05}
        size={400}
        x="65%"
        y="45%"
        delay={B.NEW_WAY}
      />
    </Ep02SceneLayout>
  );
};
