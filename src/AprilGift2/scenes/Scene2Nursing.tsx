import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { PALETTES, SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { CountUpNumber, ProductBadge } from "../../components";

const P = PALETTES.aprilGift;
const DUR = 558;

/*
 * 음성 싱크 (로컬 프레임 = 절대 - 615):
 * fr 11:  "첫 번째 선물"
 * fr 46:  "간병인 입원 생활비"    → 제목 등장
 * fr 144: "프리미엄 플랜에서만"   → 프리미엄 뱃지
 * fr 191: "20만 원이 가능"        → before 숫자
 * fr 328: "올인원 플랜도"         → 올인원 뱃지
 * fr 361: "20만 원 꽉꽉"         → 카운트업 완료, 펀치
 * fr 493: "강력한 힘이 될 겁니다"
 */

export const Scene2Nursing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 30, DUR], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  // fr 11: 번호 뱃지
  const numIn = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING.bouncy });

  // fr 46: 제목 "간병인 일당 한도"
  const headIn = spring({ frame: Math.max(0, frame - 44), fps, config: SPRING.smooth });

  // fr 144: 프리미엄 뱃지
  // fr 328: 올인원 뱃지 (ProductBadge delay로 처리)

  // fr 191: 회색 취소선 "15만원" 등장 (원래 타이밍 유지)
  const beforeIn = spring({ frame: Math.max(0, frame - 189), fps, config: SPRING.smooth });

  // fr 252: 큰 남색 "15만원" 등장 — "아쉬우셨죠?" 끝(28.91s) 직후
  const bigNumIn = spring({ frame: Math.max(0, frame - 250), fps, config: SPRING.smooth });

  // 카운트업: fr 300~350 (올인원 말하기 직전에 카운트업 시작 → fr 361에 완료)
  const countStart = 300;
  const punchFrame = 360;
  const punch = spring({ frame: Math.max(0, frame - punchFrame), fps, config: SPRING.bouncy });
  const punchScale = interpolate(punch, [0, 0.5, 1], [1, 1.06, 1]);

  // 배경 원
  const bgCircleIn = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING.heavy });

  // flash
  const flashOpacity = interpolate(frame, [punchFrame, punchFrame + 3, punchFrame + 12], [0, 0.12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 배경 원 */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 107, 53, 0.06)",
          transform: `translate(-50%, -50%) scale(${bgCircleIn})`,
        }}
      />

      {/* 상단: 번호 + 제목 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 30,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            opacity: numIn,
            transform: `scale(${numIn})`,
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: P.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 900, color: "#FFF" }}>
            01
          </span>
        </div>

        <div
          style={{
            opacity: headIn,
            transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)`,
          }}
        >
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.text }}>
            간병인 일당 한도
          </span>
        </div>
      </div>

      {/* 중앙: 숫자 영역 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Before "15만원" */}
          <div style={{ opacity: beforeIn * 0.5, transform: `scale(${beforeIn})` }}>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 100,
                fontWeight: 700,
                color: P.sub,
                textDecoration: "line-through",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              15만원
            </span>
          </div>

          {/* 화살표 */}
          {frame >= 250 && (
            <div style={{ fontSize: 56, color: P.accent, lineHeight: 1 }}>▼</div>
          )}

          {/* After: 거대한 "15→20만원" — "아쉬우셨죠?" 이후 등장 */}
          <div style={{ opacity: bigNumIn, transform: `scale(${punchScale}) translateY(${interpolate(bigNumIn, [0, 1], [20, 0])}px)` }}>
            <CountUpNumber
              from={15}
              to={20}
              startFrame={countStart}
              duration={50}
              fontSize={200}
              color={frame >= punchFrame ? P.accent : P.text}
              fontWeight={900}
              formatter={(n) => String(n)}
              suffix="만원"
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* 하단: 뱃지들 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <ProductBadge text="프리미엄" delay={142} bgColor={P.accentDark} fontSize={56} />
        <ProductBadge text="올인원" delay={326} bgColor={P.accent} fontSize={56} />
      </div>

      {/* Flash */}
      <AbsoluteFill
        style={{ backgroundColor: "#FFFFFF", opacity: flashOpacity, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
