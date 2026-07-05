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
import { BEATS_CHAMPAGNE as B } from "./wine-talk-beats";

/**
 * 씬2: WINE 01 샴페인 [숫자 임팩트]
 * "30만원" 한 방에 쾅 (승인: 카운트업 없음)
 */
export const Scene2_Champagne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hotelIn = spring({
    frame: Math.max(0, frame - B.HOTEL),
    fps,
    config: SPRING.smooth,
  });
  const priceIn = spring({
    frame: Math.max(0, frame - B.PRICE),
    fps,
    config: SPRING.bouncy,
  });
  // 쾅 임팩트 — 등장 직후 미세 흔들림 감쇠
  const shakeDecay = interpolate(frame, [B.PRICE, B.PRICE + 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = Math.sin((frame - B.PRICE) * 1.4) * 5 * shakeDecay;

  const chip1 = spring({
    frame: Math.max(0, frame - B.CHIP_HYANG),
    fps,
    config: SPRING.bouncy,
  });
  const chip2 = spring({
    frame: Math.max(0, frame - B.CHIP_MAT),
    fps,
    config: SPRING.bouncy,
  });
  const chip3 = spring({
    frame: Math.max(0, frame - B.CHIP_YEOUN),
    fps,
    config: SPRING.bouncy,
  });
  const questionIn = spring({
    frame: Math.max(0, frame - B.QUESTION),
    fps,
    config: SPRING.smooth,
  });

  return (
    <WineLayout>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <WineBadge label="WINE 01 · 샴페인" current={1} appear={B.BADGE} />

        {/* 하얏트호텔 와인바 */}
        <div
          style={{
            position: "absolute",
            top: 500,
            opacity: hotelIn,
            transform: `translateY(${(1 - hotelIn) * 30}px)`,
            fontSize: 62,
            fontWeight: 600,
            color: W.sub,
            whiteSpace: "nowrap",
          }}
        >
          하얏트호텔 와인바
        </div>

        {/* 30만원 — 한 방에 쾅 */}
        <div
          style={{
            position: "absolute",
            top: 640,
            transform: `scale(${priceIn}) translateX(${shake}px)`,
            fontSize: 250,
            fontWeight: 900,
            color: W.accent,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          30만원
        </div>

        {/* 향 · 맛 · 여운 칩 */}
        <div
          style={{
            position: "absolute",
            top: 1120,
            display: "flex",
            gap: 30,
          }}
        >
          <WineChip text="향" progress={chip1} tilt={-2} fontSize={64} />
          <WineChip text="맛" progress={chip2} fontSize={64} />
          <WineChip text="여운" progress={chip3} tilt={2} fontSize={64} />
        </div>

        {/* 진짜 다를까? */}
        <div
          style={{
            position: "absolute",
            top: 1380,
            opacity: questionIn,
            transform: `translateY(${(1 - questionIn) * 40}px)`,
            fontSize: 84,
            fontWeight: 900,
            color: W.text,
            whiteSpace: "nowrap",
          }}
        >
          진짜 다를까?
        </div>
      </AbsoluteFill>
    </WineLayout>
  );
};
