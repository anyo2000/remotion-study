import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPRING } from "../constants";
import { W, WineLayout } from "./WineLayout";
import { BEATS_CLOSING as B } from "./wine-talk-beats";

/**
 * 씬7: 클로징 [카드 나열]
 * "5잔, 싹 다" + 🍷×5 → OK 3연타 → "궁금한 마음만 챙겨오세요!"
 */
export const Scene7_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = spring({
    frame: Math.max(0, frame - B.HEADLINE),
    fps,
    config: SPRING.bouncy,
  });
  const finalIn = spring({
    frame: Math.max(0, frame - B.FINAL),
    fps,
    config: SPRING.bouncy,
  });
  // 마지막 문구 은은한 펄스 (등장 후)
  const finalPulse =
    1 + Math.sin(Math.max(0, frame - B.FINAL) * 0.07) * 0.015;

  const okBeats = [B.OK1, B.OK2, B.OK3];
  const okTexts = ["와인 몰라도", "술 안 좋아해도", "많이 못 마셔도"];

  return (
    <WineLayout>
      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* 헤드라인 */}
        <div
          style={{
            position: "absolute",
            top: 380,
            transform: `scale(${headIn})`,
            fontSize: 88,
            fontWeight: 900,
            color: W.text,
            whiteSpace: "nowrap",
          }}
        >
          5잔, 싹 다 마셔봅니다
        </div>

        {/* 🍷 5개 */}
        <div
          style={{
            position: "absolute",
            top: 560,
            display: "flex",
            gap: 24,
          }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const s = spring({
              frame: Math.max(0, frame - (B.GLASSES + i * 4)),
              fps,
              config: SPRING.bouncy,
            });
            return (
              <div
                key={i}
                style={{
                  fontSize: 110,
                  lineHeight: 1,
                  transform: `scale(${s})`,
                }}
              >
                🍷
              </div>
            );
          })}
        </div>

        {/* OK 3연타 */}
        <div
          style={{
            position: "absolute",
            top: 830,
            display: "flex",
            flexDirection: "column",
            gap: 34,
            alignItems: "center",
          }}
        >
          {okTexts.map((t, i) => {
            const s = spring({
              frame: Math.max(0, frame - okBeats[i]),
              fps,
              config: SPRING.bouncy,
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  background: W.card,
                  border: `2px solid ${W.cardBorder}`,
                  borderRadius: 60,
                  padding: "22px 50px",
                  transform: `scale(${s}) rotate(${(i - 1) * 1.2}deg)`,
                  boxShadow: "0 6px 0 rgba(58,44,34,0.08)",
                }}
              >
                <span
                  style={{
                    fontSize: 62,
                    fontWeight: 700,
                    color: W.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </span>
                <span
                  style={{
                    fontSize: 66,
                    fontWeight: 900,
                    color: W.accent,
                  }}
                >
                  OK
                </span>
              </div>
            );
          })}
        </div>

        {/* 궁금한 마음만 챙겨오세요! */}
        <div
          style={{
            position: "absolute",
            top: 1440,
            width: "100%",
            textAlign: "center",
            transform: `scale(${finalIn * finalPulse})`,
            fontSize: 86,
            fontWeight: 900,
            color: W.accent,
            lineHeight: 1.35,
            whiteSpace: "pre-line",
          }}
        >
          궁금한 마음만{"\n"}챙겨오세요!
        </div>
      </AbsoluteFill>
    </WineLayout>
  );
};
