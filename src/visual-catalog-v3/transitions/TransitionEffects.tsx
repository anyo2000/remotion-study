import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { SceneA, SceneB } from "../SampleScenes";

// ── 공통 헬퍼 ─────────────────────────────────────────────
/** 전환 구간 계산: 앞 35% SceneA 정지, 중간 30% 전환, 뒤 35% SceneB 정지 */
const useTransitionProgress = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const transitionStart = Math.floor(durationInFrames * 0.35);
  const transitionEnd = Math.floor(durationInFrames * 0.65);

  const progress = interpolate(frame, [transitionStart, transitionEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  return { frame, progress, transitionStart, transitionEnd, durationInFrames };
};

// ── 1. CrossFade ──────────────────────────────────────────
export const TransitionCrossFade: React.FC = () => {
  const { progress } = useTransitionProgress();

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - progress }}>
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: progress }}>
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 2. WipeRight ──────────────────────────────────────────
export const TransitionWipeRight: React.FC = () => {
  const { progress } = useTransitionProgress();
  const pct = progress * 100;

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
        }}
      >
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 3. WipeDown ───────────────────────────────────────────
export const TransitionWipeDown: React.FC = () => {
  const { progress } = useTransitionProgress();
  const pct = progress * 100;

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `inset(0 0 ${100 - pct}% 0)`,
        }}
      >
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 4. SlideLeft ──────────────────────────────────────────
export const TransitionSlideLeft: React.FC = () => {
  const { progress } = useTransitionProgress();
  const offsetA = -progress * 100;
  const offsetB = (1 - progress) * 100;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${offsetA}%)` }}>
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${offsetB}%)` }}>
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 5. SlideUp ────────────────────────────────────────────
export const TransitionSlideUp: React.FC = () => {
  const { progress } = useTransitionProgress();
  const offsetA = -progress * 100;
  const offsetB = (1 - progress) * 100;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${offsetA}%)` }}>
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${offsetB}%)` }}>
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 6. ZoomIn ─────────────────────────────────────────────
export const TransitionZoomIn: React.FC = () => {
  const { progress } = useTransitionProgress();
  const scaleA = 1 + progress * 0.5;
  const opacityA = 1 - progress;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 }}>
        <SceneB />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${scaleA})`,
          opacity: opacityA,
        }}
      >
        <SceneA />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 7. ZoomOut ────────────────────────────────────────────
export const TransitionZoomOut: React.FC = () => {
  const { progress } = useTransitionProgress();
  const scaleA = 1 - progress * 0.5;
  const opacityA = 1 - progress;
  const scaleB = interpolate(progress, [0, 1], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scaleB})` }}>
        <SceneB />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${scaleA})`,
          opacity: opacityA,
        }}
      >
        <SceneA />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 8. IrisOpen ───────────────────────────────────────────
export const TransitionIrisOpen: React.FC = () => {
  const { progress } = useTransitionProgress();
  // 원형 클립: 중심에서 확장 (대각선 길이의 반 = ~72% 정도면 화면 전체 커버)
  const radius = progress * 75;

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `circle(${radius}% at 50% 50%)`,
        }}
      >
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 9. SplitHorizontal ───────────────────────────────────
export const TransitionSplitHorizontal: React.FC = () => {
  const { progress } = useTransitionProgress();
  // 상단 반쪽은 위로, 하단 반쪽은 아래로 이동
  const offset = progress * 50;

  return (
    <AbsoluteFill>
      {/* SceneB underneath */}
      <AbsoluteFill>
        <SceneB />
      </AbsoluteFill>
      {/* Top half of SceneA slides up */}
      <AbsoluteFill
        style={{
          clipPath: "inset(0 0 50% 0)",
          transform: `translateY(-${offset}%)`,
        }}
      >
        <SceneA />
      </AbsoluteFill>
      {/* Bottom half of SceneA slides down */}
      <AbsoluteFill
        style={{
          clipPath: "inset(50% 0 0 0)",
          transform: `translateY(${offset}%)`,
        }}
      >
        <SceneA />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── 10. BlurTransition ────────────────────────────────────
export const TransitionBlur: React.FC = () => {
  const { progress } = useTransitionProgress();
  // SceneA: sharp → blurry, SceneB: blurry → sharp
  const blurA = interpolate(progress, [0, 0.5], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityA = interpolate(progress, [0.3, 0.7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blurB = interpolate(progress, [0.5, 1], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityB = interpolate(progress, [0.3, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `blur(${blurA}px)`,
          opacity: opacityA,
        }}
      >
        <SceneA />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `blur(${blurB}px)`,
          opacity: opacityB,
        }}
      >
        <SceneB />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
