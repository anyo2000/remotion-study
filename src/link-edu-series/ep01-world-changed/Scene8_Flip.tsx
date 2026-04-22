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
import { BEATS_FLIP } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_FLIP;

/**
 * 씬 8: 순서를 뒤집는다 — 전환, 희망
 *
 * 좌우 2단계. 왼쪽 "친해지고 → 전문성" (dim).
 * 오른쪽 "전문성 → 관계" (accent 강조).
 * 중앙에 🔄 flip 애니메이션.
 */
export const Scene8_Flip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "접근을 뒤집어야 돼요"
  const flipTextIn = spring({
    frame: Math.max(0, frame - B.FLIP_TEXT),
    fps,
    config: SPRING.smooth,
  });

  // OLD WAY
  const oldIn = spring({
    frame: Math.max(0, frame - B.OLD_WAY),
    fps,
    config: SPRING.smooth,
  });

  // FLIP MOMENT (🔄 회전)
  const flipMoment = spring({
    frame: Math.max(0, frame - B.FLIP_MOMENT),
    fps,
    config: SPRING.bouncy,
  });

  // NEW WAY
  const newIn = spring({
    frame: Math.max(0, frame - B.NEW_WAY),
    fps,
    config: SPRING.smooth,
  });

  // "관계는 그 다음에"
  const followIn = spring({
    frame: Math.max(0, frame - B.FOLLOW),
    fps,
    config: SPRING.smooth,
  });

  // OLD WAY dim when new appears
  const oldDim = frame >= B.FLIP_MOMENT
    ? interpolate(frame, [B.FLIP_MOMENT, B.FLIP_MOMENT + 15], [1, 0.3], {
        extrapolateRight: "clamp",
      })
    : 1;

  // flip text dim when cards appear
  const topDim = frame >= B.OLD_WAY
    ? interpolate(frame, [B.OLD_WAY, B.OLD_WAY + 15], [1, 0.5], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 🔄 rotation
  const flipRotation = interpolate(flipMoment, [0, 1], [0, 360]);

  return (
    <Ep01SceneLayout pageTitle="접근을 뒤집다" dense>
      {/* "접근을 뒤집어야 돼요" */}
      <div
        style={{
          opacity: flipTextIn * topDim,
          transform: `translateY(${interpolate(flipTextIn, [0, 1], [12, 0])}px)`,
          textAlign: "center",
          marginBottom: 32,
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
          접근을 뒤집어야 돼요
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
        {/* 왼쪽: OLD WAY */}
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
            친해지고
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

        {/* 오른쪽: NEW WAY */}
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

      {/* "관계는 그 다음에 따라오게" */}
      <div
        style={{
          marginTop: 32,
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
          관계는 그 다음에 따라오게
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
    </Ep01SceneLayout>
  );
};
