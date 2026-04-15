import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE_WIDE, FONT_FAMILY, PALETTES } from "../../constants";
import { CharacterReveal, WordHighlight, GradientBackground } from "../../components";

/**
 * 축1-1: 키워드 강조
 * "보장분석 한 번이면 고객의 빈틈이 보입니다"
 * → 🔍 이모지 + CharacterReveal + "빈틈" WordHighlight
 */
export const Axis1Keyword: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const palette = PALETTES.coolBlue;

  const BEATS = {
    EMOJI_IN: 0,
    HEADLINE_IN: 8,
    HIGHLIGHT: Math.floor(durationInFrames * 0.4),
    DIM: Math.floor(durationInFrames * 0.65),
  };

  const emojiIn = spring({
    frame: Math.max(0, frame - BEATS.EMOJI_IN),
    fps,
    config: SPRING.bouncy,
  });

  const highlightProgress = spring({
    frame: Math.max(0, frame - BEATS.HIGHLIGHT),
    fps,
    config: SPRING.smooth,
  });

  const dimProgress =
    frame >= BEATS.DIM
      ? interpolate(frame, [BEATS.DIM, BEATS.DIM + 15], [1, 0.4], {
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: `0 ${SAFE_WIDE.side + 40}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {/* 이모지 */}
          <div
            style={{
              fontSize: 120,
              opacity: emojiIn * dimProgress,
              transform: `scale(${emojiIn})`,
              lineHeight: 1,
            }}
          >
            🔍
          </div>

          {/* 헤드라인 */}
          <div style={{ position: "relative", textAlign: "center" }}>
            <CharacterReveal
              text={"빈틈이 보입니다"}
              delay={BEATS.HEADLINE_IN}
              stagger={2}
              fontSize={90}
              fontWeight={900}
              color={palette.text}
            />
          </div>

          {/* 강조 단어 오버레이 */}
          {highlightProgress > 0.01 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, 10px)",
                textAlign: "center",
              }}
            >
              <WordHighlight
                color={palette.accent}
                delay={BEATS.HIGHLIGHT}
                fontSize={90}
                fontWeight={900}
                textColor={palette.accent}
                heightRatio={0.35}
              >
                빈틈
              </WordHighlight>
            </div>
          )}

          {/* 서브 텍스트 */}
          <div
            style={{
              opacity: dimProgress * interpolate(
                spring({ frame: Math.max(0, frame - 20), fps, config: SPRING.smooth }),
                [0, 1],
                [0, 1]
              ),
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 600,
              color: palette.sub,
              textAlign: "center",
            }}
          >
            보장분석 한 번이면
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
