import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GlowOrb } from "../components";
import { SceneLayout } from "./SceneLayout";
import { BEATS_TIMER } from "./hooking-why-beats";

const palette = PALETTES.orange;
const B = BEATS_TIMER;

/**
 * 장면 9: [숫자 임팩트] — 3초 타이머
 * 오디오: "고객이 들을지 말지 결정하는 시간 3초"
 */
export const SampleScene9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const ringIn = spring({
    frame: Math.max(0, frame - B.RING_IN),
    fps,
    config: SPRING.heavy,
  });

  const numberIn = spring({
    frame: Math.max(0, frame - B.NUMBER_IN),
    fps,
    config: SPRING.bouncy,
  });

  const labelIn = spring({
    frame: Math.max(0, frame - B.LABEL_IN),
    fps,
    config: SPRING.smooth,
  });

  const subIn = spring({
    frame: Math.max(0, frame - B.SUB_IN),
    fps,
    config: SPRING.smooth,
  });

  // 3→0 카운트다운 (프레임 기반)
  const countdownProgress = Math.min(1, frame / durationInFrames);
  const countNumber = Math.max(0, 3 - Math.floor(countdownProgress * 3.5));

  // 원형 링 진행률
  const cx = 300;
  const cy = 200;
  const r = 140;
  const circumference = 2 * Math.PI * r;
  const dashLen = circumference * (1 - countdownProgress) * ringIn;

  return (
    <SceneLayout pageTitle="상담 첫 3초">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
        }}
      >
        {/* 왼쪽: 원형 타이머 + 숫자 */}
        <div style={{ position: "relative", width: 300, height: 300 }}>
          <svg
            width={300}
            height={300}
            viewBox={`${cx - 150} ${cy - 150} 300 300`}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* 배경 링 */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={12}
            />
            {/* 진행 링 */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={palette.accent}
              strokeWidth={12}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${palette.accent})`,
              }}
            />
          </svg>
          {/* 중앙 숫자 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 300,
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: FONT_FAMILY,
              fontSize: 120,
              fontWeight: 900,
              color: palette.accent,
              fontVariantNumeric: "tabular-nums",
              opacity: numberIn,
              transform: `scale(${interpolate(numberIn, [0, 1], [0.6, 1])})`,
            }}
          >
            {countNumber}
          </div>
        </div>

        {/* 오른쪽: 설명 텍스트 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            opacity: labelIn,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 900,
              color: palette.text,
            }}
          >
            3초
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              lineHeight: 1.5,
              opacity: subIn,
            }}
          >
            듣거나{"\n"}돌아서거나
          </div>
        </div>

        <GlowOrb
          color={palette.accent}
          opacity={0.05}
          size={400}
          x="35%"
          y="50%"
          delay={5}
        />
      </div>
    </SceneLayout>
  );
};
