/**
 * EP02 친숙보다 중요한 것 — BEATS 타이밍 데이터
 *
 * 원천: public/audio/link-edu-ep02-familiar.words.json (Whisper word-level)
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
// 씬 1: 첫 통화의 절벽 (0~7.4s)
// "첫 통화에서 고객이 '관심 없어요'" → "영영 못 만나요"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S1 = 0.0;
export const BEATS_CLIFF = {
  // 📞 등장
  PHONE_IN: local(0.0, S1),
  // "관심 없어요" 2.20~2.70s
  REJECT_BUBBLE: local(2.20, S1),
  // "전화를 끊어요" 3.26~3.70s
  HANGUP: local(3.26, S1),
  // "영영 못 만나요" 5.88~6.58s
  NEVER_AGAIN: local(5.88, S1),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 2: SFP의 현실 (7.6~34.9s)
// "SFP FP님들" → "친해질 시간? 없어요" x3 → "SFP만의 얘기일까요?"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S2 = 7.6;
export const BEATS_SFP_REALITY = {
  // "첫 통화가 마지막 통화가" 19.52~21.72s
  FIRST_LAST: local(19.52, S2),
  // "친해질 시간?" 22.74s → ❌ 1
  NO_TIME: local(22.74, S2),
  // "선물 들고 갈 기회?" 24.48s → ❌ 2
  NO_GIFT: local(24.48, S2),
  // "이관받았다고 인사할 기회?" 27.40s → ❌ 3
  NO_GREET: local(27.40, S2),
  // "이게 SFP만의 얘기일까요?" 32.00~33.62s
  QUESTION: local(32.00, S2),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 3: FP 절반 소멸 (35.3~65.6s)
// "FP의 절반이 없어질 거다" → "AI" → "1초 만에"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S3 = 35.3;
export const BEATS_HALF_GONE = {
  // "10년 안에" 39.30~40.08s
  TEN_YEARS: local(39.30, S3),
  // "절반이 없어질 거다" 41.72~42.62s
  HALF_TEXT: local(41.72, S3),
  // "왜 그럴까요" 43.48~43.70s
  WHY: local(43.48, S3),
  // "AI예요" 53.26s
  AI_TEXT: local(53.26, S3),
  // "1초만에 해요" 61.50~62.14s
  ONE_SEC: local(61.50, S3),
  // "GA의 장점이 없어질" 63.20~65.12s
  GA_GONE: local(63.20, S3),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 4: 딱 하나, 관계 (66.1~85.3s)
// "딱 하나 남아요. 관계예요." → 가족/성향/걱정 → "컴퓨터로 못 찾거든요"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S4 = 66.1;
export const BEATS_RELATIONSHIP = {
  // "딱 하나 남아요" 69.92s
  ONE_LEFT: local(69.92, S4),
  // "관계예요" 70.86s
  KEYWORD: local(70.86, S4),
  // "가족 구성원이 어떤지" 75.52~76.36s
  FAMILY: local(75.52, S4),
  // "성향이 어떤지" 77.76~78.38s
  TENDENCY: local(77.76, S4),
  // "걱정을 하고 있는지" 80.00~80.72s
  WORRY: local(80.00, S4),
  // "컴퓨터로 못 찾거든요" 81.94~82.70s
  CANT_COMPUTE: local(81.94, S4),
  // "우리가 아는 거예요" 83.24~84.32s
  WE_KNOW: local(83.24, S4),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 5: 순서를 바꾸다 (85.3~99.2s)
// "관계→전문성" dim → 🔄 → "전문성→관계" accent
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S5 = 85.3;
export const BEATS_FLIP = {
  // "순서를 바꾸기로" 86.10~86.50s
  FLIP_TEXT: local(86.10, S5),
  // "관계가 먼저 있고 전문성이 따라오던" 88.12~90.62s
  OLD_WAY: local(88.12, S5),
  // "이제는" 91.78s → 전환점
  FLIP_MOMENT: local(91.78, S5),
  // "전문성을 먼저 보여주고" 92.82~93.66s
  NEW_WAY: local(92.82, S5),
  // "관계가 따라오게" 94.24~95.12s
  FOLLOW: local(94.24, S5),
  // "지금 시대에 맞는 답이에요" 97.42~98.56s
  ANSWER: local(97.42, S5),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 6: 복잡함이 기회다 (99.8~130.0s)
// "역설" → "담보 200개, 암 30개" → "복잡하니까 물어보는 거"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S6 = 99.8;
export const BEATS_COMPLEXITY = {
  // "역설 하나" 101.62~102.00s
  PARADOX: local(101.62, S6),
  // "복잡해진 거" 104.70~105.30s
  COMPLEX: local(104.70, S6),
  // "기회라고 봐요" 107.10~107.68s
  OPPORTUNITY: local(107.10, S6),
  // "종합형 담보가 200개" 116.18~117.44s
  NUM_200: local(116.18, S6),
  // "암 담보만 해도 30개" 118.74~119.36s
  NUM_30: local(118.74, S6),
  // "고객이 우리한테 물어보는 거예요" 121.82~123.28s
  ASK_US: local(121.82, S6),
  // "남은 기회거든요" 128.84~129.14s
  CHANCE: local(128.84, S6),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 7: 1분의 조건 (130.0~161.1s)
// "15분" → 취소 → "5분" → 취소 → "1분" → 정리 3줄
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S7 = 130.0;
export const BEATS_ONE_MINUTE = {
  // "15분이 기본이었어요" 134.02~134.86s
  FIFTEEN_MIN: local(134.02, S7),
  // "근데 요즘은요" 140.50~141.24s
  BUT_NOW: local(140.50, S7),
  // "15분?" 142.26s → 의문
  FIFTEEN_Q: local(142.26, S7),
  // "5분도 어려워요" 147.08~147.88s
  FIVE_MIN: local(147.08, S7),
  // "1분 안에" 148.62~149.26s
  ONE_MIN: local(148.62, S7),
  // "정리할게요" 153.18s
  SUMMARY_START: local(153.18, S7),
  // "AI가 못 주는 걸" 154.22s → 정리 1
  LINE_1: local(154.22, S7),
  // "복잡한 걸 쉽게" 156.76s → 정리 2
  LINE_2: local(156.76, S7),
  // "1분 안에 해내야" 158.96s → 정리 3
  LINE_3: local(158.96, S7),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 8: 클로징 + 다음 편 티저 (161.1~170.8s)
// "가능할까요? 가능해요." → "L·I·N·K"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S8 = 161.1;
export const BEATS_CLOSING = {
  // "이게 가능할까요?" 161.06~161.66s
  QUESTION: local(161.06, S8),
  // "가능해요" 163.20s
  POSSIBLE: local(163.20, S8),
  // "방법이 있으니까요" 163.84~164.64s
  METHOD: local(163.84, S8),
  // "L" 166.28s
  L: local(166.28, S8),
  // "I" 166.78s
  I: local(166.78, S8),
  // "N" 167.10s
  N: local(167.10, S8),
  // "K" 167.86s
  K: local(167.86, S8),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 전체 타이밍 — 음성 타임스탬프 기반 절대값
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SCENE_STARTS = {
  TITLE: 0,
  S1: T(0),        // 120  — 음성 시작
  S2: T(7.6),      // 348  — "SFP FP님들"
  S3: T(35.3),     // 1179 — "여러 회사 비교"
  S4: T(66.1),     // 2103 — "그럼 우리 전속 FP는"
  S5: T(85.3),     // 2679 — "그래서 우리가 순서를"
  S6: T(99.8),     // 3114 — "그리고 FP 여러분"
  S7: T(130.0),    // 4020 — "단, 조건이 있어요"
  S8: T(161.1),    // 4953 — "이게 가능할까요?"
} as const;

export const SCENE_DURS = {
  S1: SCENE_STARTS.S2 - SCENE_STARTS.S1,
  S2: SCENE_STARTS.S3 - SCENE_STARTS.S2,
  S3: SCENE_STARTS.S4 - SCENE_STARTS.S3,
  S4: SCENE_STARTS.S5 - SCENE_STARTS.S4,
  S5: SCENE_STARTS.S6 - SCENE_STARTS.S5,
  S6: SCENE_STARTS.S7 - SCENE_STARTS.S6,
  S7: SCENE_STARTS.S8 - SCENE_STARTS.S7,
  S8: T(170.8) + 75 - SCENE_STARTS.S8, // 음성 끝 + 2.5초 여유
} as const;

export const TOTAL_FRAMES = SCENE_STARTS.S8 + SCENE_DURS.S8;
