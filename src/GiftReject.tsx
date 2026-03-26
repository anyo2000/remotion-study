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

// ===== 팔레트 (LifeLink와 동일) =====
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

const SAFE = { top: 150, bottom: 170, side: 60 };

// ========== 장면1: 옛날 — 선물 10개 쌓이면 계약 ==========
const OldWayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 선물 박스 8개가 하나씩 날아와서 쌓임 (10번 받으면 → 개념적으로)
  const gifts = Array.from({ length: 8 }, (_, i) => i);
  const giftSize = 160;
  const stackX = 540;
  const stackBaseY = 1500;

  const allStacked = frame > 1 * fps + 8 * 12 + 15;
  const checkOpacity = allStacked
    ? interpolate(frame, [1 * fps + 8 * 12 + 15, 1 * fps + 8 * 12 + 30], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;
  const checkScale = allStacked
    ? spring({
        frame: Math.max(0, frame - (1 * fps + 8 * 12 + 15)),
        fps,
        config: { damping: 8 },
      })
    : 0;

  const currentCount = Math.min(
    10,
    Math.max(0, Math.ceil((frame - 1 * fps) / 12 * (10 / 8)))
  );

  return (
    <AbsoluteFill>
      <Background />

      {/* 타이틀 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <p
          style={{
            color: P.sub,
            fontSize: 64,
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          예전에는
        </p>
      </div>

      {/* 쌓이는 선물 박스들 */}
      {gifts.map((_, i) => {
        const delay = 1 * fps + i * 12;
        const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 200 },
        });

        const col = i % 2;
        const row = Math.floor(i / 2);
        const gap = 30;
        const totalW = 2 * giftSize + gap;
        const x = stackX - totalW / 2 + col * (giftSize + gap) + giftSize / 2;
        const y = stackBaseY - row * (giftSize + gap);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - giftSize / 2,
              top: y - giftSize / 2,
              width: giftSize,
              height: giftSize,
              opacity,
              transform: `scale(${scale})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: giftSize * 0.7 }}>🎁</span>
          </div>
        );
      })}

      {/* 카운터 */}
      {currentCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: SAFE.top + 240,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: P.text,
              fontSize: 120,
              fontWeight: "bold",
              fontVariantNumeric: "tabular-nums",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            {Math.min(currentCount, 10)}
          </span>
          <span
            style={{
              color: P.sub,
              fontSize: 64,
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            {" "}/ 10
          </span>
        </div>
      )}

      {/* 체크 — 계약! */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 420,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 96,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          계약
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 장면2: "아니요" — 전부 날아감 ==========
const RejectScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "아니요" — 음성에서 "이런 거 갖고 오지 말라고" 쯤 (~3초)
  const noDelay = 3 * fps;
  const noScale = spring({
    frame: Math.max(0, frame - noDelay),
    fps,
    config: { damping: 8 },
  });
  const noOpacity = interpolate(frame, [noDelay, noDelay + 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 선물들이 튕겨나감
  const rejectGifts = Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * Math.PI * 2 + Math.random() * 0.5,
    speed: 400 + Math.random() * 300,
    size: 60 + Math.random() * 50,
    delay: noDelay + 0.5 * fps + i * 4,
  }));

  // 방어막 원 — 장면 시작부터 서서히 (분위기 연출, 정보 아님)
  const shieldOpacity = interpolate(frame, [0.5 * fps, 2 * fps], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shieldScale = spring({
    frame: Math.max(0, frame - 0.5 * fps),
    fps,
    config: { damping: 200 },
  });

  // 경계심 키워드 — "경계심이 세요" 쯤 (~6초)
  const kwOpacity = interpolate(frame, [6 * fps, 6.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 하단 질문 — "왜 나한테 도움 되지 않는 걸" (~8초)
  const qOpacity = interpolate(frame, [8 * fps, 8.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />

      {/* 방어막 원 */}
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 960 - 250,
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `2px solid ${P.accent}`,
          opacity: shieldOpacity,
          transform: `scale(${shieldScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 350,
          top: 960 - 350,
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: `1px solid ${P.accent}`,
          opacity: shieldOpacity * 0.5,
          transform: `scale(${shieldScale})`,
        }}
      />

      {/* 튕겨나가는 선물들 */}
      {rejectGifts.map((gift, i) => {
        const rejectProgress = frame > gift.delay
          ? interpolate(frame, [gift.delay, gift.delay + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            })
          : 0;

        const gx = 540 + Math.cos(gift.angle) * gift.speed * rejectProgress;
        const gy = 960 + Math.sin(gift.angle) * gift.speed * rejectProgress;
        const gOpacity = rejectProgress > 0
          ? interpolate(rejectProgress, [0, 0.2, 0.8, 1], [0, 0.6, 0.4, 0], {
              extrapolateRight: "clamp",
            })
          : 0;
        const gRotate = rejectProgress * 180;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gx - gift.size / 2,
              top: gy - gift.size / 2,
              opacity: gOpacity,
              transform: `rotate(${gRotate}deg)`,
              fontSize: gift.size,
              lineHeight: 1,
            }}
          >
            🎁
          </div>
        );
      })}

      {/* 방어막 중앙 — 손바닥 이모지 */}
      <div
        style={{
          position: "absolute",
          left: 540 - 100,
          top: 960 - 100,
          opacity: interpolate(frame, [1 * fps, 2.5 * fps], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${shieldScale})`,
          fontSize: 200,
          lineHeight: 1,
        }}
      >
        🤚
      </div>

      {/* "아니요" */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            opacity: noOpacity,
            transform: `scale(${noScale}) translateY(-280px)`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: P.text,
              fontSize: 160,
              fontWeight: "bold",
              margin: 0,
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            아니요
          </p>
        </div>
      </AbsoluteFill>

      {/* 경계심 */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: kwOpacity,
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
          경계심
        </p>
      </div>

      {/* 하단 질문 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 200,
          left: SAFE.side,
          right: SAFE.side,
          textAlign: "center",
          opacity: qOpacity,
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
          도움 안 되는 걸
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
          왜 나한테 주지?
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== 메인 ==========
export const GiftReject: React.FC = () => {
  const FADE = 15;
  const GAP = 21;
  // 음성 길이: 파트1 ~11초(330f), 파트2 ~10.4초(312f) + 여유
  const S1 = 330 + GAP;
  const S2 = 330 + 75;     // + 여유

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <OldWayScene />
          <Audio src={staticFile("audio/gift-01-oldway.mp3")} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <RejectScene />
          <Audio src={staticFile("audio/gift-02-reject.mp3")} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
