/**
 * EP01 세상이 바뀌었다 — BEATS 타이밍 데이터
 *
 * 원천: public/audio/link-edu-ep01-world-changed.words.json (Whisper word-level)
 * 규칙: 음성보다 먼저 정보 노출 금지 (±3프레임 이내)
 */

export const FPS = 30;
export const TITLE_DUR = 120; // 타이틀 카드 4초
export const AUDIO_START = TITLE_DUR;

/** 오디오 초 → 글로벌 프레임 */
export const T = (sec: number) => Math.round(sec * FPS) + AUDIO_START;

/** 오디오 초 → 특정 씬 기준 로컬 프레임 */
const local = (audioSec: number, sceneStartSec: number) =>
  Math.round((audioSec - sceneStartSec) * FPS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 3: MZ 고객 거부 [대화 UI]
// 오디오 32.2~47.7s
// "선물 들고 가보세요" → "안 받을게요" → "목적 있는 선물을 싫어하거든요"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S3 = 32.2;
export const BEATS_MZ_REJECT = {
  // "선물 들고 가보세요" 33.9~34.9s
  FP_BUBBLE: local(33.9, S3), // 51 — FP가 선물 들고 감
  // "안 받을게요" 35.9~36.4s
  CUSTOMER_REJECT: local(35.9, S3), // 111 — 고객 거부
  // "부담스러워서요" 36.8~37.2s — 같은 고객 버블에 포함
  // "목적 있는 선물을 싫어하거든요" 40.7~42.5s
  INSIGHT_TEXT: local(40.7, S3), // 255 — 해설 텍스트
  // "보험 얘기하려고 주는 건 더 싫은 거예요" 45.5~47.7s
  ACCENT_TEXT: local(45.5, S3), // 399 — 핵심 강조
} as const;

export const SCENE3_DURATION = Math.round((47.7 - S3) * FPS); // 465 frames

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 7: 무대가 바뀌었다 [반전]
// 오디오 122.5~139.1s
// "실력 문제일까요?" → "아니에요" → "무대가 통째로 바뀐 거예요"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S7 = 122.5;
export const BEATS_STAGE_CHANGED = {
  // "실력 문제일까요?" 124.3~125.0s
  QUESTION_IN: local(124.3, S7), // 54
  // "아니에요" 125.8~126.1s
  DENY_IN: local(125.8, S7), // 99
  // "진짜 여러분 잘못 아니에요" 126.8~128.4s
  EMPATHY_IN: local(126.8, S7), // 129
  // "무대가" 129.2s
  KEYWORD_START: local(129.2, S7), // 201
  // "통째로 바뀐 거예요" 129.8~130.6s
  KEYWORD_FULL: local(129.8, S7), // 219
  // "더 억울하실 거예요" 133.9~135.1s
  SUB_IN: local(133.9, S7), // 342
} as const;

export const SCENE7_DURATION = Math.round((139.1 - S7) * FPS); // 498 frames
