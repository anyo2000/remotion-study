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
import { BEATS_HOSTPICK as B } from "./wine-talk-beats";

/**
 * 씬6: WINE 05 호스트 픽 [반전 — 헤드라인 생략]
 * HOST 크레딧 카드 → 거대 "?" 서서히 확대 (리빌 없음) → "와서 확인 👀"
 */
export const Scene6_HostPick: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const creditIn = spring({
    frame: Math.max(0, frame - B.CREDIT),
    fps,
    config: SPRING.smooth,
  });
  const creditX = (1 - creditIn) * 500;

  // "?" — 서서히 확대 + 펄스 글로우
  const qIn = spring({
    frame: Math.max(0, frame - B.QMARK),
    fps,
    config: SPRING.dramatic,
  });
  const qGrow = interpolate(frame, [B.QMARK, B.CONFIRM], [0.8, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowPulse = 0.5 + Math.sin((frame - B.QMARK) * 0.08) * 0.25;

  const firstIn = spring({
    frame: Math.max(0, frame - B.FIRST),
    fps,
    config: SPRING.smooth,
  });
  const confirmIn = spring({
    frame: Math.max(0, frame - B.CONFIRM),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <WineLayout>
      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* HOST 크레딧 카드 */}
        <div
          style={{
            position: "absolute",
            top: 300,
            transform: `translateX(${creditX}px)`,
            opacity: creditIn,
            display: "flex",
            alignItems: "center",
            gap: 28,
            background: W.card,
            border: `3px solid ${W.cardBorder}`,
            borderRadius: 24,
            padding: "26px 52px",
            boxShadow: "10px 10px 0 rgba(58,44,34,0.10)",
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: 6,
              color: W.card,
              background: W.accent,
              padding: "10px 26px",
              borderRadius: 14,
            }}
          >
            HOST
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 900,
              color: W.text,
              whiteSpace: "nowrap",
            }}
          >
            안효성 PICK
          </div>
        </div>

        {/* 글로우 */}
        <div
          style={{
            position: "absolute",
            top: 600,
            width: 820,
            height: 820,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(122,36,52,0.14) 0%, transparent 65%)`,
            opacity: qIn * glowPulse,
          }}
        />

        {/* 거대 "?" — 리빌 없음 */}
        <div
          style={{
            position: "absolute",
            top: 660,
            transform: `scale(${qIn * qGrow})`,
            fontSize: 460,
            fontWeight: 900,
            color: W.accent,
            lineHeight: 1,
          }}
        >
          ?
        </div>

        {/* 이건 아마 처음일 걸요 */}
        <div
          style={{
            position: "absolute",
            top: 1280,
            opacity: firstIn,
            transform: `translateY(${(1 - firstIn) * 30}px)`,
            fontSize: 64,
            fontWeight: 600,
            color: W.sub,
            whiteSpace: "nowrap",
          }}
        >
          이건 아마 처음일 걸요
        </div>

        {/* 뭔지는… 와서 확인 👀 */}
        <div
          style={{
            position: "absolute",
            top: 1440,
            transform: `scale(${confirmIn})`,
            background: W.card,
            border: `2px solid ${W.cardBorder}`,
            borderRadius: 60,
            padding: "24px 52px",
            fontSize: 68,
            fontWeight: 800,
            color: W.text,
            whiteSpace: "nowrap",
            boxShadow: "0 6px 0 rgba(58,44,34,0.08)",
          }}
        >
          뭔지는… 와서 확인 👀
        </div>
      </AbsoluteFill>
    </WineLayout>
  );
};
