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
  accent: "#4A9EFF",
  orange: "#FF8C38",
};

const Background: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: P.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74, 158, 255, 0.04), transparent)`,
      }}
    />
  </AbsoluteFill>
);

// ===== SVG 아이콘 =====
const TagIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const DocIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const CheckIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// ===== 글자별 낙하 데이터 (미리 정해둔 랜덤 방향) =====
const FALL_DIRECTIONS = [
  { tx: -120, ty: 400, rot: -35 },
  { tx: 60, ty: 500, rot: 25 },
  { tx: -80, ty: 350, rot: -50 },
  { tx: 150, ty: 450, rot: 40 },
  { tx: -40, ty: 550, rot: -20 },
  { tx: 100, ty: 380, rot: 55 },
  { tx: -160, ty: 480, rot: -45 },
  { tx: 30, ty: 420, rot: 30 },
  { tx: -100, ty: 500, rot: -60 },
  { tx: 140, ty: 360, rot: 15 },
];

// ===== 취소선 + 글자 낙하 장면 =====
const NegationScene: React.FC<{
  text: string;
  icon: React.ReactNode;
  duration: number;
  speed: "slow" | "mid" | "fast";
}> = ({ text, icon, duration, speed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpeed = speed === "slow" ? 1 : speed === "mid" ? 0.8 : 0.6;

  // 아이콘 등장
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: speed === "fast" ? 200 : 100 },
  });

  // 텍스트 등장
  const textEnterEnd = Math.floor(20 * enterSpeed);
  const textOpacity = interpolate(frame, [8, textEnterEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [8, textEnterEnd], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 낙하 시작 타이밍
  const fallStart = speed === "slow" ? 42 : speed === "mid" ? 35 : 28;

  // 글자 낙하 진행도
  const fallProgress = interpolate(
    frame,
    [fallStart, fallStart + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
  );

  // 아이콘 낙하
  const iconFall = interpolate(
    frame,
    [fallStart, fallStart + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
  );

  // 화면 shake (fast만)
  const shakeX = speed === "fast" && frame >= fallStart && frame <= fallStart + 10
    ? Math.sin(frame * 8) * 12
    : 0;
  const shakeY = speed === "fast" && frame >= fallStart && frame <= fallStart + 10
    ? Math.cos(frame * 6) * 8
    : 0;

  // 전체 페이드아웃
  const fadeOutStart = duration - 10;
  const groupOpacity = interpolate(
    frame,
    [0, 3, fadeOutStart, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const chars = text.split("");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: groupOpacity,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <Background />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* 아이콘 — 낙하 */}
        <div
          style={{
            transform: `scale(${iconScale}) translateY(${iconFall * 600}px) rotate(${iconFall * -30}deg)`,
            opacity: 1 - iconFall,
          }}
        >
          {icon}
        </div>

        {/* 텍스트 — 각 글자가 개별 낙하 */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {chars.map((char, i) => {
            const dir = FALL_DIRECTIONS[i % FALL_DIRECTIONS.length];
            // 글자별 약간의 딜레이 (스태거)
            const charFallProgress = interpolate(
              frame,
              [fallStart + i * 2, fallStart + i * 2 + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
            );

            return (
              <span
                key={i}
                style={{
                  color: P.text,
                  fontSize: 80,
                  fontWeight: 700,
                  fontFamily: "Pretendard, sans-serif",
                  letterSpacing: "-0.02em",
                  display: "inline-block",
                  transform: charFallProgress > 0
                    ? `translate(${dir.tx * charFallProgress}px, ${dir.ty * charFallProgress}px) rotate(${dir.rot * charFallProgress}deg)`
                    : "none",
                  opacity: 1 - charFallProgress * 0.8,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===== 암전 장면 =====
const BlackoutScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.bg }} />
);

// ===== 연결 장면 — 네트워크 확장 =====
const ConnectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 초기 3개 점
  const initialDots = [
    { x: 540, y: 800 },
    { x: 300, y: 1050 },
    { x: 780, y: 1050 },
  ];

  // 확장 점 (나중에 추가)
  const expandDots = [
    { x: 180, y: 850 },
    { x: 900, y: 850 },
    { x: 420, y: 1200 },
    { x: 660, y: 1200 },
    { x: 540, y: 650 },
  ];

  const allDots = [...initialDots, ...expandDots];

  // 초기 점 등장
  const dotScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  // 초기 3개 선 연결
  const lineDelay = 10;
  const lineProgress = (start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const l1 = lineProgress(lineDelay, lineDelay + 15);
  const l2 = lineProgress(lineDelay + 6, lineDelay + 21);
  const l3 = lineProgress(lineDelay + 12, lineDelay + 27);

  // 확장 점 등장 (30프레임부터)
  const expandDelay = 30;
  const expandScales = expandDots.map((_, i) =>
    spring({
      frame: Math.max(0, frame - (expandDelay + i * 4)),
      fps,
      config: { damping: 8, stiffness: 120 },
    })
  );

  // 확장 선 연결 (점이 등장한 후)
  const expandLines = [
    { from: 0, to: 3 }, // 상단 → 좌상
    { from: 0, to: 4 }, // 상단 → 우상
    { from: 1, to: 3 }, // 좌하 → 좌상
    { from: 2, to: 4 }, // 우하 → 우상
    { from: 1, to: 5 }, // 좌하 → 좌하단
    { from: 2, to: 6 }, // 우하 → 우하단
    { from: 0, to: 7 }, // 상단 → 꼭대기
    { from: 3, to: 7 }, // 좌상 → 꼭대기
    { from: 4, to: 7 }, // 우상 → 꼭대기
  ];

  const expandLineProgresses = expandLines.map((_, i) =>
    lineProgress(expandDelay + 8 + i * 3, expandDelay + 20 + i * 3)
  );

  // 텍스트 등장
  const textDelay = 25;
  const textOpacity = interpolate(frame, [textDelay, textDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textScale = spring({
    frame: Math.max(0, frame - textDelay),
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // 전체 glow 증가
  const glowIntensity = interpolate(frame, [30, 80], [0.1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const drawLine = (
    fromDot: { x: number; y: number },
    toDot: { x: number; y: number },
    progress: number
  ) => {
    if (progress <= 0) return null;
    const endX = fromDot.x + (toDot.x - fromDot.x) * progress;
    const endY = fromDot.y + (toDot.y - fromDot.y) * progress;
    return (
      <line
        x1={fromDot.x}
        y1={fromDot.y}
        x2={endX}
        y2={endY}
        stroke={P.accent}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.5}
      />
    );
  };

  return (
    <AbsoluteFill>
      <Background />

      {/* 텍스트 */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
          transform: `scale(${Math.max(0.85, textScale)})`,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 82,
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
            fontSize: 82,
            fontWeight: 800,
            fontFamily: "Pretendard, sans-serif",
            margin: "15px 0 0 0",
          }}
        >
          연결됩니다.
        </p>
      </div>

      {/* 네트워크 */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* 초기 삼각형 선 */}
        {drawLine(initialDots[0], initialDots[1], l1)}
        {drawLine(initialDots[1], initialDots[2], l2)}
        {drawLine(initialDots[2], initialDots[0], l3)}

        {/* 확장 선 */}
        {expandLines.map((line, i) =>
          drawLine(allDots[line.from], allDots[line.to], expandLineProgresses[i])
        )}

        {/* 초기 점 */}
        {initialDots.map((dot, i) => (
          <g key={`init-${i}`}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={35}
              fill={P.accent}
              opacity={glowIntensity * 0.3}
              style={{ filter: "blur(18px)" }}
            />
            <circle
              cx={dot.x}
              cy={dot.y}
              r={14 * dotScale}
              fill={P.accent}
            />
          </g>
        ))}

        {/* 확장 점 */}
        {expandDots.map((dot, i) => (
          <g key={`exp-${i}`}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={30}
              fill={P.accent}
              opacity={glowIntensity * 0.2}
              style={{ filter: "blur(15px)" }}
            />
            <circle
              cx={dot.x}
              cy={dot.y}
              r={10 * expandScales[i]}
              fill={P.accent}
              opacity={0.8}
            />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ===== 엔딩 장면 — LINK 오렌지 탁탁탁 =====
const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // L-I-N-K 한 글자씩 탁탁탁탁
  const letters = ["L", "I", "N", "K"];
  const letterDelay = 7; // 글자 간격 (약 0.23초)

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

  // Consulting 등장 (LINK 완성 후)
  const consultingDelay = letters.length * letterDelay + 10;
  const consultingOpacity = interpolate(
    frame,
    [consultingDelay, consultingDelay + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const consultingY = interpolate(
    frame,
    [consultingDelay, consultingDelay + 12],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Coming Soon 등장
  const comingSoonDelay = consultingDelay + 15;
  const comingSoonOpacity = interpolate(
    frame,
    [comingSoonDelay, comingSoonDelay + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const comingSoonY = interpolate(
    frame,
    [comingSoonDelay, comingSoonDelay + 12],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 밑줄 (LINK 아래)
  const lineDelay = letters.length * letterDelay + 5;
  const lineWidth = interpolate(frame, [lineDelay, lineDelay + 20], [0, 280], {
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
        {/* LINK — 오렌지, 한 글자씩 */}
        <div style={{ display: "flex", gap: 8 }}>
          {letters.map((letter, i) => (
            <span
              key={i}
              style={{
                color: P.orange,
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

        {/* 밑줄 */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: P.orange,
            borderRadius: 2,
            opacity: 0.6,
          }}
        />

        {/* Consulting */}
        <p
          style={{
            color: P.text,
            fontSize: 64,
            fontWeight: 500,
            fontFamily: "Pretendard, sans-serif",
            margin: 0,
            letterSpacing: "0.15em",
            opacity: consultingOpacity,
            transform: `translateY(${consultingY}px)`,
          }}
        >
          Consulting
        </p>

        {/* Coming Soon */}
        <p
          style={{
            color: P.sub,
            fontSize: 52,
            fontWeight: 400,
            fontFamily: "Pretendard, sans-serif",
            margin: "10px 0 0 0",
            letterSpacing: "0.08em",
            opacity: comingSoonOpacity,
            transform: `translateY(${comingSoonY}px)`,
          }}
        >
          Coming Soon
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== 메인 컴포지션 =====
const S1 = 75;  // 2.5초 — 느리게
const S2 = 65;  // 2.2초 — 중간
const S3 = 55;  // 1.8초 — 빠르게 + shake
const BLACKOUT = 30; // 1초 암전
const S4 = 100; // 3.3초 — 연결
const S5 = 110; // 3.7초 — 엔딩 (글자 등장 여유)

export const LinkTeaser1: React.FC = () => {
  const s2Start = S1;
  const s3Start = s2Start + S2;
  const blackoutStart = s3Start + S3;
  const s4Start = blackoutStart + BLACKOUT;
  const s5Start = s4Start + S4;

  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      {/* 장면 1: 팔지 마세요 — 느리게, 여유 있게 */}
      <Sequence from={0} durationInFrames={S1}>
        <NegationScene
          text="팔지 마세요."
          icon={<TagIcon size={160} color={P.text} />}
          duration={S1}
          speed="slow"
        />
      </Sequence>

      {/* 장면 2: 설명하지 마세요 — 좀 더 빠르게 */}
      <Sequence from={s2Start} durationInFrames={S2}>
        <NegationScene
          text="설명하지 마세요."
          icon={<DocIcon size={160} color={P.text} />}
          duration={S2}
          speed="mid"
        />
      </Sequence>

      {/* 장면 3: 정답을 주지 마세요 — 빠르게 + shake */}
      <Sequence from={s3Start} durationInFrames={S3}>
        <NegationScene
          text="정답을 주지 마세요."
          icon={<CheckIcon size={160} color={P.text} />}
          duration={S3}
          speed="fast"
        />
      </Sequence>

      {/* 암전 — 1초 정적 */}
      <Sequence from={blackoutStart} durationInFrames={BLACKOUT}>
        <BlackoutScene />
      </Sequence>

      {/* 장면 4: 그래야, 연결됩니다 — 네트워크 확장 */}
      <Sequence from={s4Start} durationInFrames={S4}>
        <ConnectionScene />
      </Sequence>

      {/* 장면 5: LINK / Consulting / Coming Soon */}
      <Sequence from={s5Start} durationInFrames={S5}>
        <EndingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
