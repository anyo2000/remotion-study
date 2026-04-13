import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE, FONT_FAMILY } from "../../constants";
import type { Palette } from "../../constants";
import type { AudioSync } from "../types";

type Props = AudioSync & {
  palette: Palette;
  durationInFrames?: number;
  headline: string;
  sub?: string;
};

// 8개 파편 — 위치/방향 다양화 (시드 기반)
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const FRAGMENTS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  return {
    tx: Math.cos(angle) * (180 + seededRandom(i * 5) * 200),
    ty: Math.sin(angle) * (180 + seededRandom(i * 7) * 200),
    rotate: (seededRandom(i * 11) - 0.5) * 360,
    // 각 파편은 원래 ❓의 일부를 clipPath로 잘라낸 것처럼 위치
    offsetX: (seededRandom(i * 3) - 0.5) * 160,
    offsetY: (seededRandom(i * 9) - 0.5) * 160,
    // scale 하한 0.45 → fontSize 최솟값 120*0.45=54px (>= 52px 규칙 준수)
    scale: 0.45 + seededRandom(i * 13) * 0.35,
  };
});

// 균열선 — 중앙에서 방사형으로 8개
const CRACKS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.2;
  const len = 60 + seededRandom(i * 7) * 80;
  return {
    x2: Math.cos(angle) * len,
    y2: Math.sin(angle) * len,
    // 각 금이 생기는 시점 다양화
    startAt: 12 + i * 1.5,
    endAt: 24 + i * 1.5,
  };
});

