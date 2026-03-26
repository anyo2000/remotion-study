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
  accent: "#5b9bd5",
  accentLight: "#7db8e8",
  accentDark: "#3d7ab5",
};

const SAFE = { top: 150, bottom: 170, side: 60 };

const Background: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: P.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(91, 155, 213, 0.05), transparent)`,
      }}
    />
  </AbsoluteFill>
);

// ========== 장면1: 컨설팅의 변천 — 블록들이 하나씩 무너짐 ==========
const FadingConsultingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 타이틀
  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 세로로 쌓인 블록들 — 과거 컨설팅 방식
  const blocks = [
    { label: "3B", y: 350, delay: 0.8 * fps },
    { label: "상품경쟁", y: 580, delay: 1.4 * fps },
    { label: "인수경쟁", y: 810, delay: 2 * fps },
    { label: "?", y: 1040, delay: 2.6 * fps },
  ];

  // 블록들이 하나씩 금 가며 사라짐
  const crackStart = 5 * fps;

  // 질문 등장
  const questionOpacity = interpolate(frame, [7 * fps, 7.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* 타이틀 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 40,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
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
          그동안의 컨설팅
        </p>
      </div>

      {/* 블록들 */}
      {blocks.map((block, i) => {
        const enterScale = spring({
          frame: Math.max(0, frame - block.delay),
          fps,
          config: { damping: 200 },
        });
        const enterOpacity = interpolate(
          frame,
          [block.delay, block.delay + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // 무너지는 효과 — 위에서부터 순서대로
        const crackDelay = crackStart + i * 12;
        const crackProgress = frame > crackDelay
          ? interpolate(frame, [crackDelay, crackDelay + 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        const blockOpacity = enterOpacity * (1 - crackProgress * 0.8);
        const blockX = crackProgress * (i % 2 === 0 ? -60 : 60);
        const blockRotate = crackProgress * (i % 2 === 0 ? -3 : 3);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 350,
              top: block.y,
              width: 700,
              height: 180,
              backgroundColor: P.card,
              border: `1px solid ${P.cardBorder}`,
              borderRadius: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: blockOpacity,
              transform: `scale(${enterScale}) translateX(${blockX}px) rotate(${blockRotate}deg)`,
            }}
          >
            <span
              style={{
                color: i < 3 ? P.sub : P.accent,
                fontSize: 64,
                fontWeight: "bold",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              {block.label}
            </span>

            {/* 금 가는 효과 */}
            {crackProgress > 0 && i < 3 && (
              <svg
                width="700"
                height="180"
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <line
                  x1={200}
                  y1={0}
                  x2={350 + crackProgress * 100}
                  y2={180}
                  stroke={P.sub}
                  strokeWidth={1}
                  opacity={crackProgress * 0.4}
                />
                <line
                  x1={450}
                  y1={0}
                  x2={300 - crackProgress * 80}
                  y2={180}
                  stroke={P.sub}
                  strokeWidth={1}
                  opacity={crackProgress * 0.3}
                />
              </svg>
            )}
          </div>
        );
      })}

      {/* 하단 질문 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: questionOpacity,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 72,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          요즘 컨설팅은 뭐지?
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면2: 벽에 부딪히는 화살표 — 현실 ==========
const WallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 화살표가 오른쪽으로 날아감
  const arrowX = interpolate(frame, [0.5 * fps, 2.5 * fps], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // 벽에 부딪히는 순간
  const hitFrame = 2.5 * fps;
  const hit = frame > hitFrame;

  // 충격 효과
  const shakeX = hit
    ? interpolate(
        frame,
        [hitFrame, hitFrame + 3, hitFrame + 6, hitFrame + 9, hitFrame + 12],
        [0, -15, 10, -5, 0],
        { extrapolateRight: "clamp" }
      )
    : 0;

  // 벽 — 세로 막대
  const wallOpacity = interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "보험 얘기" 라벨
  const labelOpacity = interpolate(frame, [3.5 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 핵심 메시지
  const msgOpacity = interpolate(frame, [5.5 * fps, 6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const msgScale = spring({
    frame: Math.max(0, frame - 5.5 * fps),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <Background />

      <div style={{ transform: `translateX(${shakeX}px)` }}>
        <AbsoluteFill>
          {/* 화살표 — 큰 삼각형 */}
          <svg
            width="1080"
            height="1920"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* 화살표 몸통 */}
            <line
              x1={100}
              y1={760}
              x2={Math.min(arrowX + 100, 620)}
              y2={760}
              stroke={P.sub}
              strokeWidth={6}
              strokeLinecap="round"
              opacity={0.6}
            />
            {/* 화살표 머리 */}
            <polygon
              points={`${Math.min(arrowX + 100, 620)},730 ${Math.min(arrowX + 150, 670)},760 ${Math.min(arrowX + 100, 620)},790`}
              fill={P.sub}
              opacity={hit ? 0.3 : 0.6}
            />

            {/* 벽 */}
            <rect
              x={680}
              y={300}
              width={12}
              height={920}
              rx={6}
              fill={P.accent}
              opacity={wallOpacity * 0.4}
            />
            <rect
              x={676}
              y={300}
              width={20}
              height={920}
              rx={10}
              fill={P.accent}
              opacity={wallOpacity * 0.1}
              filter="blur(8px)"
            />
          </svg>

          {/* 벽 오른쪽: "보험 얘기" */}
          <div
            style={{
              position: "absolute",
              left: 720,
              top: 680,
              opacity: labelOpacity,
            }}
          >
            <span
              style={{
                color: P.sub,
                fontSize: 56,
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              보험 얘기
            </span>
          </div>

          {/* 벽 왼쪽: "여기서 끝" */}
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 680,
              opacity: labelOpacity,
            }}
          >
            <span
              style={{
                color: P.accent,
                fontSize: 56,
                fontWeight: "bold",
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              여기서 끝
            </span>
          </div>
        </AbsoluteFill>
      </div>

      {/* 핵심 메시지 — 하단 크게 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: SAFE.side,
          right: SAFE.side,
          textAlign: "center",
          opacity: msgOpacity,
          transform: `scale(${msgScale})`,
        }}
      >
        <p
          style={{
            color: P.text,
            fontSize: 76,
            fontWeight: "bold",
            margin: 0,
            lineHeight: 1.5,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          꺼내기 전부터
        </p>
        <p
          style={{
            color: P.accent,
            fontSize: 100,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          잘립니다
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면3: 전환 — 벽 앞을 준비하자 ==========
const PrepareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 벽이 있고, 그 앞에 공간이 넓게 열림
  const spaceOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 왼쪽 공간에 빛이 채워짐
  const glowProgress = interpolate(frame, [1.5 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // 키워드
  const kw1Opacity = interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kw2Opacity = interpolate(frame, [4.5 * fps, 5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kw2Scale = spring({
    frame: Math.max(0, frame - 4.5 * fps),
    fps,
    config: { damping: 12 },
  });

  // 하단 제목
  const titleOpacity = interpolate(frame, [6.5 * fps, 7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />

      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0, opacity: spaceOpacity }}
      >
        {/* 벽 — 오른쪽에 세로선 */}
        <rect
          x={780}
          y={200}
          width={8}
          height={1520}
          rx={4}
          fill={P.sub}
          opacity={0.2}
        />

        {/* 벽 앞 공간 — 빛나는 영역 */}
        <rect
          x={60}
          y={200}
          width={720 * glowProgress}
          height={1520}
          rx={20}
          fill={P.accent}
          opacity={0.03}
        />

        {/* 영역 테두리 */}
        <rect
          x={60}
          y={200}
          width={720}
          height={1520}
          rx={20}
          fill="none"
          stroke={P.accent}
          strokeWidth={1}
          opacity={0.1 * glowProgress}
          strokeDasharray="20 10"
        />
      </svg>

      {/* "보험 얘기 전" 영역 표시 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 120,
          left: SAFE.side + 40,
          opacity: kw1Opacity,
        }}
      >
        <p
          style={{
            color: P.sub,
            fontSize: 52,
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          보험 얘기 전,
        </p>
        <p
          style={{
            color: P.text,
            fontSize: 72,
            fontWeight: "bold",
            margin: "8px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          이 공간을 준비하자
        </p>
      </div>

      {/* 중앙 큰 키워드 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity: kw2Opacity,
            transform: `scale(${kw2Scale})`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: P.accent,
              fontSize: 160,
              fontWeight: "bold",
              margin: 0,
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            준비
          </p>
        </div>
      </AbsoluteFill>

      {/* 하단 타이틀 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
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
          라이프링크 컨설팅
        </p>
        <p
          style={{
            color: P.text,
            fontSize: 64,
            fontWeight: "bold",
            margin: "12px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          잘리지 않는 준비
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 메인 ==========
export const LifeLink: React.FC = () => {
  const FADE = 15;
  const GAP = 21;
  const S1 = 10 * 30 + GAP;
  const S2 = 9 * 30 + GAP;
  const S3 = 9 * 30 + 75;  // + 여유

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <FadingConsultingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <WallScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <PrepareScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
