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
// 씬 1: 여의도 식당 (0~9.1s)
// "요즘 여의도의 식당들이 8시만 되면 문을 닫아요... 회식 자체가 거의 사라졌어요"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S1 = 0.0;
export const BEATS_RESTAURANT = {
  // "식당들이" 1.46s
  BUILDINGS_IN: local(0.5, S1),
  // "8시만 되면" 2.0~2.9s → 숫자 등장
  TIME_NUMBER: local(2.0, S1),
  // "문을 닫아요" 3.2~4.1s → 불 꺼짐 시작
  LIGHTS_OFF: local(3.2, S1),
  // "회식 자체가" 7.1~7.7s
  KEYWORD_IN: local(7.1, S1),
  // "사라졌어요" 8.2~9.1s
  KEYWORD_FULL: local(8.2, S1),
} as const;
export const SCENE1_DUR = Math.round((9.1 - S1) * FPS) + 30; // +1초 여유

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 2: 과거의 교육 (9.9~31.3s)
// "5년 전 배웠잖아요" → "만나라/선물/택배" → "그때는 먹히던 시대" → "근데 이제 아니죠"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S2 = 9.9;
export const BEATS_OLD_EDUCATION = {
  // "사람을 자꾸 만나라" 14.2~15.4s
  MEET: local(14.2, S2),
  // "선물 들고 가라" 16.1~16.9s
  GIFT: local(16.1, S2),
  // "택배 보내라" 17.3~18.0s
  DELIVERY: local(17.3, S2),
  // "그때는 그게 진짜 먹히던 시대" 26.0~29.3s
  WORKED: local(26.0, S2),
  // "근데 이제 아니죠" 29.9~31.3s → 전환점
  NOT_ANYMORE: local(29.9, S2),
} as const;
export const SCENE2_DUR = Math.round((31.3 - S2) * FPS) + 21; // +0.7초

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 3: MZ 고객 거부 (32.2~47.7s)
// "선물 들고 가보세요" → "안 받을게요" → "목적 있는 선물" → "보험 선물은 더 싫다"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S3 = 32.2;
export const BEATS_MZ_REJECT = {
  // "선물 들고 가보세요" 33.9~34.9s
  GIFT_EMOJI: local(33.9, S3),
  // "안 받을게요" 35.9~36.4s
  REJECT: local(35.9, S3),
  // "부담스러워서요" 36.8~37.2s
  BURDEN: local(36.8, S3),
  // "목적 있는 선물을 싫어하거든요" 40.7~42.5s
  INSIGHT: local(40.7, S3),
  // "보험 얘기하려고 주는 건 더 싫은 거예요" 45.5~47.7s
  ACCENT: local(45.5, S3),
} as const;
export const SCENE3_DUR = Math.round((47.7 - S3) * FPS) + 21;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 4-1: 의리 가입 종말 (47.7~58.3s)
// "의리로 가입해주는 시대, 끝났어요"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S4A = 47.7;
export const BEATS_LOYALTY_END = {
  // "두 번째" 47.7~49.1s
  NUMBER_IN: local(47.7, S4A),
  // "의리로 가입해주는 시대" 49.7~51.1s
  LOYALTY_TEXT: local(49.7, S4A),
  // "끝났어요" 51.4~52.2s
  END_TEXT: local(51.4, S4A),
} as const;
export const SCENE4A_DUR = Math.round((58.3 - S4A) * FPS) + 21;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 4-2: 10만원 (59.2~82.9s)
// "10만 원 값어치" → "형제끼리도 옮겨요" → "의리로 버티던 계약들이 흔들리고"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S4B = 59.2;
export const BEATS_TEN_MAN = {
  // "10만 원 값어치를" 60.8~62.0s
  NUMBER_IN: local(60.8, S4B),
  // "형제끼리도 회사 옮겨요" 69.5~71.4s
  BROTHERS: local(69.5, S4B),
  // "형 때문에 내가 왜 10만 원을 손해 봐" 71.4~74.0s
  QUOTE: local(71.4, S4B),
  // "의리 하나로 버티던 계약들이 흔들리고" 79.5~82.9s
  SHAKING: local(79.5, S4B),
} as const;
export const SCENE4B_DUR = Math.round((82.9 - S4B) * FPS) + 21;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 5: 보장분석의 벽 (83.7~111.2s)
// "이게 제일 무서워요" → "보장분석=벽" → "받아봤어요/10번/해약" → "방어모드"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S5 = 83.7;
export const BEATS_WALL = {
  // "이게 제일 무서워요" 85.0~86.0s
  SCARY_TEXT: local(85.0, S5),
  // "보장분석 해드릴게요" 86.8~87.6s
  ANALYSIS_TEXT: local(86.8, S5),
  // "이 말 자체가 벽이 돼버렸어요" 88.3~90.1s
  WALL_START: local(88.3, S5),
  // "받아 봤어요" 91.0~91.7s → 벽돌 1
  BRICK_1: local(91.0, S5),
  // "10번 받아 봤어요" 92.0~93.1s → 벽돌 2
  BRICK_2: local(92.0, S5),
  // "또 다 해약하라고 하는 거 아니에요?" 93.7~95.3s → 벽돌 3
  BRICK_3: local(93.7, S5),
  // "보장분석이라는 단어만 꺼내도" 107.0~108.5s
  JUST_THE_WORD: local(107.0, S5),
  // "고객이 방어모드로 들어가는 거예요" 109.0~111.2s
  DEFENSE_MODE: local(109.0, S5),
} as const;
export const SCENE5_DUR = Math.round((111.2 - S5) * FPS) + 21;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 6: 총정리 — 4가지 막힘 (111.2~121.8s)
// "대면이 어렵고 / 선물이 안 통하고 / 의리가 안 먹히고 / 보장분석 거부감"
// B안: 텍스트 순차 등장 + 취소선
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S6 = 111.2;
export const BEATS_SUMMARY = {
  // "대면이 어렵고" 113.1~114.2s
  LINE_1: local(113.1, S6),
  // "선물이 안 통하고" 114.2~115.6s
  LINE_2: local(114.2, S6),
  // "의리가 안 먹히고" 115.6~117.2s
  LINE_3: local(115.6, S6),
  // "보장분석이라는 말 자체도 거부감을 주는 세상" 118.6~121.8s
  LINE_4: local(118.6, S6),
  // 마지막 "세상" 121.4~121.8s
  WORLD: local(121.4, S6),
} as const;
export const SCENE6_DUR = Math.round((121.8 - S6) * FPS) + 30;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 7: 반전 — 무대가 바뀌었다 (122.5~139.1s)
// "실력 문제일까요?" → "아니에요" → "무대가 통째로 바뀐 거예요"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S7 = 122.5;
export const BEATS_STAGE_CHANGED = {
  // "실력 문제일까요?" 124.0~125.0s
  QUESTION: local(124.0, S7),
  // "아니에요" 125.8~126.1s
  DENY: local(125.8, S7),
  // "진짜 여러분 잘못 아니에요" 126.8~128.4s
  EMPATHY: local(126.8, S7),
  // "무대가" 129.2s
  KEYWORD_START: local(129.2, S7),
  // "통째로 바뀐 거예요" 129.4~130.6s
  KEYWORD_FULL: local(129.8, S7),
  // "더 억울하실 거예요" 133.9~135.1s
  SUB: local(133.9, S7),
} as const;
export const SCENE7_DUR = Math.round((139.1 - S7) * FPS) + 30;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 8: 순서를 뒤집는다 (139.1~151.1s)
// "접근을 뒤집어야 돼요" → "친해지고→전문성" → "전문성→관계"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S8 = 139.1;
export const BEATS_FLIP = {
  // "접근을 뒤집어야 돼요" 140.5~142.1s
  FLIP_TEXT: local(140.5, S8),
  // "친해지고 나서 전문성을 보여줬잖아요" 142.6~145.5s
  OLD_WAY: local(142.6, S8),
  // "이제는 순서를 뒤집는 거예요" 146.1~147.6s
  FLIP_MOMENT: local(146.1, S8),
  // "전문성부터 보여주고" 148.4~149.6s
  NEW_WAY: local(148.4, S8),
  // "관계는 그 다음에 따라오게" 149.6~151.5s
  FOLLOW: local(149.6, S8),
} as const;
export const SCENE8_DUR = Math.round((151.1 - S8) * FPS) + 21;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 9: 클로징 (152.4~166.7s)
// "LINK 컨설팅이 나온 배경" → "생존의 문제" → "함께 나눠보도록"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S9 = 152.4;
export const BEATS_CLOSING = {
  // "링크 컨설팅이 나온 배경이에요" 152.7~154.5s
  LINK_TEXT: local(152.7, S9),
  // "첫 통화가 마지막 통화가 되는" 156.7~158.5s
  FIRST_LAST: local(156.7, S9),
  // "생존의 문제예요" 160.4~161.5s
  SURVIVAL: local(160.4, S9),
  // "함께 나눠보도록 할게요" 165.8~166.7s
  CTA: local(165.8, S9),
} as const;
export const SCENE9_DUR = Math.round((166.7 - S9) * FPS) + 75; // +2.5초 여유

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 전체 타이밍 — 음성 타임스탬프 기반 절대값
// 씬 시작 = 해당 음성이 시작하는 오디오 초 → T()로 글로벌 프레임 변환
// GAP 없음 — 음성 자체의 호흡 쉼이 자연스러운 간격
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SCENE_STARTS = {
  TITLE: 0,
  S1: T(0),         // 120  — 음성 시작
  S2: T(9.9),       // 417  — "불과 5년 전만 해도"
  S3: T(32.2),      // 1086 — "요즘 이관받은 MZ"
  S4A: T(47.7),     // 1551 — "두 번째, 의리로"
  S4B: T(59.2),     // 1896 — "내가 1년에 이 고객한테"
  S5: T(83.7),      // 2631 — "세 번째, 이게 제일"
  S6: T(111.2),     // 3456 — "FP 여러분, 대면이"
  S7: T(122.5),     // 3795 — "이게 FP 한 분 한 분"
  S8: T(139.1),     // 4293 — "그래서 우리가 접근을"
  S9: T(152.4),     // 4692 — "이게 링크 컨설팅이"
} as const;

/** 씬 길이 = 다음 씬 시작 - 이 씬 시작 (마지막 씬은 음성 끝 + 여유) */
export const SCENE_DURS = {
  S1: SCENE_STARTS.S2 - SCENE_STARTS.S1,
  S2: SCENE_STARTS.S3 - SCENE_STARTS.S2,
  S3: SCENE_STARTS.S4A - SCENE_STARTS.S3,
  S4A: SCENE_STARTS.S4B - SCENE_STARTS.S4A,
  S4B: SCENE_STARTS.S5 - SCENE_STARTS.S4B,
  S5: SCENE_STARTS.S6 - SCENE_STARTS.S5,
  S6: SCENE_STARTS.S7 - SCENE_STARTS.S6,
  S7: SCENE_STARTS.S8 - SCENE_STARTS.S7,
  S8: SCENE_STARTS.S9 - SCENE_STARTS.S8,
  S9: T(166.7) + 75 - SCENE_STARTS.S9, // 음성 끝 + 2.5초 여유
} as const;

export const TOTAL_FRAMES = SCENE_STARTS.S9 + SCENE_DURS.S9;
