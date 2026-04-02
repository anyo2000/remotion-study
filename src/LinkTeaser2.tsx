import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";

// ===== 팔레트 (5색) =====
const P = {
  bg: "#0B1120",
  text: "#F0F0F0",
  sub: "#8899AA",
  accent: "#FF8C38",
  cardBorder: "rgba(255, 255, 255, 0.25)",
  cardBg: "rgba(255, 255, 255, 0.07)",
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

// ===== 파편 방향 (4조각용) =====
const FRAG4 = [
  { tx: -220, ty: -180, rot: -35 },
  { tx: 240, ty: -150, rot: 30 },
  { tx: -200, ty: 300, rot: -45 },
  { tx: 260, ty: 280, rot: 40 },
];

// ===== 공통: 도형 쌓기 → 깨짐 → 텍스트 등장 =====
// shapes: 도형 JSX를 그리는 함수
// breakStart: 깨지기 시작하는 프레임
// duration: 장면 전체 길이
const MetaphorScene: React.FC<{
  text: string;
  renderShapes: (params: {
    frame: number;
    fps: number;
    breakProgress: number;
  }) => React.ReactNode;
  renderFragments: (params: {
    breakProgress: number;
  }) => React.ReactNode;
  breakStart: number;
  duration: number;
}> = ({ text, renderShapes, renderFragments, breakStart, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const breakProgress = interpolate(
    frame,
    [breakStart, breakStart + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
  );

  // shake
  const shakeActive = frame >= breakStart && frame <= breakStart + 10;
  const shakeX = shakeActive ? Math.sin(frame * 9) * 12 : 0;
  const shakeY = shakeActive ? Math.cos(frame * 7) * 8 : 0;

  // 텍스트 — 깨지는 것과 동시에 등장
  const textDelay = breakStart + 2;
  const textScale = spring({
    frame: Math.max(0, frame - textDelay),
    fps,
    config: { damping: 8, stiffness: 120 },
  });
  const textOpacity = interpolate(frame, [textDelay, textDelay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 텍스트 머무른 후 페이드아웃
  const fadeOutStart = duration - 15;
  const fadeOut = interpolate(frame, [fadeOutStart, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <Background />

      {/* 도형들 (깨지기 전) */}
      {breakProgress < 0.01 && renderShapes({ frame, fps, breakProgress })}

      {/* 파편들 (깨진 후) */}
      {breakProgress > 0 && renderFragments({ breakProgress })}

      {/* 텍스트 — 화면 중앙 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 60,
          right: 60,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: textOpacity,
          transform: `scale(${Math.max(0.7, textScale)})`,
        }}
      >
        <p
          style={{
            color: P.text,
            fontSize: 84,
            fontWeight: 700,
            fontFamily: "Pretendard, sans-serif",
            margin: 0,
            textAlign: "center",
          }}
        >
          {text}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===== 장면 1: 동전(원형) — 팔지 마세요 =====
const CoinScene: React.FC<{ duration: number }> = ({ duration }) => {
  const coins = [
    { x: 540, y: 1250, r: 120 },
    { x: 540, y: 980, r: 120 },
    { x: 540, y: 710, r: 120 },
  ];

  return (
    <MetaphorScene
      text="팔지 마세요."
      breakStart={50}
      duration={duration}
      renderShapes={({ frame, fps }) => (
        <>
          {coins.map((coin, i) => {
            const scale = spring({
              frame: Math.max(0, frame - i * 12),
              fps,
              config: { damping: 10, stiffness: 150 },
            });
            const symbolOp = interpolate(frame, [i * 12 + 8, i * 12 + 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: coin.x - coin.r,
                  top: coin.y - coin.r,
                  width: coin.r * 2,
                  height: coin.r * 2,
                  borderRadius: "50%",
                  border: `3px solid ${P.cardBorder}`,
                  backgroundColor: P.cardBg,
                  transform: `scale(${scale})`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: P.accent,
                    fontSize: 80,
                    fontWeight: 700,
                    fontFamily: "Pretendard, sans-serif",
                    opacity: symbolOp,
                  }}
                >
                  ₩
                </span>
              </div>
            );
          })}
        </>
      )}
      renderFragments={({ breakProgress }) => (
        <>
          {coins.map((coin, ci) =>
            FRAG4.map((frag, fi) => (
              <div
                key={`f-${ci}-${fi}`}
                style={{
                  position: "absolute",
                  left: coin.x - coin.r,
                  top: coin.y - coin.r,
                  width: coin.r * 2,
                  height: coin.r * 2,
                  borderRadius: "50%",
                  border: `3px solid ${P.cardBorder}`,
                  backgroundColor: P.cardBg,
                  clipPath:
                    fi === 0 ? "polygon(0 0, 50% 0, 50% 50%, 0 50%)" :
                    fi === 1 ? "polygon(50% 0, 100% 0, 100% 50%, 50% 50%)" :
                    fi === 2 ? "polygon(0 50%, 50% 50%, 50% 100%, 0 100%)" :
                    "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
                  transform: `translate(${frag.tx * breakProgress}px, ${frag.ty * breakProgress}px) rotate(${frag.rot * breakProgress}deg)`,
                  opacity: 1 - breakProgress * 0.8,
                }}
              />
            ))
          )}
        </>
      )}
    />
  );
};

// ===== 장면 2: 문서(세로 직사각) — 설명하지 마세요 =====
const DocScene: React.FC<{ duration: number }> = ({ duration }) => {
  const docs = [
    { x: 540, y: 1220, w: 220, h: 280 },
    { x: 540, y: 900, w: 220, h: 280 },
    { x: 540, y: 580, w: 220, h: 280 },
  ];

  return (
    <MetaphorScene
      text="설명하지 마세요."
      breakStart={45}
      duration={duration}
      renderShapes={({ frame, fps }) => (
        <>
          {docs.map((doc, i) => {
            const scale = spring({
              frame: Math.max(0, frame - i * 10),
              fps,
              config: { damping: 10, stiffness: 160 },
            });
            const lineOp = interpolate(frame, [i * 10 + 6, i * 10 + 16], [0, 0.6], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: doc.x - doc.w / 2,
                  top: doc.y - doc.h / 2,
                  width: doc.w,
                  height: doc.h,
                  borderRadius: 18,
                  border: `3px solid ${P.cardBorder}`,
                  backgroundColor: P.cardBg,
                  transform: `scale(${scale})`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 16,
                  padding: 35,
                }}
              >
                {[0.95, 0.75, 0.6, 0.85].map((w, li) => (
                  <div
                    key={li}
                    style={{
                      width: `${w * 100}%`,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: P.sub,
                      opacity: lineOp,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </>
      )}
      renderFragments={({ breakProgress }) => (
        <>
          {docs.map((doc, di) =>
            FRAG4.map((frag, fi) => (
              <div
                key={`f-${di}-${fi}`}
                style={{
                  position: "absolute",
                  left: doc.x - doc.w / 2,
                  top: doc.y - doc.h / 2,
                  width: doc.w,
                  height: doc.h,
                  borderRadius: 18,
                  border: `3px solid ${P.cardBorder}`,
                  backgroundColor: P.cardBg,
                  clipPath:
                    fi === 0 ? "polygon(0 0, 50% 0, 50% 50%, 0 50%)" :
                    fi === 1 ? "polygon(50% 0, 100% 0, 100% 50%, 50% 50%)" :
                    fi === 2 ? "polygon(0 50%, 50% 50%, 50% 100%, 0 100%)" :
                    "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
                  transform: `translate(${frag.tx * breakProgress}px, ${frag.ty * breakProgress}px) rotate(${frag.rot * breakProgress}deg)`,
                  opacity: 1 - breakProgress * 0.8,
                }}
              />
            ))
          )}
        </>
      )}
    />
  );
};

// ===== 장면 3: 체크박스 — 정답을 주지 마세요 =====
const CheckScene: React.FC<{ duration: number }> = ({ duration }) => {
  const boxes = [
    { x: 540, y: 1200, s: 200 },
    { x: 540, y: 960, s: 200 },
    { x: 540, y: 720, s: 200 },
  ];

  return (
    <MetaphorScene
      text="정답을 주지 마세요."
      breakStart={38}
      duration={duration}
      renderShapes={({ frame, fps }) => (
        <>
          {boxes.map((box, i) => {
            const scale = spring({
              frame: Math.max(0, frame - i * 8),
              fps,
              config: { damping: 10, stiffness: 180 },
            });
            const checkP = interpolate(frame, [i * 8 + 5, i * 8 + 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: box.x - box.s / 2,
                  top: box.y - box.s / 2,
                  width: box.s,
                  height: box.s,
                  borderRadius: 24,
                  border: `3px solid ${P.cardBorder}`,
                  backgroundColor: P.cardBg,
                  transform: `scale(${scale})`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg width={100} height={100} viewBox="0 0 24 24">
                  <path
                    d="M5 13l4 4L19 7"
                    fill="none"
                    stroke={P.accent}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={24}
                    strokeDashoffset={24 * (1 - checkP)}
                  />
                </svg>
              </div>
            );
          })}
        </>
      )}
      renderFragments={({ breakProgress }) => (
        <>
          {boxes.map((box, bi) =>
            FRAG4.map((frag, fi) => (
              <div
                key={`f-${bi}-${fi}`}
                style={{
                  position: "absolute",
                  left: box.x - box.s / 2,
                  top: box.y - box.s / 2,
                  width: box.s,
                  height: box.s,
                  borderRadius: 24,
                  border: `3px solid ${P.cardBorder}`,
                  backgroundColor: P.cardBg,
                  clipPath:
                    fi === 0 ? "polygon(0 0, 50% 0, 50% 50%, 0 50%)" :
                    fi === 1 ? "polygon(50% 0, 100% 0, 100% 50%, 50% 50%)" :
                    fi === 2 ? "polygon(0 50%, 50% 50%, 50% 100%, 0 100%)" :
                    "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
                  transform: `translate(${frag.tx * breakProgress}px, ${frag.ty * breakProgress}px) rotate(${frag.rot * breakProgress}deg)`,
                  opacity: 1 - breakProgress * 0.8,
                }}
              />
            ))
          )}
        </>
      )}
    />
  );
};

// ===== 장면 4: 암전 =====
const BlackoutScene: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.bg }} />
);

// ===== 장면 5: 4점 다이아몬드 연결 =====
const ConnectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 4개 점 — 다이아몬드 형태 (LINK 4글자)
  const diamond = [
    { x: 540, y: 700 },   // 상
    { x: 280, y: 960 },   // 좌
    { x: 800, y: 960 },   // 우
    { x: 540, y: 1220 },  // 하
  ];

  // 4개 점이 바깥에서 수렴
  const startPositions = [
    { x: 540, y: 200 },
    { x: -100, y: 960 },
    { x: 1180, y: 960 },
    { x: 540, y: 1700 },
  ];

  const converge = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 현재 점 위치
  const currentDots = diamond.map((d, i) => ({
    x: startPositions[i].x + (d.x - startPositions[i].x) * converge,
    y: startPositions[i].y + (d.y - startPositions[i].y) * converge,
  }));

  // 4변 연결 (다이아몬드 테두리)
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
  const edgeProgresses = edges.map((_, i) =>
    interpolate(frame, [25 + i * 5, 40 + i * 5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // 대각선 연결 (X자)
  const crossEdges = [[0, 3], [1, 2]];
  const crossProgresses = crossEdges.map((_, i) =>
    interpolate(frame, [50 + i * 8, 65 + i * 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // 완성 glow
  const glowIntensity = interpolate(frame, [60, 90], [0.1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 점 크기 — 수렴 완료 후 커짐
  const dotRadius = interpolate(converge, [0.8, 1], [8, 16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 텍스트
  const textDelay = 20;
  const textOpacity = interpolate(frame, [textDelay, textDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textScale = spring({
    frame: Math.max(0, frame - textDelay),
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* 텍스트 */}
      <div
        style={{
          position: "absolute",
          top: 300,
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
            fontSize: 84,
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
            fontSize: 84,
            fontWeight: 800,
            fontFamily: "Pretendard, sans-serif",
            margin: "15px 0 0 0",
          }}
        >
          연결됩니다.
        </p>
      </div>

      {/* 다이아몬드 네트워크 */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* 테두리 선 */}
        {edges.map(([from, to], i) => {
          const p = edgeProgresses[i];
          if (p <= 0) return null;
          const f = currentDots[from];
          const t = currentDots[to];
          return (
            <line
              key={`edge-${i}`}
              x1={f.x}
              y1={f.y}
              x2={f.x + (t.x - f.x) * p}
              y2={f.y + (t.y - f.y) * p}
              stroke={P.accent}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.6}
            />
          );
        })}

        {/* 대각선 */}
        {crossEdges.map(([from, to], i) => {
          const p = crossProgresses[i];
          if (p <= 0) return null;
          const f = currentDots[from];
          const t = currentDots[to];
          return (
            <line
              key={`cross-${i}`}
              x1={f.x}
              y1={f.y}
              x2={f.x + (t.x - f.x) * p}
              y2={f.y + (t.y - f.y) * p}
              stroke={P.accent}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.3}
            />
          );
        })}

        {/* 점 */}
        {currentDots.map((dot, i) => (
          <g key={`dot-${i}`}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={40}
              fill={P.accent}
              opacity={glowIntensity * 0.3}
              style={{ filter: "blur(20px)" }}
            />
            <circle
              cx={dot.x}
              cy={dot.y}
              r={dotRadius}
              fill={P.accent}
              opacity={Math.max(0.3, converge)}
            />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ===== 장면 6: LINK 오렌지 탁탁탁 =====
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
const S1 = 100; // 3.3초 동전 (여유)
const S2 = 85;  // 2.8초 문서
const S3 = 70;  // 2.3초 체크
const S4 = 30;  // 1초 암전
const S5 = 120; // 4초 연결
const S6 = 110; // 3.7초 엔딩
// 총: 515프레임 (~17초)

export const LinkTeaser2: React.FC = () => {
  let t = 0;
  const seq = (duration: number) => {
    const from = t;
    t += duration;
    return from;
  };

  const s1 = seq(S1);
  const s2 = seq(S2);
  const s3 = seq(S3);
  const s4 = seq(S4);
  const s5 = seq(S5);
  const s6 = seq(S6);

  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      <Sequence from={s1} durationInFrames={S1}>
        <CoinScene duration={S1} />
      </Sequence>

      <Sequence from={s2} durationInFrames={S2}>
        <DocScene duration={S2} />
      </Sequence>

      <Sequence from={s3} durationInFrames={S3}>
        <CheckScene duration={S3} />
      </Sequence>

      <Sequence from={s4} durationInFrames={S4}>
        <BlackoutScene />
      </Sequence>

      <Sequence from={s5} durationInFrames={S5}>
        <ConnectionScene />
      </Sequence>

      <Sequence from={s6} durationInFrames={S6}>
        <EndingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
