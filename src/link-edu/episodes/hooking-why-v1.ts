import type { EpisodeData } from "../types";

/**
 * 왜 후킹인가 — V1
 * 4B(세로 칸막이) + 6B(화살표 수렴)
 */

const TITLE_DUR = 60;
const T = (sec: number) => Math.round(sec * 30) + TITLE_DUR;

export const hookingWhyV1: EpisodeData = {
  meta: {
    id: "hooking-why-v1",
    title: "왜 후킹인가",
    category: "L",
    episodeNumber: 3,
    palette: "orange",
    audioFile: "audio/link-edu-hooking-why.wav",
    audioOffset: TITLE_DUR,
    totalDurationFrames: T(82),
  },
  scenes: [
    // 타이틀 (0~60fr, 2초 정적)
    {
      type: "titlecard" as any,
      startFrame: 0,
      category: "L",
      categoryLabel: "후킹",
      episodeTitle: "왜 후킹인가",
    },

    // 2A: 물음표 쪼개짐 — "파라고? 말라고?"
    {
      type: "questionsplit",
      startFrame: T(2.5),
      cues: {},
    },

    // 3B: ? 물처럼 차오름 → "궁금하죠?"
    {
      type: "risingquestions",
      startFrame: T(11.2),
      cues: {},
    },

    // 4B: 세로 칸막이(지하철 창문) + 고개 숙인 실루엣
    {
      type: "subwayframe",
      startFrame: T(15.5),
      cues: {},
    },

    // 5A: 하나가 고개 들고 음파 → 연쇄 반응
    {
      type: "chainreaction",
      startFrame: T(20.6),
      cues: {},
    },

    // 6B: 화살표/선이 중앙으로 수렴 → 섬광 + "전원이"
    {
      type: "arrowfocus",
      startFrame: T(28.1),
      headline: "전원이",
      cues: {},
    },

    // 7A-C: 물음표 균열 → 터짐 → 파편 → "답이 안 나왔으니까"
    {
      type: "puzzleburst",
      startFrame: T(31.9),
      headline: "답이",
      sub: "안 나왔으니까",
      cues: {},
    },

    // 7B-A: 필름 스트립 끊김 → 빈 프레임 → "다음 편 →"
    {
      type: "filmstrip",
      startFrame: T(36.7),
      cues: {},
    },

    // 8A: 낚시줄 — 미끼(설명) 안 물림, 미끼(질문) 물림
    {
      type: "fishing",
      startFrame: T(42.5),
      cues: {},
    },

    // 9A: 모래시계 카운트다운
    {
      type: "hourglass",
      startFrame: T(50.0),
      cues: {},
    },

    // 10A: 벽돌 쌓기(거절) → 질문이 벽 관통 → 무너짐
    {
      type: "brickdialogue",
      startFrame: T(54.4),
      exchanges: [
        { speaker: "fp" as const, text: "보장 분석\n해드리려고요", emoji: "😐", delay: 10 },
        { speaker: "customer" as const, text: "괜찮아요", emoji: "🙅", delay: 50 },
        { speaker: "fp" as const, text: "임신해도 돈 받고\n안 해도 돈 받는 거\n아세요?", emoji: "💡", delay: T(63.9) - T(54.4) },
        { speaker: "customer" as const, text: "그게 뭐예요?", emoji: "🤔", delay: T(67.4) - T(54.4) },
      ],
      cues: {},
    },

    // 11B: 기존 BlurText 클로징
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
