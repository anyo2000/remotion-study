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

// ========== 장면1: 경계심을 무너뜨려라 ==========
const ConnectScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 🔗 → 🩺 흐름 (연결 → 진단)
  const chainOpacity = interpolate(frame, [0.8 * fps, 1.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chainScale = spring({
    frame: Math.max(0, frame - 0.8 * fps),
    fps,
    config: { damping: 200 },
  });

  // 핵심 키워드 (~2.5초)
  const kwOpacity = interpolate(frame, [2.5 * fps, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kwScale = spring({
    frame: Math.max(0, frame - 2.5 * fps),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="첫 번째, 연결" opacity={headlineOpacity} />

      {/* 🔗 → 🩺 */}
      <div
        style={{
          position: "absolute",
          top: 550,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
          opacity: chainOpacity,
          transform: `scale(${chainScale})`,
        }}
      >
        <span style={{ fontSize: 160, lineHeight: 1 }}>🔗</span>
        <span style={{ color: P.sub, fontSize: 80 }}>→</span>
        <span style={{ fontSize: 160, lineHeight: 1 }}>🩺</span>
      </div>

      {/* 핵심 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 300,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: kwOpacity,
          transform: `scale(${kwScale})`,
        }}
      >
        <p
          style={{
            color: P.text,
            fontSize: 80,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          경계심을
        </p>
        <p
          style={{
            color: P.accent,
            fontSize: 100,
            fontWeight: "bold",
            margin: "8px 0 0 0",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          무너뜨려라
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면2: 선입견 — "보장 분석" 금지 ==========
const PrejudiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 화법 말풍선 등장 (~2초)
  const bubbleOpacity = interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bubbleScale = spring({
    frame: Math.max(0, frame - 2 * fps),
    fps,
    config: { damping: 200 },
  });

  // ❌ 금지선 등장 (~4초)
  const xOpacity = interpolate(frame, [4 * fps, 4.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xScale = spring({
    frame: Math.max(0, frame - 4 * fps),
    fps,
    config: { damping: 8 },
  });

  // 선입견 쏟아짐 (~7초)
  const prejudices = ["보험 팔겠지", "부담 주겠지", "또 영업이지"];
  const prejudiceStart = 7 * fps;

  // "안 만나지" 결론 (~11초)
  const conclusionOpacity = interpolate(frame, [11 * fps, 11.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="선입견" opacity={headlineOpacity} />

      {/* 말풍선 — "보장 분석 해드리려고요" */}
      <div
        style={{
          position: "absolute",
          top: 450,
          left: SAFE.side + 40,
          right: SAFE.side + 40,
          opacity: bubbleOpacity,
          transform: `scale(${bubbleScale})`,
        }}
      >
        <div
          style={{
            backgroundColor: P.card,
            border: `1px solid ${P.cardBorder}`,
            borderRadius: 28,
            padding: "40px 52px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: P.text,
              fontSize: 64,
              fontWeight: "bold",
              margin: 0,
              fontFamily: "Pretendard, sans-serif",
              lineHeight: 1.4,
            }}
          >
            "보장 분석
            <br />
            해드리려고요"
          </p>
        </div>
      </div>

      {/* ❌ */}
      <div
        style={{
          position: "absolute",
          top: 440,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: xOpacity,
          transform: `scale(${xScale})`,
          fontSize: 280,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        ❌
      </div>

      {/* 선입견들 */}
      {prejudices.map((text, i) => {
        const delay = prejudiceStart + i * 15;
        const pOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const pY = spring({
          frame: Math.max(0, frame - delay),
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
              top: 900 + i * 100,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: pOpacity,
              transform: `translateY(${pY}px)`,
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
              "{text}"
            </p>
          </div>
        );
      })}

      {/* 결론 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: conclusionOpacity,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 80,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          안 만나지
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면3: 팔짱 — 틈을 안 보인다 ==========
const ArmsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 🙅 등장 (~1.5초)
  const emojiOpacity = interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const emojiScale = spring({
    frame: Math.max(0, frame - 1.5 * fps),
    fps,
    config: { damping: 200 },
  });

  // "절대 넘어가지 말아야지" (~3.5초)
  const thoughtOpacity = interpolate(frame, [3.5 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "그러면 안 돼요" (~6초)
  const noOpacity = interpolate(frame, [6 * fps, 6.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const noScale = spring({
    frame: Math.max(0, frame - 6 * fps),
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <Background />
      <Headline text="만나도" opacity={headlineOpacity} />

      {/* 🙅 크게 */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            opacity: emojiOpacity,
            transform: `scale(${emojiScale})`,
            fontSize: 280,
            lineHeight: 1,
            marginTop: -150,
          }}
        >
          🙅
        </div>
      </AbsoluteFill>

      {/* 생각 — "넘어가지 말아야지" */}
      <div
        style={{
          position: "absolute",
          top: 1050,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: thoughtOpacity,
        }}
      >
        <p
          style={{
            color: P.sub,
            fontSize: 64,
            margin: 0,
            fontStyle: "italic",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          "절대 넘어가지 말아야지"
        </p>
      </div>

      {/* "그러면 안 돼요" */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: noOpacity,
          transform: `scale(${noScale})`,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 88,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          그러면 안 돼요
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 메인 ==========
export const GuardDown: React.FC = () => {
  const FADE = 15;
  const GAP = 21;
  const S1 = 150 + GAP;   // 4.6초
  const S2 = 450 + GAP;   // 14.6초
  const S3 = 265 + 75;     // 8.4초 + 여유

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <ConnectScene />
          <Audio src={staticFile("audio/guard-01-connect.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <PrejudiceScene />
          <Audio src={staticFile("audio/guard-02-prejudice.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <ArmsScene />
          <Audio src={staticFile("audio/guard-03-arms.mp3")} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