export const PuzzleBurstScene: React.FC<Props> = ({
  palette,
  durationInFrames: dur,
  headline,
  sub,
  cues,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur, width, height } = useVideoConfig();
  const duration = dur ?? configDur;

  const cx = (width as number) / 2;
  const cy = (height as number) / 2;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    Q_IN: cues?.qIn ?? 0,
    CRACKS_START: cues?.cracksStart ?? 10,
    EXPLOSION: cues?.explosion ?? 35,
    SHAKE_END: cues?.shakeEnd ?? 38,
    HEADLINE_IN: cues?.headlineIn ?? 40,
    SUB_IN: cues?.subIn ?? 55,
  };

  // ❓ 등장 — 바운스
  const qIn = spring({
    frame: Math.max(0, frame - BEATS.Q_IN),
    fps,
    config: SPRING.bouncy,
  });

  // 폭발 진행
  const exploded = frame >= BEATS.EXPLOSION;
  const burstProgress = spring({
    frame: Math.max(0, frame - BEATS.EXPLOSION),
    fps,
    config: { damping: 6, stiffness: 180 },
  });

  // 화면 쉐이크 — 폭발 직후 2~3프레임
  const shakeDuration = BEATS.SHAKE_END - BEATS.EXPLOSION;
  const shakeX =
    frame >= BEATS.EXPLOSION && frame < BEATS.SHAKE_END
      ? 10 *
        Math.sin((frame - BEATS.EXPLOSION) * 3.5) *
        Math.exp(-((frame - BEATS.EXPLOSION) * 0.6))
      : 0;
  const shakeY =
    frame >= BEATS.EXPLOSION && frame < BEATS.SHAKE_END
      ? 8 *
        Math.cos((frame - BEATS.EXPLOSION) * 4) *
        Math.exp(-((frame - BEATS.EXPLOSION) * 0.6))
      : 0;

  // 헤드라인 등장
  const headlineIn = spring({
    frame: Math.max(0, frame - BEATS.HEADLINE_IN),
    fps,
    config: SPRING.bouncy,
  });

  // 서브 등장
  const subIn = spring({
    frame: Math.max(0, frame - BEATS.SUB_IN),
    fps,
    config: SPRING.smooth,
  });

  // 균열선 stroke-dashoffset 계산 — 각 균열마다 다른 타이밍으로 "생김"
  const getCrackProgress = (startAt: number, endAt: number) => {
    if (frame < startAt) return 0;
    if (frame >= endAt) return 1;
    return (frame - startAt) / (endAt - startAt);
  };

  // ❓ 규모 — 폭발 전까지 살짝 떨림 (긴장감)
  const qTrembleX =
    !exploded && frame >= BEATS.CRACKS_START
      ? 3 * Math.sin((frame - BEATS.CRACKS_START) * 1.8)
      : 0;
  const qTrembleY =
    !exploded && frame >= BEATS.CRACKS_START
      ? 3 * Math.cos((frame - BEATS.CRACKS_START) * 2.1)
      : 0;

  return (
    <AbsoluteFill
      style={{
        background: palette.bg,
        overflow: "hidden",
        transform: `translateX(${shakeX}px) translateY(${shakeY}px)`,
      }}
    >
      {/* 배경 그라디언트 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${palette.glowPosition}, ${palette.glow} 0%, transparent 65%)`,
        }}
      />

      {/* ── 파편들 (폭발 후 배경에서 계속 떠다님) ── */}
      {exploded &&
        FRAGMENTS.map((frag, i) => {
          const tx = frag.tx * burstProgress;
          const ty = frag.ty * burstProgress;
          const rot = frag.rotate * burstProgress;
          const fragOpacity = interpolate(
            burstProgress,
            [0, 0.3, 1],
            [1, 0.7, 0.15],
            { extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx + frag.offsetX,
                top: cy + frag.offsetY,
                fontSize: 120 * frag.scale,
                transform: `translate(-50%, -50%) translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
                opacity: fragOpacity,
                userSelect: "none",
                color: palette.sub,
              }}
            >
              ❓
            </div>
          );
        })}

      {/* ── 폭발 전: ❓ 원본 + 균열 SVG ── */}
      {!exploded && (
        <>
          {/* ❓ 본체 */}
          <div
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              transform: `translate(-50%, -50%) translateX(${qTrembleX}px) translateY(${qTrembleY}px) scale(${qIn})`,
              fontSize: 280,
              lineHeight: 1,
              userSelect: "none",
              opacity: qIn,
            }}
          >
            ❓
          </div>

          {/* 균열선 SVG */}
          {frame >= BEATS.CRACKS_START && (
            <svg
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                overflow: "visible",
                pointerEvents: "none",
              }}
              width={width as number}
              height={height as number}
            >
              {CRACKS.map((crack, i) => {
                const progress = getCrackProgress(crack.startAt, crack.endAt);
                const totalLen = Math.sqrt(crack.x2 ** 2 + crack.y2 ** 2);
                const dashOffset = totalLen * (1 - progress);

                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={cx + crack.x2}
                    y2={cy + crack.y2}
                    stroke={palette.accent}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray={totalLen}
                    strokeDashoffset={dashOffset}
                    opacity={0.8}
                  />
                );
              })}
            </svg>
          )}
        </>
      )}

      {/* ── 폭발 직후 플래시 ── */}
      {frame >= BEATS.EXPLOSION && frame < BEATS.EXPLOSION + 6 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: palette.accent,
            opacity: interpolate(
              frame,
              [BEATS.EXPLOSION, BEATS.EXPLOSION + 6],
              [0.5, 0],
              { extrapolateRight: "clamp" }
            ),
          }}
        />
      )}

      {/* ── 헤드라인: "답이" ── */}
      {frame >= BEATS.HEADLINE_IN && (
        <div
          style={{
            position: "absolute",
            left: SAFE.side,
            right: SAFE.side,
            top: cy - 160,
            display: "flex",
            justifyContent: "center",
            opacity: headlineIn,
            transform: `scale(${headlineIn})`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 120,
              fontWeight: 900,
              color: palette.accent,
              textAlign: "center",
              textShadow: `0 0 40px ${palette.accent}70`,
            }}
          >
            {headline}
          </span>
        </div>
      )}

      {/* ── 서브 텍스트 ── */}
      {sub && frame >= BEATS.SUB_IN && (
        <div
          style={{
            position: "absolute",
            left: SAFE.side,
            right: SAFE.side,
            top: cy + 20,
            display: "flex",
            justifyContent: "center",
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 64,
              fontWeight: 700,
              color: palette.sub,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {sub}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
