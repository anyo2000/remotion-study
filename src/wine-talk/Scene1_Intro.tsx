import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPRING } from "../constants";
import { W, WineLayout, WineChip } from "./WineLayout";
import { BEATS_INTRO as B } from "./wine-talk-beats";

/**
 * 씬1: 인트로 [키워드 강조]
 * 상단 "YRC WINE TALK" 제목 상시 → "1도 몰라도" 팝 → 칩
 * → "이번에 만날 와인들" 라벨 + 🍷 5개 정렬
 */
export const Scene1_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [B.TOP_TITLE, B.TOP_TITLE + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookIn = spring({
    frame: Math.max(0, frame - B.HOOK),
    fps,
    config: SPRING.bouncy,
  });
  const highlightW = interpolate(
    frame,
    [B.HIGHLIGHT, B.HIGHLIGHT + 14],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const chipIn = spring({
    frame: Math.max(0, frame - B.CHIP),
    fps,
    config: SPRING.smooth,
  });
  const sogaeIn = spring({
    frame: Math.max(0, frame - B.SOGAE),
    fps,
    config: SPRING.smooth,
  });

  return (
    <WineLayout>
      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* 상단 제목 — YRC WINE TALK */}
        <div
          style={{
            position: "absolute",
            top: 180,
            opacity: titleOp,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: 10,
            color: W.accent,
            whiteSpace: "nowrap",
          }}
        >
          YRC WINE TALK
        </div>

        {/* 훅 헤드라인 */}
        <div
          style={{
            position: "absolute",
            top: 430,
            width: "100%",
            textAlign: "center",
            transform: `scale(${hookIn})`,
            lineHeight: 1.35,
          }}
        >
          <div style={{ fontSize: 78, fontWeight: 700, color: W.text }}>
            와인,
          </div>
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: W.text,
              whiteSpace: "nowrap",
              marginTop: 8,
            }}
          >
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 6,
                  width: `${highlightW}%`,
                  height: 36,
                  background: "rgba(122, 36, 52, 0.16)",
                  borderRadius: 10,
                }}
              />
              <span style={{ position: "relative" }}>1도 몰라도</span>
            </span>{" "}
            됩니다
          </div>
        </div>

        {/* 칩 */}
        <div style={{ position: "absolute", top: 830 }}>
          <WineChip
            text="내 입맛에 맞는 와인 찾기"
            progress={chipIn}
            tilt={-1.5}
            fontSize={60}
          />
        </div>

        {/* 이번에 만날 와인들 라벨 */}
        <div
          style={{
            position: "absolute",
            top: 1090,
            opacity: sogaeIn,
            transform: `translateY(${(1 - sogaeIn) * 30}px)`,
            fontSize: 64,
            fontWeight: 800,
            color: W.text,
            whiteSpace: "nowrap",
          }}
        >
          이번에 만날 와인들
        </div>

        {/* 🍷 5개 정렬 */}
        <div
          style={{
            position: "absolute",
            top: 1230,
            display: "flex",
            gap: 26,
          }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const s = spring({
              frame: Math.max(0, frame - (B.GLASSES + i * 2)),
              fps,
              config: SPRING.bouncy,
            });
            return (
              <div
                key={i}
                style={{
                  fontSize: 116,
                  lineHeight: 1,
                  transform: `scale(${s})`,
                }}
              >
                🍷
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </WineLayout>
  );
};
