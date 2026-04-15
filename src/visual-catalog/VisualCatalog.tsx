import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LabelCard } from "./LabelCard";

// 축1 씬들
import { Axis1Keyword } from "./axis1/Axis1Keyword";
import { Axis1Comparison } from "./axis1/Axis1Comparison";
import { Axis1Flow } from "./axis1/Axis1Flow";
import { Axis1Cards } from "./axis1/Axis1Cards";
import { Axis1NumberImpact } from "./axis1/Axis1NumberImpact";
import { Axis1Dialogue } from "./axis1/Axis1Dialogue";
import { Axis1Reversal } from "./axis1/Axis1Reversal";

// 축2 모션 변형
import {
  MotionFadeIn,
  MotionSlideUp,
  MotionPopIn,
  MotionTypeIn,
  MotionScaleUp,
  MotionBlurClear,
  MotionCharReveal,
  MotionBounceDrop,
  MotionElasticStretch,
  MotionRotateIn,
} from "./axis2/MotionVariants";

// 축3 톤 변형
import { ToneCleanComparison, TonePlayfulComparison } from "./axis3/ToneComparison";
import { ToneCleanCards, TonePlayfulCards } from "./axis3/ToneCards";

// ── 타이밍 상수 ─────────────────────────────────────
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// 라벨 / 씬 길이
const INTRO_DUR = sec(3);
const AXIS_TITLE_DUR = sec(2.5);
const LABEL_DUR = sec(2);
const LABEL_SHORT = sec(1.5);

// 축1 씬 길이
const A1_KEYWORD = sec(4);
const A1_COMPARISON = sec(5);
const A1_FLOW = sec(5);
const A1_CARDS = sec(4);
const A1_NUMBER = sec(4);
const A1_DIALOGUE = sec(5);
const A1_REVERSAL = sec(4);

// 축2 씬 길이
const A2_EACH = sec(3);

// 축3 씬 길이
const A3_COMP = sec(5);
const A3_CARD = sec(4);

const OUTRO_DUR = sec(3);

// ── 축1 데이터 ──────────────────────────────────────
const axis1Scenes: Array<{
  label: string;
  duration: number;
  component: React.FC;
}> = [
  { label: "키워드 강조", duration: A1_KEYWORD, component: Axis1Keyword },
  { label: "비교", duration: A1_COMPARISON, component: Axis1Comparison },
  { label: "흐름도", duration: A1_FLOW, component: Axis1Flow },
  { label: "카드 나열", duration: A1_CARDS, component: Axis1Cards },
  { label: "숫자 임팩트", duration: A1_NUMBER, component: Axis1NumberImpact },
  { label: "대화 UI", duration: A1_DIALOGUE, component: Axis1Dialogue },
  { label: "반전", duration: A1_REVERSAL, component: Axis1Reversal },
];

// ── 축2 데이터 ──────────────────────────────────────
const axis2Scenes: Array<{
  label: string;
  component: React.FC;
}> = [
  { label: "Fade In", component: MotionFadeIn },
  { label: "Slide Up", component: MotionSlideUp },
  { label: "Pop In", component: MotionPopIn },
  { label: "Type In", component: MotionTypeIn },
  { label: "Scale Up", component: MotionScaleUp },
  { label: "Blur → Clear", component: MotionBlurClear },
  { label: "Character Reveal", component: MotionCharReveal },
  { label: "Bounce Drop", component: MotionBounceDrop },
  { label: "Elastic Stretch", component: MotionElasticStretch },
  { label: "Rotate In", component: MotionRotateIn },
];

// ── 축3 데이터 ──────────────────────────────────────
const axis3Scenes: Array<{
  label: string;
  duration: number;
  component: React.FC;
}> = [
  { label: "정돈 톤 — 비교", duration: A3_COMP, component: ToneCleanComparison },
  { label: "가벼운 톤 — 비교", duration: A3_COMP, component: TonePlayfulComparison },
  { label: "정돈 톤 — 카드", duration: A3_CARD, component: ToneCleanCards },
  { label: "가벼운 톤 — 카드", duration: A3_CARD, component: TonePlayfulCards },
];

/**
 * 비주얼 카탈로그 — 메인 Composition
 * 하나의 영상으로 3개 축의 모든 샘플을 순서대로 보여줌.
 */
export const VisualCatalog: React.FC = () => {
  let cursor = 0;
  const sequences: React.ReactNode[] = [];
  let key = 0;

  const push = (duration: number, node: React.ReactNode) => {
    sequences.push(
      <Sequence key={key++} from={cursor} durationInFrames={duration}>
        {node}
      </Sequence>
    );
    cursor += duration;
  };

  // ── 인트로 ──────────────────────────────────────
  push(
    INTRO_DUR,
    <LabelCard
      label="비주얼 카탈로그"
      sub="씬 타입 × 모션 × 톤 — 공유 비주얼 사전"
    />
  );

  // ── 축 1: 씬 타입 비교 ──────────────────────────
  push(
    AXIS_TITLE_DUR,
    <LabelCard
      category="축 1"
      label="같은 내용 → 다른 씬 타입"
      sub='"보장분석 한 번이면 고객의 빈틈이 보입니다"'
    />
  );

  for (const scene of axis1Scenes) {
    push(LABEL_DUR, <LabelCard category="축 1" label={scene.label} />);
    push(scene.duration, <scene.component />);
  }

  // ── 축 2: 모션 비교 ────────────────────────────
  push(
    AXIS_TITLE_DUR,
    <LabelCard
      category="축 2"
      label="같은 씬 → 다른 모션"
      sub="keyword 타입, 동일 텍스트 + 이모지"
    />
  );

  for (const scene of axis2Scenes) {
    push(LABEL_SHORT, <LabelCard category="축 2" label={scene.label} />);
    push(A2_EACH, <scene.component />);
  }

  // ── 축 3: 톤 비교 ─────────────────────────────
  push(
    AXIS_TITLE_DUR,
    <LabelCard
      category="축 3"
      label="같은 씬 → 다른 톤"
      sub="정돈 톤 vs 가벼운 톤"
    />
  );

  for (const scene of axis3Scenes) {
    push(LABEL_DUR, <LabelCard category="축 3" label={scene.label} />);
    push(scene.duration, <scene.component />);
  }

  // ── 아웃트로 ────────────────────────────────────
  push(
    OUTRO_DUR,
    <LabelCard
      label="카탈로그 끝"
      sub="마음에 드는 스타일을 골라주세요"
    />
  );

  return <AbsoluteFill>{sequences}</AbsoluteFill>;
};

/** 전체 프레임 수 계산 (Root.tsx에서 사용) */
export const VISUAL_CATALOG_FRAMES = (() => {
  let total = INTRO_DUR;

  // 축1
  total += AXIS_TITLE_DUR;
  for (const s of axis1Scenes) total += LABEL_DUR + s.duration;

  // 축2
  total += AXIS_TITLE_DUR;
  total += axis2Scenes.length * (LABEL_SHORT + A2_EACH);

  // 축3
  total += AXIS_TITLE_DUR;
  for (const s of axis3Scenes) total += LABEL_DUR + s.duration;

  total += OUTRO_DUR;
  return total;
})();
