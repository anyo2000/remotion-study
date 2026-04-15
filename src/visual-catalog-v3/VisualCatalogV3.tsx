import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LabelCard } from "../visual-catalog/LabelCard";

// 전환 효과 10종
import {
  TransitionCrossFade,
  TransitionWipeRight,
  TransitionWipeDown,
  TransitionSlideLeft,
  TransitionSlideUp,
  TransitionZoomIn,
  TransitionZoomOut,
  TransitionIrisOpen,
  TransitionSplitHorizontal,
  TransitionBlur,
} from "./transitions/TransitionEffects";

// ── 타이밍 상수 ─────────────────────────────────────
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

const INTRO_DUR = sec(3);
const TITLE_DUR = sec(2.5);
const LABEL_DUR = sec(1.5);
const TRANSITION_DUR = sec(5);
const OUTRO_DUR = sec(3);

// ── 전환 데이터 ──────────────────────────────────────
const transitionScenes: Array<{
  label: string;
  sub: string;
  component: React.FC;
}> = [
  {
    label: "CrossFade",
    sub: "투명도 교차 페이드",
    component: TransitionCrossFade,
  },
  {
    label: "Wipe Right",
    sub: "좌→우 와이프",
    component: TransitionWipeRight,
  },
  {
    label: "Wipe Down",
    sub: "위→아래 와이프",
    component: TransitionWipeDown,
  },
  {
    label: "Slide Left",
    sub: "좌측 슬라이드 전환",
    component: TransitionSlideLeft,
  },
  {
    label: "Slide Up",
    sub: "위로 슬라이드 전환",
    component: TransitionSlideUp,
  },
  {
    label: "Zoom In",
    sub: "확대 페이드 전환",
    component: TransitionZoomIn,
  },
  {
    label: "Zoom Out",
    sub: "축소 → 확대 전환",
    component: TransitionZoomOut,
  },
  {
    label: "Iris Open",
    sub: "원형 리빌 (중심 확장)",
    component: TransitionIrisOpen,
  },
  {
    label: "Split Horizontal",
    sub: "상하 분할 슬라이드",
    component: TransitionSplitHorizontal,
  },
  {
    label: "Blur Transition",
    sub: "블러 아웃 → 블러 인",
    component: TransitionBlur,
  },
];

/**
 * 비주얼 카탈로그 V3 — 전환 효과 편
 * SceneA → (전환) → SceneB 패턴으로 10가지 전환 효과를 순서대로 보여줌
 */
export const VisualCatalogV3: React.FC = () => {
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
      label="비주얼 카탈로그 V3"
      sub="장면 전환 효과 — SceneA → SceneB"
    />
  );

  // ── 타이틀 ──────────────────────────────────────
  push(
    TITLE_DUR,
    <LabelCard
      category="전환 효과"
      label="같은 두 장면 → 다른 전환"
      sub="🔍 보장분석 → ✅ 계약 체결"
    />
  );

  // ── 각 전환 효과 ────────────────────────────────
  for (const scene of transitionScenes) {
    push(
      LABEL_DUR,
      <LabelCard
        category="전환 효과"
        label={scene.label}
        sub={scene.sub}
      />
    );
    push(TRANSITION_DUR, <scene.component />);
  }

  // ── 아웃트로 ────────────────────────────────────
  push(
    OUTRO_DUR,
    <LabelCard
      label="V3 카탈로그 끝"
      sub="V1(텍스트) + V2(비주얼) + V3(전환) = 완전한 비주얼 사전"
    />
  );

  return <AbsoluteFill>{sequences}</AbsoluteFill>;
};

/** 전체 프레임 수 계산 (Root.tsx에서 사용) */
export const VISUAL_CATALOG_V3_FRAMES = (() => {
  let total = INTRO_DUR + TITLE_DUR;

  // 각 전환: 라벨 + 전환 씬
  total += transitionScenes.length * (LABEL_DUR + TRANSITION_DUR);

  total += OUTRO_DUR;
  return total;
})();
