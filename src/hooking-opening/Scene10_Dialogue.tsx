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

const palette = PALETTES.orange;

/**
 * 장면 10: 대화 비교 Before/After (T(54.4)~T(72.8), 18.4초 = 552fr)
 *
 * 좌: BEFORE — 설명형 오프닝 → 거절
 * 우: AFTER  — 후킹 질문 → 관심
 * 마지막: "첫마디만 바꿨을 뿐" 헤드라인
 */

// 프레임 타이밍 (scene 내 상대값, T(84.7)-T(75.5)=276 등)
const BEFORE_FP = 10;       // FP: "보장 분석 해드리려고요"
const BEFORE_CUST = 80;     // 고객: "경계합니다"
const AFTER_FP = 276;       // FP: "임신해도 돈 받고..." (T(84.7)-T(75.5))
const AFTER_CUST = 370;     // 고객: "그게 뭐예요?"
const HEADLINE = 507;       // "첫마디만 바꿨을 뿐" (T(92.4)-T(75.5))

type BubbleProps = {
  text: string;
  emoji: string;
  isFP: boolean;
  delay: number;
};

const Bubble: React.FC<BubbleProps> = ({ text, emoji, isFP, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const prog = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.smooth,
  });

  const bgColor = isFP
    ? "rgba(255, 140, 56, 0.08)"
    : "rgba(255, 255, 255, 0.06)";
  const borderColor = isFP
    ? "rgba(255, 140, 56, 0.25)"
    : "rgba(255, 255, 255, 0.12)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: isFP ? "flex-start" : "flex-end",
        flexDirection: "column",
        opacity: prog,
        transform: `translateY(${interpolate(prog, [0, 1], [15, 0])}px)`,
      }}
    >
      <div
        style={{
          padding: "20px 28px",
          borderRadius: 20,
          backgroundColor: bgColor,
          border: `2px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          maxWidth: 500,
        }}
      >
        <span style={{ fontSize: 52, flexShrink: 0 }}>{emoji}</span>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 700,
            color: palette.text,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export const Scene10_Dialogue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeLabelIn = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: SPRING.smooth,
  });

  const afterLabelIn = spring({
    frame: Math.max(0, frame - AFTER_FP - 5),
    fps,
    config: SPRING.smooth,
  });

  // Before 영역 dim (After 등장 시)
  const beforeDim =
    frame >= AFTER_FP
      ? interpolate(frame, [AFTER_FP, AFTER_FP + 20], [1, 0.35], {
          extrapolateRight: "clamp",
        })
      : 1;

  // 헤드라인
  const headlineIn = spring({
    frame: Math.max(0, frame - HEADLINE),
    fps,
    config: SPRING.smooth,
  });

  return (
    <SceneLayout pageTitle="첫마디만 바꿨을 뿐" dense>
      <div
        style={{
          display: "flex",
          gap: 60,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* BEFORE 컬럼 */}
        <div
          style={{
            flex: 1,
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            opacity: beforeDim,
          }}
        >
          {/* 라벨 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: beforeLabelIn,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(224, 90, 90, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 800,
                color: "#E05A5A",
              }}
            >
              ✕
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 800,
                color: "#E05A5A",
              }}
            >
              BEFORE
            </span>
          </div>

          <Bubble
            text={"보장 분석\n해드리려고요"}
            emoji="😐"
            isFP
            delay={BEFORE_FP}
          />
          <Bubble
            text="경계합니다"
            emoji="🛡️"
            isFP={false}
            delay={BEFORE_CUST}
          />
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: 2,
            backgroundColor: palette.cardBorder,
            opacity: 0.3,
            alignSelf: "stretch",
          }}
        />

        {/* AFTER 컬럼 */}
        <div
          style={{
            flex: 1,
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* 라벨 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: afterLabelIn,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(78, 205, 196, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 800,
                color: "#4ECDC4",
              }}
            >
              ○
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 800,
                color: "#4ECDC4",
              }}
            >
              AFTER
            </span>
          </div>

          <Bubble
            text={"임신해도 돈 받고\n안 해도 돈 받는 거\n아세요?"}
            emoji="💡"
            isFP
            delay={AFTER_FP}
          />
          <Bubble
            text="그게 뭐예요?"
            emoji="🤔"
            isFP={false}
            delay={AFTER_CUST}
          />
        </div>
      </div>

      {/* 하단 헤드라인 — 처음부터 자리 확보, opacity로 등장 */}
      <div
        style={{
          marginTop: 40,
          opacity: headlineIn,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [10, 0])}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 900,
            color: palette.accent,
          }}
        >
          첫마디만 바꿨을 뿐
        </span>
      </div>

      <GlowOrb
        color="#4ECDC4"
        opacity={0.04}
        size={400}
        x="70%"
        y="50%"
        delay={AFTER_FP}
      />
    </SceneLayout>
  );
};
