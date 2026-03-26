import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// ===== 팔레트 (전 장면 고정) =====
const P = {
  bg: "#0c1117",
  card: "rgba(255, 255, 255, 0.06)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  text: "#f0f0f0",
  sub: "#9ca3af",
  accent: "#e0a8b8",
  accentLight: "#edc4d0",
  accentDark: "#c88e9e",
};

const SAFE = { top: 150, bottom: 170, side: 60 };

const Background: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: P.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(224, 168, 184, 0.06), transparent)`,
      }}
    />
  </AbsoluteFill>
);

// ========== 장면1: 점 — 흩어진 동그라미들이 깜빡이다 사라짐 ==========
const DotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 화면 가득 채우는 큰 동그라미들 — 더 크게, 더 골고루
  const circles = [
    { x: 180, y: 280, size: 260 },
    { x: 580, y: 200, size: 200 },
    { x: 880, y: 400, size: 240 },
    { x: 320, y: 560, size: 280 },
    { x: 750, y: 650, size: 220 },
    { x: 140, y: 840, size: 250 },
    { x: 540, y: 900, size: 200 },
    { x: 850, y: 1000, size: 260 },
    { x: 350, y: 1150, size: 240 },
    { x: 700, y: 1280, size: 220 },
    { x: 180, y: 1400, size: 230 },
    { x: 560, y: 1520, size: 250 },
  ];

  // 키워드 등장
  const keywordOpacity = interpolate(frame, [4 * fps, 4.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keywordScale = spring({
    frame: Math.max(0, frame - 4 * fps),
    fps,
    config: { damping: 12 },
  });

  // 후반부: 동그라미들 하나씩 깜빡이며 사라짐
  const fadeOutStart = 5.5 * fps;

  return (
    <AbsoluteFill>
      <Background />

      {/* 동그라미들 */}
      {circles.map((c, i) => {
        const delay = i * 6;
        const enterScale = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 200 },
        });

        // 깜빡이다 사라지는 효과
        const flickerDelay = fadeOutStart + i * 4;
        const flicker = frame > flickerDelay
          ? interpolate(
              frame,
              [flickerDelay, flickerDelay + 6, flickerDelay + 10, flickerDelay + 18],
              [1, 0.3, 0.7, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          : 1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x - c.size / 2,
              top: c.y - c.size / 2,
              width: c.size,
              height: c.size,
              borderRadius: "50%",
              backgroundColor: P.sub,
              opacity: 0.12 * enterScale * flicker,
              transform: `scale(${enterScale})`,
            }}
          />
        );
      })}

      {/* 중앙 키워드 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity: keywordOpacity,
            transform: `scale(${keywordScale})`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: P.text,
              fontSize: 200,
              fontWeight: "bold",
              margin: 0,
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            점
          </p>
          <p
            style={{
              color: P.sub,
              fontSize: 56,
              margin: "24px 0 0 0",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            아플 때만 반짝
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========== 장면2: 흩어진 점들이 하나의 선으로 모여듦 ==========
const LineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 점들의 시작 위치(흩어짐) → 세로선 위로 모임
  const dots = [
    { sx: 120, sy: 250, ex: 540, ey: 350 },
    { sx: 880, sy: 400, ex: 540, ey: 550 },
    { sx: 200, sy: 700, ex: 540, ey: 750 },
    { sx: 900, sy: 900, ex: 540, ey: 950 },
    { sx: 150, sy: 1200, ex: 540, ey: 1150 },
    { sx: 800, sy: 1400, ex: 540, ey: 1350 },
    { sx: 400, sy: 1700, ex: 540, ey: 1550 },
  ];

  // 모여드는 진행도
  const gatherProgress = interpolate(frame, [1 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // 선이 나타나는 진행도
  const lineOpacity = interpolate(frame, [3 * fps, 4.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 선이 빛나는 효과
  const lineGlow = interpolate(frame, [4 * fps, 5.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 키워드
  const keywordOpacity = interpolate(frame, [5.5 * fps, 6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keywordScale = spring({
    frame: Math.max(0, frame - 5.5 * fps),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* 점들이 흩어진 곳에서 선 위치로 이동 */}
      {dots.map((d, i) => {
        const x = interpolate(gatherProgress, [0, 1], [d.sx, d.ex]);
        const y = interpolate(gatherProgress, [0, 1], [d.sy, d.ey]);
        const dotSize = interpolate(gatherProgress, [0, 1], [80, 28]);
        const dotOpacity = interpolate(gatherProgress, [0, 0.3], [0.15, 0.6], {
          extrapolateRight: "clamp",
        });

        // 점이 선에 합쳐지면 밝아짐
        const onLine = gatherProgress > 0.9;
        const finalOpacity = onLine
          ? interpolate(gatherProgress, [0.9, 1], [0.6, 1], {
              extrapolateRight: "clamp",
            })
          : dotOpacity;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - dotSize / 2,
              top: y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: onLine ? P.accent : P.sub,
              opacity: finalOpacity,
            }}
          />
        );
      })}

      {/* 세로 연결선 — 화면 위에서 아래로 */}
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: lineOpacity,
        }}
      >
        <path
          d="M 540 200 C 540 600, 540 700, 540 1700"
          fill="none"
          stroke={P.accent}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.4}
        />
        {/* 빛나는 효과 — 위에서 아래로 */}
        <line
          x1={540}
          y1={200}
          x2={540}
          y2={interpolate(lineGlow, [0, 1], [200, 1700])}
          stroke={P.accentLight}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.25}
          filter="blur(6px)"
        />
      </svg>

      {/* 키워드 — 위쪽 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: keywordOpacity,
          transform: `scale(${keywordScale})`,
        }}
      >
        <p
          style={{
            color: P.sub,
            fontSize: 56,
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          삶 전체를 잇는
        </p>
        <p
          style={{
            color: P.accent,
            fontSize: 200,
            fontWeight: "bold",
            margin: "8px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          선
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면3: 선이 세 갈래로 갈라짐 ==========
const ThreeLinesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 하나의 선에서 시작
  const splitProgress = interpolate(frame, [1 * fps, 3.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // 세 갈래 — 중앙에서 좌우로 넓게 펼침
  const branches = [
    {
      label: "치료의 선",
      sub: "끊김 없는 치료비 통장",
      tint: P.accent,
      endX: 760,
      endY: 380,
    },
    {
      label: "생명의 선",
      sub: "임신부터 출산까지",
      tint: P.accentLight,
      endX: 760,
      endY: 960,
    },
    {
      label: "존엄의 선",
      sub: "법률 비용 지원",
      tint: P.accentDark,
      endX: 760,
      endY: 1540,
    },
  ];

  const labelDelay = [4 * fps, 5 * fps, 6 * fps];

  // 하단 메시지
  const closingOpacity = interpolate(frame, [7.5 * fps, 8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />

      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 시작점 — 왼쪽 중앙 */}
        <circle cx={160} cy={960} r={12} fill={P.accent} opacity={0.6} />

        {/* 갈라지는 세 곡선 */}
        {branches.map((b, i) => {
          const endX = interpolate(splitProgress, [0, 1], [160, b.endX]);
          const endY = interpolate(splitProgress, [0, 1], [960, b.endY]);
          const ctrlX = interpolate(splitProgress, [0, 1], [160, 400]);
          const ctrlY = interpolate(splitProgress, [0, 1], [960, (960 + b.endY) / 2]);

          return (
            <path
              key={i}
              d={`M 160 960 Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
              fill="none"
              stroke={b.tint}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.5}
            />
          );
        })}

        {/* 각 끝에 큰 원 */}
        {branches.map((b, i) => {
          const endX = interpolate(splitProgress, [0, 1], [160, b.endX]);
          const endY = interpolate(splitProgress, [0, 1], [960, b.endY]);
          const circleScale = spring({
            frame: Math.max(0, frame - 3 * fps - i * 12),
            fps,
            config: { damping: 200 },
          });

          return (
            <g key={i}>
              <circle
                cx={endX}
                cy={endY}
                r={120 * circleScale}
                fill={b.tint}
                opacity={0.08}
              />
              <circle
                cx={endX}
                cy={endY}
                r={60 * circleScale}
                fill={b.tint}
                opacity={0.15}
              />
              <circle
                cx={endX}
                cy={endY}
                r={16 * circleScale}
                fill={b.tint}
                opacity={0.6}
              />
            </g>
          );
        })}
      </svg>

      {/* 각 갈래 옆에 레이블 + 부제 */}
      {branches.map((b, i) => {
        const labelOpacity = interpolate(
          frame,
          [labelDelay[i], labelDelay[i] + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const labelY = spring({
          frame: Math.max(0, frame - labelDelay[i]),
          fps,
          from: 20,
          to: 0,
          config: { damping: 200 },
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: SAFE.side + 40,
              top: b.endY - 80,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              width: 500,
            }}
          >
            <span
              style={{
                color: b.tint,
                fontSize: 72,
                fontWeight: "bold",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              {b.label}
            </span>
            <p
              style={{
                color: P.sub,
                fontSize: 44,
                margin: "8px 0 0 0",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              {b.sub}
            </p>
          </div>
        );
      })}

      {/* 하단 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 40,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: closingOpacity,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 52,
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          시그니처 4.0
        </p>
        <p
          style={{
            color: P.text,
            fontSize: 64,
            fontWeight: "bold",
            margin: "8px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          여성의 삶 전체를 보장
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 메인 ==========
export const Signature4: React.FC = () => {
  const FADE = 15;
  const GAP = 21;
  const S1 = 9 * 30 + GAP;
  const S2 = 8 * 30 + GAP;
  const S3 = 10 * 30;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <DotScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <LineScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <ThreeLinesScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
