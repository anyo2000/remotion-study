import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPRING } from "../constants";
import { W, WineLayout, WineBadge } from "./WineLayout";
import { BEATS_WHITE as B } from "./wine-talk-beats";

/**
 * 씬5: WINE 04 화이트 [반전]
 * "가볍기만 하다?" 둥실 → 취소선+드롭 → "맛있는 화이트구나" + 배경 워시
 */
export const Scene5_White: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lightIn = spring({
    frame: Math.max(0, frame - B.LIGHT),
    fps,
    config: SPRING.smooth,
  });
  // 둥실 떠 있는 모션 — 취소선 전까지만
  const floatActive = interpolate(frame, [B.STRIKE - 5, B.STRIKE], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bob = Math.sin((frame - B.LIGHT) / 9) * 14 * floatActive;

  // 취소선 드로잉
  const strike = interpolate(frame, [B.STRIKE, B.STRIKE + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 드롭 — 취소선 후 뚝 떨어지며 흐려짐
  const dropT = spring({
    frame: Math.max(0, frame - (B.STRIKE + 8)),
    fps,
    config: SPRING.smooth,
  });
  const drop = dropT * 90;
  const dropFade = interpolate(frame, [B.STRIKE + 8, B.STRIKE + 26], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tastyIn = spring({
    frame: Math.max(0, frame - B.TASTY),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <WineLayout washFrom={B.WASH}>
      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* 가볍기만 하다? — 둥실 → 취소선 → 드롭 */}
        <div
          style={{
            position: "absolute",
            top: 520,
            transform: `translateY(${bob + drop}px) rotate(${dropT * 5}deg)`,
            opacity: lightIn * dropFade,
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
              fontSize: 100,
              fontWeight: 900,
              color: W.text,
              whiteSpace: "nowrap",
            }}
          >
            가볍기만 하다?
            <span
              style={{
                position: "absolute",
                left: "-2%",
                top: "50%",
                width: `${strike * 104}%`,
                height: 14,
                borderRadius: 7,
                background: W.accent,
              }}
            />
          </span>
        </div>

        {/* 여기서 끝 라벨 */}
        <div
          style={{
            position: "absolute",
            top: 740,
            opacity: interpolate(frame, [B.STRIKE, B.STRIKE + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontSize: 62,
            fontWeight: 800,
            color: W.accent,
            whiteSpace: "nowrap",
          }}
        >
          여기서 끝
        </div>

        {/* 이런 게 맛있는 화이트구나 */}
        <div
          style={{
            position: "absolute",
            top: 950,
            width: "100%",
            textAlign: "center",
            transform: `scale(${tastyIn})`,
            fontSize: 96,
            fontWeight: 900,
            color: W.text,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
          }}
        >
          이런 게 맛있는{"\n"}화이트구나
        </div>

        <WineBadge label="WINE 04 · 화이트" current={4} appear={B.BADGE} />
      </AbsoluteFill>
    </WineLayout>
  );
};
