import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { PALETTES, SPRING, SAFE, FONT_FAMILY } from "../../constants";

const P = PALETTES.aprilGift;

/*
 * 음성 싱크 (절대 프레임):
 * fr 0:   "화창한 봄"
 * fr 32:  "4월입니다"           → "4월" 팡!
 * fr 271: "특별한 선물 보따리"  → 텍스트
 * fr 376: "4월 한정"            → 뱃지
 * fr 416: "인수 조건 대폭 확대" → "인수확대" 크게
 * fr 565: "지금 바로 뜯어보시죠"
 */

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [570, 615], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  // fr 32: "4월" 팡!
  const aprilScale = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: SPRING.bouncy,
  });

  // 큰 배경 원
  const circleIn = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: SPRING.heavy,
  });

  // fr 271: "특별한 선물 보따리를 준비했습니다"
  const titleIn = spring({
    frame: Math.max(0, frame - 268),
    fps,
    config: SPRING.smooth,
  });

  // 🎁 (선물 보따리 말할 때)
  const giftScale = spring({
    frame: Math.max(0, frame - 265),
    fps,
    config: SPRING.bouncy,
  });

  // fr 376: "4월 한정" 뱃지
  const badgeIn = spring({
    frame: Math.max(0, frame - 374),
    fps,
    config: SPRING.bouncy,
  });

  // fr 416: "인수확대" 크게
  const expandIn = spring({
    frame: Math.max(0, frame - 414),
    fps,
    config: SPRING.dramatic,
  });

  // flash
  const flashOpacity = interpolate(frame, [414, 417, 428], [0, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 큰 코랄 원 배경 */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          width: 550,
          height: 550,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 107, 53, 0.07)",
          transform: `translate(-50%, -50%) scale(${circleIn})`,
        }}
      />

      {/* 메인 — 화면 중앙 기준 약간 위 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 200,
        }}
      >
        {/* "4월" 거대 */}
        <div
          style={{
            fontSize: 300,
            fontWeight: 900,
            color: P.accent,
            fontFamily: FONT_FAMILY,
            transform: `scale(${aprilScale})`,
            lineHeight: 1,
          }}
        >
          4월
        </div>

        {/* 🎁 + "선물을 준비했습니다" */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 30,
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <span style={{ fontSize: 80, transform: `scale(${giftScale})` }}>🎁</span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 800,
              color: P.text,
            }}
          >
            선물을 준비했습니다
          </span>
        </div>
      </AbsoluteFill>

      {/* 하단: "4월 한정" 뱃지 + "인수확대" */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 180,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            opacity: badgeIn,
            transform: `scale(${badgeIn})`,
            padding: "14px 52px",
            borderRadius: 50,
            backgroundColor: P.accent,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 60,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            4월 한정
          </span>
        </div>

        <div
          style={{
            opacity: expandIn,
            transform: `scale(${expandIn})`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 140,
              fontWeight: 900,
              color: P.text,
            }}
          >
            인수확대
          </span>
        </div>
      </div>

      {/* Flash */}
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
