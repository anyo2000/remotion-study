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

// 두괄식 헤드라인 컴포넌트
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

// ========== 장면1: 만남을 꺼림 ==========
const AvoidScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 사람들이 중앙에서 멀어짐
  const people = [
    { angle: 0 },
    { angle: 60 },
    { angle: 120 },
    { angle: 180 },
    { angle: 240 },
    { angle: 300 },
  ];

  const spreadProgress = interpolate(frame, [2 * fps, 7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const lineOpacity = interpolate(spreadProgress, [0.3, 0.8], [0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 📱 (~8초)
  const phoneOpacity = interpolate(frame, [8 * fps, 8.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneScale = spring({
    frame: Math.max(0, frame - 8 * fps),
    fps,
    config: { damping: 200 },
  });

  // 하단 "습관이 됐다" (~12초)
  const kwOpacity = interpolate(frame, [12 * fps, 12.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = 540;
  const cy = 860;
  const minR = 120;
  const maxR = 420;

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="만남을 꺼림" opacity={headlineOpacity} />

      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {people.map((p, i) => {
          const r = minR + spreadProgress * (maxR - minR);
          const rad = (p.angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * r;
          const y = cy + Math.sin(rad) * r;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={P.sub}
              strokeWidth={2}
              opacity={lineOpacity}
              strokeDasharray="8 6"
            />
          );
        })}
      </svg>

      {people.map((p, i) => {
        const r = minR + spreadProgress * (maxR - minR);
        const rad = (p.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;

        const enterOpacity = interpolate(frame, [0.5 * fps + i * 6, 1 * fps + i * 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(spreadProgress, [0.6, 1], [1, 0.3], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 60,
              top: y - 60,
              fontSize: 120,
              opacity: enterOpacity * fadeOut,
              lineHeight: 1,
            }}
          >
            👤
          </div>
        );
      })}

      {/* 📱 중앙 */}
      <div
        style={{
          position: "absolute",
          left: cx - 80,
          top: cy - 80,
          fontSize: 160,
          opacity: phoneOpacity,
          transform: `scale(${phoneScale})`,
          lineHeight: 1,
        }}
      >
        📱
      </div>

      {/* 하단 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: kwOpacity,
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
          비대면이
        </p>
        <p
          style={{
            color: P.text,
            fontSize: 80,
            fontWeight: "bold",
            margin: "8px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          습관이 됐다
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면2: 의리가입 종말 ==========
const LoyaltyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 두 사람 연결 → 끊어짐 (~5초)
  const breakProgress = interpolate(frame, [5 * fps, 6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // 💰 "5만원" (~7초)
  const moneyOpacity = interpolate(frame, [7 * fps, 7.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leaveX = breakProgress * 250;

  // 하단 "여유가 없어졌다" (~11초)
  const msgOpacity = interpolate(frame, [11 * fps, 11.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const personY = 820;

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="의리가입 종말" opacity={headlineOpacity} />

      {/* 연결선 */}
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {breakProgress < 1 && (
          <line
            x1={380}
            y1={personY}
            x2={700 + leaveX}
            y2={personY}
            stroke={breakProgress > 0 ? P.sub : P.accent}
            strokeWidth={3}
            opacity={breakProgress > 0 ? 0.2 : 0.5}
            strokeDasharray={breakProgress > 0 ? "12 8" : "none"}
          />
        )}
      </svg>

      {/* 🧑‍💼 남아있는 사람 */}
      <div
        style={{
          position: "absolute",
          left: 260,
          top: personY - 80,
          fontSize: 160,
          lineHeight: 1,
        }}
      >
        🧑‍💼
      </div>

      {/* 🚶 떠나는 사람 */}
      <div
        style={{
          position: "absolute",
          left: 620 + leaveX,
          top: personY - 80,
          fontSize: 160,
          lineHeight: 1,
          opacity: 1 - breakProgress * 0.5,
        }}
      >
        🚶
      </div>

      {/* 💰 금액 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: personY + 140,
          textAlign: "center",
          opacity: moneyOpacity,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 96,
            fontWeight: "bold",
            margin: 0,
            fontVariantNumeric: "tabular-nums",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          -5만원
        </p>
      </div>

      {/* 하단 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: 0,
          right: 0,
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
          그만큼의
        </p>
        <p
          style={{
            color: P.text,
            fontSize: 80,
            fontWeight: "bold",
            margin: "8px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          여유가 없어졌다
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면3: SFP ==========
const SfpScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 😤 등장 (~2초)
  const hostileOpacity = interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hostileScale = spring({
    frame: Math.max(0, frame - 1.5 * fps),
    fps,
    config: { damping: 200 },
  });

  // "만나기도 전부터 적대적" (~4초)
  const kwOpacity = interpolate(frame, [4 * fps, 4.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 결론 (~7초)
  const conclusionOpacity = interpolate(frame, [7 * fps, 7.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const conclusionScale = spring({
    frame: Math.max(0, frame - 7 * fps),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="SFP의 현실" opacity={headlineOpacity} />

      {/* 😤 크게 */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            opacity: hostileOpacity,
            transform: `scale(${hostileScale})`,
            fontSize: 280,
            lineHeight: 1,
            marginTop: -100,
          }}
        >
          😤
        </div>
      </AbsoluteFill>

      {/* "적대적" */}
      <div
        style={{
          position: "absolute",
          top: 1100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: kwOpacity,
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
          만나기도 전부터
        </p>
        <p
          style={{
            color: P.text,
            fontSize: 96,
            fontWeight: "bold",
            margin: "8px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          적대적
        </p>
      </div>

      {/* 결론 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 150,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: conclusionOpacity,
          transform: `scale(${conclusionScale})`,
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
          새로운 컨설팅이 필요하다
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 메인 ==========
export const ColdWall: React.FC = () => {
  const FADE = 15;
  const GAP = 21;
  const S1 = 460 + GAP;
  const S2 = 445 + GAP;
  const S3 = 330 + 75;     // + 여유

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <AvoidScene />
          <Audio src={staticFile("audio/cold-01-avoid.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <LoyaltyScene />
          <Audio src={staticFile("audio/cold-02-loyalty.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <SfpScene />
          <Audio src={staticFile("audio/cold-03-sfp.mp3")} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
