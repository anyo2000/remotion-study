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
import { BEATS_OREGON as B } from "./wine-talk-beats";

/**
 * 씬4: WINE 03 오레곤 레드 [반전 — 헤드라인 생략]
 * "떫다 쓰다 😖" → 버건디 X 슬래시 → "술술 넘어갈걸요?"
 */
export const Scene4_OregonRed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bitterIn = spring({
    frame: Math.max(0, frame - B.BITTER),
    fps,
    config: SPRING.bouncy,
  });
  const harshIn = spring({
    frame: Math.max(0, frame - B.HARSH),
    fps,
    config: SPRING.bouncy,
  });
  const emojiIn = spring({
    frame: Math.max(0, frame - B.EMOJI),
    fps,
    config: SPRING.bouncy,
  });

  // X 슬래시 — 두 획 순차 드로잉
  const slash1 = interpolate(frame, [B.X_SLASH, B.X_SLASH + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slash2 = interpolate(
    frame,
    [B.X_SLASH + 6, B.X_SLASH + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // X 이후 편견 그룹 dim
  const groupDim = interpolate(
    frame,
    [B.X_SLASH + 16, B.X_SLASH + 34],
    [1, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const smoothIn = spring({
    frame: Math.max(0, frame - B.SMOOTH),
    fps,
    config: SPRING.smooth,
  });
  // X 슬래시는 "술술" 등장 때 dim — 주인공 배턴터치
  const xDim = interpolate(frame, [B.SMOOTH, B.SMOOTH + 18], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const LINE_LEN = 760;

  return (
    <WineLayout>
      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* 편견 그룹 */}
        <div
          style={{
            position: "absolute",
            top: 480,
            opacity: groupDim,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
          }}
        >
          <div style={{ display: "flex", gap: 60 }}>
            <div
              style={{
                fontSize: 130,
                fontWeight: 900,
                color: W.text,
                transform: `scale(${bitterIn}) rotate(-4deg)`,
              }}
            >
              떫다
            </div>
            <div
              style={{
                fontSize: 130,
                fontWeight: 900,
                color: W.text,
                transform: `scale(${harshIn}) rotate(3deg)`,
              }}
            >
              쓰다
            </div>
          </div>
          <div
            style={{
              fontSize: 140,
              lineHeight: 1,
              transform: `scale(${emojiIn})`,
            }}
          >
            😖
          </div>
        </div>

        {/* 버건디 X 슬래시 */}
        <svg
          width={LINE_LEN}
          height={520}
          style={{ position: "absolute", top: 430, opacity: xDim }}
        >
          <line
            x1={40}
            y1={40}
            x2={LINE_LEN - 40}
            y2={480}
            stroke={W.accent}
            strokeWidth={18}
            strokeLinecap="round"
            strokeDasharray={1000}
            strokeDashoffset={1000 * (1 - slash1)}
          />
          <line
            x1={LINE_LEN - 40}
            y1={40}
            x2={40}
            y2={480}
            stroke={W.accent}
            strokeWidth={18}
            strokeLinecap="round"
            strokeDasharray={1000}
            strokeDashoffset={1000 * (1 - slash2)}
          />
        </svg>

        {/* 편견입니다 라벨 */}
        <div
          style={{
            position: "absolute",
            top: 1040,
            opacity: interpolate(
              frame,
              [B.X_SLASH, B.X_SLASH + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            fontSize: 66,
            fontWeight: 800,
            color: W.accent,
            whiteSpace: "nowrap",
          }}
        >
          편견입니다
        </div>

        {/* 술술 넘어갈걸요? */}
        <div
          style={{
            position: "absolute",
            top: 1220,
            opacity: smoothIn,
            transform: `translateX(${(1 - smoothIn) * -120}px)`,
            fontSize: 92,
            fontWeight: 900,
            color: W.text,
            whiteSpace: "nowrap",
          }}
        >
          술술 넘어갈걸요?
        </div>

        <WineBadge label="WINE 03 · 레드" current={3} appear={B.BADGE} />
      </AbsoluteFill>
    </WineLayout>
  );
};
