import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep04SceneLayout } from "./Ep04SceneLayout";
import { BEATS_CAFE } from "./ep04-beats";

const palette = PALETTES.ep01;
const B = BEATS_CAFE;

/**
 * 씬 3: 카페 양쪽 테이블
 * 좌: "보장 분석" → 15분 → 끝 / 우: "설명드리려고" → 30분 → 인증번호
 */
export const Scene3_Cafe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardsIn = spring({
    frame: Math.max(0, frame - B.CARDS_IN),
    fps,
    config: SPRING.heavy,
  });

  const leftMentIn = spring({
    frame: Math.max(0, frame - B.LEFT_MENT),
    fps,
    config: SPRING.smooth,
  });

  const leftResultIn = spring({
    frame: Math.max(0, frame - B.LEFT_RESULT),
    fps,
    config: SPRING.smooth,
  });

  const rightMentIn = spring({
    frame: Math.max(0, frame - B.RIGHT_MENT),
    fps,
    config: SPRING.smooth,
  });

  const rightResultIn = spring({
    frame: Math.max(0, frame - B.RIGHT_RESULT),
    fps,
    config: SPRING.smooth,
  });

  // 타이머 카운트업
  const leftTimerActive = frame >= B.LEFT_TIMER;
  const leftMinutes = leftTimerActive
    ? Math.min(15, Math.floor(interpolate(
        frame,
        [B.LEFT_TIMER, B.LEFT_TIMER + 30],
        [0, 15],
        { extrapolateRight: "clamp" }
      )))
    : 0;

  const rightTimerActive = frame >= B.RIGHT_TIMER;
  const rightMinutes = rightTimerActive
    ? Math.min(30, Math.floor(interpolate(
        frame,
        [B.RIGHT_TIMER, B.RIGHT_TIMER + 40],
        [0, 30],
        { extrapolateRight: "clamp" }
      )))
    : 0;

  // 하이라이트: 좌 dim + 우 강조
  const isHighlighted = frame >= B.HIGHLIGHT;
  const highlightProgress = isHighlighted
    ? spring({
        frame: Math.max(0, frame - B.HIGHLIGHT),
        fps,
        config: SPRING.smooth,
      })
    : 0;
  const leftDim = isHighlighted
    ? interpolate(highlightProgress, [0, 1], [1, 0.3])
    : 1;

  const CARD_W = 560;
  const CARD_H = 500;

  return (
    <Ep04SceneLayout pageTitle="같은 날, 다른 결과" dense>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 40,
        }}
      >
        {/* 좌측 — 실패 테이블 */}
        <div
          style={{
            width: CARD_W,
            minHeight: CARD_H,
            borderRadius: 24,
            backgroundColor: "rgba(224, 90, 90, 0.06)",
            border: "2px solid rgba(224, 90, 90, 0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "32px 28px",
            opacity: cardsIn * leftDim,
            transform: `translateX(${interpolate(cardsIn, [0, 1], [-30, 0])}px)`,
          }}
        >
          <div style={{ fontSize: 64, lineHeight: 1 }}>☕😐</div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.text,
              textAlign: "center",
              lineHeight: 1.4,
              opacity: leftMentIn,
            }}
          >
            "보장 분석해서{"\n"}부족한 거 봐드릴게요"
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              opacity: leftResultIn,
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 64,
                fontWeight: 900,
                color: "#E05A5A",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱️ {leftTimerActive ? `${leftMinutes}분` : ""}
            </div>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: "#E05A5A",
              }}
            >
              👋 "다음에 뵐게요"
            </div>
          </div>
        </div>

        {/* 우측 — 성공 테이블 */}
        <div
          style={{
            width: CARD_W,
            minHeight: CARD_H,
            borderRadius: 24,
            backgroundColor: isHighlighted
              ? "rgba(78, 205, 196, 0.10)"
              : "rgba(78, 205, 196, 0.05)",
            border: `2px solid rgba(78, 205, 196, ${isHighlighted ? 0.4 : 0.15})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "32px 28px",
            opacity: cardsIn,
            transform: `translateX(${interpolate(cardsIn, [0, 1], [30, 0])}px)`,
            position: "relative",
          }}
        >
          {isHighlighted && (
            <GlowOrb
              color="#4ECDC4"
              opacity={0.06 * highlightProgress}
              size={350}
              x="50%"
              y="50%"
              delay={B.HIGHLIGHT}
            />
          )}
          <div style={{ fontSize: 64, lineHeight: 1 }}>☕😮</div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.text,
              textAlign: "center",
              lineHeight: 1.4,
              opacity: rightMentIn,
            }}
          >
            "설명드리려고{"\n"}왔어요"
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              opacity: rightResultIn,
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 64,
                fontWeight: 900,
                color: "#4ECDC4",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱️ {rightTimerActive ? `${rightMinutes}분` : ""}
            </div>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: "#4ECDC4",
              }}
            >
              📲 인증번호 완료
            </div>
          </div>
        </div>
      </div>
    </Ep04SceneLayout>
  );
};
