/**
 * EP05 임신해도, 임신 안 돼도 — BEATS 타이밍 데이터 (v3 — Whisper 정밀 매핑)
 */

export const FPS = 30;
export const TITLE_DUR = 120;
export const AUDIO_START = TITLE_DUR;

export const T = (sec: number) => Math.round(sec * FPS) + AUDIO_START;

const local = (audioSec: number, sceneStartSec: number) =>
  Math.round((audioSec - sceneStartSec) * FPS);

// ━━ 씬 1: 카페 거절 (0~15s) ━━
const S1 = 0.0;
export const BEATS_S1 = {
  CAFE_IN: local(0.0, S1),
  CUSTOMER_BUBBLE: local(9.2, S1),     // "저 보험 관심 없거든요"
  DOOR_CLOSED: local(15.0, S1),        // "벌써 문이 닫혀"
} as const;

// ━━ 씬 2: 이러면 끝이에요 (15~25s) ━━
const S2 = 15.0;
export const BEATS_S2 = {
  WARNING: local(16.9, S2),            // "여기서 보장 봐드릴게요 하면?"
  END_TEXT: local(21.2, S2),           // "오늘 상담은 끝이에요"
  COFFEE: local(22.9, S2),            // "커피만 마시고 헤어지는 거예요"
} as const;

// ━━ 씬 3: 고객 머릿속 + 새로운 조합 (25~52s, sub-phases) ━━
const S3 = 25.0;
export const BEATS_S3 = {
  // Phase 1: 왜?
  WHY: local(25.3, S3),               // "왜 끝이냐면요"
  MIND_INTRO: local(26.9, S3),        // "보험이라는 분야는 고객 머릿속에"
  ROW1: local(35.8, S3),              // "좋은 상품 → 팔려는 거구나"
  ROW2: local(38.2, S3),              // "혜택 → 돈 더 내라는 거지"
  // Phase 2: 결론
  SETUP: local(41.0, S3),             // "답이 정해진 질문으로는 안 돼요"
  CONCLUSION: local(44.7, S3),        // "들어본 적 없는 조합"
} as const;

// ━━ 씬 4: FP 후킹 멘트 (52~67s) ━━
const S4 = 52.0;
export const BEATS_S4 = {
  FP_CONTEXT: local(53.2, S4),        // "우리 FP님이 자료 한장 꺼내지 않고"
  HOOK_TEXT: local(63.1, S4),         // "혹시 임신하면 돈 받고"
} as const;

// ━━ 씬 5: 고객 반응 멈춤 (67~74s) ━━
const S5 = 67.0;
export const BEATS_S5 = {
  COFFEE_DOWN: local(68.1, S5),       // "커피잔 내려놓고 쳐다봐요"
  REACTION: local(70.1, S5),          // "네? 그게 뭐예요?"
  STOPPED: local(72.0, S5),           // "고객의 반응이 멈췄어요"
} as const;

// ━━ 씬 6: 보장 카드 (74~112s) ━━
const S6 = 74.0;
export const BEATS_S6 = {
  FP_SMILE: local(74.1, S6),          // "FP님이 웃으면서"
  FRIENDS_Q: local(82.4, S6),         // "결혼 준비하는 친구들 있으세요?"
  HAPPY_CARD: local(95.6, S6),        // "임신이 잘 돼서 임신축하금, 출산축하금"
  SAD_CARD: local(102.1, S6),         // "난임병원 다니시게 되면 난임진단비"
} as const;

// ━━ 씬 7: 고객 반응 + 핵심 포인트 (112~125s) ━━
const S7 = 112.0;
export const BEATS_S7 = {
  FACE_CHANGE: local(112.1, S7),      // "고객 표정이 바뀌어요"
  NANIME: local(114.9, S7),           // "친구가 난임병원 다니는데"
  KEY_POINT: local(122.8, S7),        // "고객이 먼저 궁금해한 거예요"
} as const;

