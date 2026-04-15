import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LabelCard } from "../visual-catalog/LabelCard";

// 축 A: SVG 선 & 도형
import {
  SvgLineDraw,
  SvgExpandingRings,
  SvgCheckmark,
  SvgXMark,
  SvgConnectedNodes,
  SvgBarChart,
  SvgCircleProgress,
  SvgArrowPath,
} from "./axisA/SvgShapes";

// 축 B: 이모지 활용법
import {
  EmojiHero,
  EmojiGrid,
  EmojiCascade,
  EmojiBullets,
  EmojiScaleSeq,
  EmojiOrbit,
} from "./axisB/EmojiPatterns";

// 축 C: 박스/블록 효과
import {
  BlockStacking,
  BlockGridReveal,
  BlockSplitScreen,
  BlockGaugeFill,
  BlockFloatingCards,
  BlockCollapse,
} from "./axisC/BlockEffects";

// ── 타이밍 상수 ─────────────────────────────────────
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

const INTRO_DUR = sec(3);
const AXIS_TITLE_DUR = sec(2.5);
const LABEL_DUR = sec(1.5);
const OUTRO_DUR = sec(3);

// 축 A — SVG 씬 길이
const SVG_DUR = sec(4);
const SVG_LONG = sec(5); // 복잡한 것

// 축 B — 이모지 씬 길이
const EMOJI_DUR = sec(4);
const EMOJI_LONG = sec(5);

// 축 C — 블록 씬 길이
const BLOCK_DUR = sec(4);
const BLOCK_LONG = sec(5);

// ── 축 데이터 ───────────────────────────────────────
const axisAScenes: Array<{ label: string; sub: string; duration: number; component: React.FC }> = [
  { label: "Line Draw", sub: "stroke-dashoffset 선 그리기", duration: SVG_DUR, component: SvgLineDraw },
  { label: "Expanding Rings", sub: "동심원 펄스 파동", duration: SVG_DUR, component: SvgExpandingRings },
  { label: "Checkmark Draw", sub: "체크마크 SVG 드로잉", duration: SVG_DUR, component: SvgCheckmark },
  { label: "X Mark Slash", sub: "거절/실패 X 표시", duration: SVG_DUR, component: SvgXMark },
  { label: "Connected Nodes", sub: "점+선 네트워크", duration: SVG_LONG, component: SvgConnectedNodes },
  { label: "Bar Chart", sub: "막대 차트 성장", duration: SVG_DUR, component: SvgBarChart },
  { label: "Circle Progress", sub: "원형 프로그레스 바", duration: SVG_DUR, component: SvgCircleProgress },
  { label: "Arrow Path", sub: "곡선 화살표 경로", duration: SVG_DUR, component: SvgArrowPath },
];

const axisBScenes: Array<{ label: string; sub: string; duration: number; component: React.FC }> = [
  { label: "Hero Emoji", sub: "중앙 큰 이모지 임팩트", duration: EMOJI_DUR, component: EmojiHero },
  { label: "Emoji Grid", sub: "격자 순차 등장", duration: EMOJI_DUR, component: EmojiGrid },
  { label: "Emoji Cascade", sub: "위에서 떨어지는 비", duration: EMOJI_LONG, component: EmojiCascade },
  { label: "Emoji Bullets", sub: "불릿 포인트 리스트", duration: EMOJI_LONG, component: EmojiBullets },
  { label: "Scale Sequence", sub: "순차 확대 → 이전 축소", duration: EMOJI_LONG, component: EmojiScaleSeq },
  { label: "Emoji Orbit", sub: "원형 오비탈 배치", duration: EMOJI_LONG, component: EmojiOrbit },
];

const axisCScenes: Array<{ label: string; sub: string; duration: number; component: React.FC }> = [
  { label: "Stacking Blocks", sub: "블록이 위에서 떨어져 쌓임", duration: BLOCK_DUR, component: BlockStacking },
  { label: "Grid Reveal", sub: "격자 대각선 리빌", duration: BLOCK_DUR, component: BlockGridReveal },
  { label: "Split Screen", sub: "화면 좌우 분할", duration: BLOCK_DUR, component: BlockSplitScreen },
  { label: "Gauge Fill", sub: "프로그레스 바 + 마커", duration: BLOCK_DUR, component: BlockGaugeFill },
  { label: "Floating Cards", sub: "떠다니는 카드 레이아웃", duration: BLOCK_DUR, component: BlockFloatingCards },
  { label: "Block Collapse", sub: "쌓기 → 무너짐 (거절)", duration: BLOCK_LONG, component: BlockCollapse },
];

/**
 * 비주얼 카탈로그 V2 — 도형/이모지/블록 편
 */
export const VisualCatalogV2: React.FC = () => {
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
      label="비주얼 카탈로그 V2"
      sub="SVG × 이모지 × 블록 — 비텍스트 시각 요소"
    />
  );

  // ── 축 A: SVG 선 & 도형 ────────────────────────
  push(
    AXIS_TITLE_DUR,
    <LabelCard
      category="축 A"
      label="SVG 선 & 도형"
      sub="stroke, circle, path, 차트 애니메이션"
    />
  );

  for (const scene of axisAScenes) {
    push(LABEL_DUR, <LabelCard category="축 A" label={scene.label} sub={scene.sub} />);
    push(scene.duration, <scene.component />);
  }

  // ── 축 B: 이모지 활용법 ────────────────────────
  push(
    AXIS_TITLE_DUR,
    <LabelCard
      category="축 B"
      label="이모지 활용법"
      sub="배치, 모션, 패턴, 레이아웃"
    />
  );

  for (const scene of axisBScenes) {
    push(LABEL_DUR, <LabelCard category="축 B" label={scene.label} sub={scene.sub} />);
    push(scene.duration, <scene.component />);
  }

  // ── 축 C: 박스/블록 효과 ──────────────────────
  push(
    AXIS_TITLE_DUR,
    <LabelCard
      category="축 C"
      label="박스 · 블록 효과"
      sub="쌓기, 격자, 분할, 플로팅, 무너짐"
    />
  );

  for (const scene of axisCScenes) {
    push(LABEL_DUR, <LabelCard category="축 C" label={scene.label} sub={scene.sub} />);
    push(scene.duration, <scene.component />);
  }

  // ── 아웃트로 ────────────────────────────────────
  push(
    OUTRO_DUR,
    <LabelCard
      label="V2 카탈로그 끝"
      sub="V1(텍스트) + V2(비주얼) = 공유 비주얼 사전 완성"
    />
  );

  return <AbsoluteFill>{sequences}</AbsoluteFill>;
};

/** 전체 프레임 수 계산 */
export const VISUAL_CATALOG_V2_FRAMES = (() => {
  let total = INTRO_DUR;

  // 축 A
  total += AXIS_TITLE_DUR;
  for (const s of axisAScenes) total += LABEL_DUR + s.duration;

  // 축 B
  total += AXIS_TITLE_DUR;
  for (const s of axisBScenes) total += LABEL_DUR + s.duration;

  // 축 C
  total += AXIS_TITLE_DUR;
  for (const s of axisCScenes) total += LABEL_DUR + s.duration;

  total += OUTRO_DUR;
  return total;
})();
