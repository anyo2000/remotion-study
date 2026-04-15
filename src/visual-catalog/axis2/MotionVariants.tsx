import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import {
  GradientBackground,
  BlurText,
  Typewriter,
  CharacterReveal,
} from "../../components";

const palette = PALETTES.coolBlue;
const TEXT = "빈틈이 보입니다";
const EMOJI = "🔍";
const EMOJI_SIZE = 100;
const TEXT_SIZE = 80;

/** 공통 래퍼: 배경 + 이모지 + 텍스트 영역 */
const MotionWrapper: React.FC<{
  emojiStyle?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ emojiStyle, children }) => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: EMOJI_SIZE, lineHeight: 1, ...emojiStyle }}>
        {EMOJI}
      </div>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ── 1. Fade In ──────────────────────────────────────
export const MotionFadeIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.heavy,
  });

  return (
    <MotionWrapper emojiStyle={{ opacity: progress }}>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: TEXT_SIZE,
          fontWeight: 900,
          color: palette.text,
          opacity: progress,
          textAlign: "center",
        }}
      >
        {TEXT}
      </div>
    </MotionWrapper>
  );
};

// ── 2. Slide Up ─────────────────────────────────────
export const MotionSlideUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.smooth,
  });

  return (
    <MotionWrapper
      emojiStyle={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: TEXT_SIZE,
          fontWeight: 900,
          color: palette.text,
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
          textAlign: "center",
        }}
      >
        {TEXT}
      </div>
    </MotionWrapper>
  );
};

// ── 3. Pop In ───────────────────────────────────────
export const MotionPopIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <MotionWrapper
      emojiStyle={{
        opacity: progress,
        transform: `scale(${progress})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: TEXT_SIZE,
          fontWeight: 900,
          color: palette.text,
          opacity: progress,
          transform: `scale(${progress})`,
          textAlign: "center",
        }}
      >
        {TEXT}
      </div>
    </MotionWrapper>
  );
};

// ── 4. Type In ──────────────────────────────────────
export const MotionTypeIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.smooth,
  });

  return (
    <MotionWrapper emojiStyle={{ opacity: emojiIn, transform: `scale(${emojiIn})` }}>
      <Typewriter
        text={TEXT}
        delay={10}
        charsPerSecond={12}
        fontSize={TEXT_SIZE}
        fontWeight={900}
        color={palette.text}
        style={{ textAlign: "center" }}
      />
    </MotionWrapper>
  );
};

// ── 5. Scale Up ─────────────────────────────────────
export const MotionScaleUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.dramatic,
  });

  const scale = interpolate(progress, [0, 1], [0.3, 1]);

  return (
    <MotionWrapper
      emojiStyle={{
        opacity: progress,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: TEXT_SIZE,
          fontWeight: 900,
          color: palette.text,
          opacity: progress,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        {TEXT}
      </div>
    </MotionWrapper>
  );
};

// ── 6. Blur → Clear ─────────────────────────────────
export const MotionBlurClear: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <BlurText
          text={`${EMOJI}\n${TEXT}`}
          delay={5}
          stagger={5}
          fontSize={TEXT_SIZE}
          fontWeight={900}
          color={palette.text}
          textAlign="center"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 7. Character Reveal ─────────────────────────────
export const MotionCharReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <MotionWrapper emojiStyle={{ opacity: emojiIn, transform: `scale(${emojiIn})` }}>
      <CharacterReveal
        text={TEXT}
        delay={10}
        stagger={3}
        fontSize={TEXT_SIZE}
        fontWeight={900}
        color={palette.text}
      />
    </MotionWrapper>
  );
};

// ── 8. Bounce Drop ──────────────────────────────────
export const MotionBounceDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.bouncy,
  });

  const ty = interpolate(progress, [0, 1], [-200, 0]);

  return (
    <MotionWrapper
      emojiStyle={{
        opacity: progress,
        transform: `translateY(${ty}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: TEXT_SIZE,
          fontWeight: 900,
          color: palette.text,
          opacity: progress,
          transform: `translateY(${ty}px)`,
          textAlign: "center",
        }}
      >
        {TEXT}
      </div>
    </MotionWrapper>
  );
};

// ── 9. Elastic Stretch ──────────────────────────────
export const MotionElasticStretch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 6, stiffness: 120 },
  });

  const scaleX = interpolate(progress, [0, 1], [0, 1]);

  return (
    <MotionWrapper
      emojiStyle={{
        opacity: progress,
        transform: `scaleX(${scaleX})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: TEXT_SIZE,
          fontWeight: 900,
          color: palette.text,
          opacity: progress,
          transform: `scaleX(${scaleX})`,
          textAlign: "center",
        }}
      >
        {TEXT}
      </div>
    </MotionWrapper>
  );
};

// ── 10. Rotate In ───────────────────────────────────
export const MotionRotateIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.smooth,
  });

  const rotate = interpolate(progress, [0, 1], [-15, 0]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <MotionWrapper
      emojiStyle={{
        opacity: progress,
        transform: `rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: TEXT_SIZE,
          fontWeight: 900,
          color: palette.text,
          opacity: progress,
          transform: `rotate(${rotate}deg) scale(${scale})`,
          textAlign: "center",
        }}
      >
        {TEXT}
      </div>
    </MotionWrapper>
  );
};
