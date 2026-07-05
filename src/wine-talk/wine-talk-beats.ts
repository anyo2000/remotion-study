/**
 * YRC Wine Talk 티저 — 타이밍 single source (v3: 무절단 오디오판)
 * 원천: public/audio/wine-talk-teaser.words.json (Whisper 실측)
 *       public/audio/wine-talk-teaser.scenes.json (씬 컷 위치 = 자연 쉼 중간점)
 * 오디오는 자르지 않고 통째 사용(균일 1.08배속) — 씬 컷만 비주얼용.
 * 모든 값은 실측 단어 start 기반 — 감 타이밍 금지.
 */

export const FPS = 30;
export const AUDIO_START = 15; // 0.5초 리드인 (타이틀 먼저, "짜잔!" 시작)
export const AUDIO_FRAMES = 2303; // 76.76초 (끝 3초 여유 포함)
export const SCENE_TAIL = 0; // 오디오에 이미 끝 3초 여유 있음
export const TOTAL_FRAMES = AUDIO_START + AUDIO_FRAMES + SCENE_TAIL; // 2318

/** 음성 절대초 → 컴포지션 프레임 */
export const T = (sec: number) => Math.round(sec * FPS) + AUDIO_START;

/** 음성 절대초 → 씬 로컬 프레임 */
const local = (audioSec: number, sceneStartSec: number) =>
  Math.round((audioSec - sceneStartSec) * FPS);

// ── 씬 컷 위치 (scenes.json 실측 — 자연 쉼 중간점) ──
const S1 = 4.28;
const S2 = 14.88;
const S3 = 27.7;
const S4 = 34.92;
const S5 = 43.43;
const S6 = 51.63;
const S7 = 62.93;

export const SCENE_START = {
  S1_INTRO: S1,
  S2_CHAMPAGNE: S2,
  S3_SAUVIGNON: S3,
  S4_OREGON: S4,
  S5_WHITE: S5,
  S6_HOSTPICK: S6,
  S7_CLOSING: S7,
} as const;

/** 타이틀카드 구간: 0 ~ T(S1) — "짜잔! YRC 와인톡 스페셜데이를 소개합니다" */
export const TITLE_END = T(S1);

// ── 씬 길이 (검증용) ──
export const SCENE1_DUR = Math.round((S2 - S1) * FPS);
export const SCENE2_DUR = Math.round((S3 - S2) * FPS);
export const SCENE3_DUR = Math.round((S4 - S3) * FPS);
export const SCENE4_DUR = Math.round((S5 - S4) * FPS);
export const SCENE5_DUR = Math.round((S6 - S5) * FPS);
export const SCENE6_DUR = Math.round((S7 - S6) * FPS);
export const SCENE7_DUR = TOTAL_FRAMES - T(S7);

// ── 씬1: 인트로 ──
export const BEATS_INTRO = {
  TOP_TITLE: local(4.28, S1), // 씬 시작 — "YRC WINE TALK" 상단 제목
  HOOK: local(4.68, S1), // "와인"
  HIGHLIGHT: local(5.24, S1), // "1도" — 마커 하이라이트
  CHIP: local(9.54, S1), // "내" (입맛에)
  SOGAE: local(12.56, S1), // "이번에" — "이번에 만날 와인들" 라벨
  GLASSES: local(12.56, S1), // 잔 5개 정렬 (라벨과 함께)
} as const;

// ── 씬2: WINE 01 샴페인 ──
export const BEATS_CHAMPAGNE = {
  BADGE: local(14.88, S2), // 씬 시작 = "1번" 콜과 함께
  HOTEL: local(16.16, S2), // "하야트(하얏트)"
  PRICE: local(17.6, S2), // "30만원" — 한 방에 쾅
  CHIP_HYANG: local(22.82, S2), // "향"
  CHIP_MAT: local(23.8, S2), // "맛"
  CHIP_YEOUN: local(24.18, S2), // "여운까지"
  QUESTION: local(24.78, S2), // "진짜 다를까"
} as const;

// ── 씬3: WINE 02 소비뇽 블랑 ──
export const BEATS_SAUVIGNON = {
  BADGE: local(27.7, S3), // 씬 시작 = "2번" 콜과 함께
  EMOJI: local(29.2, S3), // "여름" — 🤔
  QUESTION: local(30.22, S3), // "아직도"
  CHIP_PRICE: local(32.24, S3), // "가격은"
  CHIP_TASTE: local(33.14, S3), // "맛은"
} as const;

// ── 씬4: WINE 03 오레곤 레드 [반전] ──
export const BEATS_OREGON = {
  BADGE: local(34.92, S4), // 씬 시작 = "3번" 콜과 함께 (번호 일관성)
  BITTER: local(36.94, S4), // "떫고"
  HARSH: local(37.42, S4), // "써서"
  EMOJI: local(37.84, S4), // "싫다고요" — 😖
  X_SLASH: local(38.96, S4), // "편견입니다"
  SMOOTH: local(41.68, S4), // "술술"
} as const;

// ── 씬5: WINE 04 화이트 [반전] ──
export const BEATS_WHITE = {
  BADGE: local(43.43, S5), // 씬 시작 = "4번" 콜과 함께
  LIGHT: local(45.36, S5), // "가볍기만"
  STRIKE: local(47.5, S5), // "끝" — 취소선+드롭
  TASTY: local(48.72, S5), // "이런 게"
  WASH: local(48.72, S5), // 배경 워시 전환
} as const;

// ── 씬6: WINE 05 호스트 픽 [반전] ──
export const BEATS_HOSTPICK = {
  CREDIT: local(51.63, S6), // 씬 시작 = "5번" 콜과 함께 크레딧 카드
  QMARK: local(54.88, S6), // "나 술 좀…" — ? 서서히 확대 시작
  FIRST: local(58.52, S6), // "이건 아마 처음일걸요"
  CONFIRM: local(60.76, S6), // "뭔지는"
} as const;

// ── 씬7: 클로징 ──
export const BEATS_CLOSING = {
  HEADLINE: local(63.46, S7), // "다섯"
  GLASSES: local(63.9, S7), // "싹" — 🍷 5개
  OK1: local(66.58, S7), // 첫 "오케이"
  OK2: local(68.48, S7), // 둘째 "오케이"
  OK3: local(70.46, S7), // 셋째 "오케이"
  FINAL: local(72.02, S7), // "궁금한"
} as const;
