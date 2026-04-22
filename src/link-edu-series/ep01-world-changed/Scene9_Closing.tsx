import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep01SceneLayout } from "./Ep01SceneLayout";
import { BEATS_CLOSING } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_CLOSING;

/**
 * 씬 9: 클로징 — 기대감
 *
 * "생존의 문제" sub → 구분선(scaleX 성장) → "LINK 컨설팅" accent
 * → "함께 나눠보도록 할게요" CTA sub.
 * pageTitle 없음 (클로징).
 */
export const Scene9_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "링크 컨설팅이 나온 배경이에요"
  const linkIn = spring({
    frame: Math.max(0, frame - B.LINK_TEXT),
    fps,
    config: SPRING.smooth,
  });

  // "생존의 문제예요"
  const survivalIn = spring({
    frame: Math.max(0, frame - B.SURVIVAL),
    fps,
    config: SPRING.bouncy,
  });

  // 구분선 — survival보다 살짝 앞
  const lineIn = spring({
    frame: Math.max(0, frame - B.SURVIVAL + 5),
    fps,
    config: SPRING.heavy,
  });

  // CTA
  const ctaIn = spring({
    frame: Math.max(0, frame - B.CTA),
    fps,
    config: SPRING.smooth,
  });

  const lineWidth = interpolate(lineIn, [0, 1], [0, 160]);

  // survival 등장 시 link text dim
  const linkDim = frame >= B.SURVIVAL
    ? interpolate(frame, [B.SURVIVAL, B.SURVIVAL + 15], [1, 0.4], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <Ep01SceneLayout hideHeader>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlowOrb
          color={palette.accent}
          opacity={0.06}
          size={600}
          x="50%"
          y="45%"
          delay={B.SURVIVAL}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* "생존의 문제" */}
          <div
            style={{
              opacity: survivalIn,
              transform: `translateY(${interpolate(survivalIn, [0, 1], [12, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 68,
                fontWeight: 700,
                color: palette.sub,
              }}
            >
              생존의 문제
            </span>
          </div>

          {/* 구분선 */}
          <div
            style={{
              width: lineWidth,
              height: 3,
              backgroundColor: palette.accent,
              borderRadius: 2,
              margin: "16px 0",
            }}
          />

          {/* "LINK 컨설팅" */}
          <div
            style={{
              opacity: linkIn,
              transform: `translateY(${interpolate(linkIn, [0, 1], [12, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 96,
                fontWeight: 900,
                color: palette.accent,
              }}
            >
              LINK 컨설팅
            </span>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 48,
              opacity: ctaIn * 0.8,
              transform: `translateY(${interpolate(ctaIn, [0, 1], [8, 0])}px)`,
              textAlign: "center",
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
              함께 나눠보도록 할게요
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Ep01SceneLayout>
  );
};
