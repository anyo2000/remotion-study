import type { EpisodeData } from "../types";

/**
 * ❸ 왜 후킹인가 — 3초의 법칙
 * 음성: public/audio/link-edu-hooking-why.wav (약 80초)
 *
 * 타이틀 2초(60fr) 후 오디오 시작.
 * T(sec) = 타임스탬프 초 × 30fps + 60(타이틀 오프셋)
 */

const TITLE_DUR = 60; // 타이틀 카드 2초
const T = (sec: number) => Math.round(sec * 30) + TITLE_DUR;

export const hookingWhy: EpisodeData = {
  meta: {
    id: "hooking-why",
    title: "왜 후킹인가",
    category: "L",
    episodeNumber: 3,
    palette: "orange",
    audioFile: "audio/link-edu-hooking-why.wav",
    audioOffset: TITLE_DUR,
    totalDurationFrames: T(82),
  },
  scenes: [
    // ── 타이틀 카드 (0~60fr, 2초) — 정적 ──
    {
      type: "titlecard" as any,
      startFrame: 0,
      category: "L",
      categoryLabel: "후킹",
      episodeTitle: "왜 후킹인가",
    },

    // ── 2. 귓구멍 질문 (2.5s~11.2s) ──
    // ❓ 중앙 + "파라고?" / "말라고?" 양쪽 대치
    {
      type: "keyword",
      startFrame: T(2.5),
      headline: "파라고?\n말라고?",
      emoji: "❓",
      cues: {},
    },

    // ── 3. 궁금하죠? (11.2s~15.5s) ──
    // 표정 이모지 팝업 + "궁금하죠?" 한 단어
    {
      type: "keyword",
      startFrame: T(11.2),
      headline: "궁금하죠?",
      emoji: "🤨",
      cues: {},
    },

    // ── 4. 지하철 - 다 폰만 봐요 (15.5s~20.6s) ──
    // 📱 도형만, 텍스트 없음
    {
      type: "keyword",
      startFrame: T(15.5),
      headline: "",
      emoji: "📱",
      cues: {},
    },

    // ── 5. 한 아저씨 질문 (20.6s~28.1s) ──
    // 🗣️ + 음파 + 📱들이 고개 듦
    {
      type: "keyword",
      startFrame: T(20.6),
      headline: "귓구멍을\n파라고 해요?",
      emoji: "🗣️",
      cues: {},
    },

    // ── 6. 전원이 쳐다봤어요 (28.1s~31.9s) ──
    // 👁️ 8개 시선 집중 + 시선선 + "전원이" 임팩트
    {
      type: "eyefocus",
      startFrame: T(28.1),
      headline: "전원이",
      accentWord: "전원이",
      cues: {},
    },

    // ── 7A. 답이 안 나왔으니까 (31.9s~36.7s) ──
    // ❗ 쿵 떨어짐 + 화면 shake + "답이 안 나왔으니까"
    {
      type: "impact",
      startFrame: T(31.9),
      dropEmoji: "❗",
      headline: "답이",
      sub: "안 나왔으니까",
      accentWord: "답이",
      cues: {},
    },

    // ── 7B. 드라마 끊기면 (36.7s~42.5s) ──
    // 텍스트 없음 — 📺→노이즈→🧑+❓→▶️
    {
      type: "visualstory",
      startFrame: T(36.7),
      cues: {},
    },

    // ── 8. 홈쇼핑 = 질문 (42.5s~50.0s) ──
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

    // ── 9. 3초 (50.0s~54.4s) ──
    // 원형 타이머 카운트다운
    {
      type: "keyword",
      startFrame: T(50.0),
      headline: "3초",
      number: { from: 3, to: 0 },
      sub: "결정",
      emoji: "⏱️",
      accentWord: "3초",
      cues: {},
    },

    // ── 10. 대화 비교 Before/After (54.4s~72.8s) ──
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

    // ── 11. 클로징 (72.8s~끝) ──
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
