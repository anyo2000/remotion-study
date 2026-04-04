/**
 * LinkTeaser4 — "시대가 바뀌었다" (2안)
 * BEATS 패턴 + remotion-bits + constants/components 활용
 *
 * 구조: 5장면 Sequence
 *   S1: 과거 — 관계의 시대 (흐름도)
 *   S2: 전환 — "2026년" (색상 전환)
 *   S3: 현실 — 안 통하는 이유 (타이핑 → 파쇄)
 *   S4: 해결 — 전문성으로 연결 (LINK 네트워크)
 *   S5: 엔딩 — LINK 컨설팅 (스탬프)
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
import { TypeWriter, AnimatedText, StaggeredMotion, GradientTransition } from "remotion-bits";
import {
  PALETTES,
  SPRING,
  FONT_FAMILY,
  SAFE,
} from "./constants";
import { GradientBackground } from "./components/GradientBackground";
import { FadeInText } from "./components/FadeInText";
import { NetworkGraph } from "./components/NetworkGraph";

// ── 장면별 프레임 (TTS 기반 예상치, 음성 도착 후 조정) ──
const S1_DUR = 255; // 8.5초 — 과거
const S2_DUR = 75;  // 2.5초 — 전환
const S3_DUR = 360; // 12초 — 현실 + 파쇄
const S4_DUR = 345; // 11.5초 — 해결 + 네트워크
const S5_DUR = 240; // 8초 — 엔딩 + 여운
const TOTAL = S1_DUR + S2_DUR + S3_DUR + S4_DUR + S5_DUR; // 1275프레임 = 42.5초

// ===================================================================
// 장면 1: 과거 — "관계의 시대"
// ===================================================================
const S1_BEATS = {
  TITLE_IN: 0,        // 0s
  STEP1_IN: 50,       // 1.7s — "자주 찾아뵙고"
  STEP2_IN: 80,       // 2.7s — "밥 한 번 같이 하고"
  STEP3_IN: 110,      // 3.7s — "관계를 쌓다 보면"
  STEP4_IN: 145,      // 4.8s — "자연스럽게 따라왔거든요"
  LINE_DRAW: 55,
  HOLD: 175,          // 5.8s
  FADE_OUT: 225,      // 7.5s
  SCENE_END: 255,     // 8.5s
} as const;

const PastScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES.gold;

  const steps = ["친숙", "방문", "설계", "제안"];
  const stepDelays = [S1_BEATS.STEP1_IN, S1_BEATS.STEP2_IN, S1_BEATS.STEP3_IN, S1_BEATS.STEP4_IN];

  // 전체 페이드아웃
  const fadeOut = interpolate(frame, [S1_BEATS.FADE_OUT, S1_BEATS.SCENE_END], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground palette="gold" />

      {/* 상단 텍스트 */}
      <FadeInText
        delay={S1_BEATS.TITLE_IN}
        fontSize={64}
        fontWeight={600}
        color={P.sub}
        style={{ position: "absolute", top: SAFE.top + 60, left: 0, right: 0, textAlign: "center" }}
      >
        관계의 시대
      </FadeInText>

      {/* 흐름도 — 4단계 가로가 아닌 세로 (9:16) */}
      <div
        style={{
          position: "absolute",
          top: 0, left: SAFE.side, right: SAFE.side, bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        {steps.map((step, i) => {
          const prog = spring({
            frame: Math.max(0, frame - stepDelays[i]),
            fps,
            config: SPRING.heavy,
          });

          // 연결선 (화살표)
          const showArrow = i > 0;
          const arrowProg = spring({
            frame: Math.max(0, frame - stepDelays[i] + 5),
            fps,
            config: SPRING.smooth,
          });

          return (
            <React.Fragment key={i}>
              {showArrow && (
                <div
                  style={{
                    fontSize: 52,
                    color: P.accent,
                    opacity: arrowProg * 0.5,
                    transform: `scale(${arrowProg})`,
                  }}
                >
                  ↓
                </div>
              )}
              <div
                style={{
                  opacity: prog,
                  transform: `translateY(${interpolate(prog, [0, 1], [20, 0])}px) scale(${interpolate(prog, [0, 1], [0.9, 1])})`,
                  backgroundColor: `${P.accent}18`,
                  border: `2px solid ${P.accent}40`,
                  borderRadius: 20,
                  padding: "28px 80px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: P.accent,
                    fontSize: 72,
                    fontWeight: 700,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {step}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 하단 부가설명 */}
      <FadeInText
        delay={S1_BEATS.HOLD}
        fontSize={52}
        color={P.sub}
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 80,
          left: 0, right: 0,
          textAlign: "center",
        }}
      >
        관계를 쌓으면, 보험은 따라왔습니다
      </FadeInText>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 2: 전환 — "2026년"
// ===================================================================
const S2_BEATS = {
  YEAR_IN: 12,
  YEAR_SCALE: 14,
  SCENE_END: 75,      // 2.5s
} as const;

const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleProgress = spring({
    frame: Math.max(0, frame - S2_BEATS.YEAR_IN),
    fps,
    config: SPRING.dramatic,
  });

  const opacity = interpolate(frame, [S2_BEATS.YEAR_IN, S2_BEATS.YEAR_IN + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* 배경 그라디언트 전환: 골드 → 쿨블루 */}
      <GradientTransition
        gradient={[
          `radial-gradient(ellipse 80% 60% at 50% 40%, ${PALETTES.gold.glow}, transparent)`,
          `radial-gradient(ellipse 80% 60% at 50% 50%, ${PALETTES.coolBlue.glow}, transparent)`,
        ]}
        duration={S2_DUR}
        style={{ backgroundColor: "#0B1120" }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          opacity,
        }}
      >
        <p
          style={{
            color: PALETTES.coolBlue.sub,
            fontSize: 56,
            fontWeight: 400,
            fontFamily: FONT_FAMILY,
            margin: 0,
          }}
        >
          그런데,
        </p>
        <p
          style={{
            color: PALETTES.coolBlue.accent,
            fontSize: 140,
            fontWeight: 900,
            fontFamily: FONT_FAMILY,
            margin: 0,
            transform: `scale(${Math.max(0.7, scaleProgress)})`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          2026
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 3: 현실 — 타이핑 → 파쇄
// ===================================================================
const S3_BEATS = {
  LINE1_TYPE: 10,       // 0.3s
  LINE2_TYPE: 90,       // 3s
  LINE3_TYPE: 170,      // 5.7s
  SHAKE_START: 265,     // 8.8s — 진동
  BREAK_START: 290,     // 9.7s — 파쇄
  FLASH: 290,
  FADE_OUT: 330,        // 11s
  SCENE_END: 360,       // 12s
} as const;

// 글자 낙하 방향 (기존 LinkTeaser3에서 가져옴)
const CHAR_FALLS = [
  { tx: -180, ty: 400, rot: -40 }, { tx: 100, ty: 500, rot: 30 },
  { tx: -60, ty: 350, rot: -55 }, { tx: 200, ty: 450, rot: 45 },
  { tx: -140, ty: 520, rot: -25 }, { tx: 80, ty: 380, rot: 50 },
  { tx: -220, ty: 460, rot: -35 }, { tx: 160, ty: 420, rot: 60 },
  { tx: -100, ty: 490, rot: -50 }, { tx: 120, ty: 370, rot: 20 },
  { tx: -50, ty: 530, rot: -45 }, { tx: 190, ty: 410, rot: 35 },
  { tx: -170, ty: 480, rot: -30 }, { tx: 70, ty: 440, rot: 55 },
  { tx: -130, ty: 360, rot: -60 }, { tx: 210, ty: 510, rot: 25 },
];

const RealityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES.coolBlue;

  const lines = [
    { text: "첫 통화 DB 영업", delay: S3_BEATS.LINE1_TYPE },
    { text: "메시지로만 소통", delay: S3_BEATS.LINE2_TYPE },
    { text: "만남을 꺼리는 고객", delay: S3_BEATS.LINE3_TYPE },
  ];

  const breakStart = S3_BEATS.BREAK_START;
  const isBreaking = frame >= breakStart;

  // shake
  const preShake = frame >= S3_BEATS.SHAKE_START && frame < breakStart;
  const shakeIntensity = preShake
    ? interpolate(frame, [S3_BEATS.SHAKE_START, breakStart], [1, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const breakShake = frame >= breakStart && frame <= breakStart + 8;
  const shakeX = preShake ? Math.sin(frame * 5) * shakeIntensity : breakShake ? Math.sin(frame * 12) * 18 : 0;
  const shakeY = breakShake ? Math.cos(frame * 9) * 12 : 0;

  // 플래시
  const flashOpacity = interpolate(
    frame,
    [breakStart, breakStart + 3, breakStart + 8],
    [0, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 전체 페이드아웃
  const fadeOut = interpolate(frame, [S3_BEATS.FADE_OUT, S3_BEATS.SCENE_END], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  let globalCharIdx = 0;

  return (
    <AbsoluteFill style={{ opacity: fadeOut, transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <GradientBackground palette="coolBlue" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          left: SAFE.side,
          right: SAFE.side,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        {lines.map((line, lineIdx) => {
          // 타이핑 완료 여부 (대략 글자 * 3프레임 속도 기준)
          const typeEnd = line.delay + line.text.length * 3 + 10;
          const isTypeDone = frame >= typeEnd;
          const fontSize = lineIdx === 2 ? 80 : 72;

          if (!isBreaking) {
            // 타이핑 중에는 TypeWriter 사용
            if (frame < line.delay) return null;
            return (
              <div key={lineIdx} style={{ textAlign: "center" }}>
                <TypeWriter
                  text={line.text}
                  typeSpeed={3}
                  cursor={false}
                  delay={0}
                  style={{
                    color: P.text,
                    fontSize,
                    fontWeight: 700,
                    fontFamily: FONT_FAMILY,
                  }}
                />
              </div>
            );
          }

          // 파쇄 모드: 각 글자 낙하
          const chars = line.text.split("");
          const startIdx = globalCharIdx;
          globalCharIdx += chars.length;

          return (
            <div key={lineIdx} style={{ display: "flex", justifyContent: "center" }}>
              {chars.map((char, ci) => {
                const fallDir = CHAR_FALLS[(startIdx + ci) % CHAR_FALLS.length];
                const charBreak = interpolate(
                  frame,
                  [breakStart + ci * 0.8, breakStart + ci * 0.8 + 15],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) },
                );
                return (
                  <span
                    key={ci}
                    style={{
                      color: P.text,
                      fontSize,
                      fontWeight: 700,
                      fontFamily: FONT_FAMILY,
                      display: "inline-block",
                      transform: `translate(${fallDir.tx * charBreak}px, ${fallDir.ty * charBreak}px) rotate(${fallDir.rot * charBreak}deg)`,
                      opacity: 1 - charBreak * 0.9,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 플래시 */}
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: flashOpacity, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 4: 해결 — "전문성으로 연결하는 법" + LINK 네트워크
// ===================================================================
const S4_BEATS = {
  TITLE_IN: 20,          // 0.7s
  TITLE_HOLD: 75,        // 2.5s
  TITLE_FADE: 90,        // 3s
  NETWORK_START: 105,    // 3.5s
  NODE_L: 110,           // L ("연결")
  NODE_I: 145,           // I ("진단")
  NODE_N: 180,           // N ("설계")
  NODE_K: 215,           // K ("해결")
  GLOW_PULSE: 250,       // 8.3s
  SUBTITLE_IN: 270,      // 9s
  SCENE_END: 345,        // 11.5s
} as const;

const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES.orange;

  // 타이틀
  const titleProgress = spring({
    frame: Math.max(0, frame - S4_BEATS.TITLE_IN),
    fps,
    config: SPRING.dramatic,
  });
  const titleOpacity = frame < S4_BEATS.TITLE_FADE
    ? titleProgress
    : interpolate(frame, [S4_BEATS.TITLE_FADE, S4_BEATS.NETWORK_START], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
  const titleScale = frame < S4_BEATS.TITLE_FADE
    ? interpolate(titleProgress, [0, 1], [0.85, 1])
    : interpolate(frame, [S4_BEATS.TITLE_FADE, S4_BEATS.NETWORK_START], [1, 0.9], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });

  // 네트워크 페이드인
  const networkOpacity = interpolate(
    frame,
    [S4_BEATS.NETWORK_START, S4_BEATS.NETWORK_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 하단 서브타이틀
  const subIn = spring({
    frame: Math.max(0, frame - S4_BEATS.SUBTITLE_IN),
    fps,
    config: SPRING.heavy,
  });

  // 글로우 펄스
  const glowPulse = frame >= S4_BEATS.GLOW_PULSE
    ? Math.sin((frame - S4_BEATS.GLOW_PULSE) * 0.1) * 0.15 + 0.85
    : 0;

  return (
    <AbsoluteFill>
      <GradientBackground palette="orange" />

      {/* 타이틀 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <p
          style={{
            color: P.text,
            fontSize: 76,
            fontWeight: 800,
            fontFamily: FONT_FAMILY,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          전문성으로{"\n"}연결하는 법
        </p>
      </div>

      {/* LINK 네트워크 — 다이아몬드 */}
      <div style={{ opacity: networkOpacity }}>
        <NetworkGraph
          nodes={[
            { x: 540, y: 520, label: "L 연결", delay: S4_BEATS.NODE_L },
            { x: 280, y: 880, label: "I 진단", delay: S4_BEATS.NODE_I },
            { x: 800, y: 880, label: "N 설계", delay: S4_BEATS.NODE_N },
            { x: 540, y: 1240, label: "K 해결", delay: S4_BEATS.NODE_K },
          ]}
          edges={[
            { from: 0, to: 1, delay: S4_BEATS.NODE_I + 5 },
            { from: 0, to: 2, delay: S4_BEATS.NODE_N + 5 },
            { from: 1, to: 3, delay: S4_BEATS.NODE_K + 5 },
            { from: 2, to: 3, delay: S4_BEATS.NODE_K + 10 },
            { from: 1, to: 2, delay: S4_BEATS.NODE_K + 15 },
            { from: 0, to: 3, delay: S4_BEATS.NODE_K + 20 },
          ]}
          accentColor={P.accent}
          nodeRadius={14}
          edgeWidth={3}
        />
      </div>

      {/* 글로우 오버레이 */}
      {glowPulse > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 50%, ${P.accent}15, transparent 60%)`,
            opacity: glowPulse,
          }}
        />
      )}

      {/* 하단 서브타이틀 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 60,
          left: 0, right: 0,
          textAlign: "center",
          opacity: subIn,
          transform: `translateY(${interpolate(subIn, [0, 1], [15, 0])}px)`,
        }}
      >
        <p
          style={{
            color: P.sub,
            fontSize: 52,
            fontWeight: 400,
            fontFamily: FONT_FAMILY,
            margin: 0,
          }}
        >
          3초 후킹 · 숫자 진단 · 고객의 말로 클로징
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 장면 5: 엔딩 — LINK 스탬프 + "4월 전국 런칭"
// ===================================================================
const S5_BEATS = {
  L_STAMP: 15,
  I_STAMP: 22,
  N_STAMP: 29,
  K_STAMP: 36,
  LINE_DRAW: 45,
  CONSULTING_IN: 55,
  LAUNCH_IN: 72,
  SCENE_END: 240,  // 8s
} as const;

const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = PALETTES.orange;

  const letters = ["L", "I", "N", "K"];
  const stampDelays = [S5_BEATS.L_STAMP, S5_BEATS.I_STAMP, S5_BEATS.N_STAMP, S5_BEATS.K_STAMP];

  const letterScales = letters.map((_, i) =>
    spring({
      frame: Math.max(0, frame - stampDelays[i]),
      fps,
      config: SPRING.letter,
    }),
  );
  const letterOpacities = letters.map((_, i) =>
    interpolate(frame, [stampDelays[i], stampDelays[i] + 3], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }),
  );

  const lineWidth = interpolate(frame, [S5_BEATS.LINE_DRAW, S5_BEATS.LINE_DRAW + 18], [0, 300], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="orange" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* LINK 글자 */}
        <div style={{ display: "flex", gap: 8 }}>
          {letters.map((letter, i) => (
            <span
              key={i}
              style={{
                color: P.accent,
                fontSize: 160,
                fontWeight: 900,
                fontFamily: FONT_FAMILY,
                letterSpacing: "0.08em",
                display: "inline-block",
                transform: `scale(${letterScales[i]})`,
                opacity: letterOpacities[i],
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: P.accent,
            borderRadius: 2,
            opacity: 0.5,
          }}
        />

        {/* Consulting */}
        <FadeInText
          delay={S5_BEATS.CONSULTING_IN}
          springConfig={SPRING.heavy}
          fontSize={64}
          fontWeight={500}
          color={P.text}
          style={{ letterSpacing: "0.15em" }}
        >
          Consulting
        </FadeInText>

        {/* 4월 전국 런칭 */}
        <FadeInText
          delay={S5_BEATS.LAUNCH_IN}
          springConfig={SPRING.heavy}
          fontSize={52}
          fontWeight={400}
          color={P.sub}
          style={{ letterSpacing: "0.08em", marginTop: 10 }}
        >
          4월 전국 런칭
        </FadeInText>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 메인 컴포지션
// ===================================================================
export const LinkTeaser4: React.FC = () => {
  const offsets = [0, S1_DUR, S1_DUR + S2_DUR, S1_DUR + S2_DUR + S3_DUR, S1_DUR + S2_DUR + S3_DUR + S4_DUR];

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTES.coolBlue.bg }}>
      <Sequence from={offsets[0]} durationInFrames={S1_DUR}>
        <PastScene />
      </Sequence>
      <Sequence from={offsets[1]} durationInFrames={S2_DUR}>
        <TransitionScene />
      </Sequence>
      <Sequence from={offsets[2]} durationInFrames={S3_DUR}>
        <RealityScene />
      </Sequence>
      <Sequence from={offsets[3]} durationInFrames={S4_DUR}>
        <SolutionScene />
      </Sequence>
      <Sequence from={offsets[4]} durationInFrames={S5_DUR}>
        <EndingScene />
      </Sequence>

      {/* 오디오 — 단일 파일 통으로 */}
      <Audio src={staticFile("audio/teaser4-full.wav")} />
    </AbsoluteFill>
  );
};
