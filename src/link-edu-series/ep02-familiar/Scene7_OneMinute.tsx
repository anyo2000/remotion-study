import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep02SceneLayout } from "./Ep02SceneLayout";
import { BEATS_ONE_MINUTE } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_ONE_MINUTE;

/**
 * 씬 7: 1분의 조건
 *
 * "15분" 등장 → 취소선 + "5분" 등장 → 취소선 + "1분" accent 크게
 * → 하단 정리 3줄 순차 등장
 */
export const Scene7_OneMinute: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "15분이 기본이었어요"
  const fifteenIn = spring({
    frame: Math.max(0, frame - B.FIFTEEN_MIN),
    fps,
    config: SPRING.smooth,
  });

  // "근데 요즘은요" — 전환 힌트
  const butNowIn = spring({
    frame: Math.max(0, frame - B.BUT_NOW),
    fps,
    config: SPRING.smooth,
  });

  // "15분?" 의문 + 취소선
  const fifteenStrikeIn = spring({
    frame: Math.max(0, frame - B.FIFTEEN_Q),
    fps,
    config: SPRING.smooth,
  });

  // "5분도 어려워요"
  const fiveIn = spring({
    frame: Math.max(0, frame - B.FIVE_MIN),
    fps,
    config: SPRING.bouncy,
  });

  // "1분 안에"
  const oneMinIn = spring({
    frame: Math.max(0, frame - B.ONE_MIN),
    fps,
    config: SPRING.bouncy,
  });

  // "정리할게요"
  const summaryStartIn = spring({
    frame: Math.max(0, frame - B.SUMMARY_START),
    fps,
    config: SPRING.smooth,
  });

  // 정리 3줄
  const line1In = spring({
    frame: Math.max(0, frame - B.LINE_1),
    fps,
    config: SPRING.smooth,
  });

  const line2In = spring({
    frame: Math.max(0, frame - B.LINE_2),
    fps,
    config: SPRING.smooth,
  });

  const line3In = spring({
    frame: Math.max(0, frame - B.LINE_3),
    fps,
    config: SPRING.smooth,
  });

  // 취소선 width — 15분
  const strikeWidth15 = interpolate(fifteenStrikeIn, [0, 1], [0, 100]);

  // 5분도 취소선 — ONE_MIN 이후
  const fiveStrikeIn =
    frame >= B.ONE_MIN
      ? spring({
          frame: Math.max(0, frame - B.ONE_MIN),
          fps,
          config: SPRING.smooth,
        })
      : 0;
  const strikeWidth5 = interpolate(fiveStrikeIn, [0, 1], [0, 100]);

  // FIVE_MIN 등장 시 최초 15분 dim
  const fifteenDim =
    frame >= B.FIFTEEN_Q
      ? interpolate(frame, [B.FIFTEEN_Q, B.FIFTEEN_Q + 10], [1, 0.35], {
          extrapolateRight: "clamp",
        })
      : 1;

  // ONE_MIN 등장 시 5분 dim
  const fiveDim =
    frame >= B.ONE_MIN
      ? interpolate(frame, [B.ONE_MIN, B.ONE_MIN + 10], [1, 0.35], {
          extrapolateRight: "clamp",
        })
      : 1;

  // SUMMARY_START 이후 상단 시간 전체 dim
  const timeAreaDim =
    frame >= B.SUMMARY_START
      ? interpolate(frame, [B.SUMMARY_START, B.SUMMARY_START + 15], [1, 0.4], {
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <Ep02SceneLayout pageTitle="시간의 조건" dense>
      {/* ── 상단: 시간 축소 흐름 ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginBottom: 36,
          opacity: timeAreaDim,
        }}
      >
        {/* "근데 요즘은요" */}
        <div
          style={{
            opacity: butNowIn * 0.7,
            transform: `translateY(${interpolate(butNowIn, [0, 1], [8, 0])}px)`,
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
            근데 요즘은요
          </span>
        </div>

        {/* 시간 흐름 행 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* 15분 — 취소선 */}
          <div
            style={{
              position: "relative",
              opacity: fifteenIn * fifteenDim,
              transform: `translateY(${interpolate(fifteenIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 800,
                color: palette.sub,
              }}
            >
              15분
            </span>
            {/* 취소선 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                height: 4,
                width: `${strikeWidth15}%`,
                backgroundColor: palette.sub,
                borderRadius: 2,
                transform: "translateY(-50%) rotate(-8deg)",
              }}
            />
          </div>

          {/* 화살표 */}
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              color: palette.sub,
              opacity: fiveIn * 0.5,
            }}
          >
            →
          </span>

          {/* 5분 — 취소선 */}
          <div
            style={{
              position: "relative",
              opacity: fiveIn * fiveDim,
              transform: `translateY(${interpolate(fiveIn, [0, 1], [10, 0])}px) scale(${interpolate(fiveIn, [0, 1], [0.8, 1])})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 800,
                color: palette.sub,
              }}
            >
              5분
            </span>
            {/* 취소선 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                height: 4,
                width: `${strikeWidth5}%`,
                backgroundColor: palette.sub,
                borderRadius: 2,
                transform: "translateY(-50%) rotate(-8deg)",
              }}
            />
          </div>

          {/* 화살표 */}
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              color: palette.accent,
              opacity: oneMinIn * 0.6,
            }}
          >
            →
          </span>

          {/* 1분 — accent, 크게 */}
          <div
            style={{
              opacity: oneMinIn,
              transform: `translateY(${interpolate(oneMinIn, [0, 1], [10, 0])}px) scale(${interpolate(oneMinIn, [0, 1], [0.7, 1])})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 108,
                fontWeight: 900,
                color: palette.accent,
                filter: `drop-shadow(0 0 16px ${palette.accent}55)`,
              }}
            >
              1분
            </span>
          </div>
        </div>
      </div>

      {/* ── 하단: 정리 카드 — SUMMARY_START 이후 등장 ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "28px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: summaryStartIn,
          transform: `translateY(${interpolate(summaryStartIn, [0, 1], [20, 0])}px)`,
        }}
      >
        {/* 정리 헤더 */}
        <div
          style={{
            opacity: summaryStartIn,
            transform: `translateY(${interpolate(summaryStartIn, [0, 1], [6, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 700,
              color: palette.accent,
            }}
          >
            1분 안에 정리할게요
          </span>
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: 1,
            backgroundColor: "rgba(255,255,255,0.08)",
            opacity: summaryStartIn,
          }}
        />

        {/* 정리 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: line1In,
            transform: `translateX(${interpolate(line1In, [0, 1], [-12, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: palette.accent,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 700,
              color: palette.text,
            }}
          >
            AI가 못 주는 것
          </span>
        </div>

        {/* 정리 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: line2In,
            transform: `translateX(${interpolate(line2In, [0, 1], [-12, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: palette.accent,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 700,
              color: palette.text,
            }}
          >
            복잡한 걸 쉽게
          </span>
        </div>

        {/* 정리 3 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: line3In,
            transform: `translateX(${interpolate(line3In, [0, 1], [-12, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: palette.accent,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 800,
              color: palette.accent,
            }}
          >
            1분 안에 해내야
          </span>
        </div>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.05}
        size={400}
        x="70%"
        y="30%"
        delay={B.ONE_MIN}
      />
    </Ep02SceneLayout>
  );
};
