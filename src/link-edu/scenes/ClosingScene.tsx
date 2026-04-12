import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY } from "../../constants";
import { BlurText, GlowOrb } from "../../components";
import type { Palette } from "../../constants";
import type { AudioSync } from "../types";

type Props = AudioSync & {
  palette: Palette;
  durationInFrames?: number;
  /** 핵심 메시지 (줄바꿈은 \n) */
  takeaway: string;
  /** 강조할 단어 목록 */
  accentWords?: string[];
  /** CTA 또는 다음 편 안내 */
  cta?: string;
  emoji?: string;
};

export const ClosingScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  takeaway,
  accentWords = [],
  cta,
  emoji,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // 20프레임 어둡게 → 메시지 등장
  const DARK_GAP = 20;
  const messageStart = DARK_GAP;
  const ctaStart = messageStart + 60;

  // 이모지 등장
  const emojiIn = spring({
    frame: Math.max(0, frame - messageStart),
    fps,
    config: SPRING.bouncy,
  });

  // CTA 등장
  const ctaIn = spring({
    frame: Math.max(0, frame - ctaStart),
    fps,
    config: SPRING.smooth,
  });

  // 전체 배경 어두워지기
  const darkFade = interpolate(frame, [0, DARK_GAP], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(0,0,0,${darkFade * 0.4})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 배경 글로우 */}
      {frame >= messageStart && (
        <GlowOrb
          color={palette.accent}
          opacity={0.05}
          size={400}
          delay={messageStart}
          pulse={0.1}
        />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          padding: "0 80px",
        }}
      >
        {/* 이모지 */}
        {emoji && frame >= messageStart && (
          <div
            style={{
              fontSize: 120,
              opacity: emojiIn,
              transform: `scale(${emojiIn})`,
            }}
          >
            {emoji}
          </div>
        )}

        {/* 핵심 메시지 — BlurText */}
        {frame >= messageStart && (
          <BlurText
            text={takeaway}
            delay={messageStart + 5}
            stagger={4}
            accentWords={accentWords}
            accentColor={palette.accent}
            fontSize={72}
            fontWeight={700}
            color={palette.text}
          />
        )}

        {/* CTA / 다음 편 안내 */}
        {cta && (
          <div
            style={{
              opacity: ctaIn,
              transform: `translateY(${interpolate(ctaIn, [0, 1], [10, 0])}px)`,
              marginTop: 20,
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
              {cta}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
