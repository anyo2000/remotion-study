import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPRING } from "../constants";
import { W, WineLayout, WineBadge, WineChip } from "./WineLayout";
import { BEATS_SAUVIGNON as B } from "./wine-talk-beats";

/**
 * 씬3: WINE 02 소비뇽 블랑 [키워드 강조]
 * 🤔 히어로 + "아직도 클라우디 베이만?" + 칩 2개
 */
export const Scene3_Sauvignon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - B.EMOJI),
    fps,
    config: SPRING.bouncy,
  });
  const questionIn = spring({
    frame: Math.max(0, frame - B.QUESTION),
    fps,
    config: SPRING.smooth,
  });
  // 물음표 흔들림 — 등장 후 감쇠
  const wiggleDecay = interpolate(
    frame,
    [B.QUESTION, B.QUESTION + 50],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const wiggle = Math.sin((frame - B.QUESTION) / 2.4) * 12 * wiggleDecay;

  const chip1 = spring({
    frame: Math.max(0, frame - B.CHIP_PRICE),
    fps,
    config: SPRING.bouncy,
  });
  const chip2 = spring({
    frame: Math.max(0, frame - B.CHIP_TASTE),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <WineLayout>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <WineBadge label="WINE 02 · 소비뇽 블랑" current={2} appear={B.BADGE} />

        {/* 🤔 히어로 */}
        <div
          style={{
            position: "absolute",
            top: 470,
            fontSize: 160,
            lineHeight: 1,
            transform: `scale(${emojiIn})`,
          }}
        >
          🤔
        </div>

        {/* 질문 */}
        <div
          style={{
            position: "absolute",
            top: 730,
            width: "100%",
            textAlign: "center",
            transform: `scale(${questionIn})`,
            fontSize: 96,
            fontWeight: 900,
            color: W.text,
            lineHeight: 1.35,
            whiteSpace: "pre-line",
          }}
        >
          아직도{"\n"}클라우디 베이만
          <span
            style={{
              display: "inline-block",
              transform: `rotate(${wiggle}deg)`,
              color: W.accent,
            }}
          >
            ?
          </span>
        </div>

        {/* 칩 2개 좌우 */}
        <div
          style={{
            position: "absolute",
            top: 1200,
            display: "flex",
            gap: 34,
          }}
        >
          <WineChip text="가격은 착하게" progress={chip1} tilt={-2} />
          <WineChip text="맛은 훌륭하게" progress={chip2} tilt={2} />
        </div>
      </AbsoluteFill>
    </WineLayout>
  );
};
