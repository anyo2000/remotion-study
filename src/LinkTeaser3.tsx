import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";

// ===== 팔레트 =====
const P = {
  bg: "#0B1120",
  text: "#F0F0F0",
  sub: "#8899AA",
  accent: "#FF8C38",
};

const Background: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: P.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 140, 56, 0.03), transparent)`,
      }}
    />
  </AbsoluteFill>
);

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
    { text: "설명하지 마세요.", enterAt: 55 },    // 1.8초 후
    { text: "정답을 주지 마세요.", enterAt: 100 }, // 3.3초 후
  ];

  // 파쇄 시작 — 세 번째 문장 등장 후 1초
  const breakStart = 132;
  const breakProgress = interpolate(
    frame,
    [breakStart, breakStart + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
  );

  // shake — 세 번째 문장 등장 직후부터 파쇄까지 미세 진동
  const preShake = frame >= 115 && frame < breakStart;
  const shakeIntensity = preShake
    ? interpolate(frame, [115, breakStart], [1, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const breakShake = frame >= breakStart && frame <= breakStart + 8;
  const shakeX = preShake
    ? Math.sin(frame * 5) * shakeIntensity
    : breakShake
    ? Math.sin(frame * 12) * 18
    : 0;
  const shakeY = breakShake ? Math.cos(frame * 9) * 12 : 0;

  // 플래시 (파쇄 순간)
  const flashOpacity = interpolate(
    frame,
    [breakStart, breakStart + 3, breakStart + 8],
    [0, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 전체 페이드아웃
  const fadeOut = interpolate(frame, [150, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 모든 글자를 하나의 배열로 합침 (파쇄용)
  let globalCharIdx = 0;

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <Background />

      {/* 텍스트들 — 화면 중앙에 세로로 쌓임 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 60,
          right: 60,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        {lines.map((line, lineIdx) => {
          // 등장 애니메이션
          const enterProgress = spring({
            frame: Math.max(0, frame - line.enterAt),
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const enterOpacity = interpolate(
            frame,
            [line.enterAt, line.enterAt + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // 폰트 크기 — 마지막이 약간 더 큼 (강조)
          const fontSize = lineIdx === 2 ? 84 : 78;

          // 파쇄 안 됐으면 일반 텍스트
          if (breakProgress === 0) {
            return (
              <p
                key={lineIdx}
                style={{
                  color: P.text,
                  fontSize,
                  fontWeight: 700,
                  fontFamily: "Pretendard, sans-serif",
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

          // 파쇄: 각 글자가 개별 낙하
          const chars = line.text.split("");
          const startIdx = globalCharIdx;
          globalCharIdx += chars.length;

          return (
            <div
              key={lineIdx}
              style={{
                display: "flex",
                justifyContent: "center",
                opacity: enterOpacity,
              }}
            >
              {chars.map((char, ci) => {
                const fallDir = CHAR_FALLS[(startIdx + ci) % CHAR_FALLS.length];
                // 스태거: 글자마다 약간의 딜레이
                const charBreak = interpolate(
                  frame,
                  [breakStart + ci * 0.8, breakStart + ci * 0.8 + 15],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
                );

                return (
                  <span
                    key={ci}
                    style={{
                      color: P.text,
                      fontSize,
                      fontWeight: 700,
                      fontFamily: "Pretendard, sans-serif",
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
        style={{
          backgroundColor: "#FFFFFF",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ===== 장면 2: 암전 → "그래야, 연결됩니다." =====
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 30프레임(1초) 암전 후 텍스트 등장
  const textDelay = 30;
  const textScale = spring({
    frame: Math.max(0, frame - textDelay),
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const textOpacity = interpolate(frame, [textDelay, textDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 배경 다이아몬드 네트워크 (은은하게)
  const diamond = [
    { x: 540, y: 650 },
    { x: 300, y: 960 },
    { x: 780, y: 960 },
    { x: 540, y: 1270 },
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3], [1, 2]];

  const networkOpacity = interpolate(frame, [textDelay + 10, textDelay + 40], [0, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dotScale = spring({
    frame: Math.max(0, frame - textDelay - 15),
    fps,
    config: { damping: 10, stiffness: 60 },
  });

  // glow
  const glowOpacity = interpolate(frame, [textDelay + 30, 110], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* 다이아몬드 네트워크 (배경) */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: networkOpacity,
        }}
      >
        {edges.map(([from, to], i) => {
          const lineP = interpolate(
            frame,
            [textDelay + 15 + i * 4, textDelay + 30 + i * 4],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          if (lineP <= 0) return null;
          const f = diamond[from];
          const t = diamond[to];
          return (
            <line
              key={i}
              x1={f.x}
              y1={f.y}
              x2={f.x + (t.x - f.x) * lineP}
              y2={f.y + (t.y - f.y) * lineP}
              stroke={P.accent}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.6}
            />
          );
        })}

        {diamond.map((dot, i) => (
          <g key={i}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={35}
              fill={P.accent}
              opacity={glowOpacity * 0.3}
              style={{ filter: "blur(18px)" }}
            />
            <circle
              cx={dot.x}
              cy={dot.y}
              r={12 * dotScale}
              fill={P.accent}
              opacity={0.7}
            />
          </g>
        ))}
      </svg>

      {/* 텍스트 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            fontFamily: "Pretendard, sans-serif",
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
            fontFamily: "Pretendard, sans-serif",
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
      config: { damping: 8, stiffness: 200, mass: 0.8 },
    })
  );

  const letterOpacities = letters.map((_, i) =>
    interpolate(frame, [i * letterDelay, i * letterDelay + 3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const lineDelay = letters.length * letterDelay + 5;
  const lineWidth = interpolate(frame, [lineDelay, lineDelay + 18], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const consultDelay = letters.length * letterDelay + 12;
  const consultOpacity = interpolate(frame, [consultDelay, consultDelay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const consultY = interpolate(frame, [consultDelay, consultDelay + 10], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const csDelay = consultDelay + 12;
  const csOpacity = interpolate(frame, [csDelay, csDelay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const csY = interpolate(frame, [csDelay, csDelay + 10], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {letters.map((letter, i) => (
            <span
              key={i}
              style={{
                color: P.accent,
                fontSize: 160,
                fontWeight: 900,
                fontFamily: "Pretendard, sans-serif",
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

        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: P.accent,
            borderRadius: 2,
            opacity: 0.5,
          }}
        />

        <p
          style={{
            color: P.text,
            fontSize: 64,
            fontWeight: 500,
            fontFamily: "Pretendard, sans-serif",
            margin: 0,
            letterSpacing: "0.15em",
            opacity: consultOpacity,
            transform: `translateY(${consultY}px)`,
          }}
        >
          Consulting
        </p>

        <p
          style={{
            color: P.sub,
            fontSize: 52,
            fontWeight: 400,
            fontFamily: "Pretendard, sans-serif",
            margin: "10px 0 0 0",
            letterSpacing: "0.08em",
            opacity: csOpacity,
            transform: `translateY(${csY}px)`,
          }}
        >
          Coming Soon
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== 메인 컴포지션 =====
const S1 = 165; // 5.5초 — 빌드업 + 파쇄 (타이트하게)
const S2 = 150; // 5초 — 암전 + 반전 (여유 있게)
const S3 = 240; // 8초 — 엔딩 + 4초 정지 여운
// 총: 555프레임 (~18.5초)

export const LinkTeaser3: React.FC = () => {
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
