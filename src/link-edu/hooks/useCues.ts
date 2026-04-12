import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SPRING } from "../../constants";

/**
 * 음성 싱크 큐를 소비하는 훅
 * cues: { "키워드": 프레임번호 } 형태
 */
export function useCues(cues: Record<string, number> | undefined) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return {
    /** 해당 큐가 이미 발화됐는지 */
    hasFired: (key: string) =>
      cues?.[key] !== undefined && frame >= cues[key],

    /** 큐의 프레임 번호 (없으면 fallback) */
    getFrame: (key: string, fallback = 0) => cues?.[key] ?? fallback,

    /** 큐 발화 후 spring 진행률 (0~1) */
    getProgress: (key: string, config = SPRING.smooth) => {
      const cueFrame = cues?.[key];
      if (cueFrame === undefined) return 0;
      return spring({
        frame: Math.max(0, frame - cueFrame),
        fps,
        config,
      });
    },
  };
}
