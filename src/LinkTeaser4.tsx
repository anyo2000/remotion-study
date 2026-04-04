/**
 * LinkTeaser4 — "숫자 충격형" (v2)
 * Props 패널에서 팔레트, 텍스트, 속도, BGM 조절 가능
 */
import React from "react";
import { z } from "zod";
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
  SAFE,
  GAP_FRAMES,
  type PaletteName,
} from "./constants";
import { GradientBackground } from "./components/GradientBackground";
import { FadeInText } from "./components/FadeInText";

// ── Zod Schema (한글 키) ──
const paletteEnum = z.enum(["blue", "orange", "gold", "coolBlue", "pink"]);

export const linkTeaser4Schema = z.object({
  문제팔레트: paletteEnum,
  솔루션팔레트: paletteEnum,

  질문: z.string(),
  숫자A: z.string(),
  숫자B: z.string(),
  핵심질문: z.string(),

  카드1: z.string(),
  카드2: z.string(),
  카드3: z.string(),

  전환문구: z.string(),

  상단문구: z.string(),
  하단문구: z.string(),

  시기: z.string(),
  마무리: z.string(),

  장면쉼: z.number().min(0).max(60),
  속도감: z.number().min(0.5).max(2.0).step(0.1),
  BGM볼륨: z.number().min(0).max(1).step(0.05),
});

export type LinkTeaser4Props = z.infer<typeof linkTeaser4Schema>;

// ── 장면 타이밍 (전체 음성 1개 기반, 타임스탬프로 동기화) ──
// 음성: teaser4-full-leda.wav (27.0초 = 810fr)
// 장면 전환은 무음 구간 기준
const S1_START = 0;     // 0.0s
const S2_START = 273;   // 9.1s — 무음 #3 이후
const S3_START = 447;   // 14.9s — 무음 #4 이후
const S4_START = 592;   // 19.7s — 무음 #5 이후
const S5_START = 737;   // 24.6s — 무음 #6 이후
const TOTAL_DUR = 885;  // 27.0s + 75fr 여유

const S1_DUR = S2_START - S1_START; // 273fr
const S2_DUR = S3_START - S2_START; // 174fr
const S3_DUR = S4_START - S3_START; // 145fr
const S4_DUR = S5_START - S4_START; // 145fr
const S5_DUR = TOTAL_DUR - S5_START; // 148fr

const scaleBeat = (beat: number, factor: number) => Math.round(beat / factor);

