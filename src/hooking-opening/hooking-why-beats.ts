/**
 * 후킹 왜 후킹인가 — BEATS 타이밍 데이터
 *
 * 원천: public/audio/link-edu-hooking-why.words.json (Whisper word-level)
 * 규칙: 음성보다 먼저 정보 노출 금지 (±3프레임 이내)
 *
 * 사용법:
 *   각 씬 컴포넌트에서 import { BEATS_씬이름 } from "./hooking-why-beats"
 *   spring({ frame: Math.max(0, frame - BEATS.KEY), fps, config })
 */

// ── 타이밍 기준 ──
export const FPS = 30;
export const TITLE_DUR = 120; // 타이틀 카드 4초
export const AUDIO_START = TITLE_DUR; // 120 — 타이틀 끝나면 바로 음성+씬2 동시

/** 오디오 초 → 글로벌 프레임 */
export const T = (sec: number) => Math.round(sec * FPS) + AUDIO_START;

/** 오디오 초 → 특정 씬 기준 로컬 프레임 */
const local = (audioSec: number, sceneStartSec: number) =>
  Math.round((audioSec - sceneStartSec) * FPS);

// ── 씬 시작 (오디오 초 기준) ──
export const SCENE_STARTS = {
  titlecard: 0, // 글로벌 frame 0
  opening: 0, // 글로벌 frame 120 (TITLE_DUR), 오디오와 동시
  hookResult: 4.4, // "지금 무슨 소린가 싶으시죠?"
  subway: 10.8, // "서울 지하철에서"
  voice: 18.8, // "근데 한 아저씨가"
  eyeFocus: 26.3, // "아무도 대답은 안 했어요"
  impact: 31.2, // "왜 쳐다봤을까요"
  dramaCliff: 40.7, // "드라마 애매한 데서"
  comparison: 45.2, // "홈쇼핑도 마찬가지예요"
  timer: 65.3, // "우리가 하는 상담도"
  dialogue: 73.5, // "똑같은 FP"
  closing: 93.5, // "그러니까 우리 FP님들은"
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 1: 반전-오프닝질문 ("파라고? 말라고?")
// 글로벌 120~T(4.4)=252, 오디오와 동시
// 오디오: "의사가 귓구멍을 파라고 할까요? 파지 말라고 할까요?"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const BEATS_OPENING = {
  EMOJI_IN: 3,
  // "파라고" 1.46s → fr 44
  LEFT_TEXT: local(1.46, 0), // 44 — "파라고" 시점에 "파라고?" 등장
  // "파지" 2.32s → fr 70
  RIGHT_TEXT: local(2.32, 0), // 70 — "파지" 시점에 "말라고?" 등장
  GLOW_PULSE: 10,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 2: 후킹의결과 ("궁금하죠? 이게 후킹입니다")
// 오디오 4.4~10.8s
// "지금 무슨 소린가 싶으시죠?" → "그게 바로 후킹의 결과입니다"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S2 = 4.4;
export const BEATS_HOOK_RESULT = {
  EMOJI_IN: 5,
  // "싶으시죠?" 5.28s
  KEYWORD_IN: local(5.28, S2), // 26 — "궁금하죠?" 등장
  // "후킹의" 8.96s
  SUB_IN: local(8.96, S2), // 137 — "이게 후킹입니다" 등장
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 3: 지하철 (📱 이모지)
// 오디오 10.8~18.8s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S3 = 10.8;
export const BEATS_SUBWAY = {
  // "지하철에서" 11.26s
  FIRST_PHONES: local(11.26, S3), // 14
  // "파는 사람" 14.40s
  MORE_PHONES: local(14.40, S3), // 108
  // "아무도 안 봐요" 15.56s
  ALL_DIM: local(15.56, S3), // 143
  // "휴대폰만" 17.06s
  CENTER_PHONE: local(17.06, S3), // 188
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 4: 아저씨 질문 (🗣️ + "귓구멍을 파라고 해요?")
// 오디오 18.8~26.3s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S4 = 18.8;
export const BEATS_VOICE = {
  // "근데 한 아저씨가" 18.84s
  EMOJI_IN: local(18.84, S4), // 1
  // "이렇게 말한" 19.70~19.96s → 음파
  WAVE_1: local(19.70, S4), // 27
  WAVE_2: local(20.28, S4), // 44
  WAVE_3: local(20.92, S4), // 64
  // "귓구멍을" 23.14s
  TEXT_IN: local(23.14, S4), // 130
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 5: 다들 쳐다봄 (👁️ 시선 집중)
// 오디오 26.3~31.2s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S5 = 26.3;
export const BEATS_EYE_FOCUS = {
  // "아무도 대답은" 26.26s
  EYES_START: local(26.26, S5), // 0 → 바로 시작
  EYES_STAGGER: 5,
  // "다들" 28.32s → 시선 수렴
  LINES_CONVERGE: local(28.32, S5), // 61
  // "쳐다보게" 29.78s → 텍스트
  TEXT_IN: local(29.78, S5), // 104
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 6: 왜 — 답답함 (❗ + "답을 안 줬으니까")
// 오디오 31.2~40.7s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S6 = 31.2;
export const BEATS_IMPACT = {
  // "왜" 31.20s → ❗ 드롭
  DROP_START: local(31.20, S6), // 0
  // "쳐다봤을까요?" 31.54s → shake
  SHAKE_START: local(32.70, S6), // 45
  // "답을" 33.86s → 텍스트
  TEXT_IN: local(33.86, S6), // 80
  // "답답함을" 39.26s → 보조텍스트
  SUB_IN: local(39.26, S6), // 242
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 7: 드라마 비유 (📺→📡→🤔→▶️)
// 오디오 40.7~45.2s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S7 = 40.7;
export const BEATS_DRAMA = {
  // "드라마" 40.72s
  PHASE_TV: local(40.72, S7), // 1
  // "끊기면" 42.10s
  PHASE_CUT: local(42.10, S7), // 42
  // "다음 편" 42.64s
  PHASE_THINK: local(42.64, S7), // 58
  // "보게 되는" 43.06s
  PHASE_PLAY: local(43.36, S7), // 80
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 8: 홈쇼핑 비교 (BEFORE vs AFTER)
// 오디오 45.2~65.3s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S8 = 45.2;
export const BEATS_COMPARISON = {
  // "홈쇼핑도" 45.16s
  CARDS_IN: local(45.16, S8), // 0
  // "오늘 이런 여행 상품을" 47.32s → BEFORE 카드
  BEFORE_TEXT: local(47.32, S8), // 64
  // "채널 바로 돌리죠" 51.90s → BEFORE 결과
  BEFORE_RESULT: local(51.90, S8), // 201
  // "참기름은" 53.78s → AFTER 카드
  AFTER_TEXT: local(53.78, S8), // 257
  // "채널 못 돌려요" 59.12s → AFTER 결과
  AFTER_RESULT: local(59.12, S8), // 418
  // "그래서 홈쇼핑은 전부 질문으로" 61.66s → 하이라이트
  HIGHLIGHT: local(61.66, S8), // 494
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 9: 3초 타이머 (⏱️ 카운트다운)
// 오디오 65.3~73.5s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S9 = 65.3;
export const BEATS_TIMER = {
  // "우리가 하는 상담도" 65.26s
  RING_IN: local(65.26, S9), // 0
  // "고객이 들을지" 67.48s
  NUMBER_IN: local(67.48, S9), // 65
  // "3초" 69.60s
  LABEL_IN: local(69.60, S9), // 129
  // "그 3초에 뭘 던지느냐가" 70.60s
  SUB_IN: local(70.60, S9), // 159
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 10: 대화 비교 (BEFORE/AFTER 대화)
// 오디오 73.5~93.5s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S10 = 73.5;
export const BEATS_DIALOGUE = {
  // "똑같은 FP" 73.50s
  LABEL_IN: local(73.50, S10), // 0
  // "보장 분석 해드리려고요" 77.98s → BEFORE FP
  BEFORE_FP: local(77.98, S10), // 134
  // "고객은 경계합니다" 80.98s → BEFORE 고객
  BEFORE_CUSTOMER: local(80.98, S10), // 224
  // "고객님 임신해도" 82.52s → AFTER FP
  AFTER_FP: local(82.52, S10), // 271
  // "그게 뭐예요?" 88.90s → AFTER 고객
  AFTER_CUSTOMER: local(88.90, S10), // 462
  // "첫마디 하나 바꿨을 뿐" 91.14s → 헤드라인
  HEADLINE: local(91.14, S10), // 529
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 11: 클로징
// 오디오 93.5~끝
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S11 = 93.5;
export const BEATS_CLOSING = {
  // "답을 주지 마세요" 96.66s
  TOP_TEXT: local(96.66, S11), // 95
  // "질문을 던지세요" 97.94s
  ACCENT_TEXT: local(97.94, S11), // 133
  // "다음 시간엔" 99.68s
  CTA: local(99.68, S11), // 185
} as const;
