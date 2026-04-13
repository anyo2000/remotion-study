import type { EpisodeData } from "../types";

/**
 * 왜 후킹인가 — V2
 * 4A(직선+고개 숙임) + 6A(음파 최대+원 회전, Scene 5와 연결)
 */

const TITLE_DUR = 60;
const T = (sec: number) => Math.round(sec * 30) + TITLE_DUR;

export const hookingWhyV2: EpisodeData = {
  meta: {
    id: "hooking-why-v2",
    title: "왜 후킹인가",
    category: "L",
    episodeNumber: 3,
    palette: "orange",
    audioFile: "audio/link-edu-hooking-why.wav",
    audioOffset: TITLE_DUR,
    totalDurationFrames: T(82),
  },
  scenes: [
    {
      type: "titlecard" as any,
      startFrame: 0,
      category: "L",
      categoryLabel: "후킹",
      episodeTitle: "왜 후킹인가",
    },

    // 2A: 물음표 쪼개짐
    { type: "questionsplit", startFrame: T(2.5), cues: {} },

    // 3B: ? 물처럼 차오름
    { type: "risingquestions", startFrame: T(11.2), cues: {} },

    // 4A: 직선(좌석) + 원(머리) 고개 숙임 + 폰 빛
    { type: "subwayline", startFrame: T(15.5), cues: {} },

    // 5A: 하나가 고개 들고 음파 → 연쇄 반응
    { type: "chainreaction", startFrame: T(20.6), cues: {} },

    // 6A: 음파 최대 확장 → 모든 원 중앙 회전 → 빛줄기 합쳐짐 → "전원이"
    { type: "wavefocus", startFrame: T(28.1), headline: "전원이", cues: {} },

    // 7A-C: 물음표 균열 → 터짐 → 파편
    { type: "puzzleburst", startFrame: T(31.9), headline: "답이", sub: "안 나왔으니까", cues: {} },

    // 7B-A: 필름 스트립 끊김
    { type: "filmstrip", startFrame: T(36.7), cues: {} },

    // 8A: 낚시줄
    { type: "fishing", startFrame: T(42.5), cues: {} },

    // 9A: 모래시계
    { type: "hourglass", startFrame: T(50.0), cues: {} },

    // 10A: 벽돌+대화
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

    // 11B: 기존 클로징
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