// ━━ 씬 8: 실수 경고 + 물러남 (125~155s, sub-phases) ━━
const S8 = 125.0;
export const BEATS_S8 = {
  MISTAKE_WARN: local(125.5, S8),     // "실수하면 안 되는 게 있어요"
  PRODUCT_INSTINCT: local(127.9, S8), // "관심을 보이면 상품설명 시작"
  DOOR_CLOSE: local(137.6, S8),       // "고객 마음의 문이 다시 닫혀요"
  STEP_BACK: local(139.3, S8),        // "이 FP는 달랐어요 → 한 발 물러나요"
  RESERVATION: local(151.1, S8),      // "예약담보로 신청하시면 돈을 안 내요"
} as const;

// ━━ 씬 9: "가능해요?" + 거절 대응 (155~178s, sub-phases) ━━
const S9 = 155.0;
export const BEATS_S9 = {
  CUSTOMER_ASK: local(157.1, S9),     // "그게 가능해요?"
  KEEP_ASKING: local(160.3, S9),      // "부담을 주지 않으니까 자꾸 물어보는"
  REJECTION: local(165.5, S9),        // "저 결혼 생각 없는데요"
  COUNTER: local(170.6, S9),          // "아 오히려 더 좋아요"
  NO_LOSS: local(177.8, S9),          // "손해는 없습니다"
} as const;

// ━━ 씬 10: 순서 반전 (178~201s, sub-phases) ━━
const S10 = 178.0;
export const BEATS_S10 = {
  OLD_WAY: local(181.2, S10),         // "예전같으면 결혼계획 있으세요?"
  PRIVATE_Q: local(188.4, S10),       // "사적인 부분을 질문하는 건"
  BURDEN: local(190.9, S10),          // "고객에게 부담을 주게 될 수"
  REVERSE: local(193.0, S10),         // "순서가 반대입니다"
  OPEN_DOOR: local(196.5, S10),       // "문을 열어주면 고객이 알아서"
} as const;

// ━━ 씬 11: 정리 3포인트 (201~218s) ━━
const S11 = 201.0;
export const BEATS_S11 = {
  POINT_1: local(205.4, S11),         // "첫째"
  POINT_2: local(209.2, S11),         // "둘째"
  POINT_3: local(214.1, S11),         // "셋째"
} as const;

// ━━ 씬 12: 클로징 (218~232s) ━━
const S12 = 218.0;
export const BEATS_S12 = {
  HOOKING_LABEL: local(218.1, S12),   // "이게 후킹이에요"
  MAIN_MESSAGE: local(221.0, S12),    // "고객이 듣고 싶게 만드는 거"
  NEXT_PREVIEW: local(224.2, S12),    // "다음 편에서는 두 번째 후킹"
} as const;

// ━━ 전체 타이밍 ━━
export const SCENE_STARTS = {
  TITLE: 0,
  S1: T(S1), S2: T(S2), S3: T(S3), S4: T(S4),
  S5: T(S5), S6: T(S6), S7: T(S7), S8: T(S8),
  S9: T(S9), S10: T(S10), S11: T(S11), S12: T(S12),
} as const;

const LAST_DUR = Math.round((232.3 - S12) * FPS) + 75;

export const SCENE_DURS = {
  S1: SCENE_STARTS.S2 - SCENE_STARTS.S1,
  S2: SCENE_STARTS.S3 - SCENE_STARTS.S2,
  S3: SCENE_STARTS.S4 - SCENE_STARTS.S3,
  S4: SCENE_STARTS.S5 - SCENE_STARTS.S4,
  S5: SCENE_STARTS.S6 - SCENE_STARTS.S5,
  S6: SCENE_STARTS.S7 - SCENE_STARTS.S6,
  S7: SCENE_STARTS.S8 - SCENE_STARTS.S7,
  S8: SCENE_STARTS.S9 - SCENE_STARTS.S8,
  S9: SCENE_STARTS.S10 - SCENE_STARTS.S9,
  S10: SCENE_STARTS.S11 - SCENE_STARTS.S10,
  S11: SCENE_STARTS.S12 - SCENE_STARTS.S11,
  S12: LAST_DUR,
} as const;

export const TOTAL_FRAMES = SCENE_STARTS.S12 + SCENE_DURS.S12;
