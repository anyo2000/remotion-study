import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep01SceneLayout } from "./Ep01SceneLayout";
import { BEATS_SUMMARY } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_SUMMARY;

/**
 * 씬 6: 4가지 막힘 총정리 — 절망의 정점
 *
 * 2×2 그리드. 각 카드는 가로로 이모지+텍스트 한 줄.
 * 취소선이 가로로 쭉 그어지는 느낌.
 * 마지막에 "이런 세상".
 */

const ITEMS = [
  { text: "대면", emoji: "🚪", delay: B.LINE_1 },
  { text: "선물", emoji: "🎁", delay: B.LINE_2 },
  { text: "의리", emoji: "🤝", delay: B.LINE_3 },
  { text: "보장분석", emoji: "📋", delay: B.LINE_4 },
] as const;

export const Scene6_Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const worldIn = spring({
    frame: Math.max(0, frame - B.WORLD),
    fps,
    config: SPRING.smooth,
  });

  const itemsDim = frame >= B.WORLD
    ? interpolate(frame, [B.WORLD, B.WORLD + 15], [1, 0.3], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <Ep01SceneLayout dense>
      {/* 2×2 그리드 — 카드 가로형, 이모지+텍스트 한 줄 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          width: "100%",
          maxWidth: 1200,
          opacity: itemsDim,
        }}
      >
        {ITEMS.map((item, i) => {
          const itemIn = spring({
            frame: Math.max(0, frame - item.delay),
            fps,
            config: SPRING.smooth,
          });

          const strikeDelay = item.delay + 18;
          const strikeIn = spring({
            frame: Math.max(0, frame - strikeDelay),
            fps,
            config: SPRING.heavy,
          });

          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                padding: "32px 40px",
                borderRadius: 24,
                backgroundColor: palette.card,
                border: `1.5px solid ${palette.cardBorder}`,
                opacity: itemIn,
                transform: `translateY(${interpolate(itemIn, [0, 1], [20, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 64, flexShrink: 0 }}>{item.emoji}</span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 64,
                  fontWeight: 800,
                  color: palette.text,
                  whiteSpace: "nowrap",
                }}
              >
                {item.text}
              </span>
              {/* 취소선 — 가로로 쭉 */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 24,
                  right: 24,
                  height: 4,
                  backgroundColor: palette.accent,
                  transform: `scaleX(${strikeIn})`,
                  transformOrigin: "left center",
                  borderRadius: 2,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* "이런 세상" */}
      <div
        style={{
          marginTop: 44,
          opacity: worldIn,
          transform: `scale(${interpolate(worldIn, [0, 1], [0.9, 1])})`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 900,
            color: palette.sub,
          }}
        >
          이런 세상
        </span>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={600}
        x="50%"
        y="40%"
        delay={B.LINE_1}
      />
    </Ep01SceneLayout>
  );
};
