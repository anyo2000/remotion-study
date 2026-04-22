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
import { BEATS_MZ_REJECT } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_MZ_REJECT;

/**
 * 씬 3: MZ 고객 거부 — 당혹 → 깨달음
 *
 * 🎁 이모지가 크게 날아오는데 🙅 이모지가 튕겨냄.
 * "목적 있는 선물 = 거부" 인사이트. "보험 선물은 더 싫다" accent 키워드.
 */
export const Scene3_MzReject: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🎁 등장 — 크게 날아옴
  const giftIn = spring({
    frame: Math.max(0, frame - B.GIFT_EMOJI),
    fps,
    config: SPRING.smooth,
  });

  // 🙅 거부 — 튕겨냄
  const rejectIn = spring({
    frame: Math.max(0, frame - B.REJECT),
    fps,
    config: SPRING.bouncy,
  });

  // "부담스러워서요"
  const burdenIn = spring({
    frame: Math.max(0, frame - B.BURDEN),
    fps,
    config: SPRING.smooth,
  });

  // 인사이트
  const insightIn = spring({
    frame: Math.max(0, frame - B.INSIGHT),
    fps,
    config: SPRING.smooth,
  });

  // 핵심 강조
  const accentIn = spring({
    frame: Math.max(0, frame - B.ACCENT),
    fps,
    config: SPRING.bouncy,
  });

  // 🎁 이 🙅에 의해 밀려나는 효과
  const giftPushed = frame >= B.REJECT
    ? interpolate(frame, [B.REJECT, B.REJECT + 15], [0, -80], {
        extrapolateRight: "clamp",
      })
    : 0;

  const giftDim = frame >= B.REJECT
    ? interpolate(frame, [B.REJECT, B.REJECT + 15], [1, 0.3], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 인사이트 등장 시 이모지 dim
  const emojiDim = frame >= B.INSIGHT
    ? interpolate(frame, [B.INSIGHT, B.INSIGHT + 15], [1, 0.25], {
        extrapolateRight: "clamp",
      })
    : 1;

  // glow flash
  const glowFlash =
    frame >= B.ACCENT && frame < B.ACCENT + 20
      ? interpolate(frame, [B.ACCENT, B.ACCENT + 20], [0.15, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <Ep01SceneLayout pageTitle="MZ 고객의 반응">
      {/* 이모지 충돌 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          opacity: emojiDim,
        }}
      >
        {/* 🎁 선물 */}
        <div
          style={{
            fontSize: 120,
            lineHeight: 1,
            opacity: giftIn * giftDim,
            transform: `translateX(${interpolate(giftIn, [0, 1], [100, 0]) + giftPushed}px) scale(${interpolate(giftIn, [0, 1], [0.3, 1])})`,
          }}
        >
          🎁
        </div>

        {/* 🙅 거부 */}
        <div
          style={{
            fontSize: 140,
            lineHeight: 1,
            opacity: rejectIn,
            transform: `scale(${interpolate(rejectIn, [0, 1], [0.4, 1])})`,
          }}
        >
          🙅
        </div>
      </div>

      {/* "부담스러워서요" */}
      <div
        style={{
          marginTop: 24,
          opacity: burdenIn * emojiDim,
          transform: `translateY(${interpolate(burdenIn, [0, 1], [12, 0])}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 600,
            color: palette.sub,
          }}
        >
          부담스러워서요
        </span>
      </div>

      {/* 인사이트 카드 */}
      <div
        style={{
          marginTop: 40,
          opacity: insightIn,
          transform: `translateY(${interpolate(insightIn, [0, 1], [16, 0])}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            padding: "28px 48px",
            borderRadius: 24,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span style={{ fontSize: 52, flexShrink: 0 }}>💡</span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 700,
              color: palette.sub,
            }}
          >
            목적 있는 선물 = 거부
          </span>
        </div>
      </div>

      {/* 핵심 키워드 */}
      <div
        style={{
          marginTop: 24,
          opacity: accentIn,
          transform: `scale(${interpolate(accentIn, [0, 1], [0.9, 1])})`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 68,
            fontWeight: 900,
            color: palette.accent,
            textShadow: `0 0 40px rgba(232, 168, 56, ${glowFlash})`,
          }}
        >
          보험 선물은 더 싫다
        </span>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={400}
        x="50%"
        y="45%"
        delay={B.INSIGHT}
      />
    </Ep01SceneLayout>
  );
};
