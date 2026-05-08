/**
 * EP04 단어 하나가 만든 벽 — BEATS 타이밍 데이터
 *
 * 원천: public/audio/link-edu-ep04-guard-down.words.json (Whisper word-level)
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
// 씬 1: 김영숙 FP의 전화 (0~40s)
// "여기 10년차 김영숙 FP님이" → FP 멘트 → 고객 거절 → 전화 끊김
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S1 = 0.0;
export const BEATS_PHONE_CALL = {
  PHONE_IN: local(0.0, S1),
  // FP 말풍선: "고객님 안녕하세요" 7.7s
  FP_BUBBLE: local(7.7, S1),
  // "보장 분석" 14.5s
  ANALYSIS_WORD: local(14.5, S1),
  // "고객이 거절합니다" 22.3s
  NARRATION_REJECT: local(20.0, S1),
  // "받아봤어요" 23.9s → 고객 말풍선
  CUSTOMER_BUBBLE: local(23.9, S1),
  // "전화가 끊겨요" 39.1s → 음파 사라짐 + shake
  PHONE_CUT: local(39.1, S1),
} as const;
export const SCENE1_DUR = Math.round((40.0 - S1) * FPS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 2: 멈칫 (40~55.5s)
// "전화기 내려놓고" → "내가 뭘 잘못했지?" → "몇년전까지만해도"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S2 = 40.0;
export const BEATS_PAUSE = {
  // 🧑‍💼 실루엣 등장
  SILHOUETTE_IN: local(40.2, S2),
  // "내가 뭘 잘못했지?" 44.2s
  QUESTION_TEXT: local(44.2, S2),
  // "몇년전까지만해도" 48.0s
  FIVE_YEARS: local(48.0, S2),
  // "안 통한 거예요" 53.5s
  NOT_WORKING: local(53.5, S2),
} as const;
export const SCENE2_DUR = Math.round((55.5 - S2) * FPS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 3: 카페 양쪽 테이블 (55.5~99s)
// 좌: "보장 분석" → 15분 → 끝 / 우: "확인해드리려고" → 30분 → 인증번호
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S3 = 55.5;
export const BEATS_CAFE = {
  // "같은 날 오후 3시" 57.8s → 카드 등장
  CARDS_IN: local(57.8, S3),
  // 좌측: "보장 분석해서 부족한 거" 66.9s
  LEFT_MENT: local(65.0, S3),
  // "15분 만에" 73.7s → 타이머
  LEFT_TIMER: local(73.7, S3),
  // "다음에 뵐게요" 74.8s → 결과
  LEFT_RESULT: local(74.8, S3),
  // "바로 옆 테이블에선" 78.0s → 우측 강조
  RIGHT_FOCUS: local(78.0, S3),
  // 우측: "설명드리려고 왔어요" 88.0s
  RIGHT_MENT: local(84.0, S3),
  // "뭐가 바뀌었는데요?" 93.2s → 고객 반응
  RIGHT_REACTION: local(93.2, S3),
  // "30분 뒤에 인증번호" 95.5s → 타이머 + 결과
  RIGHT_TIMER: local(95.5, S3),
  RIGHT_RESULT: local(96.6, S3),
  // "어떤 게 달라서였을까요?" 100.0s → 좌 dim + 우 하이라이트
  HIGHLIGHT: local(98.5, S3),
} as const;
export const SCENE3_DUR = Math.round((100.0 - S3) * FPS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 4: 벽의 정체 (100~138s)
// "벽이 하나 생긴거" → 벽돌 3개 쌓임 → "방어모드" → "오염"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S4 = 100.0;
export const BEATS_WALL = {
  // "우리가 못해서가 아니에요" 105.5s
  NOT_OUR_FAULT: local(105.5, S4),
  // "벽이 하나 생긴거예요" 109.0s
  WALL_LABEL: local(109.0, S4),
  // "그 벽 이름이 보장 분석이에요" 111.0s → 큰 텍스트
  WALL_NAME: local(111.0, S4),
  // "보장분석해드릴게요" 118.5s → 벽돌 1
  BRICK_1: local(118.5, S4),
  // "부족한 거 채워드릴게요" 120.0s → 벽돌 2
  BRICK_2: local(120.0, S4),
  // "갈아타시면 좋아요" 122.3s → 벽돌 3
  BRICK_3: local(122.3, S4),
  // "방어모드로 들어가요" 129.9s
  DEFENSE_MODE: local(129.9, S4),
  // "단어가 오염되어 버린 거예요" 136.2s → 벽에 금
  CONTAMINATED: local(136.2, S4),
} as const;
export const SCENE4_DUR = Math.round((138.0 - S4) * FPS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 5: 단어 치환 (138~165s)
// BEFORE→AFTER 3행 변환
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S5 = 138.0;
export const BEATS_REPLACE = {
  // "같은 뜻을 다르게 표현하는" 138.0s → 제목
  TITLE_IN: local(138.0, S5),
  // 행1 BEFORE: "보장분석 해드리려고요" 141.5s
  ROW1_BEFORE: local(141.5, S5),
  // 행1 AFTER: "설명해드릴 게 있어서" 143.8s
  ROW1_AFTER: local(143.8, S5),
  // 행2 BEFORE: "보험이 좀 부족하신 것 같다" 147.0s
  ROW2_BEFORE: local(147.0, S5),
  // 행2 AFTER: "바뀐 치료방법이 적용되는지" 149.8s
  ROW2_AFTER: local(149.8, S5),
  // 행3 BEFORE: "가입설계 동의 해주세요" 155.5s
  ROW3_BEFORE: local(155.5, S5),
  // 행3 AFTER: "숫자만 확인해주시면" 160.1s
  ROW3_AFTER: local(158.4, S5),
} as const;
export const SCENE5_DUR = Math.round((165.0 - S5) * FPS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 6: 김영숙 FP 재도전 (165~181.5s)
// 벽 무너짐 → 📱 재등장 → "어, 뭐가 바뀌었는데요?"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S6 = 165.0;
export const BEATS_RETRY = {
  // 벽 무너짐 시작
  WALL_BREAK: local(165.0, S6),
  // "다시 전화를 걸었어요" 167.5s → 📱 등장
  PHONE_RETURN: local(167.5, S6),
  // "두세군데 표현만 바꿔봤습니다" 170.0s
  WORDS_CHANGED: local(170.0, S6),
  // "어, 뭐가 바뀌었는데요?" 174.4s → 임팩트 텍스트
  IMPACT_TEXT: local(174.4, S6),
  // "세상이 변한 거예요" 180.3s
  WORLD_CHANGED: local(180.3, S6),
} as const;
export const SCENE6_DUR = Math.round((181.5 - S6) * FPS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 7: 클로징 (181.5~225s)
// "단어 한두 개만 빼도" → "첫 1분의 공기가 달라집니다"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S7 = 181.5;
export const BEATS_CLOSING = {
  // "입에 붙어 있는 단어들이 있어요" 184.5s
  OLD_WORDS: local(184.5, S7),
  // "신뢰의 시작이었던 표현들이" 188.5s
  TRUST_SIGNAL: local(188.5, S7),
  // "옛날 단어들을 그대로 쓰고 있는 거예요" 197.0s
  STILL_USING: local(197.0, S7),
  // "오늘 통화 한 건이라도 좋아요" 199.0s
  TODAY_ONE: local(199.0, S7),
  // "단어 한두 개만 빼도" 215.1s → 1줄목
  LINE_1: local(215.1, S7),
  // "통화 첫 1분의 공기가 완전히 달라집니다" 216.3s → 2줄목
  LINE_2: local(216.3, S7),
  // "진짜 후킹 화법으로" 222.6s → 다음편 예고
  NEXT_PREVIEW: local(222.6, S7),
} as const;
export const SCENE7_DUR = Math.round((225.0 - S7) * FPS) + 75; // +2.5초 여유

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 전체 타이밍
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SCENE_STARTS = {
  TITLE: 0,
  S1: T(S1),
  S2: T(S2),
  S3: T(S3),
  S4: T(S4),
  S5: T(S5),
  S6: T(S6),
  S7: T(S7),
} as const;

export const SCENE_DURS = {
  S1: SCENE_STARTS.S2 - SCENE_STARTS.S1,
  S2: SCENE_STARTS.S3 - SCENE_STARTS.S2,
  S3: SCENE_STARTS.S4 - SCENE_STARTS.S3,
  S4: SCENE_STARTS.S5 - SCENE_STARTS.S4,
  S5: SCENE_STARTS.S6 - SCENE_STARTS.S5,
  S6: SCENE_STARTS.S7 - SCENE_STARTS.S6,
  S7: SCENE7_DUR,
} as const;

export const TOTAL_FRAMES = SCENE_STARTS.S7 + SCENE_DURS.S7;
