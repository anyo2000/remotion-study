import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const C = {
  bg: "#0c1117",
  white: "#f0f0f0",
  muted: "#6b7280",
  accent: "#7cb3e0",
  highlight: "#e8943a",
  cardBg: "rgba(255, 255, 255, 0.05)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
};

// Safe Zone: 모바일 9:16 기준
const SAFE = {
  top: 150,
  bottom: 170,
  side: 60,
};

const Background: React.FC<{ glow?: { x: string; y: string; color: string } }> = ({
  glow = { x: "50%", y: "40%", color: "rgba(124, 179, 224, 0.08)" },
}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: C.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at ${glow.x} ${glow.y}, ${glow.color}, transparent)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%)",
      }}
    />
  </AbsoluteFill>
);

// Safe Zone 래퍼
const SafeArea: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE.top,
      paddingBottom: SAFE.bottom,
      paddingLeft: SAFE.side,
      paddingRight: SAFE.side,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ========== 장면1: 가입자 현황 ==========
const MembersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 30, stiffness: 40 },
  });
  const count = Math.round(countProgress * 4000);

  const labelOpacity = interpolate(frame, [fps * 1.5, fps * 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const generations = [
    { label: "1세대", ratio: 0.28, delay: fps * 4 },
    { label: "2세대", ratio: 0.26, delay: fps * 4.6 },
    { label: "3세대", ratio: 0.24, delay: fps * 5.2 },
    { label: "4세대", ratio: 0.22, delay: fps * 5.8 },
  ];

  const chartOpacity = interpolate(frame, [fps * 3.5, fps * 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const msgOpacity = interpolate(frame, [fps * 9, fps * 9.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background glow={{ x: "50%", y: "30%", color: "rgba(124, 179, 224, 0.07)" }} />
      <SafeArea
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* 타이틀 */}
        <p style={{ color: C.accent, fontSize: 48, margin: 0, marginBottom: 20 }}>
          실손보험 가입자
        </p>

        {/* 숫자 카운트업 */}
        <div style={{ marginBottom: 12, textAlign: "center" }}>
          <span
            style={{
              color: C.white,
              fontSize: 200,
              fontWeight: "bold",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count.toLocaleString()}
          </span>
        </div>
        <div style={{ opacity: labelOpacity, marginBottom: 80 }}>
          <span style={{ color: C.accent, fontSize: 72, fontWeight: "bold" }}>만 명</span>
        </div>

        {/* 세대별 차트 */}
        <div
          style={{
            opacity: chartOpacity,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {generations.map((gen, i) => {
            const barProgress = spring({
              frame: Math.max(0, frame - gen.delay),
              fps,
              from: 0,
              to: 1,
              config: { damping: 15 },
            });

            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span
                  style={{
                    color: C.white,
                    fontSize: 48,
                    fontWeight: "bold",
                    width: 160,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {gen.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 56,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${barProgress * gen.ratio * 100}%`,
                      height: "100%",
                      backgroundColor: C.accent,
                      borderRadius: 12,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span
                  style={{
                    color: C.white,
                    fontSize: 48,
                    fontVariantNumeric: "tabular-nums",
                    width: 110,
                    flexShrink: 0,
                  }}
                >
                  {Math.round(barProgress * gen.ratio * 100)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* 메시지 */}
        <div style={{ opacity: msgOpacity, marginTop: 56, textAlign: "center" }}>
          <p style={{ color: C.white, fontSize: 48, margin: 0 }}>
            고르게 분포되어 있습니다
          </p>
        </div>
      </SafeArea>
    </AbsoluteFill>
  );
};

// ========== 장면2: 재가입 도래 ==========
const ReentryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const timelineOpacity = interpolate(frame, [fps * 2, fps * 2.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowProgress = spring({
    frame: Math.max(0, frame - fps * 2.5),
    fps,
    from: 0,
    to: 1,
    config: { damping: 15 },
  });

  const months = [
    { label: "7월", value: 1900, delay: fps * 7 },
    { label: "8월", value: 2500, delay: fps * 8 },
    { label: "9월", value: 3400, delay: fps * 9 },
    { label: "10월", value: 4600, delay: fps * 10 },
  ];
  const graphOpacity = interpolate(frame, [fps * 6, fps * 6.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const industryOpacity = interpolate(frame, [fps * 14, fps * 14.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const industryScale = spring({
    frame: Math.max(0, frame - fps * 14),
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 10 },
  });

  const bigOpacity = interpolate(frame, [fps * 17, fps * 17.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background glow={{ x: "50%", y: "40%", color: "rgba(124, 179, 224, 0.06)" }} />
      <SafeArea
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* 타이틀 */}
        <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: C.muted, fontSize: 48, margin: 0, marginBottom: 8 }}>
            5년 재가입 도래
          </p>
          <p style={{ color: C.white, fontSize: 80, fontWeight: "bold", margin: 0 }}>
            재가입 시기
          </p>
        </div>

        {/* 타임라인 */}
        <div
          style={{
            opacity: timelineOpacity,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 16,
              padding: "16px 28px",
              textAlign: "center",
            }}
          >
            <p style={{ color: C.muted, fontSize: 42, margin: 0 }}>가입</p>
            <p style={{ color: C.white, fontSize: 52, fontWeight: "bold", margin: 0 }}>
              '21.7
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: arrowProgress * 80, height: 3, backgroundColor: C.accent, borderRadius: 2 }} />
            <span style={{ color: C.accent, fontSize: 48, opacity: arrowProgress }}>→</span>
          </div>

          <div
            style={{
              backgroundColor: C.cardBg,
              border: `2px solid ${C.accent}`,
              borderRadius: 16,
              padding: "16px 28px",
              textAlign: "center",
            }}
          >
            <p style={{ color: C.muted, fontSize: 42, margin: 0 }}>재가입</p>
            <p style={{ color: C.accent, fontSize: 52, fontWeight: "bold", margin: 0 }}>
              '26.7
            </p>
          </div>
        </div>

        {/* 막대 그래프 */}
        <div
          style={{
            opacity: graphOpacity,
            display: "flex",
            alignItems: "flex-end",
            gap: 28,
            height: 360,
            marginBottom: 24,
          }}
        >
          {months.map((m, i) => {
            const barProgress = spring({
              frame: Math.max(0, frame - m.delay),
              fps,
              from: 0,
              to: 1,
              config: { damping: 12 },
            });
            const maxH = 240;
            const barH = barProgress * (m.value / 4600) * maxH;
            const isLast = i === months.length - 1;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: isLast ? C.highlight : C.white,
                    fontSize: 44,
                    fontWeight: "bold",
                    fontVariantNumeric: "tabular-nums",
                    opacity: barProgress,
                  }}
                >
                  {Math.round(barProgress * m.value).toLocaleString()}
                </span>
                <div
                  style={{
                    width: 120,
                    height: barH,
                    backgroundColor: isLast ? C.highlight : "rgba(124, 179, 224, 0.3)",
                    borderRadius: 12,
                    opacity: isLast ? 0.9 : 0.6,
                  }}
                />
                <span style={{ color: C.muted, fontSize: 44 }}>{m.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ opacity: graphOpacity, marginBottom: 24 }}>
          <span style={{ color: C.muted, fontSize: 44 }}>우리 회사 기준</span>
        </div>

        {/* 전 업계 */}
        <div
          style={{
            opacity: industryOpacity,
            transform: `scale(${industryScale})`,
            textAlign: "center",
          }}
        >
          <p style={{ color: C.white, fontSize: 52, fontWeight: "bold", margin: 0 }}>
            전 업계로 보면?
          </p>
        </div>

        <div style={{ opacity: bigOpacity, marginTop: 16, textAlign: "center" }}>
          <p style={{ color: C.accent, fontSize: 56, fontWeight: "bold", margin: 0 }}>
            어마어마한 숫자
          </p>
        </div>
      </SafeArea>
    </AbsoluteFill>
  );
};

// ========== 장면3: 고객 질문 ==========
const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubble1Opacity = interpolate(frame, [fps * 1, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bubble1Y = spring({
    frame: Math.max(0, frame - fps * 1),
    fps,
    from: 20,
    to: 0,
    config: { damping: 12 },
  });

  const keywordOpacity = interpolate(frame, [fps * 4, fps * 4.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const closingOpacity = interpolate(frame, [fps * 7, fps * 7.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const closingY = spring({
    frame: Math.max(0, frame - fps * 7),
    fps,
    from: 20,
    to: 0,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <Background glow={{ x: "50%", y: "35%", color: "rgba(232, 148, 58, 0.05)" }} />
      <SafeArea
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* 고객 말풍선 */}
        <div
          style={{
            opacity: bubble1Opacity,
            transform: `translateY(${bubble1Y}px)`,
            marginBottom: 80,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 32 }}>👤</span>
            </div>
            <span style={{ color: C.muted, fontSize: 48 }}>고객</span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: `1px solid rgba(255, 255, 255, 0.12)`,
              borderRadius: 28,
              borderTopLeftRadius: 4,
              padding: "48px 56px",
            }}
          >
            <p
              style={{
                color: C.white,
                fontSize: 68,
                fontWeight: "bold",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              "내 실손은
              <br />
              어떻게 되는 거야?"
            </p>
          </div>
        </div>

        {/* 그 질문을 받는 사람이 */}
        <div style={{ opacity: keywordOpacity, marginBottom: 36, textAlign: "center" }}>
          <p style={{ color: C.muted, fontSize: 48, margin: 0 }}>
            그 질문을 받는 사람이
          </p>
        </div>

        {/* 여러분이었으면 좋겠습니다 */}
        <div
          style={{
            opacity: closingOpacity,
            transform: `translateY(${closingY}px)`,
            textAlign: "center",
          }}
        >
          <p style={{ color: C.highlight, fontSize: 80, fontWeight: "bold", margin: 0, marginBottom: 16 }}>
            여러분이었으면
          </p>
          <p style={{ color: C.white, fontSize: 80, fontWeight: "bold", margin: 0 }}>
            좋겠습니다
          </p>
        </div>
      </SafeArea>
    </AbsoluteFill>
  );
};

// ========== 메인 컴포지션 ==========
export const MyComposition: React.FC = () => {
  const FADE = 15; // 장면 전환 페이드 (0.5초)
  const GAP = 21;  // 장면 사이 쉼 (0.7초)
  const S1 = 378 + GAP;
  const S2 = 640 + GAP;
  const S3 = 336;

  return (
    <AbsoluteFill>
      <Background />

      {/* 음성 — 각 장면 시작에 맞춤 (페이드 후 재생) */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <MembersScene />
          <Audio src={staticFile("audio/01-members.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <ReentryScene />
          <Audio src={staticFile("audio/02-reentry.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <QuestionScene />
          <Audio src={staticFile("audio/03-question.mp3")} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
