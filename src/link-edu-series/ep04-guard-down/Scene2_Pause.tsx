import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep04SceneLayout } from "./Ep04SceneLayout";
import { BEATS_PAUSE } from "./ep04-beats";

const palette = PALETTES.ep01;
const B = BEATS_PAUSE;

/**
 * 씬 2: 멈칫 — 허탈, 자기 의심
 * 🧑‍💼 실루엣(크게) → "내가 뭘 잘못했지?" → "몇 년 전엔 통했던 멘트"
 */
export const Scene2_Pause: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const silhouetteIn = spring({
    frame: Math.max(0, frame - B.SILHOUETTE_IN),
    fps,
    config: SPRING.heavy,
  });

  const questionIn = spring({
    frame: Math.max(0, frame - B.QUESTION_TEXT),
    fps,
    config: SPRING.smooth,
  });

  const fiveYearsIn = spring({
    frame: Math.max(0, frame - B.FIVE_YEARS),
    fps,
    config: SPRING.smooth,
  });

  const notWorkingIn = spring({
    frame: Math.max(0, frame - B.NOT_WORKING),
    fps,
    config: SPRING.smooth,
  });

  return (
    <Ep04SceneLayout hideHeader>
      {/* 어두운 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 🧑‍💼 실루엣 — 크게 */}
        <div
          style={{
            fontSize: 160,
            lineHeight: 1,
            opacity: silhouetteIn * 0.5,
          }}
        >
          🧑‍💼
        </div>

        {/* "내가 뭘 잘못했지?" */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 900,
            color: palette.accent,
            opacity: questionIn,
            transform: `translateY(${interpolate(questionIn, [0, 1], [15, 0])}px)`,
          }}
        >
          "내가 뭘 잘못했지?"
        </div>

        {/* "몇 년 전엔 통했던 멘트" */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: palette.sub,
            opacity: fiveYearsIn * 0.8,
            transform: `translateY(${interpolate(fiveYearsIn, [0, 1], [10, 0])}px)`,
          }}
        >
          몇 년 전엔 통했던 멘트
        </div>

        {/* "그게 어제는 안 통한 거예요" */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.text,
            opacity: notWorkingIn,
          }}
        >
          어제는 안 통했다
        </div>
      </div>
    </Ep04SceneLayout>
  );
};
