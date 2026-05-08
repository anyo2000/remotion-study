import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { Ep04SceneLayout } from "./Ep04SceneLayout";
import { BEATS_REPLACE } from "./ep04-beats";

const palette = PALETTES.ep01;
const B = BEATS_REPLACE;

const ROWS = [
  {
    before: "보장분석 해드리려고요",
    after: "설명해드릴 게 있어서",
    beforeDelay: B.ROW1_BEFORE,
    afterDelay: B.ROW1_AFTER,
  },
  {
    before: "보험이 부족하신 것 같다",
    after: "바뀐 치료방법이 적용되는지",
    beforeDelay: B.ROW2_BEFORE,
    afterDelay: B.ROW2_AFTER,
  },
  {
    before: "가입설계 동의 해주세요",
    after: "숫자만 확인해주시면",
    beforeDelay: B.ROW3_BEFORE,
    afterDelay: B.ROW3_AFTER,
  },
] as const;

/**
 * 씬 5: 단어 치환 — BEFORE→AFTER 3행 변환
 */
export const Scene5_Replace: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Ep04SceneLayout pageTitle="같은 뜻, 다른 표현" dense wide>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          width: "100%",
        }}
      >
        {ROWS.map((row, i) => {
          const beforeIn = spring({
            frame: Math.max(0, frame - row.beforeDelay),
            fps,
            config: SPRING.smooth,
          });

          const afterIn = spring({
            frame: Math.max(0, frame - row.afterDelay),
            fps,
            config: SPRING.smooth,
          });

          // BEFORE 취소선
          const strikeProgress = spring({
            frame: Math.max(0, frame - row.afterDelay),
            fps,
            config: SPRING.heavy,
          });

          // BEFORE가 dim 되는 효과
          const beforeDim = afterIn > 0
            ? interpolate(afterIn, [0, 1], [1, 0.4])
            : 1;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 32,
                opacity: beforeIn,
              }}
            >
              {/* BEFORE */}
              <div
                style={{
                  width: 520,
                  padding: "20px 28px",
                  borderRadius: 16,
                  backgroundColor: "rgba(224, 90, 90, 0.06)",
                  border: "1px solid rgba(224, 90, 90, 0.15)",
                  position: "relative",
                  opacity: beforeDim,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    fontWeight: 600,
                    color: palette.sub,
                  }}
                >
                  {row.before}
                </span>
                {/* 취소선 */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 20,
                    right: 20,
                    height: 3,
                    backgroundColor: "#E05A5A",
                    transform: `scaleX(${strikeProgress})`,
                    transformOrigin: "left",
                    opacity: strikeProgress * 0.7,
                  }}
                />
              </div>

              {/* 화살표 */}
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 56,
                  fontWeight: 700,
                  color: palette.accent,
                  opacity: afterIn,
                  flexShrink: 0,
                }}
              >
                →
              </div>

              {/* AFTER */}
              <div
                style={{
                  width: 520,
                  padding: "20px 28px",
                  borderRadius: 16,
                  backgroundColor: "rgba(78, 205, 196, 0.08)",
                  border: `1px solid rgba(78, 205, 196, ${afterIn > 0 ? 0.3 : 0.1})`,
                  opacity: afterIn,
                  transform: `translateX(${interpolate(afterIn, [0, 1], [20, 0])}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    fontWeight: 700,
                    color: palette.text,
                  }}
                >
                  {row.after}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Ep04SceneLayout>
  );
};
