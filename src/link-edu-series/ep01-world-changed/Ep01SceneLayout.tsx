import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GradientBackground, ParticleField } from "../../components";

const palette = PALETTES.ep01;

type Props = {
  pageTitle?: string;
  hideHeader?: boolean;
  dense?: boolean;
  children: React.ReactNode;
};

export const LAYOUT = {
  topBarY: 28,
  topBarFontSize: 34,
  separatorY: 95,
  pageTitleY: 140,
  pageTitleFontSize: 56,
  pageTitleFontWeight: 800 as const,
  contentMaxTop: 240,
  contentTop: 300,
  contentBottom: 1030,
  contentMaxBottom: 1050,
  outerPad: 80,
  contentPad: 120,
} as const;

export const Ep01SceneLayout: React.FC<Props> = ({
  pageTitle,
  hideHeader = false,
  dense = false,
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
      <GradientBackground
        bgColor={palette.bg}
        glowColor={palette.glow}
        glowPosition={palette.glowPosition}
      />
      <ParticleField
        count={14}
        color={palette.accent}
        maxOpacity={0.08}
        speed={0.2}
        sizeRange={[2, 4]}
        seed="ep01-layout"
      />

      {showHeader && (
        <>
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 12px",
                borderRadius: 14,
                backgroundColor: "rgba(232, 168, 56, 0.12)",
                border: "1px solid rgba(232, 168, 56, 0.25)",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: LAYOUT.topBarFontSize,
                  fontWeight: 700,
                  color: palette.accent,
                }}
              >
                OT
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: LAYOUT.topBarFontSize - 2,
                  fontWeight: 600,
                  color: palette.sub,
                }}
              >
                개론
              </span>
            </div>

            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: LAYOUT.topBarFontSize,
                fontWeight: 700,
                color: palette.text,
              }}
            >
              세상이 바뀌었다
            </span>
          </div>

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

      <div
        style={{
          position: "absolute",
          top: hideHeader ? 0 : dense ? LAYOUT.contentMaxTop : LAYOUT.contentTop,
          bottom: hideHeader
            ? 0
            : 1080 - (dense ? LAYOUT.contentMaxBottom : LAYOUT.contentBottom),
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
