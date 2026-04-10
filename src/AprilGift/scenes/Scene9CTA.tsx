import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { PALETTES, SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { FadeInText } from "../../components";

const P = PALETTES.aprilGift;
const DUR = 867; // 5040 - 4173

// 리캡 숫자들 (빠르게 스쳐감)
const RECAP_NUMBERS = [
  "20만",
  "5천만",
  "3천만",
  "2천만",
  "7천만",
  "5만",
];
const RECAP_EACH = 10; // 각 숫자 10프레임

export const Scene9CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 90, DUR], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  // 리캡 단계 (0~60프레임)
  const recapEnd = RECAP_NUMBERS.length * RECAP_EACH;
  const currentRecapIndex = Math.floor(frame / RECAP_EACH);
  const isRecapPhase = frame < recapEnd;

  // "4월 한정!" 등장
  const limitIn = spring({
    frame: Math.max(0, frame - (recapEnd + 20)),
    fps,
    config: SPRING.dramatic,
  });

  // CTA 텍스트
  const ctaIn = spring({
    frame: Math.max(0, frame - (recapEnd + 120)),
    fps,
    config: SPRING.smooth,
  });

  // "파이팅!!"
  const fightingIn = spring({
    frame: Math.max(0, frame - (recapEnd + 350)),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 리캡 숫자 (빠르게 스쳐감) */}
      {isRecapPhase && currentRecapIndex < RECAP_NUMBERS.length && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 200,
              fontWeight: 900,
              color: P.accent,
              fontVariantNumeric: "tabular-nums",
              opacity: interpolate(
                frame % RECAP_EACH,
                [0, 3, 7, 10],
                [0, 1, 1, 0]
              ),
              transform: `scale(${interpolate(
                frame % RECAP_EACH,
                [0, 5, 10],
                [0.8, 1, 1.1]
              )})`,
            }}
          >
            {RECAP_NUMBERS[currentRecapIndex]}
          </div>
        </AbsoluteFill>
      )}

      {/* "4월 한정!" */}
      {!isRecapPhase && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: SAFE.side,
            paddingRight: SAFE.side,
          }}
        >
          <div
            style={{
              opacity: limitIn,
              transform: `scale(${limitIn})`,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 140,
                fontWeight: 900,
                color: P.accent,
                lineHeight: 1.2,
              }}
            >
              4월 한정!
            </div>
          </div>

          <div
            style={{
              opacity: ctaIn,
              transform: `translateY(${interpolate(ctaIn, [0, 1], [30, 0])}px)`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 64,
                fontWeight: 700,
                color: P.text,
                lineHeight: 1.5,
                marginBottom: 16,
              }}
            >
              아쉬웠던 그 고객에게
            </div>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 72,
                fontWeight: 800,
                color: P.text,
                lineHeight: 1.4,
              }}
            >
              지금 바로 연락하세요!
            </div>
          </div>

          {/* 파이팅!! */}
          <div
            style={{
              marginTop: 80,
              opacity: fightingIn,
              transform: `scale(${fightingIn})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 900,
                color: P.accent,
              }}
            >
              파이팅!! 🔥
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
