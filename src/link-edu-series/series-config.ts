/**
 * LINK 마이크로러닝 시리즈 — 공통 설정
 *
 * 전 에피소드에 동일 적용되는 값들.
 * 에피소드별 커스텀이 필요하면 에피소드 폴더에서 오버라이드.
 */

// ── 해상도 ──
export const SERIES_WIDTH = 1920;
export const SERIES_HEIGHT = 1080;
export const SERIES_FPS = 30;

// ── 타이틀카드 ──
export const TITLE_CARD_FRAMES = 120; // 4초

// ── Safe Zone (가로 1920×1080) ──
export const SAFE_ZONE = {
  top: 80,
  bottom: 80,
  left: 100,
  right: 100,
} as const;

// ── 상단 바 ──
export const TOP_BAR = {
  y: 28,
  fontSize: 34,
  separatorY: 95,
  /** 시리즈 이름 (좌측) */
  seriesName: "LINK Consulting",
  /** 단계 뱃지 색상 */
  badgeColor: "#5b9bd5",
} as const;

// ── 페이지 타이틀 (맥락 라벨) ──
export const PAGE_TITLE = {
  y: 140,
  fontSize: 56,
  fontWeight: 800 as const,
} as const;

// ── 콘텐츠 영역 ──
export const CONTENT = {
  /** 기본 시작 Y */
  top: 300,
  /** 내용 많을 때 (dense) */
  topDense: 240,
  /** 끝 Y */
  bottom: 1030,
  bottomDense: 1050,
  /** 좌우 패딩 */
  padX: 120,
} as const;

// ── 팔레트 ──
// constants.ts의 PALETTES.orange를 기본 사용
// 단계별로 바꾸고 싶으면 여기서 오버라이드 가능
export { PALETTES, FONT_FAMILY, SPRING } from "../constants";

// ── 단계별 뱃지 라벨 ──
export const STAGE_LABELS: Record<string, string> = {
  OT: "오리엔테이션",
  L: "후킹",
  I: "진단",
  N: "설계",
  K: "클로징",
} as const;

// ── 장면 간 전환 ──
export const SCENE_GAP = 21; // 0.7초
export const SCENE_TAIL = 75; // 마지막 장면 여유 (2.5초)
