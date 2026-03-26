import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Audio,
  staticFile,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const P = {
  bg: "#0c1117",
  card: "rgba(255, 255, 255, 0.06)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  text: "#f0f0f0",
  sub: "#9ca3af",
  accent: "#5b9bd5",
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

const Headline: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div
    style={{
      position: "absolute",
      top: SAFE.top + 40,
      left: 0,
      right: 0,
      textAlign: "center",
      opacity,
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
      {text}
    </p>
  </div>
);

// ========== 장면1: 캐스케이드 — 가벼운 톤 ==========
const CascadeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 단계별 Q&A가 쌓임
  const steps = [
    { q: "임신하면?", a: "축하금 💰", delay: 1 * fps },
    { q: "임신 안 하면?", a: "난임 치료 🏥", delay: 3 * fps },
    { q: "결혼 계획 없으면?", a: "", delay: 5.5 * fps },
  ];

  // "상관없어요" (~7초)
  const punchOpacity = interpolate(frame, [7 * fps, 7.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punchScale = spring({
    frame: Math.max(0, frame - 7 * fps),
    fps,
    config: { damping: 8 },
  });

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="어떤 상황이든" opacity={headlineOpacity} />

      {/* Q&A 단계들 */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: SAFE.side + 20,
          right: SAFE.side + 20,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {steps.map((step, i) => {
          const stepOpacity = interpolate(
            frame,
            [step.delay, step.delay + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const stepY = spring({
            frame: Math.max(0, frame - step.delay),
            fps,
            from: 20,
            to: 0,
            config: { damping: 200 },
          });

          return (
            <div
              key={i}
              style={{
                opacity: stepOpacity,
                transform: `translateY(${stepY}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              {/* 질문 */}
              <div
                style={{
                  backgroundColor: P.card,
                  border: `1px solid ${P.cardBorder}`,
                  borderRadius: 20,
                  padding: "24px 36px",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    color: P.text,
                    fontSize: 56,
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  {step.q}
                </span>
              </div>

              {/* 답 */}
              {step.a && (
                <>
                  <span style={{ color: P.sub, fontSize: 56 }}>→</span>
                  <span
                    style={{
                      color: P.accent,
                      fontSize: 56,
                      fontWeight: "bold",
                      fontFamily: "Pretendard, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.a}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* "상관없어요" — 크게 바운스 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 250,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: punchOpacity,
          transform: `scale(${punchScale})`,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 120,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          상관없어요
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면2: 화법은 미끼 — 정돈 톤 ==========
const MethodScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 화법 카드들 — 하나씩 등장
  const hooks = ["화법 1", "화법 2", "화법 3"];

  // "던진다" 키워드 (~6초)
  const throwOpacity = interpolate(frame, [6 * fps, 6.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 걸린다 → 상담 (~8초)
  const catchOpacity = interpolate(frame, [8 * fps, 8.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const catchScale = spring({
    frame: Math.max(0, frame - 8 * fps),
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="화법은 미끼" opacity={headlineOpacity} />

      {/* 화법 카드들 */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {hooks.map((hook, i) => {
          const delay = 1.5 * fps + i * fps * 0.6;
          const cardOpacity = interpolate(
            frame,
            [delay, delay + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const cardScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 200 },
          });

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                backgroundColor: P.card,
                border: `1px solid ${P.cardBorder}`,
                borderRadius: 20,
                padding: "36px 40px",
                textAlign: "center",
                width: 240,
              }}
            >
              <span style={{ fontSize: 80, lineHeight: 1 }}>🪝</span>
              <p
                style={{
                  color: P.sub,
                  fontSize: 52,
                  margin: "16px 0 0 0",
                  fontFamily: "Pretendard, sans-serif",
                }}
              >
                {hook}
              </p>
            </div>
          );
        })}
      </div>

      {/* "대화 중에 던진다" */}
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: throwOpacity,
        }}
      >
        <p
          style={{
            color: P.text,
            fontSize: 72,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          대화 중에 던진다
        </p>
      </div>

      {/* "걸리면 → 상담" */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 250,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: catchOpacity,
          transform: `scale(${catchScale})`,
        }}
      >
        <p
          style={{
            color: P.sub,
            fontSize: 60,
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          혹해서 걸리면
        </p>
        <p
          style={{
            color: P.accent,
            fontSize: 88,
            fontWeight: "bold",
            margin: "12px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          상담이 된다
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면3: 흐름 위주로 — 가벼운 마무리 ==========
const FlowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 흐름 화살표 — 세로로
  const arrows = ["연결", "진단", "화법", "상담"];
  const arrowStart = 2 * fps;

  // 하단 메시지 (~8초)
  const msgOpacity = interpolate(frame, [8 * fps, 8.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="오늘은 흐름" opacity={headlineOpacity} />

      {/* 흐름 화살표 */}
      <div
        style={{
          position: "absolute",
          top: 450,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {arrows.map((label, i) => {
          const delay = arrowStart + i * fps * 0.6;
          const itemOpacity = interpolate(
            frame,
            [delay, delay + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const itemY = spring({
            frame: Math.max(0, frame - delay),
            fps,
            from: 20,
            to: 0,
            config: { damping: 200 },
          });

          return (
            <div key={i} style={{ opacity: itemOpacity, transform: `translateY(${itemY}px)`, textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: P.card,
                  border: `1px solid ${P.cardBorder}`,
                  borderRadius: 20,
                  padding: "28px 80px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    color: P.text,
                    fontSize: 64,
                    fontWeight: "bold",
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  {label}
                </span>
              </div>
              {i < arrows.length - 1 && (
                <p style={{ color: P.sub, fontSize: 52, margin: "8px 0", opacity: 0.5 }}>↓</p>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: SAFE.side,
          right: SAFE.side,
          textAlign: "center",
          opacity: msgOpacity,
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
          논리가 맞는지
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
          흐름 위주로 보세요
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 메인 ==========
export const HookTalk: React.FC = () => {
  const FADE = 15;
  const GAP = 21;
  const S1 = 270 + GAP;   // 8.7초
  const S2 = 345 + GAP;   // 11초
  const S3 = 375 + 75;     // 12초 + 여유

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <CascadeScene />
          <Audio src={staticFile("audio/hook-01-cascade.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <MethodScene />
          <Audio src={staticFile("audio/hook-02-method.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <FlowScene />
          <Audio src={staticFile("audio/hook-03-flow.mp3")} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
