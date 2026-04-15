import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LabelCard } from "../visual-catalog/LabelCard";

// 차트 씬들
import {
  DonutChart,
  LineGraph,
  FunnelChart,
  RadarChart,
  TimelineHorizontal,
  BeforeAfterGauge,
  StackedBar,
  ProgressSteps,
} from "./charts/DataVizCharts";

// ── 타이밍 상수 ─────────────────────────────────────
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

const INTRO_DUR = sec(3);
const TITLE_DUR = sec(2.5);
const LABEL_DUR = sec(1.5);
const SCENE_DUR = sec(5);
const OUTRO_DUR = sec(3);

// ── 차트 데이터 ─────────────────────────────────────
const chartScenes: Array<{
  label: string;
  sub: string;
  component: React.FC;
}> = [
  {
    label: "도넛 차트",
    sub: "Donut Chart — 보장 영역별 비중",
    component: DonutChart,
  },
  {
    label: "라인 그래프",
    sub: "Line Graph — 월별 상담 건수 추이",
    component: LineGraph,
  },
  {
    label: "퍼널 차트",
    sub: "Funnel Chart — 상담 프로세스 전환율",
    component: FunnelChart,
  },
  {
    label: "레이더 차트",
    sub: "Radar Chart — 보장 커버리지",
    component: RadarChart,
  },
  {
    label: "타임라인",
    sub: "Timeline — 보험 라이프사이클",
    component: TimelineHorizontal,
  },
  {
    label: "전/후 비교 게이지",
    sub: "Before/After Gauge — 보장분석 비교",
    component: BeforeAfterGauge,
  },
  {
    label: "스택 막대 차트",
    sub: "Stacked Bar — 월별 실적 구성",
    component: StackedBar,
  },
  {
    label: "단계별 진행",
    sub: "Progress Steps — 프로세스 상태",
    component: ProgressSteps,
  },
];

/**
 * 비주얼 카탈로그 V5 — 데이터 시각화
 * 8종 데이터 시각화 컴포넌트 쇼케이스
 */
export const VisualCatalogV5: React.FC = () => {
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
      label="비주얼 카탈로그 V5"
      sub="데이터 시각화 컴포넌트 쇼케이스"
    />
  );

  // ── 타이틀 ──────────────────────────────────────
  push(
    TITLE_DUR,
    <LabelCard
      category="V5"
      label="데이터 시각화"
      sub="보험 교육 영상을 위한 차트/그래프 8종"
    />
  );

  // ── 차트 씬 ──────────────────────────────────────
  for (const scene of chartScenes) {
    push(
      LABEL_DUR,
      <LabelCard category="V5" label={scene.label} sub={scene.sub} />
    );
    push(SCENE_DUR, <scene.component />);
  }

  // ── 아웃트로 ────────────────────────────────────
  push(
    OUTRO_DUR,
    <LabelCard
      label="카탈로그 끝"
      sub="차트 유형을 골라 영상에 활용하세요"
    />
  );

  return <AbsoluteFill>{sequences}</AbsoluteFill>;
};

/** 전체 프레임 수 계산 (Root.tsx에서 사용) */
export const VISUAL_CATALOG_V5_FRAMES = (() => {
  let total = INTRO_DUR + TITLE_DUR;
  total += chartScenes.length * (LABEL_DUR + SCENE_DUR);
  total += OUTRO_DUR;
  return total;
})();
