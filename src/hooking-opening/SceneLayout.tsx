import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../constants";
import { GradientBackground, ParticleField } from "../components";

const palette = PALETTES.orange;

/**
 * 공통 장면 레이아웃 (1920×1080)
 *
 * ┌─────────────────────────────────────────┐ y=0
 * │ LINK Consulting · L후킹 · 왜 후킹인가    │ 제목줄 (topBar)
 * │─────────────────────────────────────────│ y=95  구분선
 * │          [세부 페이지 타이틀]              │ y=140
 * │                                         │
 * │─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ y=240 최대활용구간(dense) 시작
 * │     ┌───── 메인 본문구간 ─────┐          │ y=300 기본구간 시작
 * │     │                        │          │
 * │     │   콘텐츠 영역 확대       │          │
 * │     │                        │          │
 * │     └────────────────────────┘          │ y=1030 기본구간 끝
 * │─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ y=1050 최대활용구간 끝
 * │           꼬리말 여백                     │
 * └─────────────────────────────────────────┘ y=1080
 */

type Props = {
  /** 페이지 제목 — 구분선 아래, 콘텐츠 위에 표시 (장면마다 다름) */
  pageTitle?: string;
  /** 에피소드 소제목 (기본: "왜 후킹인가") — 상단 바에 표시 */
  episodeTitle?: string;
  /** 상단 머리말 숨김 (첫 장면 반전 등 특수 경우) */
  hideHeader?: boolean;
  /** 내용 많을 때 — 최대 활용구간 사용 (contentMaxTop ~ contentMaxBottom) */
  dense?: boolean;
  /** 파티클 */
  particles?: boolean;
  children: React.ReactNode;
};

// ── 레이아웃 상수 ──
export const LAYOUT = {
  /** 상단 바 Y */
  topBarY: 28,
  /** 상단 바 폰트 크기 */
  topBarFontSize: 34,
  /** 구분선 Y — 상단 바 텍스트 아래 + 여백 */
  separatorY: 95,
  /** 페이지 타이틀 Y */
  pageTitleY: 140,
  /** 페이지 제목 폰트 크기 (고정) */
  pageTitleFontSize: 56,
  /** 페이지 제목 폰트 굵기 (고정) */
  pageTitleFontWeight: 800 as const,
  /** 본문 최대 활용구간 시작 Y — 내용 많을 때 여기부터 */
  contentMaxTop: 240,
  /** 본문 메인 구간 시작 Y — 페이지제목 아래 여유 확보 */
  contentTop: 300,
  /** 본문 메인 구간 끝 Y — 아래까지 활용 */
  contentBottom: 1030,
  /** 본문 최대 활용구간 끝 Y */
  contentMaxBottom: 1050,
  /** 좌우 바깥 패딩 */
  outerPad: 80,
  /** 콘텐츠 좌우 패딩 */
  contentPad: 120,
} as const;

export const SceneLayout: React.FC<Props> = ({
  pageTitle,
  episodeTitle = "왜 후킹인가",
  hideHeader = false,
  dense = false,
  particles = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barIn = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: SPRING.heavy,
  });

  const titleIn = pageTitle
    ? spring({
        frame: Math.max(0, frame - 5),
        fps,
        config: SPRING.smooth,
      })
    : 0;

  const showHeader = !hideHeader;

  return (
    <AbsoluteFill>
      <GradientBackground palette="orange" />
      {particles && (
        <ParticleField
          count={18}
          color={palette.accent}
          maxOpacity={0.12}
          speed={0.25}
          sizeRange={[2, 4]}
          seed="hooking-layout"
        />
      )}

      {showHeader && (
        <>
          {/* ── 상단 머리말: 한 줄로 좌·중·우 — 모든 장면 공통 ── */}
          <div
            style={{
              position: "absolute",
              top: LAYOUT.topBarY,
              left: LAYOUT.outerPad,
              right: LAYOUT.outerPad,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: barIn,
            }}
          >
            {/* 좌: LINK Consulting */}
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: LAYOUT.topBarFontSize,
                fontWeight: 600,
                color: palette.sub,
              }}
            >
              LINK Consulting
            </span>

            {/* 중: L단계 뱃지 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 12px",
                borderRadius: 14,
                backgroundColor: "rgba(91, 155, 213, 0.12)",
                border: "1px solid rgba(91, 155, 213, 0.25)",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: LAYOUT.topBarFontSize,
                  fontWeight: 700,
                  color: "#5b9bd5",
                }}
              >
                L
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: LAYOUT.topBarFontSize - 2,
                  fontWeight: 600,
                  color: palette.sub,
                }}
              >
                후킹
              </span>
            </div>

            {/* 우: 에피소드 제목 (모든 장면 동일) */}
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: LAYOUT.topBarFontSize,
                fontWeight: 700,
                color: palette.text,
              }}
            >
              {episodeTitle}
            </span>
          </div>

          {/* ── 구분선 ── */}
          <div
            style={{
              position: "absolute",
              top: LAYOUT.separatorY,
              left: LAYOUT.outerPad,
              right: LAYOUT.outerPad,
              height: 1,
              backgroundColor: palette.cardBorder,
              opacity: barIn * 0.4,
            }}
          />

          {/* ── 페이지 제목 — 좌측 액센트 바 + 반투명 배경 ── */}
          {pageTitle && (
            <div
              style={{
                position: "absolute",
                top: LAYOUT.pageTitleY,
                left: LAYOUT.contentPad,
                right: LAYOUT.contentPad,
                display: "flex",
                justifyContent: "center",
                opacity: titleIn,
                transform: `translateY(${interpolate(titleIn, [0, 1], [8, 0])}px)`,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 28px 10px 24px",
                  borderLeft: `3px solid ${palette.accent}`,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: LAYOUT.pageTitleFontSize,
                    fontWeight: LAYOUT.pageTitleFontWeight,
                    color: palette.text,
                  }}
                >
                  {pageTitle}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── 콘텐츠 영역 ── */}
      <div
        style={{
          position: "absolute",
          top: hideHeader ? 0 : dense ? LAYOUT.contentMaxTop : LAYOUT.contentTop,
          bottom: hideHeader ? 0 : 1080 - (dense ? LAYOUT.contentMaxBottom : LAYOUT.contentBottom),
          left: hideHeader ? 0 : LAYOUT.contentPad,
          right: hideHeader ? 0 : LAYOUT.contentPad,
          display: hideHeader ? undefined : "flex",
          flexDirection: hideHeader ? undefined : "column",
          justifyContent: hideHeader ? undefined : "center",
          alignItems: hideHeader ? undefined : "center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
