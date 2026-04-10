import { Easing } from "remotion";

// ── 비디오 스펙 ──────────────────────────────────────────────
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920; // 세로 9:16
export const VIDEO_FPS = 30;

// ── Safe Zone ────────────────────────────────────────────────
export const SAFE = { top: 150, bottom: 170, side: 60 } as const;
export const SAFE_WIDE = { top: 80, bottom: 80, side: 100 } as const; // 가로(16:9) 영상용

// ── 전환 / 타이밍 ────────────────────────────────────────────
export const FADE_FRAMES = 15; // 0.5초 — TransitionSeries fade 길이
export const GAP_FRAMES = 21; // 0.7초 — 장면 사이 쉼
export const SCENE_TAIL = 75; // 2.5초 — 마지막 장면 여유

// ── 색상 팔레트 ──────────────────────────────────────────────
// 매 영상 시작 시 하나를 골라서 전 장면에 동일하게 적용
export const PALETTES = {
  /** 파랑 계열 — HookTalk, GuardDown, GiftReject, ColdWall, LifeLink */
  blue: {
    bg: "#0c1117",
    card: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    text: "#f0f0f0",
    sub: "#9ca3af",
    accent: "#5b9bd5",
    accentLight: "#7db8e8",
    accentDark: "#3d7ab5",
    glow: "rgba(91, 155, 213, 0.05)",
    glowPosition: "50% 40%",
  },
  /** 오렌지 계열 — LinkTeaser1/2/3, TeaserSampleA/B */
  orange: {
    bg: "#0B1120",
    card: "rgba(255, 255, 255, 0.07)",
    cardBorder: "rgba(255, 255, 255, 0.25)",
    text: "#F0F0F0",
    sub: "#8899AA",
    accent: "#FF8C38",
    accentLight: "#FFB070",
    accentDark: "#E07020",
    glow: "rgba(255, 140, 56, 0.03)",
    glowPosition: "50% 50%",
  },
  /** 골드 계열 — 과거/따뜻한 감성 (LinkTeaser4 장면1) */
  gold: {
    bg: "#0c1117",
    card: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(201, 162, 39, 0.15)",
    text: "#f0f0f0",
    sub: "#9ca3af",
    accent: "#C9A227",
    accentLight: "#E0C060",
    accentDark: "#A08020",
    glow: "rgba(201, 162, 39, 0.06)",
    glowPosition: "50% 40%",
  },
  /** 쿨블루 계열 — 차가운/현실 (LinkTeaser4 장면2-3) */
  coolBlue: {
    bg: "#0B1120",
    card: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(91, 155, 213, 0.15)",
    text: "#f0f0f0",
    sub: "#8899AA",
    accent: "#5b9bd5",
    accentLight: "#7db8e8",
    accentDark: "#3d7ab5",
    glow: "rgba(91, 155, 213, 0.04)",
    glowPosition: "50% 50%",
  },
  /** 핑크 계열 — Signature4 */
  pink: {
    bg: "#0c1117",
    card: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    text: "#f0f0f0",
    sub: "#9ca3af",
    accent: "#e0a8b8",
    accentLight: "#edc4d0",
    accentDark: "#c88e9e",
    glow: "rgba(224, 168, 184, 0.06)",
    glowPosition: "50% 40%",
  },
  /** 네이비+틸그린 — LinkCounsel (상담 설득 화법) */
  counsel: {
    bg: "#1A1F36",
    card: "#252B48",
    cardBorder: "rgba(78, 205, 196, 0.15)",
    text: "#F0F0F0",
    sub: "#8B93A7",
    accent: "#4ECDC4",
    accentLight: "#7EDDD6",
    accentDark: "#36B5AD",
    glow: "rgba(78, 205, 196, 0.04)",
    glowPosition: "50% 50%",
  },
  /** 밝은 크림+코랄 — AprilGift (4월 인수확대 선물 보따리) */
  aprilGift: {
    bg: "#FFF8F0",
    card: "#FFFFFF",
    cardBorder: "rgba(255, 107, 53, 0.12)",
    text: "#2D3748",
    sub: "#718096",
    accent: "#FF6B35",
    accentLight: "#FF8F5E",
    accentDark: "#E55A2B",
    glow: "rgba(255, 107, 53, 0.06)",
    glowPosition: "50% 40%",
  },
} as const;

/** 팔레트 타입 (컴포넌트 props용) */
export type PaletteName = keyof typeof PALETTES;
export type Palette = (typeof PALETTES)[PaletteName];

// ── 스프링 프리셋 ────────────────────────────────────────────
export const SPRING = {
  /** 부드럽게, 바운스 없음 — 배경, 카드, 페이드인 */
  heavy: { damping: 200 },
  /** 살짝 바운스 — 텍스트 등장, 일반 진입 */
  smooth: { damping: 12 },
  /** 통통 튀는 — 임팩트, 펀치 */
  bouncy: { damping: 8 },
  /** 글자별 애니메이션 — LINK 스탬프 등 */
  letter: { damping: 12, stiffness: 200, mass: 0.8 },
  /** 빠르고 반응적 — UI 요소 */
  snappy: { damping: 20, stiffness: 200 },
  /** 무겁고 드라마틱 — 중요 순간 */
  dramatic: { damping: 30, stiffness: 80 },
  /** 연결선/네트워크 노드 */
  network: { damping: 10, stiffness: 80 },
  /** 차트 바 */
  chart: { damping: 30, stiffness: 40 },
} as const;

// ── 이징 ─────────────────────────────────────────────────────
export const EASING = {
  /** 부드러운 감속 — 일반 진입 */
  smoothOut: Easing.out(Easing.quad),
  /** 부드러운 가속 — 낙하, 파쇄 */
  smoothIn: Easing.in(Easing.quad),
  /** 시네마틱 — 드라마틱 진입 */
  cinematic: Easing.bezier(0.22, 1, 0.36, 1),
  /** 지수 — 극적 가속 */
  exp: Easing.bezier(0.19, 1, 0.22, 1),
} as const;

// ── 폰트 ─────────────────────────────────────────────────────
export const FONT_FAMILY = "Pretendard, sans-serif";
export const MIN_FONT_SIZE = 52; // 이보다 작은 글씨 절대 금지
