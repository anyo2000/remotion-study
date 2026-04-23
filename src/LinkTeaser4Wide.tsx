/**
 * LinkTeaser4Wide — "숫자 충격형" 가로 리빌드 (16:9, 1920x1080)
 * 대본/음성/타이밍은 세로형(LinkTeaser4)과 동일, 레이아웃만 가로 적용
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  staticFile,
  Easing,
} from "remotion";
import {
  PALETTES,
  SPRING,
  FONT_FAMILY,
  SAFE_WIDE as SAFE,
  type PaletteName,
} from "./constants";
import { GradientBackground } from "./components/GradientBackground";

// ── 장면 타이밍 (세로형과 동일 — 음성 기반) ──
const S1_START = 0;     // 0.0s
const S2_START = 273;   // 9.1s
const S3_START = 447;   // 14.9s
const S4_START = 592;   // 19.7s
const S5_START = 737;   // 24.6s
const TOTAL_DUR = 885;  // 27.0s + 75fr 여유

const S1_DUR = S2_START - S1_START; // 273fr
const S2_DUR = S3_START - S2_START; // 174fr
const S3_DUR = S4_START - S3_START; // 145fr
const S4_DUR = S5_START - S4_START; // 145fr
const S5_DUR = TOTAL_DUR - S5_START; // 148fr

// ── BEATS (장면별 비주얼 타이밍) ──
const BEATS_S1 = {
  COUNT_START: 5,
  COUNT_END: 30,
  QUESTION: 45,
  TEN: 100,
  TWENTY: 130,
  REST: 170,
  WHERE: 200,
  FADE_OUT: 250,
} as const;

const BEATS_S2 = {
  CARD1: 8,
  CARD2: 50,
  CARD3: 95,
  FADE_OUT: 145,
} as const;

const BEATS_S3 = {
  BUILD_START: 5,
  BUILD_END: 35,
  WALL_TEXT: 10,
  SHAKE_START: 40,
  BREAK: 60,
  METHOD: 75,
  FADE_OUT: 125,
} as const;

const BEATS_S4 = {
  SKILL_IN: 10,
  LINK_IN: 45,
  CONSULTING_IN: 65,
} as const;

const BEATS_S5 = {
  MONTH_IN: 12,
  COMING_IN: 40,
} as const;

// ===================================================================
// 장면 1: 숫자 충격 — 좌우 분할
// ===================================================================
const NumberImpactScene: React.FC<{ palette: PaletteName }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const B = BEATS_S1;

  const countProgress = interpolate(
    frame,
    [B.COUNT_START, B.COUNT_END],
    [0, 10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) },
  );
  const countNum = Math.round(countProgress);
  const countScale = spring({ frame: Math.max(0, frame - B.COUNT_START), fps, config: SPRING.dramatic });

  const punchScale =
    frame >= B.COUNT_END && frame < B.COUNT_END + 8
      ? interpolate(frame, [B.COUNT_END, B.COUNT_END + 4, B.COUNT_END + 8], [1, 1.15, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const questionIn = spring({ frame: Math.max(0, frame - B.QUESTION), fps, config: SPRING.heavy });
  const tenIn = spring({ frame: Math.max(0, frame - B.TEN), fps, config: SPRING.bouncy });
  const twentyIn = spring({ frame: Math.max(0, frame - B.TWENTY), fps, config: SPRING.bouncy });
  const restIn = spring({ frame: Math.max(0, frame - B.REST), fps, config: SPRING.heavy });
  const whereIn = spring({ frame: Math.max(0, frame - B.WHERE), fps, config: SPRING.dramatic });
  const fadeOut = interpolate(frame, [B.FADE_OUT, S1_DUR], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground palette={palette} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: `${SAFE.top}px ${SAFE.side}px`,
          gap: 80,
        }}
      >
        {/* 좌측: 숫자 카운트업 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 360,
            transform: `scale(${punchScale})`,
          }}
        >
          <span
            style={{
              color: P.accent,
              fontSize: 220,
              fontWeight: 900,
              fontFamily: FONT_FAMILY,
              fontVariantNumeric: "tabular-nums",
              opacity: countScale,
              transform: `scale(${countScale})`,
            }}
          >
            {countNum}
            <span style={{ fontSize: 88, fontWeight: 500, color: P.sub }}>명</span>
          </span>
        </div>

        {/* 우측: 질문 + 서브텍스트 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <div style={{ opacity: questionIn, transform: `translateY(${interpolate(questionIn, [0, 1], [20, 0])}px)` }}>
            <p style={{ color: P.sub, fontSize: 56, fontWeight: 400, fontFamily: FONT_FAMILY, margin: 0 }}>
              상담하면 몇 건 체결하시나요?
            </p>
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
            <span
              style={{
                color: P.text,
                fontSize: 88,
                fontWeight: 800,
                fontFamily: FONT_FAMILY,
                fontVariantNumeric: "tabular-nums",
                opacity: tenIn,
                transform: `scale(${tenIn})`,
              }}
            >
              2건?
            </span>
            <span
              style={{
                color: P.text,
                fontSize: 88,
                fontWeight: 800,
                fontFamily: FONT_FAMILY,
                fontVariantNumeric: "tabular-nums",
                opacity: twentyIn,
                transform: `scale(${twentyIn})`,
              }}
            >
              1건?
            </span>
          </div>

          <div style={{ opacity: restIn, transform: `translateY(${interpolate(restIn, [0, 1], [15, 0])}px)`, marginTop: 20 }}>
            <p style={{ color: P.sub, fontSize: 56, fontWeight: 400, fontFamily: FONT_FAMILY, margin: 0 }}>
              그럼 나머지 고객은
            </p>
          </div>

          <div style={{ opacity: whereIn, transform: `scale(${interpolate(whereIn, [0, 1], [0.9, 1])})` }}>
            <p style={{ color: P.accent, fontSize: 64, fontWeight: 700, fontFamily: FONT_FAMILY, margin: 0 }}>
              어디서 떨어진 걸까요?
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 2: 벽 — 가로 3카드
// ===================================================================
const WallScene: React.FC<{ palette: PaletteName }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const B = BEATS_S2;

  const cards = [
    { emoji: "\u{1F6AB}", text: "관심 없다는\n고객", delay: B.CARD1 },
    { emoji: "\u{1F512}", text: "인증번호를\n안 주는 고객", delay: B.CARD2 },
    { emoji: "\u{1F4AC}", text: '"생각해볼게요"\n고객', delay: B.CARD3 },
  ];

  const fadeOut = interpolate(frame, [B.FADE_OUT, S2_DUR], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground palette={palette} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: `${SAFE.top}px ${SAFE.side}px`,
          gap: 40,
        }}
      >
        {cards.map((card, i) => {
          const prog = spring({ frame: Math.max(0, frame - card.delay), fps, config: SPRING.heavy });
          return (
            <div
              key={i}
              style={{
                opacity: prog,
                transform: `translateY(${interpolate(prog, [0, 1], [30, 0])}px)`,
                backgroundColor: P.card,
                border: `2px solid ${P.cardBorder}`,
                borderRadius: 24,
                padding: "48px 40px",
                width: 480,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <span style={{ fontSize: 72 }}>{card.emoji}</span>
              <span
                style={{
                  color: P.text,
                  fontSize: 56,
                  fontWeight: 600,
                  fontFamily: FONT_FAMILY,
                  lineHeight: 1.4,
                  textAlign: "center",
                  whiteSpace: "pre-line",
                }}
              >
                {card.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 3: 전환 — 벽돌 와이드 → 무너짐
// ===================================================================
const WALL_ROWS = 5;
const BRICK_GAP = 10;
const AVAILABLE_W = 1920 - SAFE.side * 2; // 1720px
const BRICK_W = (AVAILABLE_W - 7 * BRICK_GAP) / 8; // 8개 기준
const BRICK_H = 72;

const generateWideRows = () => {
  const rows: { cols: number; bricks: { col: number; row: number; fallX: number; fallRot: number }[] }[] = [];
  for (let row = 0; row < WALL_ROWS; row++) {
    const cols = row % 2 === 0 ? 8 : 7;
    const bricks = [];
    for (let col = 0; col < cols; col++) {
      const seed = row * 10 + col;
      bricks.push({
        col,
        row,
        fallX: ((seed * 7 + 3) % 11 - 5) * 40,
        fallRot: ((seed * 13 + 7) % 9 - 4) * 15,
      });
    }
    rows.push({ cols, bricks });
  }
  return rows;
};

const WALL_ROWS_DATA = generateWideRows();

const BreakthroughScene: React.FC<{ palette: PaletteName }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const B = BEATS_S3;

  const buildProgress = interpolate(frame, [B.BUILD_START, B.BUILD_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wallTextIn = spring({ frame: Math.max(0, frame - B.WALL_TEXT), fps, config: SPRING.dramatic });

  const isShaking = frame >= B.SHAKE_START && frame < B.BREAK;
  const shakeIntensity = isShaking
    ? interpolate(frame, [B.SHAKE_START, B.BREAK], [1, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const shakeX = isShaking ? Math.sin(frame * 8) * shakeIntensity : 0;
  const shakeY = isShaking ? Math.cos(frame * 11) * shakeIntensity * 0.5 : 0;

  const isBreaking = frame >= B.BREAK;
  const breakProgress = isBreaking
    ? interpolate(frame, [B.BREAK, B.BREAK + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.quad),
      })
    : 0;

  const breakShakeX = isBreaking && breakProgress < 0.3 ? Math.sin(frame * 15) * 15 : 0;

  const methodIn = spring({ frame: Math.max(0, frame - B.METHOD), fps, config: SPRING.dramatic });
  const fadeOut = interpolate(frame, [B.FADE_OUT, S3_DUR], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut, transform: `translate(${shakeX + breakShakeX}px, ${shakeY}px)` }}>
      <GradientBackground palette={palette} />

      {/* "이 벽을" — 좌측 상단 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 40,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: wallTextIn,
        }}
      >
        <span style={{ color: P.sub, fontSize: 72, fontWeight: 600, fontFamily: FONT_FAMILY }}>이 벽을</span>
      </div>

      {/* 벽돌 — 화면 중앙, 와이드하게 */}
      <div
        style={{
          position: "absolute",
          left: SAFE.side,
          right: SAFE.side,
          top: "25%",
          bottom: "35%",
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: BRICK_GAP,
        }}
      >
        {WALL_ROWS_DATA.map((rowData, rowIdx) => {
          const rowDelay = rowIdx / WALL_ROWS;
          const appearFrame = B.BUILD_START + rowDelay * (B.BUILD_END - B.BUILD_START);

          return (
            <div key={rowIdx} style={{ display: "flex", gap: BRICK_GAP, justifyContent: "center" }}>
              {rowData.bricks.map((brick, colIdx) => {
                const brickSpring = spring({
                  frame: Math.max(0, frame - appearFrame),
                  fps,
                  config: { damping: 20, stiffness: 180 },
                });

                if (buildProgress <= rowDelay && !isBreaking) return null;

                const fallDelay = (WALL_ROWS - brick.row) * 0.8;
                const fallProgress = isBreaking
                  ? interpolate(frame, [B.BREAK + fallDelay, B.BREAK + fallDelay + 18], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.in(Easing.quad),
                    })
                  : 0;

                return (
                  <div
                    key={colIdx}
                    style={{
                      width: BRICK_W,
                      height: BRICK_H,
                      backgroundColor: `${P.accent}30`,
                      border: `2px solid ${P.accent}55`,
                      borderRadius: 4,
                      transform: `translateY(${isBreaking ? fallProgress * (400 + brick.row * 50) : interpolate(brickSpring, [0, 1], [-30, 0])}px) translateX(${fallProgress * brick.fallX}px) rotate(${fallProgress * brick.fallRot}deg)`,
                      opacity: isBreaking ? Math.max(0, 1 - fallProgress * 1.2) : brickSpring,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 플래시 */}
      {isBreaking && breakProgress < 0.3 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: interpolate(breakProgress, [0, 0.05, 0.3], [0, 0.15, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}

      {/* "단계별로 부수는 방법이 있습니다" */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          bottom: "35%",
          left: SAFE.side,
          right: SAFE.side,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          opacity: methodIn,
          transform: `scale(${interpolate(methodIn, [0, 1], [0.85, 1])})`,
        }}
      >
        <p
          style={{
            color: P.text,
            fontSize: 72,
            fontWeight: 800,
            fontFamily: FONT_FAMILY,
            margin: 0,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
          }}
        >
          {"단계별로 부수는\n방법이 있습니다"}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 4: LINK
// ===================================================================
const LinkRevealScene: React.FC<{ palette: PaletteName }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const B = BEATS_S4;

  const skillIn = spring({ frame: Math.max(0, frame - B.SKILL_IN), fps, config: SPRING.heavy });
  const consultingIn = spring({ frame: Math.max(0, frame - B.CONSULTING_IN), fps, config: SPRING.heavy });

  return (
    <AbsoluteFill>
      <GradientBackground palette={palette} />

      {/* 상단: "관계가 아니라 / 실력으로 계약하는 방법" */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 60,
          left: SAFE.side,
          right: SAFE.side,
          textAlign: "center",
          opacity: skillIn,
          transform: `translateY(${interpolate(skillIn, [0, 1], [20, 0])}px)`,
        }}
      >
        <p style={{ color: P.sub, fontSize: 56, fontWeight: 400, fontFamily: FONT_FAMILY, margin: 0 }}>
          관계가 아니라
        </p>
        <p style={{ color: P.text, fontSize: 68, fontWeight: 700, fontFamily: FONT_FAMILY, margin: "12px 0 0 0" }}>
          실력으로 계약하는 방법
        </p>
      </div>

      {/* 중앙: LINK + Consulting */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {["L", "I", "N", "K"].map((letter, i) => {
            const letterScale = spring({
              frame: Math.max(0, frame - B.LINK_IN - i * 4),
              fps,
              config: SPRING.letter,
            });
            return (
              <span
                key={i}
                style={{
                  color: P.accent,
                  fontSize: 160,
                  fontWeight: 900,
                  fontFamily: FONT_FAMILY,
                  letterSpacing: "0.06em",
                  display: "inline-block",
                  transform: `scale(${letterScale})`,
                  opacity: letterScale,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
        <div
          style={{
            width: interpolate(consultingIn, [0, 1], [0, 300]),
            height: 4,
            backgroundColor: P.accent,
            borderRadius: 2,
            opacity: 0.5,
          }}
        />
        <span
          style={{
            color: P.text,
            fontSize: 64,
            fontWeight: 500,
            fontFamily: FONT_FAMILY,
            letterSpacing: "0.15em",
            opacity: consultingIn,
          }}
        >
          Consulting
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 5: 엔딩
// ===================================================================
const EndingScene: React.FC<{ palette: PaletteName }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const B = BEATS_S5;

  const monthIn = spring({ frame: Math.max(0, frame - B.MONTH_IN), fps, config: SPRING.dramatic });
  const comingIn = spring({ frame: Math.max(0, frame - B.COMING_IN), fps, config: SPRING.heavy });

  return (
    <AbsoluteFill>
      <GradientBackground palette={palette} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
        }}
      >
        <span
          style={{
            color: P.accent,
            fontSize: 320,
            fontWeight: 900,
            fontFamily: FONT_FAMILY,
            opacity: monthIn,
            transform: `scale(${interpolate(monthIn, [0, 1], [0.7, 1])})`,
          }}
        >
          지금
        </span>
        <span
          style={{
            color: P.sub,
            fontSize: 128,
            fontWeight: 400,
            fontFamily: FONT_FAMILY,
            opacity: comingIn,
            transform: `translateY(${interpolate(comingIn, [0, 1], [12, 0])}px)`,
            letterSpacing: "0.1em",
          }}
        >
          만나보세요
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 메인 컴포지션
// ===================================================================
export const LINK_TEASER4_WIDE_FRAMES = TOTAL_DUR;

export const LinkTeaser4Wide: React.FC = () => {
  const problemPalette: PaletteName = "coolBlue";
  const solutionPalette: PaletteName = "orange";

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTES[problemPalette].bg }}>
      <Sequence from={S1_START} durationInFrames={S1_DUR}>
        <NumberImpactScene palette={problemPalette} />
      </Sequence>
      <Sequence from={S2_START} durationInFrames={S2_DUR}>
        <WallScene palette={problemPalette} />
      </Sequence>
      <Sequence from={S3_START} durationInFrames={S3_DUR}>
        <BreakthroughScene palette={problemPalette} />
      </Sequence>
      <Sequence from={S4_START} durationInFrames={S4_DUR}>
        <LinkRevealScene palette={solutionPalette} />
      </Sequence>
      <Sequence from={S5_START} durationInFrames={S5_DUR}>
        <EndingScene palette={solutionPalette} />
      </Sequence>

      {/* 음성 — S5(24.6초) 전까지만 재생 */}
      <Audio src={staticFile("audio/teaser4-full-leda.wav")} endAt={S5_START} />
      {/* BGM */}
      <Audio src={staticFile("audio/bgm-teaser.mp3")} volume={0.15} />
    </AbsoluteFill>
  );
};
