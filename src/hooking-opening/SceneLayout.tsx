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
 * 공통 장면 레이아웃
 *
 * ┌──────────────────────────────────────────────────────┐ y=0
 * │ LINK Consulting    ·    L단계 — 후킹    ·    왜 후킹인가 │ 상단 바 한 줄 (좌·중·우)
 * │──────────────────────────────────────────────────────│ y=60
 * │                                                      │
 * │               [페이지 제목] ← 중앙 정렬                 │ 본문 영역 시작
 * │                                                      │
 * │          10%│    콘텐츠 (80%)    │10%                  │
 * │                                                      │
 * │──────────────────────────────────────────────────────│ y=940
 * │                   하단 여백                            │
 * └──────────────────────────────────────────────────────┘ y=1080
 */

type Props = {
  /** 페이지 제목 — 본문 영역 첫 줄, 중앙 정렬 (매 장면 다름) */
  pageTitle?: string;
  /** 에피소드 소제목 (기본: "왜 후킹인가") */
  episodeTitle?: string;
  /** 반전 등 풀콘텐츠 모드 */
  fullContent?: boolean;
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
  /** 구분선 Y — 상단 바 아래 여유 두고 */
  separatorY: 62,
  /** 페이지 제목 Y — 구분선 아래 여유 */
  pageTitleY: 170,
  /** 페이지 제목 폰트 크기 (고정) */
  pageTitleFontSize: 60,
  /** 페이지 제목 폰트 굵기 (고정) */
  pageTitleFontWeight: 900 as const,
  /** 콘텐츠 시작 Y — 페이지 제목 아래 큰 여백 */
  contentTop: 300,
  /** 콘텐츠 끝 Y — 아래 여백 최소 */
  contentBottom: 1030,
  /** 좌우 바깥 패딩 */
  outerPad: 110,
  /** 콘텐츠 좌우 패딩 (10% 여백 = 192px) */
  contentPad: 192,
} as const;

export const SceneLayout: React.FC<Props> = ({
  pageTitle,
  episodeTitle = "왜 후킹인가",
  fullContent = false,
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

      {!fullContent && (
        <>
          {/* ── 상단 바: 한 줄로 좌·중·우 ── */}
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

            {/* 우: 에피소드 소제목 */}
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

          {/* ── 구분선 — 상단 바와 본문 사이 ── */}
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

          {/* ── 페이지 제목 — 중앙 정렬, 통일 양식 ── */}
          {pageTitle && (
            <div
              style={{
                position: "absolute",
                top: LAYOUT.pageTitleY,
                left: LAYOUT.contentPad,
                right: LAYOUT.contentPad,
                textAlign: "center",
                opacity: titleIn,
                transform: `translateY(${interpolate(titleIn, [0, 1], [8, 0])}px)`,
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
          )}
        </>
      )}

      {/* ── 콘텐츠 영역 ── */}
      <div
        style={{
          position: "absolute",
          top: fullContent ? 0 : LAYOUT.contentTop,
          bottom: fullContent ? 0 : 1080 - LAYOUT.contentBottom,
          left: fullContent ? 0 : LAYOUT.contentPad,
          right: fullContent ? 0 : LAYOUT.contentPad,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
