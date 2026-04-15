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
import { GradientBackground, GaugeBar } from "../../components";

const palette = PALETTES.coolBlue;

// ── C-1: Stacking Blocks ────────────────────────────
// 블록이 위에서 떨어져서 쌓이는 효과
export const BlockStacking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blocks = [
    { label: "니즈 파악", color: "rgba(91, 155, 213, 0.15)", border: "rgba(91, 155, 213, 0.3)" },
    { label: "보장 분석", color: "rgba(78, 205, 196, 0.15)", border: "rgba(78, 205, 196, 0.3)" },
    { label: "상품 매칭", color: "rgba(255, 140, 56, 0.15)", border: "rgba(255, 140, 56, 0.3)" },
    { label: "제안서 작성", color: "rgba(91, 155, 213, 0.15)", border: "rgba(91, 155, 213, 0.3)" },
    { label: "계약 체결", color: palette.accent + "25", border: palette.accent },
  ];

  const blockHeight = 90;
  const blockGap = 12;
  const totalHeight = blocks.length * (blockHeight + blockGap);
  const baseY = 540 + totalHeight / 2;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: 600,
            height: totalHeight,
          }}
        >
          {blocks.map((block, i) => {
            const delay = 8 + i * 10;
            const progress = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: { damping: 12, stiffness: 200 },
            });

            const y = interpolate(progress, [0, 1], [-300, 0]);
            const bottomPos = (blocks.length - 1 - i) * (blockHeight + blockGap);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  bottom: bottomPos,
                  left: 0,
                  right: 0,
                  height: blockHeight,
                  borderRadius: 16,
                  backgroundColor: block.color,
                  border: `2px solid ${block.border}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateY(${y}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    fontWeight: 700,
                    color: i === blocks.length - 1 ? palette.accent : palette.text,
                  }}
                >
                  {block.label}
                </span>
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
            opacity: spring({ frame: Math.max(0, frame - 55), fps, config: SPRING.heavy }),
          }}
        >
          블록 쌓기 — spring 낙하
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── C-2: Grid Reveal ────────────────────────────────
// 격자 셀이 순서대로(대각선 방향) 나타남
export const BlockGridReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = 4;
  const cols = 6;
  const cellSize = 140;
  const gap = 12;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap,
          }}
        >
          {Array.from({ length: rows * cols }, (_, idx) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            // 대각선 순서: row + col 값이 작을수록 먼저
            const diagDelay = (row + col) * 4 + 5;
            const progress = spring({
              frame: Math.max(0, frame - diagDelay),
              fps,
              config: SPRING.snappy,
            });

            // 색상 변화 — 대각선 위치에 따라
            const hue = interpolate(row + col, [0, rows + cols - 2], [200, 240]);
            const lightness = interpolate(row + col, [0, rows + cols - 2], [25, 15]);

            return (
              <div
                key={idx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 12,
                  backgroundColor: `hsl(${hue}, 40%, ${lightness}%)`,
                  border: `1px solid rgba(91, 155, 213, ${0.1 + (row + col) * 0.03})`,
                  opacity: progress,
                  transform: `scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 50), fps, config: SPRING.heavy }),
          }}
        >
          격자 대각선 리빌
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── C-3: Split Screen ───────────────────────────────
// 화면이 좌우로 분할되며 두 콘텐츠 나타남
export const BlockSplitScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.heavy,
  });

  const leftWidth = interpolate(splitProgress, [0, 1], [100, 50]);
  const rightWidth = interpolate(splitProgress, [0, 1], [0, 50]);

  const contentIn = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />

      {/* 왼쪽 패널 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${leftWidth}%`,
          height: "100%",
          backgroundColor: "rgba(224, 90, 90, 0.06)",
          borderRight: splitProgress > 0.5 ? "2px solid rgba(255,255,255,0.08)" : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 100,
            opacity: contentIn,
            transform: `scale(${contentIn})`,
          }}
        >
          😵
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 800,
            color: "#E05A5A",
            opacity: contentIn,
          }}
        >
          BEFORE
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: palette.sub,
            opacity: contentIn,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          설명부터 시작
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: `${rightWidth}%`,
          height: "100%",
          backgroundColor: "rgba(78, 205, 196, 0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 100,
            opacity: contentIn,
            transform: `scale(${contentIn})`,
          }}
        >
          🎯
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 800,
            color: "#4ECDC4",
            opacity: contentIn,
          }}
        >
          AFTER
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: palette.sub,
            opacity: contentIn,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          보장분석부터 시작
        </div>
      </div>

      {/* 라벨 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 56,
          fontWeight: 700,
          color: palette.sub,
          opacity: contentIn,
        }}
      >
        화면 분할 (Split Screen)
      </div>
    </AbsoluteFill>
  );
};

// ── C-4: Gauge Fill ─────────────────────────────────
// 프로그레스 바 + 단계별 마커
export const BlockGaugeFill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stages = [
    { label: "접촉", ratio: 0.2, emoji: "👋" },
    { label: "분석", ratio: 0.45, emoji: "🔍" },
    { label: "제안", ratio: 0.7, emoji: "💡" },
    { label: "계약", ratio: 1.0, emoji: "✅" },
  ];

  const fillProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.chart,
  });

  const currentRatio = 0.73 * fillProgress;
  const barWidth = 1200;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* 게이지 바 */}
        <div style={{ position: "relative", width: barWidth }}>
          <GaugeBar
            fromRatio={0}
            toRatio={0.73}
            startFrame={10}
            barColor={palette.accent}
            bgColor="rgba(255,255,255,0.06)"
            height={40}
            width={barWidth}
            borderRadius={20}
          />

          {/* 단계 마커 */}
          {stages.map((stage, i) => {
            const markerX = stage.ratio * barWidth;
            const reached = currentRatio >= stage.ratio;
            const markerIn = spring({
              frame: Math.max(0, frame - 20 - i * 10),
              fps,
              config: SPRING.bouncy,
            });

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: markerX - 30,
                  top: -70,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  opacity: markerIn,
                  transform: `scale(${markerIn})`,
                }}
              >
                <div style={{ fontSize: 52 }}>{stage.emoji}</div>
                <div
                  style={{
                    position: "absolute",
                    top: 100,
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    fontWeight: 600,
                    color: reached ? palette.accent : palette.sub,
                    whiteSpace: "nowrap",
                  }}
                >
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 50), fps, config: SPRING.heavy }),
            marginTop: 60,
          }}
        >
          게이지 바 + 단계 마커
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── C-5: Floating Cards ─────────────────────────────
// 카드가 서로 다른 높이에서 떠다니며 나타남
export const BlockFloatingCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cards = [
    { emoji: "📋", title: "현황", x: -350, baseY: -80, phase: 0 },
    { emoji: "🔍", title: "분석", x: -120, baseY: 40, phase: 1.2 },
    { emoji: "🎯", title: "제안", x: 120, baseY: -40, phase: 2.4 },
    { emoji: "✅", title: "계약", x: 350, baseY: 60, phase: 3.6 },
  ];

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {cards.map((card, i) => {
          const delay = 10 + i * 12;
          const cardIn = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: SPRING.smooth,
          });

          // 떠다니는 모션
          const float = Math.sin((frame + card.phase * 10) * 0.04) * 12;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${card.x}px - 100px)`,
                top: `calc(50% + ${card.baseY + float}px - 90px)`,
                width: 200,
                padding: "28px 20px",
                borderRadius: 24,
                backgroundColor: palette.card,
                border: `1.5px solid ${palette.cardBorder}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                opacity: cardIn,
                transform: `translateY(${interpolate(cardIn, [0, 1], [40, 0])}px)`,
                boxShadow: `0 8px 32px rgba(0,0,0,${0.2 * cardIn})`,
              }}
            >
              <div style={{ fontSize: 64, lineHeight: 1 }}>{card.emoji}</div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 52,
                  fontWeight: 700,
                  color: palette.text,
                }}
              >
                {card.title}
              </span>
            </div>
          );
        })}

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
          플로팅 카드 — 떠다니는 레이아웃
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── C-6: Block Collapse ─────────────────────────────
// 블록이 쌓였다가 무너지는 효과 (거절/실패 표현)
export const BlockCollapse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blocks = [
    { label: "기대", color: "rgba(91, 155, 213, 0.15)" },
    { label: "노력", color: "rgba(78, 205, 196, 0.15)" },
    { label: "진행", color: "rgba(255, 140, 56, 0.15)" },
    { label: "결과?", color: "rgba(224, 90, 90, 0.15)" },
  ];

  const collapseStart = 55;
  const isCollapsing = frame >= collapseStart;

  // 무너진 후 메시지
  const messageIn = spring({
    frame: Math.max(0, frame - collapseStart - 20),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: 400,
            height: 500,
          }}
        >
          {blocks.map((block, i) => {
            // 쌓이기
            const stackDelay = 5 + i * 10;
            const stackProgress = spring({
              frame: Math.max(0, frame - stackDelay),
              fps,
              config: { damping: 12, stiffness: 200 },
            });

            const blockHeight = 90;
            const gap = 12;
            const bottomPos = i * (blockHeight + gap);
            const stackY = interpolate(stackProgress, [0, 1], [-250, 0]);

            // 무너지기
            const collapseStagger = i * 3;
            const collapseFrame = Math.max(0, frame - collapseStart - collapseStagger);
            const collapseProgress = isCollapsing
              ? spring({
                  frame: collapseFrame,
                  fps,
                  config: { damping: 8, mass: 1.5 },
                })
              : 0;

            // 미리 정해진 방향
            const directions = [-1.2, 1.5, -0.8, 1.3];
            const rotations = [20, -25, 15, -30];

            const collapseX = directions[i] * 200 * collapseProgress;
            const collapseY = 400 * collapseProgress;
            const collapseRotate = rotations[i] * collapseProgress;
            const collapseOpacity = interpolate(collapseProgress, [0.5, 1], [1, 0], {
              extrapolateLeft: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  bottom: bottomPos,
                  left: 0,
                  right: 0,
                  height: blockHeight,
                  borderRadius: 16,
                  backgroundColor: block.color,
                  border: `2px solid rgba(255,255,255,0.1)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: interpolate(stackProgress, [0, 0.3], [0, 1], {
                    extrapolateRight: "clamp",
                  }) * (isCollapsing ? collapseOpacity : 1),
                  transform: isCollapsing
                    ? `translate(${collapseX}px, ${collapseY}px) rotate(${collapseRotate}deg)`
                    : `translateY(${stackY}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 52,
                    fontWeight: 700,
                    color: palette.text,
                  }}
                >
                  {block.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 무너진 후 메시지 */}
        {isCollapsing && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: `translateY(-50%) scale(${messageIn})`,
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 900,
              color: "#E05A5A",
              opacity: messageIn,
              textAlign: "center",
            }}
          >
            거절
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.heavy }),
          }}
        >
          블록 쌓기 → 무너짐
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
