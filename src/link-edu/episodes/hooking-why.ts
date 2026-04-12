import type { EpisodeData } from "../types";

/**
 * ❸ 왜 후킹인가 — 3초의 법칙
 * 음성: public/audio/link-edu-hooking-why.wav (약 80초)
 *
 * 텍스트 원칙: 키워드만. 문장 금지. 한 화면에 2줄 이내.
 */

const TITLE_DUR = 45; // 타이틀 카드 1.5초
const T = (sec: number) => Math.round(sec * 30) + TITLE_DUR;

export const hookingWhy: EpisodeData = {
  meta: {
    id: "hooking-why",
    title: "왜 후킹인가",
    category: "L",
    episodeNumber: 3,
    palette: "orange",
    audioFile: "audio/link-edu-hooking-why.wav",
    totalDurationFrames: T(82),
  },
  scenes: [
    // ── 타이틀 카드 (0~45fr) ──
    {
      type: "titlecard" as any,
      startFrame: 0,
      category: "L",
      categoryLabel: "후킹",
      episodeTitle: "왜 후킹인가",
    },

    // ── 1. 첫 질문 (45fr~) ── "의사가 귓구멍을..." 2.5s
    {
      type: "keyword",
      startFrame: TITLE_DUR,
      headline: "귓구멍을\n파라고 해요?\n파지 말라고 해요?",
      emoji: "🤔",
      cues: {},
    },

    // ── 2. 안 궁금한 사람 없음 (11.2s) ──
    {
      type: "keyword",
      startFrame: T(11.2),
      headline: "궁금하죠?",
      sub: "지하철에서 생긴 일",
      emoji: "🚇",
      cues: {},
    },

    // ── 3. 지하철 — 다 폰만 봄 (15.5s) ──
    {
      type: "keyword",
      startFrame: T(15.5),
      headline: "아무도 안 봐요",
      emoji: "📱",
      sub: "다 폰만 보죠",
      cues: {},
    },

    // ── 4. 한 아저씨 — 질문 반복 (20.6s) ──
    {
      type: "keyword",
      startFrame: T(20.6),
      headline: "귓구멍을\n파라고 해요?",
      sub: "한 아저씨가 이렇게 말했어요",
      emoji: "🗣️",
      cues: {},
    },

    // ── 5. 전원이 쳐다봤다 (28.1s) ──
    {
      type: "keyword",
      startFrame: T(28.1),
      headline: "전원이\n쳐다봤어요",
      emoji: "😳",
      accentWord: "전원이",
      cues: {},
    },

    // ── 6. 왜? 답이 안 나왔으니까 (31.9s) ──
    {
      type: "keyword",
      startFrame: T(31.9),
      headline: "답이\n안 나왔으니까",
      emoji: "🧠",
      accentWord: "답이",
      sub: "드라마가 끊기면\n다음 편 보는 것과 같아요",
      cues: {},
    },

    // ── 7. 홈쇼핑 비교 (42.5s) ──
    {
      type: "comparison",
      startFrame: T(42.5),
      wrong: {
        label: "채널 돌림",
        text: "여행 상품을\n소개해드리면...",
        emoji: "📺",
      },
      right: {
        label: "채널 못 돌림",
        text: "참기름은\n바로 짠 게 맛있나요?",
        emoji: "❓",
      },
      headline: "홈쇼핑 = 질문",
      cues: {},
    },

    // ── 8. 3초 (50.0s) ──
    {
      type: "keyword",
      startFrame: T(50.0),
      headline: "3초",
      sub: "들을지 말지\n결정하는 시간",
      emoji: "⏱️",
      accentWord: "3초",
      cues: {},
    },

    // ── 9. 비포/애프터 대화 (54.4s) ──
    {
      type: "dialogue",
      startFrame: T(54.4),
      exchanges: [
        {
          speaker: "fp",
          text: "보장 분석\n해드리려고요",
          emoji: "😐",
          delay: 10,
        },
        {
          speaker: "customer",
          text: "괜찮아요",
          emoji: "🙅",
          delay: 50,
        },
        {
          speaker: "fp",
          text: "임신해도 돈 받고\n안 해도 돈 받는 거\n아세요?",
          emoji: "💡",
          delay: T(63.9) - T(54.4),
        },
        {
          speaker: "customer",
          text: "그게 뭐예요?",
          emoji: "🤔",
          delay: T(67.4) - T(54.4),
        },
      ],
      headline: "첫마디만 바꿨을 뿐",
      cues: {},
    },

    // ── 10. 클로징 (72.8s) ──
    {
      type: "closing" as any,
      startFrame: T(72.8),
      takeaway: "답을 주지 마세요\n질문을 던지세요",
      accentWords: ["질문"],
      emoji: "🎯",
      cta: "다음 편 → 임신 화법 실전",
      cues: {},
    },
  ],
};
