import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LabelCard } from "../visual-catalog/LabelCard";

// 분위기 & 배경 샘플
import {
  NoParticle,
  LightParticle,
  DenseParticle,
  GlowTop,
  GlowCenter,
  GlowMulti,
  DarkMode,
  LightMode,
  Vignette,
  Letterbox,
  GrainOverlay,
  ColorShift,
} from "./atmosphere/AtmosphereEffects";

// ── 타이밍 상수 ─────────────────────────────────────
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

const INTRO_DUR = sec(3);
const GROUP_TITLE_DUR = sec(2.5);
const LABEL_DUR = sec(1.5);
const SCENE_DUR = sec(4.5);
const OUTRO_DUR = sec(3);

// ── 그룹 데이터 ─────────────────────────────────────
type SceneEntry = {
  label: string;
  sub?: string;
  component: React.FC;
};

const group1: SceneEntry[] = [
  { label: "NoParticle", sub: "파티클 없음, 그라디언트만", component: NoParticle },
  { label: "LightParticle", sub: "15개, 느린 속도, 은은", component: LightParticle },
  { label: "DenseParticle", sub: "50개, 빠른 속도, 뚜렷", component: DenseParticle },
];

const group2: SceneEntry[] = [
  { label: "GlowTop", sub: "상단 50%/20%, 큰 사이즈", component: GlowTop },
  { label: "GlowCenter", sub: "중앙 50%/50%, 보통 사이즈", component: GlowCenter },
  { label: "GlowMulti", sub: "3곳 분산 배치", component: GlowMulti },
];

const group3: SceneEntry[] = [
  { label: "DarkMode", sub: "coolBlue — 어두운 배경", component: DarkMode },
  { label: "LightMode", sub: "linkEdu — 밝은 배경", component: LightMode },
];

const group4: SceneEntry[] = [
  { label: "Vignette", sub: "가장자리 어둡게", component: Vignette },
  { label: "Letterbox", sub: "시네마틱 상하 블랙바", component: Letterbox },
  { label: "GrainOverlay", sub: "필름 그레인 노이즈", component: GrainOverlay },
  { label: "ColorShift", sub: "배경 색상 서서히 변화", component: ColorShift },
];

const groups: Array<{
  title: string;
  sub: string;
  scenes: SceneEntry[];
}> = [
  {
    title: "파티클 밀도",
    sub: "같은 배경, 파티클 수만 다르게",
    scenes: group1,
  },
  {
    title: "글로우 위치/크기",
    sub: "GlowOrb 배치에 따른 분위기 변화",
    scenes: group2,
  },
  {
    title: "다크 vs 라이트",
    sub: "팔레트 교체만으로 완전히 다른 느낌",
    scenes: group3,
  },
  {
    title: "시네마틱 효과",
    sub: "오버레이 한 장으로 분위기 전환",
    scenes: group4,
  },
];

/**
 * 비주얼 카탈로그 V4 — 분위기 & 배경
 * 같은 콘텐츠를 12가지 배경/분위기로 보여주는 비교 영상
 */
export const VisualCatalogV4: React.FC = () => {
  let cursor = 0;
  const sequences: React.ReactNode[] = [];
  let key = 0;

  const push = (duration: number, node: React.ReactNode) => {
    sequences.push(
      <Sequence key={key++} from={cursor} durationInFrames={duration}>
        {node}
      </Sequence>,
    );
    cursor += duration;
  };

  // ── 인트로 ──────────────────────────────────────
  push(
    INTRO_DUR,
    <LabelCard
      label="비주얼 카탈로그 V4"
      sub="분위기 & 배경 — 같은 내용, 다른 느낌"
    />,
  );

  // ── 그룹별 순회 ────────────────────────────────
  for (const group of groups) {
    // 그룹 타이틀
    push(
      GROUP_TITLE_DUR,
      <LabelCard
        category="V4"
        label={group.title}
        sub={group.sub}
      />,
    );

    // 씬들
    for (const scene of group.scenes) {
      push(
        LABEL_DUR,
        <LabelCard category={group.title} label={scene.label} sub={scene.sub} />,
      );
      push(SCENE_DUR, <scene.component />);
    }
  }

  // ── 아웃트로 ──────────────────────────────────
  push(
    OUTRO_DUR,
    <LabelCard
      label="카탈로그 V4 끝"
      sub="배경 하나로 느낌이 바뀝니다"
    />,
  );

  return <AbsoluteFill>{sequences}</AbsoluteFill>;
};

/** 전체 프레임 수 계산 (Root.tsx에서 사용) */
export const VISUAL_CATALOG_V4_FRAMES = (() => {
  let total = INTRO_DUR;

  for (const group of groups) {
    total += GROUP_TITLE_DUR;
    total += group.scenes.length * (LABEL_DUR + SCENE_DUR);
  }

  total += OUTRO_DUR;
  return total;
})();
