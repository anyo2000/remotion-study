/**
 * LinkTeaser3 — 새 구조 (constants + components) 버전
 * 원본: LinkTeaser3.tsx (530줄, 인라인 팔레트/배경/스프링)
 * 변경: constants.ts import + GradientBackground/FadeInText/NetworkGraph 재사용
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";
import {
  PALETTES,
  SPRING,
  FONT_FAMILY,
  VIDEO_FPS,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./constants";
import { GradientBackground } from "./components/GradientBackground";
import { FadeInText } from "./components/FadeInText";
import { NetworkGraph } from "./components/NetworkGraph";

const P = PALETTES.orange;

// ===== 글자 낙하 방향 =====
const CHAR_FALLS = [
  { tx: -180, ty: 400, rot: -40 },
  { tx: 100, ty: 500, rot: 30 },
  { tx: -60, ty: 350, rot: -55 },
  { tx: 200, ty: 450, rot: 45 },
  { tx: -140, ty: 520, rot: -25 },
  { tx: 80, ty: 380, rot: 50 },
  { tx: -220, ty: 460, rot: -35 },
  { tx: 160, ty: 420, rot: 60 },
  { tx: -100, ty: 490, rot: -50 },
  { tx: 120, ty: 370, rot: 20 },
  { tx: -50, ty: 530, rot: -45 },
  { tx: 190, ty: 410, rot: 35 },
  { tx: -170, ty: 480, rot: -30 },
  { tx: 70, ty: 440, rot: 55 },
  { tx: -130, ty: 360, rot: -60 },
  { tx: 210, ty: 510, rot: 25 },
  { tx: -90, ty: 390, rot: -40 },
  { tx: 150, ty: 470, rot: 45 },
  { tx: -200, ty: 430, rot: -50 },
  { tx: 50, ty: 500, rot: 35 },
  { tx: -110, ty: 350, rot: -20 },
  { tx: 180, ty: 460, rot: 55 },
  { tx: -160, ty: 520, rot: -35 },
  { tx: 90, ty: 380, rot: 40 },
];

// ===== 장면 1: 세 문장 쌓기 → 한꺼번에 파쇄 =====
const BuildUpScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "팔지 마세요.", enterAt: 0 },
    { text: "설명하지 마세요.", enterAt: 55 },
    { text: "정답을 주지 마세요.", enterAt: 100 },
  ];

  const breakStart = 132;
  const breakProgress = interpolate(
    frame,
    [breakStart, breakStart + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) },
  );

  // shake
  const preShake = frame >= 115 && frame < breakStart;
  const shakeIntensity = preShake
    ? interpolate(frame, [115, breakStart], [1, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const breakShake = frame >= breakStart && frame <= breakStart + 8;
  const shakeX = preShake
    ? Math.sin(frame * 5) * shakeIntensity
    : breakShake ? Math.sin(frame * 12) * 18 : 0;
  const shakeY = breakShake ? Math.cos(frame * 9) * 12 : 0;

  // 플래시
  const flashOpacity = interpolate(
    frame,
    [breakStart, breakStart + 3, breakStart + 8],
    [0, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 전체 페이드아웃
  const fadeOut = interpolate(frame, [150, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let globalCharIdx = 0;

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <GradientBackground palette="orange" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        {lines.map((line, lineIdx) => {
          const enterProgress = spring({
            frame: Math.max(0, frame - line.enterAt),
            fps,
            config: SPRING.smooth,
          });
          const enterOpacity = interpolate(
            frame,
            [line.enterAt, line.enterAt + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const fontSize = lineIdx === 2 ? 84 : 78;

          // 파쇄 전: FadeInText 스타일
          if (breakProgress === 0) {
            return (
              <p
                key={lineIdx}
                style={{
                  color: P.text,
                  fontSize,
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                  margin: 0,
                  textAlign: "center",
                  opacity: enterOpacity,
                  transform: `translateY(${(1 - enterProgress) * 30}px)`,
                }}
              >
                {line.text}
              </p>
            );
          }

          // 파쇄: 각 글자 낙하
          const chars = line.text.split("");
          const startIdx = globalCharIdx;
          globalCharIdx += chars.length;

          return (
            <div
              key={lineIdx}
              style={{ display: "flex", justifyContent: "center", opacity: enterOpacity }}
            >
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
      <AbsoluteFill
        style={{ backgroundColor: "#FFFFFF", opacity: flashOpacity, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};

// ===== 장면 2: 암전 → "그래야, 연결됩니다." =====
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textDelay = 30; // 1초 암전

  const textScale = spring({
    frame: Math.max(0, frame - textDelay),
    fps,
    config: SPRING.dramatic,
  });
  const textOpacity = interpolate(frame, [textDelay, textDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 다이아몬드 네트워크 — NetworkGraph 컴포넌트 사용
  const networkOpacity = interpolate(frame, [textDelay + 10, textDelay + 40], [0, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="orange" />

      {/* 다이아몬드 네트워크 (배경) */}
      <div style={{ opacity: networkOpacity }}>
        <NetworkGraph
          nodes={[
            { x: 540, y: 650, delay: textDelay + 15 },
            { x: 300, y: 960, delay: textDelay + 19 },
            { x: 780, y: 960, delay: textDelay + 23 },
            { x: 540, y: 1270, delay: textDelay + 27 },
          ]}
          edges={[
            { from: 0, to: 1, delay: textDelay + 17 },
            { from: 0, to: 2, delay: textDelay + 21 },
            { from: 1, to: 3, delay: textDelay + 25 },
            { from: 2, to: 3, delay: textDelay + 29 },
            { from: 0, to: 3, delay: textDelay + 33 },
            { from: 1, to: 2, delay: textDelay + 37 },
          ]}
          accentColor={P.accent}
        />
      </div>

      {/* 텍스트 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
          opacity: textOpacity,
          transform: `scale(${Math.max(0.85, textScale)})`,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 88,
            fontWeight: 800,
            fontFamily: FONT_FAMILY,
            margin: 0,
          }}
        >
          그래야,
        </p>
        <p
          style={{
            color: P.text,
            fontSize: 88,
            fontWeight: 800,
            fontFamily: FONT_FAMILY,
            margin: 0,
          }}
        >
          연결됩니다.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== 장면 3: LINK 탁탁탁 =====
const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = ["L", "I", "N", "K"];
  const letterDelay = 7;

  const letterScales = letters.map((_, i) =>
    spring({
      frame: Math.max(0, frame - i * letterDelay),
      fps,
      config: SPRING.letter,
    }),
  );

  const letterOpacities = letters.map((_, i) =>
    interpolate(frame, [i * letterDelay, i * letterDelay + 3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const lineDelay = letters.length * letterDelay + 5;
  const lineWidth = interpolate(frame, [lineDelay, lineDelay + 18], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const consultDelay = letters.length * letterDelay + 12;
  const csDelay = consultDelay + 12;

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

        {/* Consulting — FadeInText 사용 */}
        <FadeInText
          delay={consultDelay}
          springConfig={SPRING.heavy}
          fontSize={64}
          fontWeight={500}
          color={P.text}
          style={{ letterSpacing: "0.15em" }}
        >
          Consulting
        </FadeInText>

        {/* Coming Soon — FadeInText 사용 */}
        <FadeInText
          delay={csDelay}
          springConfig={SPRING.heavy}
          fontSize={52}
          fontWeight={400}
          color={P.sub}
          style={{ letterSpacing: "0.08em", marginTop: 10 }}
        >
          Coming Soon
        </FadeInText>
      </div>
    </AbsoluteFill>
  );
};

// ===== 메인 컴포지션 =====
const S1 = 165; // 5.5초
const S2 = 150; // 5초
const S3 = 240; // 8초
// 총: 555프레임 (~18.5초)

export const LinkTeaser3v2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      <Sequence from={0} durationInFrames={S1}>
        <BuildUpScene />
      </Sequence>
      <Sequence from={S1} durationInFrames={S2}>
        <RevealScene />
      </Sequence>
      <Sequence from={S1 + S2} durationInFrames={S3}>
        <EndingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