// ===================================================================
// 장면 1: 숫자 충격
// ===================================================================
const NumberImpactScene: React.FC<{
  palette: PaletteName;
  question: string;
  numberA: string;
  numberB: string;
  hook: string;
  speedFactor: number;
}> = ({ palette, question, numberA, numberB, hook, speedFactor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const sb = (b: number) => scaleBeat(b, speedFactor);

  // 273fr = 9.1초. 음성: "10명...2건?...1건?...나머지...어디서?"
  const BEATS = {
    COUNT_START: sb(5), COUNT_END: sb(30), QUESTION: sb(45),
    TEN: sb(100), TWENTY: sb(130), REST: sb(170), WHERE: sb(200), FADE_OUT: sb(250),
  };

  const countProgress = interpolate(frame, [BEATS.COUNT_START, BEATS.COUNT_END], [0, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const countNum = Math.round(countProgress);
  const countScale = spring({ frame: Math.max(0, frame - BEATS.COUNT_START), fps, config: SPRING.dramatic });

  const punchScale = frame >= BEATS.COUNT_END && frame < BEATS.COUNT_END + 8
    ? interpolate(frame, [BEATS.COUNT_END, BEATS.COUNT_END + 4, BEATS.COUNT_END + 8], [1, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const questionIn = spring({ frame: Math.max(0, frame - BEATS.QUESTION), fps, config: SPRING.heavy });
  const tenIn = spring({ frame: Math.max(0, frame - BEATS.TEN), fps, config: SPRING.bouncy });
  const twentyIn = spring({ frame: Math.max(0, frame - BEATS.TWENTY), fps, config: SPRING.bouncy });
  const restIn = spring({ frame: Math.max(0, frame - BEATS.REST), fps, config: SPRING.heavy });
  const whereIn = spring({ frame: Math.max(0, frame - BEATS.WHERE), fps, config: SPRING.dramatic });
  const fadeOut = interpolate(frame, [BEATS.FADE_OUT, S1_DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 100 올라갈 때 크기 유지 (축소 없음), 위치만 이동
  const numberLift = frame >= BEATS.QUESTION
    ? interpolate(frame, [BEATS.QUESTION, BEATS.QUESTION + 20], [0, -350], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground palette={palette} />
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", transform: `translateY(${numberLift}px) scale(${punchScale})` }}>
        <span style={{ color: P.accent, fontSize: 240, fontWeight: 900, fontFamily: FONT_FAMILY, fontVariantNumeric: "tabular-nums", opacity: countScale, transform: `scale(${countScale})` }}>
          {countNum}<span style={{ fontSize: 96, fontWeight: 500, color: P.sub }}>명</span>
        </span>
      </div>
      <div style={{ position: "absolute", top: "52%", left: SAFE.side, right: SAFE.side, textAlign: "center", opacity: questionIn, transform: `translateY(${interpolate(questionIn, [0, 1], [20, 0])}px)` }}>
        <p style={{ color: P.sub, fontSize: 60, fontWeight: 400, fontFamily: FONT_FAMILY, margin: 0 }}>{question}</p>
      </div>
      <div style={{ position: "absolute", top: "60%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        <span style={{ color: P.text, fontSize: 96, fontWeight: 800, fontFamily: FONT_FAMILY, fontVariantNumeric: "tabular-nums", opacity: tenIn, transform: `scale(${tenIn})` }}>{numberA}</span>
        <span style={{ color: P.text, fontSize: 96, fontWeight: 800, fontFamily: FONT_FAMILY, fontVariantNumeric: "tabular-nums", opacity: twentyIn, transform: `scale(${twentyIn})` }}>{numberB}</span>
      </div>
      <div style={{ position: "absolute", bottom: SAFE.bottom + 160, left: SAFE.side, right: SAFE.side, textAlign: "center", opacity: restIn, transform: `translateY(${interpolate(restIn, [0, 1], [15, 0])}px)` }}>
        <p style={{ color: P.sub, fontSize: 60, fontWeight: 400, fontFamily: FONT_FAMILY, margin: 0 }}>그럼 나머지 고객은</p>
      </div>
      <div style={{ position: "absolute", bottom: SAFE.bottom + 60, left: SAFE.side, right: SAFE.side, textAlign: "center", opacity: whereIn, transform: `scale(${interpolate(whereIn, [0, 1], [0.9, 1])})` }}>
        <p style={{ color: P.accent, fontSize: 72, fontWeight: 700, fontFamily: FONT_FAMILY, margin: 0 }}>{hook}</p>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 2: 벽 — 카드
// ===================================================================
const WallScene: React.FC<{
  palette: PaletteName; card1: string; card2: string; card3: string; speedFactor: number;
}> = ({ palette, card1, card2, card3, speedFactor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const sb = (b: number) => scaleBeat(b, speedFactor);

  // 174fr = 5.8초
  const cards = [
    { emoji: "🚫", text: card1, delay: sb(8) },
    { emoji: "🔒", text: card2, delay: sb(50) },
    { emoji: "💬", text: card3, delay: sb(95) },
  ];
  const fadeOut = interpolate(frame, [sb(145), S2_DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground palette={palette} />
      <div style={{ position: "absolute", top: 0, left: SAFE.side, right: SAFE.side, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
        {cards.map((card, i) => {
          const prog = spring({ frame: Math.max(0, frame - card.delay), fps, config: SPRING.heavy });
          return (
            <div key={i} style={{ opacity: prog, transform: `translateX(${interpolate(prog, [0, 1], [-40, 0])}px)`, backgroundColor: P.card, border: `2px solid ${P.cardBorder}`, borderRadius: 24, padding: "40px 56px", width: "85%", display: "flex", alignItems: "center", gap: 28 }}>
              <span style={{ fontSize: 64 }}>{card.emoji}</span>
              <span style={{ color: P.text, fontSize: 64, fontWeight: 600, fontFamily: FONT_FAMILY, lineHeight: 1.3, whiteSpace: "pre-line" }}>{card.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 3: 전환 — 벽돌 담벼락 쌓기 → 무너짐
// ===================================================================

// 벽돌 설정: 고정 크기 벽돌, 5-4 교대, 중앙 정렬
// 핵심: 모든 벽돌 같은 크기. 5개 줄이 전체 폭을 결정하고, 4개 줄은 반칸 들여쓰기
const WALL_ROWS = 7;
const BRICK_GAP = 10;
const AVAILABLE_W = 1080 - SAFE.side * 2; // 960px
const BRICK_W = (AVAILABLE_W - 4 * BRICK_GAP) / 5; // 5개 기준 = ~184px
const BRICK_H = 64;

const generateRows = () => {
  const rows: { cols: number; bricks: { col: number; row: number; fallX: number; fallRot: number }[] }[] = [];
  for (let row = 0; row < WALL_ROWS; row++) {
    const cols = row % 2 === 0 ? 5 : 4;
    const bricks = [];
    for (let col = 0; col < cols; col++) {
      const seed = row * 10 + col;
      bricks.push({
        col, row,
        fallX: ((seed * 7 + 3) % 11 - 5) * 40,
        fallRot: ((seed * 13 + 7) % 9 - 4) * 15,
      });
    }
    rows.push({ cols, bricks });
  }
  return rows;
};

const WALL_ROWS_DATA = generateRows();

const BreakthroughScene: React.FC<{
  palette: PaletteName; method: string; speedFactor: number;
}> = ({ palette, method, speedFactor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const sb = (b: number) => scaleBeat(b, speedFactor);

  // 타이밍
  // 145fr = 4.8초
  const BUILD_START = sb(5);
  const BUILD_END = sb(35);
  const SHAKE_START = sb(40);
  const BREAK_FRAME = sb(60);
  const METHOD_IN = sb(75);
  const FADE_OUT = sb(125);

  // "이 벽을" 텍스트
  const wallTextIn = spring({ frame: Math.max(0, frame - sb(10)), fps, config: SPRING.dramatic });

  // 벽돌 쌓기 진행도 (0~1)
  const buildProgress = interpolate(frame, [BUILD_START, BUILD_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 진동
  const isShaking = frame >= SHAKE_START && frame < BREAK_FRAME;
  const shakeIntensity = isShaking
    ? interpolate(frame, [SHAKE_START, BREAK_FRAME], [1, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const shakeX = isShaking ? Math.sin(frame * 8) * shakeIntensity : 0;
  const shakeY = isShaking ? Math.cos(frame * 11) * shakeIntensity * 0.5 : 0;

  // 무너짐
  const isBreaking = frame >= BREAK_FRAME;
  const breakProgress = isBreaking
    ? interpolate(frame, [BREAK_FRAME, BREAK_FRAME + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) })
    : 0;

  // 무너질 때 추가 쉐이크
  const breakShakeX = isBreaking && breakProgress < 0.3 ? Math.sin(frame * 15) * 15 : 0;

  // "단계별로 부수는 방법이 있습니다"
  const methodIn = spring({ frame: Math.max(0, frame - METHOD_IN), fps, config: SPRING.dramatic });
  const fadeOut = interpolate(frame, [FADE_OUT, S3_DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeOut, transform: `translate(${shakeX + breakShakeX}px, ${shakeY}px)` }}>
      <GradientBackground palette={palette} />

      {/* "이 벽을" */}
      <div style={{ position: "absolute", top: SAFE.top + 60, left: 0, right: 0, textAlign: "center", opacity: wallTextIn }}>
        <span style={{ color: P.sub, fontSize: 88, fontWeight: 600, fontFamily: FONT_FAMILY }}>이 벽을</span>
      </div>

      {/* 벽돌 담벼락 — 고정 크기, 중앙 정렬 */}
      <div style={{
        position: "absolute",
        left: 0, right: 0,
        top: "30%", bottom: "40%",
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: BRICK_GAP,
      }}>
        {WALL_ROWS_DATA.map((rowData, rowIdx) => {
          const rowDelay = rowIdx / WALL_ROWS;
          const appearFrame = BUILD_START + rowDelay * (BUILD_END - BUILD_START);

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
                  ? interpolate(frame, [BREAK_FRAME + fallDelay, BREAK_FRAME + fallDelay + 18], [0, 1], {
                      extrapolateLeft: "clamp", extrapolateRight: "clamp",
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
                      transform: `translateY(${isBreaking ? fallProgress * (500 + brick.row * 60) : interpolate(brickSpring, [0, 1], [-30, 0])}px) translateX(${fallProgress * brick.fallX}px) rotate(${fallProgress * brick.fallRot}deg)`,
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
        <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: interpolate(breakProgress, [0, 0.05, 0.3], [0, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
      )}

      {/* "단계별로 부수는 방법이 있습니다" — 벽이 있던 자리(화면 중앙) */}
      <div style={{ position: "absolute", top: "30%", bottom: "40%", left: SAFE.side, right: SAFE.side, display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", opacity: methodIn, transform: `scale(${interpolate(methodIn, [0, 1], [0.85, 1])})` }}>
        <p style={{ color: P.text, fontSize: 80, fontWeight: 800, fontFamily: FONT_FAMILY, margin: 0, lineHeight: 1.4, whiteSpace: "pre-line" }}>{method}</p>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 4: LINK
// ===================================================================
const LinkRevealScene: React.FC<{
  palette: PaletteName; topText: string; bottomText: string; speedFactor: number;
}> = ({ palette, topText, bottomText, speedFactor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const sb = (b: number) => scaleBeat(b, speedFactor);

  // 145fr = 4.8초
  const BEATS = { SKILL_IN: sb(10), LINK_IN: sb(45), CONSULTING_IN: sb(65) };
  const skillIn = spring({ frame: Math.max(0, frame - BEATS.SKILL_IN), fps, config: SPRING.heavy });
  const consultingIn = spring({ frame: Math.max(0, frame - BEATS.CONSULTING_IN), fps, config: SPRING.heavy });

  return (
    <AbsoluteFill>
      <GradientBackground palette={palette} />
      <div style={{ position: "absolute", top: SAFE.top + 120, left: SAFE.side, right: SAFE.side, textAlign: "center", opacity: skillIn, transform: `translateY(${interpolate(skillIn, [0, 1], [20, 0])}px)` }}>
        <p style={{ color: P.sub, fontSize: 64, fontWeight: 400, fontFamily: FONT_FAMILY, margin: 0 }}>관계가 아니라</p>
        <p style={{ color: P.text, fontSize: 80, fontWeight: 700, fontFamily: FONT_FAMILY, margin: "12px 0 0 0" }}>{topText}</p>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["L", "I", "N", "K"].map((letter, i) => {
            const letterScale = spring({ frame: Math.max(0, frame - BEATS.LINK_IN - i * 4), fps, config: SPRING.letter });
            return <span key={i} style={{ color: P.accent, fontSize: 160, fontWeight: 900, fontFamily: FONT_FAMILY, letterSpacing: "0.06em", display: "inline-block", transform: `scale(${letterScale})`, opacity: letterScale }}>{letter}</span>;
          })}
        </div>
        <div style={{ width: interpolate(consultingIn, [0, 1], [0, 260]), height: 4, backgroundColor: P.accent, borderRadius: 2, opacity: 0.5 }} />
        <span style={{ color: P.text, fontSize: 72, fontWeight: 500, fontFamily: FONT_FAMILY, letterSpacing: "0.15em", opacity: consultingIn }}>{bottomText}</span>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 5: 엔딩
// ===================================================================
const EndingScene: React.FC<{
  palette: PaletteName; month: string; closing: string; speedFactor: number;
}> = ({ palette, month, closing, speedFactor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES[palette];
  const sb = (b: number) => scaleBeat(b, speedFactor);

  const monthIn = spring({ frame: Math.max(0, frame - sb(12)), fps, config: SPRING.dramatic });
  const comingIn = spring({ frame: Math.max(0, frame - sb(40)), fps, config: SPRING.heavy });

  return (
    <AbsoluteFill>
      <GradientBackground palette={palette} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <span style={{ color: P.accent, fontSize: 160, fontWeight: 900, fontFamily: FONT_FAMILY, opacity: monthIn, transform: `scale(${interpolate(monthIn, [0, 1], [0.7, 1])})` }}>{month}</span>
        <span style={{ color: P.sub, fontSize: 68, fontWeight: 400, fontFamily: FONT_FAMILY, opacity: comingIn, transform: `translateY(${interpolate(comingIn, [0, 1], [12, 0])}px)`, letterSpacing: "0.1em" }}>{closing}</span>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 메인 컴포지션
// ===================================================================
export const LinkTeaser4: React.FC<LinkTeaser4Props> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTES[props.문제팔레트].bg }}>
      <Sequence from={S1_START} durationInFrames={S1_DUR}>
        <NumberImpactScene palette={props.문제팔레트} question={props.질문} numberA={props.숫자A} numberB={props.숫자B} hook={props.핵심질문} speedFactor={props.속도감} />
      </Sequence>
      <Sequence from={S2_START} durationInFrames={S2_DUR}>
        <WallScene palette={props.문제팔레트} card1={props.카드1} card2={props.카드2} card3={props.카드3} speedFactor={props.속도감} />
      </Sequence>
      <Sequence from={S3_START} durationInFrames={S3_DUR}>
        <BreakthroughScene palette={props.문제팔레트} method={props.전환문구} speedFactor={props.속도감} />
      </Sequence>
      <Sequence from={S4_START} durationInFrames={S4_DUR}>
        <LinkRevealScene palette={props.솔루션팔레트} topText={props.상단문구} bottomText={props.하단문구} speedFactor={props.속도감} />
      </Sequence>
      <Sequence from={S5_START} durationInFrames={S5_DUR}>
        <EndingScene palette={props.솔루션팔레트} month={props.시기} closing={props.마무리} speedFactor={props.속도감} />
      </Sequence>

      {/* 음성 — 전체 1개 파일 */}
      <Audio src={staticFile("audio/teaser4-full-leda.wav")} />

      {/* BGM */}
      <Audio src={staticFile("audio/bgm-teaser.mp3")} volume={props.BGM볼륨} />
    </AbsoluteFill>
  );
};
