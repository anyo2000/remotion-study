import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GradientBackground, GlowOrb } from "../../components";

const palette = PALETTES.coolBlue;

// ── B-1: Hero Emoji ─────────────────────────────────
// 큰 이모지 하나가 바운스하며 등장 + 글로우 + 텍스트
export const EmojiHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.bouncy,
  });

  const textIn = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: SPRING.smooth,
  });

  // 미세 펄스
  const pulse = 1 + Math.sin(frame * 0.06) * 0.03;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.06} size={600} x="50%" y="42%" delay={10} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 200,
            lineHeight: 1,
            opacity: emojiIn,
            transform: `scale(${emojiIn * pulse})`,
          }}
        >
          🔍
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 900,
            color: palette.text,
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
          }}
        >
          보장분석
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 600,
            color: palette.sub,
            opacity: textIn * 0.8,
          }}
        >
          히어로 이모지 — 중앙 임팩트
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── B-2: Emoji Grid ─────────────────────────────────
// 이모지 격자 — 순서대로 나타남
export const EmojiGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojis = [
    "📋", "🔍", "🎯", "💡",
    "🤝", "✅", "📊", "💰",
    "🏠", "🚗", "👶", "🏥",
  ];
  const cols = 4;
  const cellSize = 180;
  const gap = 24;
  const gridWidth = cols * cellSize + (cols - 1) * gap;
  const rows = Math.ceil(emojis.length / cols);
  const gridHeight = rows * cellSize + (rows - 1) * gap;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: gridWidth,
            gap,
          }}
        >
          {emojis.map((emoji, i) => {
            const delay = 8 + i * 4;
            const progress = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: SPRING.smooth,
            });

            return (
              <div
                key={i}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 80,
                  opacity: progress,
                  transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
                  borderRadius: 20,
                  backgroundColor: palette.card,
                  border: `1px solid ${palette.cardBorder}`,
                }}
              >
                {emoji}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 50), fps, config: SPRING.heavy }),
          }}
        >
          이모지 격자 — 순차 등장
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── B-3: Emoji Cascade ──────────────────────────────
// 위에서 이모지가 떨어지는 비 효과
export const EmojiCascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojis = ["📋", "🔍", "🎯", "💡", "🤝", "✅", "📊", "💰", "🏠", "🚗", "👶", "🏥"];
  const count = 20;

  const items = Array.from({ length: count }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    x: 100 + random(`x-${i}`) * 1720, // safe zone 내
    delay: Math.floor(random(`d-${i}`) * 50),
    speed: 0.6 + random(`s-${i}`) * 0.6,
    size: 60 + random(`sz-${i}`) * 40,
    rotation: (random(`r-${i}`) - 0.5) * 30,
  }));

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {items.map((item, i) => {
          const elapsed = Math.max(0, frame - item.delay);
          const y = -100 + elapsed * item.speed * 8;
          const opacity = y > 900 ? interpolate(y, [900, 1100], [1, 0], { extrapolateRight: "clamp" }) : 1;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: item.x,
                top: y,
                fontSize: item.size,
                opacity: elapsed > 0 ? opacity : 0,
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              {item.emoji}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 라벨 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 56,
          fontWeight: 700,
          color: palette.sub,
          opacity: spring({ frame: Math.max(0, frame - 15), fps, config: SPRING.heavy }),
        }}
      >
        이모지 캐스케이드 (비)
      </div>
    </AbsoluteFill>
  );
};

// ── B-4: Emoji Bullets ──────────────────────────────
// 이모지를 불릿으로 쓰는 리스트
export const EmojiBullets: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { emoji: "📋", text: "현황 파악" },
    { emoji: "🔍", text: "빈틈 분석" },
    { emoji: "🎯", text: "맞춤 제안" },
    { emoji: "✅", text: "계약 체결" },
  ];

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 36,
          }}
        >
          {items.map((item, i) => {
            const delay = 10 + i * 15;
            const emojiIn = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: SPRING.bouncy,
            });
            const textIn = spring({
              frame: Math.max(0, frame - delay - 5),
              fps,
              config: SPRING.smooth,
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 72,
                    opacity: emojiIn,
                    transform: `scale(${emojiIn})`,
                    lineHeight: 1,
                  }}
                >
                  {item.emoji}
                </div>
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 64,
                    fontWeight: 700,
                    color: palette.text,
                    opacity: textIn,
                    transform: `translateX(${interpolate(textIn, [0, 1], [30, 0])}px)`,
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 65), fps, config: SPRING.heavy }),
          }}
        >
          이모지 불릿 리스트
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── B-5: Emoji Scale Sequence ───────────────────────
// 이모지가 하나씩 커지며 등장 → 이전 것은 줄어듦
export const EmojiScaleSeq: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojis = ["📋", "🔍", "🎯", "💡", "✅"];
  const stagger = 15;
  const centerX = 960;
  const spacing = 200;
  const startX = centerX - ((emojis.length - 1) * spacing) / 2;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing - 100,
          }}
        >
          {emojis.map((emoji, i) => {
            const delay = 10 + i * stagger;
            const enterProgress = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: SPRING.bouncy,
            });

            // 다음 이모지 등장 시 이전 것 축소
            const nextDelay = delay + stagger;
            const shrinkProgress = i < emojis.length - 1
              ? spring({
                  frame: Math.max(0, frame - nextDelay),
                  fps,
                  config: SPRING.smooth,
                })
              : 0;

            const scale = interpolate(
              enterProgress,
              [0, 1],
              [0, 1.3 - shrinkProgress * 0.5]
            );

            return (
              <div
                key={i}
                style={{
                  fontSize: 100,
                  lineHeight: 1,
                  opacity: enterProgress,
                  transform: `scale(${Math.max(0, scale)})`,
                }}
              >
                {emoji}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 120,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 70), fps, config: SPRING.heavy }),
          }}
        >
          이모지 순차 확대 시퀀스
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── B-6: Emoji Orbit ────────────────────────────────
// 이모지가 원형으로 배치 + 중앙 텍스트
export const EmojiOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojis = ["📋", "🔍", "🎯", "💡", "🤝", "✅"];
  const radius = 220;
  const centerX = 0;
  const centerY = -20;

  // 전체 회전 (느린)
  const rotation = frame * 0.3;

  // 중앙 텍스트
  const centerIn = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.04} size={500} x="50%" y="45%" delay={5} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 궤도 원형 배치 */}
        <div style={{ position: "relative", width: radius * 2 + 100, height: radius * 2 + 100 }}>
          {/* 궤도 링 */}
          <svg
            width={radius * 2 + 100}
            height={radius * 2 + 100}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <circle
              cx={radius + 50} cy={radius + 50} r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </svg>

          {emojis.map((emoji, i) => {
            const delay = 5 + i * 8;
            const progress = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: SPRING.bouncy,
            });

            const angle = (i / emojis.length) * 360 + rotation;
            const rad = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad) + radius + 50;
            const y = centerY + radius * Math.sin(rad) + radius + 50;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x - 40,
                  top: y - 40,
                  fontSize: 72,
                  lineHeight: 1,
                  opacity: progress,
                  transform: `scale(${progress})`,
                }}
              >
                {emoji}
              </div>
            );
          })}

          {/* 중앙 텍스트 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${centerIn})`,
              opacity: centerIn,
              fontFamily: FONT_FAMILY,
              fontSize: 64,
              fontWeight: 900,
              color: palette.accent,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            보장분석
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: centerIn,
          }}
        >
          이모지 오비탈 배치
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
