import type { EpisodeData } from "../types";

/** Phase 2 테스트용 — 핵심 장면 3종(keyword, dialogue, comparison) 검증 */
export const templateTest: EpisodeData = {
  meta: {
    id: "template-test",
    title: "템플릿 테스트",
    category: "L",
    episodeNumber: 0,
    palette: "linkEdu",
    audioFile: "audio/april-gift-aoede.wav", // 임시 오디오 (테스트용)
    totalDurationFrames: 900, // 30초
  },
  scenes: [
    // ── 키워드 장면 (0~300fr, 10초) ──
    {
      type: "keyword",
      startFrame: 0,
      headline: "3초 후킹",
      sub: "고객의 판단 시간",
      emoji: "⏱️",
      accentWord: "3초",
      cues: { "3초": 10 },
    },

    // ── 대화 장면 (300~600fr, 10초) ──
    {
      type: "dialogue",
      startFrame: 300,
      exchanges: [
        { speaker: "fp", text: "보험 살펴보시겠어요?", delay: 15 },
        { speaker: "customer", text: "괜찮아요~", emoji: "🙅", delay: 60 },
        { speaker: "fp", text: "매달 천 원이면 암 수술 때 천만 원이에요", emoji: "💡", delay: 120 },
        { speaker: "customer", text: "그게 뭐예요?", emoji: "🤔", delay: 180 },
      ],
      headline: "후킹 전 vs 후",
      cues: { "보험": 10 },
    },

    // ── 비교 장면 (600~900fr, 10초) ──
    {
      type: "comparison",
      startFrame: 600,
      wrong: {
        label: "기존 방식",
        text: "보장 분석 해드릴까요?",
        emoji: "📋",
      },
      right: {
        label: "LINK 화법",
        text: "확인해드릴 게 있어서요",
        emoji: "💡",
      },
      headline: "첫마디를 바꾸세요",
      cues: { "기존": 15, "LINK": 75 },
    },
  ],
};
