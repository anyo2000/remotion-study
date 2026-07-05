import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { WineBottle, WineGlass, WineProgress } from "./wine-shared";

// ═════════════════════════════════════════════
// 1안 — 와인 5잔 언박싱형
// 아이보리 배경, 버건디·딥그린·골드 포인트
// 후킹(잔 차오름) → WINE 01 → WINE 02 → 잔 5개 정렬
// ═════════════════════════════════════════════

export const STRUCTURE1_FRAMES = 360;

const IVORY = "#F5EEE2";
const INK = "#2B2118";
const BURGUNDY = "#7A2434";
const GREEN = "#2E4B3F";
const GOLD = "#C9A227";

export const Structure1Unboxing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (at: number, damping = 11) =>
    spring({ frame: frame - at, fps, config: { damping, mass: 0.8 } });
  const fade = (a: number, b: number, c: number, d: number) =>
    interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const fadeIn = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // ── 비트1: 후킹 (잔이 차오름) ──
  const beat1Op = fade(0, 1, 80, 94);
  const glassLevel = interpolate(frame, [8, 62], [0.05, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // ── 비트2: WINE 01 ──
  const beat2Op = fade(86, 96, 162, 174);
  const bottle1X = interpolate(pop(96, 14), [0, 1], [-720, 0]);

  // ── 비트3: WINE 02 ──
  const beat3Op = fade(172, 182, 244, 256);
  const bottle2X = interpolate(pop(182, 14), [0, 1], [720, 0]);

  // ── 비트4: 잔 5개 정렬 ──
  const beat4Op = fadeIn(254, 264);
  const glassColors = [GOLD, GREEN, BURGUNDY, "#D98F6C", "#4A3550"];

  const wineCard = (
    op: number,
    x: number,
    badge: string,
    color: string,
    line1: string,
    line2: string,
    progress: number,
    progressText: string
  ) => (
    <AbsoluteFill style={{ opacity: op, alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 250,
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: 12,
          color: IVORY,
          background: color,
          padding: "16px 52px",
          borderRadius: 60,
          transform: `scale(${pop(frame > 180 ? 178 : 92)})`,
        }}
      >
        {badge}
      </div>
      <div
        style={{
          position: "absolute",
          top: 420,
          transform: `translateX(${x}px) rotate(${x / 90}deg)`,
        }}
      >
        <WineBottle width={230} fill={color} labelColor={IVORY} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 480,
          width: "100%",
          textAlign: "center",
          opacity: pop(frame > 180 ? 202 : 116),
          fontSize: 58,
          fontWeight: 500,
          color: INK,
        }}
      >
        {line1}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 340,
          width: "100%",
          textAlign: "center",
          transform: `scale(${pop(frame > 180 ? 220 : 134)})`,
          fontSize: 92,
          fontWeight: 900,
          color: color,
          whiteSpace: "pre-line",
          lineHeight: 1.25,
        }}
      >
        {line2}
      </div>
      <div style={{ position: "absolute", bottom: 190 }}>
        <WineProgress
          current={progress}
          active={GOLD}
          dim="rgba(43,33,24,0.15)"
          text={progressText}
        />
      </div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 80% at 50% 25%, #FBF6EC 0%, ${IVORY} 55%, #EAE0CE 100%)`,
      }}
    >
      {/* ── 비트1: 후킹 ── */}
      <AbsoluteFill style={{ opacity: beat1Op, alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 330,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(16)})`,
            fontSize: 78,
            fontWeight: 900,
            color: INK,
            lineHeight: 1.3,
          whiteSpace: "nowrap",
          }}
        >
          와인, 1도 몰라도 됩니다
        </div>
        <div
          style={{
            position: "absolute",
            top: 470,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(46)})`,
            fontSize: 66,
            fontWeight: 700,
            color: BURGUNDY,
          }}
        >
          그런데 이 5잔은 궁금할걸요?
        </div>
        <div style={{ position: "absolute", top: 700 }}>
          <WineGlass
            height={560}
            level={glassLevel}
            wine={BURGUNDY}
            stroke={INK}
            clipId="s1-hook-glass"
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 260,
            opacity: fadeIn(66, 82),
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: 16,
            color: GOLD,
          }}
        >
          YRC WINE TALK
        </div>
      </AbsoluteFill>

      {/* ── 비트2: WINE 01 ── */}
      {frame < 180 &&
        wineCard(
          beat2Op,
          bottle1X,
          "WINE 01",
          BURGUNDY,
          "하얏트호텔 와인바",
          "30만원 샴페인\n블라인드 테스트 1위",
          1,
          "WINE 01 / 05"
        )}

      {/* ── 비트3: WINE 02 ── */}
      {frame >= 180 &&
        wineCard(
          beat3Op,
          bottle2X,
          "WINE 02",
          GREEN,
          "클라우디 베이 말고",
          "가격은 착한데\n맛은 안 밀리는 화이트",
          2,
          "WINE 02 / 05"
        )}

      {/* ── 비트4: 잔 5개 정렬 ── */}
      <AbsoluteFill
        style={{ opacity: beat4Op, alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            position: "absolute",
            top: 480,
            width: "100%",
            textAlign: "center",
            transform: `scale(${pop(296)})`,
            fontSize: 82,
            fontWeight: 900,
            color: INK,
            lineHeight: 1.3,
          whiteSpace: "nowrap",
          }}
        >
          5잔, 싹 다 마셔봅니다
        </div>
        <div
          style={{
            position: "absolute",
            top: 760,
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          {glassColors.map((c, i) => {
            const s = pop(264 + i * 9, 9);
            const isLast = i === 4;
            return (
              <div
                key={i}
                style={{
                  transform: `scale(${s})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: BURGUNDY,
                    opacity: isLast ? 1 : 0,
                  }}
                >
                  ?
                </div>
                <WineGlass
                  height={270}
                  level={isLast ? 0 : 0.62}
                  wine={c}
                  stroke={INK}
                  clipId={`s1-row-glass-${i}`}
                />
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 300,
            opacity: fadeIn(300, 316),
            fontSize: 58,
            fontWeight: 600,
            color: "rgba(43,33,24,0.65)",
          }}
        >
          마지막 잔은, 현장에서 👀
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
