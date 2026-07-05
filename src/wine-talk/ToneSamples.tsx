import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ─────────────────────────────────────────────
// YRC Wine Talk — 톤 샘플 3종 (A 블라인드 리빌 / B 키네틱 타이포 / C 필름 무드)
// 같은 카피(WINE 01 · 30만원 샴페인)를 세 가지 톤으로 비교
// ─────────────────────────────────────────────

const LABEL_FRAMES = 45;
const SAMPLE_FRAMES = 270;
export const TONE_SAMPLES_FRAMES = (LABEL_FRAMES + SAMPLE_FRAMES) * 3;

// ── 라벨 카드 (타이틀카드 규칙: 애니메이션 없이 즉시 표시) ──
const LabelCard: React.FC<{ tag: string; title: string; accent: string }> = ({
  tag,
  title,
  accent,
}) => (
  <AbsoluteFill
    style={{
      background: "#0E0E12",
      justifyContent: "center",
      alignItems: "center",
      gap: 36,
    }}
  >
    <div
      style={{
        fontSize: 58,
        fontWeight: 700,
        letterSpacing: 14,
        color: accent,
      }}
    >
      {tag}
    </div>
    <div
      style={{
        fontSize: 88,
        fontWeight: 800,
        color: "#F5F2EC",
        textAlign: "center",
        lineHeight: 1.3,
        whiteSpace: "pre",
      }}
    >
      {title}
    </div>
  </AbsoluteFill>
);

// ═════════════════════════════════════════════
// 안 A — 블라인드 리빌 · 미스터리 톤
// 딥네이비→버건디, 골드 포인트, 병 실루엣 + 리빌 티징
// ═════════════════════════════════════════════

const BottleShape: React.FC<{ fill: string }> = ({ fill }) => (
  <svg width="360" height="1120" viewBox="0 0 200 620">
    <path
      d="M85 10 L115 10 L115 150 C115 195 150 205 150 265 L150 560 C150 592 128 612 100 612 C72 612 50 592 50 560 L50 265 C50 205 85 195 85 150 Z"
      fill={fill}
    />
  </svg>
);

const SampleA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const GOLD = "#D9B36C";
  const CREAM = "#F1E9DC";

  // 병 등장
  const bottleUp = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const bottleY = interpolate(bottleUp, [0, 1], [260, 0]);

  // 상단 라벨
  const topOp = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "30만원" 팝
  const priceSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 11, mass: 0.8 },
  });
  const subOp = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 1위로 교체
  const priceOut = interpolate(frame, [130, 145], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rankSpring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 11, mass: 0.8 },
  });

  // 리빌 티징: 골드 병이 45%까지 드러났다가 다시 덮임
  const revealPct = interpolate(
    frame,
    [200, 232, 262],
    [0, 45, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const hookOp = interpolate(frame, [205, 222], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 90% at 50% 30%, #1A2338 0%, #101728 45%, #1C0D16 100%)",
        alignItems: "center",
      }}
    >
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          opacity: topOp,
          fontSize: 54,
          fontWeight: 500,
          letterSpacing: 10,
          color: "rgba(241,233,220,0.75)",
        }}
      >
        하얏트호텔 와인바
      </div>

      {/* 병 실루엣 + 리빌 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: "50%",
          transform: `translate(-50%, ${bottleY}px)`,
        }}
      >
        <div style={{ position: "relative" }}>
          <BottleShape fill="#05070D" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(${100 - revealPct}% 0 0 0)`,
            }}
          >
            <BottleShape fill={GOLD} />
          </div>
        </div>
      </div>

      {/* 30만원 */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: "50%",
          textAlign: "center",
          whiteSpace: "nowrap",
          opacity: priceOut,
          transform: `translateX(-50%) scale(${priceSpring})`,
        }}
      >
        <div
          style={{
            fontSize: 190,
            fontWeight: 900,
            color: GOLD,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.05,
          }}
        >
          30만원
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 600,
            color: CREAM,
            opacity: subOp,
            marginTop: 18,
          }}
        >
          샴페인
        </div>
      </div>

      {/* 블라인드 테스트 1위 */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: "50%",
          textAlign: "center",
          whiteSpace: "nowrap",
          transform: `translateX(-50%) scale(${rankSpring})`,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 500,
            color: "rgba(241,233,220,0.75)",
            marginBottom: 16,
          }}
        >
          점장 블라인드 테스트
        </div>
        <div
          style={{
            fontSize: 170,
            fontWeight: 900,
            color: GOLD,
            lineHeight: 1.05,
          }}
        >
          1위
        </div>
      </div>

      {/* 하단 훅 */}
      <div
        style={{
          position: "absolute",
          bottom: 230,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          opacity: hookOp,
          fontSize: 64,
          fontWeight: 700,
          color: CREAM,
        }}
      >
        정말 맛이 다를까? 👀
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════
// 안 B — 키네틱 타이포 · 통통 튀는 톤
// 파스텔 컬러블록 3연속, 글자가 주인공
// ═════════════════════════════════════════════

const SampleB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const INK = "#1F2430";

  // 블록 전환 (원형 와이프)
  const wipe2 = interpolate(frame, [85, 100], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipe3 = interpolate(frame, [175, 190], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 블록1: 30만원?!
  const tag1 = spring({ frame: frame - 5, fps, config: { damping: 13 } });
  const price = spring({
    frame: frame - 22,
    fps,
    config: { damping: 9, mass: 0.7 },
  });
  const emoji = spring({
    frame: frame - 45,
    fps,
    config: { damping: 8, mass: 0.6 },
  });

  // 블록2: 1위
  const l2a = spring({ frame: frame - 100, fps, config: { damping: 13 } });
  const l2b = spring({
    frame: frame - 122,
    fps,
    config: { damping: 8, mass: 0.7 },
  });

  // 블록3: 진짜 맛이 다를까?
  const l3a = spring({ frame: frame - 190, fps, config: { damping: 13 } });
  const l3b = spring({ frame: frame - 205, fps, config: { damping: 12 } });
  // 물음표 흔들림 (감쇠 — 등장 후 점점 잦아듦)
  const wiggleDecay = interpolate(frame, [195, 250], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wiggle = Math.sin((frame - 195) / 2.2) * 14 * wiggleDecay;

  return (
    <AbsoluteFill style={{ background: "#B8E6D5" }}>
      {/* 블록1 */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 30 }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: INK,
            background: "#FFFFFF",
            padding: "18px 44px",
            borderRadius: 60,
            transform: `scale(${tag1}) rotate(-3deg)`,
          }}
        >
          호텔 와인바 샴페인이
        </div>
        <div
          style={{
            fontSize: 230,
            fontWeight: 900,
            color: INK,
            lineHeight: 1.05,
            transform: `scale(${price}) rotate(-4deg)`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          30만원?!
        </div>
        <div
          style={{
            fontSize: 150,
            transform: `scale(${emoji}) rotate(12deg)`,
          }}
        >
          😳
        </div>
      </AbsoluteFill>

      {/* 블록2 */}
      <AbsoluteFill
        style={{
          background: "#FFB3A0",
          clipPath: `circle(${wipe2}% at 50% 50%)`,
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
        }}
      >
        <div
          style={{
            fontSize: 66,
            fontWeight: 800,
            color: INK,
            transform: `scale(${l2a}) rotate(2deg)`,
          }}
        >
          근데 블라인드 테스트
        </div>
        <div
          style={{
            fontSize: 260,
            fontWeight: 900,
            color: "#FFFFFF",
            textShadow: "8px 8px 0 rgba(31,36,48,0.9)",
            lineHeight: 1.05,
            transform: `scale(${l2b}) rotate(-5deg)`,
          }}
        >
          1위
        </div>
        <div style={{ fontSize: 120, transform: `scale(${l2b})` }}>🏆</div>
      </AbsoluteFill>

      {/* 블록3 */}
      <AbsoluteFill
        style={{
          background: "#CBB6F2",
          clipPath: `circle(${wipe3}% at 50% 50%)`,
          justifyContent: "center",
          alignItems: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: INK,
            lineHeight: 1.3,
            textAlign: "center",
            whiteSpace: "pre-line",
            transform: `scale(${l3a})`,
          }}
        >
          진짜 맛이
          {"\n"}다를까
          <span
            style={{
              display: "inline-block",
              transform: `rotate(${wiggle}deg)`,
              color: "#FFFFFF",
              textShadow: "6px 6px 0 rgba(31,36,48,0.9)",
            }}
          >
            ?
          </span>
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            color: INK,
            background: "#FFFFFF",
            padding: "20px 48px",
            borderRadius: 60,
            transform: `scale(${l3b}) rotate(2deg)`,
          }}
        >
          7월, 직접 확인 🍷
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════
// 안 C — 필름 무드 · 감성 시네마 톤
// 레터박스 + 필름그레인 + 슬로우 줌, 미니멀 자막
// ═════════════════════════════════════════════

const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.09,
        mixBlendMode: "overlay",
      }}
    >
      <filter id="wineGrain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          seed={frame % 40}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#wineGrain)" />
    </svg>
  );
};

const WineGlass: React.FC<{ winePct: number }> = ({ winePct }) => {
  // 볼 내부 와인 수위: winePct 0~1
  const wineTop = interpolate(winePct, [0, 1], [200, 120]);
  return (
    <svg width="460" height="720" viewBox="0 0 300 470">
      <defs>
        <clipPath id="bowlClip">
          <path d="M60 20 C60 130 100 175 142 183 L158 183 C200 175 240 130 240 20 Z" />
        </clipPath>
      </defs>
      {/* 와인 */}
      <rect
        x="50"
        y={wineTop}
        width="200"
        height={220}
        fill="#6B1F2E"
        clipPath="url(#bowlClip)"
      />
      {/* 볼 외곽 */}
      <path
        d="M60 20 C60 130 100 175 142 183 L158 183 C200 175 240 130 240 20 Z"
        fill="none"
        stroke="#C9A227"
        strokeWidth="3"
      />
      {/* 스템 + 베이스 */}
      <line x1="150" y1="183" x2="150" y2="400" stroke="#C9A227" strokeWidth="3" />
      <path
        d="M85 425 C85 410 115 402 150 402 C185 402 215 410 215 425"
        fill="none"
        stroke="#C9A227"
        strokeWidth="3"
      />
    </svg>
  );
};

const SampleC: React.FC = () => {
  const frame = useCurrentFrame();

  // 슬로우 줌 (시네마틱)
  const zoom = interpolate(frame, [0, SAMPLE_FRAMES], [1.06, 1.0]);

  // 와인 수위 서서히 상승
  const winePct = interpolate(frame, [25, 150], [0.12, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // 자막 3줄 교차 페이드
  const line1 = interpolate(frame, [30, 50, 105, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2 = interpolate(frame, [125, 145, 185, 198], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3 = interpolate(frame, [195, 215], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 300,
    width: "100%",
    textAlign: "center",
    fontSize: 56,
    fontWeight: 300,
    letterSpacing: 6,
    color: "#E8DCC8",
    lineHeight: 1.5,
    whiteSpace: "pre-line",
  };

  return (
    <AbsoluteFill style={{ background: "#0B0805" }}>
      {/* 무대 (줌 적용) */}
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          background:
            "radial-gradient(80% 55% at 50% 42%, #3A2210 0%, #1A0F08 55%, #0B0805 100%)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ marginTop: -120 }}>
          <WineGlass winePct={winePct} />
        </div>
      </AbsoluteFill>

      {/* 자막 */}
      <div style={{ ...subtitleStyle, opacity: line1 }}>
        하얏트호텔 와인바,{"\n"}30만원의 샴페인.
      </div>
      <div style={{ ...subtitleStyle, opacity: line2 }}>
        점장 블라인드 테스트,{"\n"}1위.
      </div>
      <div style={{ ...subtitleStyle, opacity: line3, whiteSpace: "pre" }}>
        정말, 다를까요.
      </div>

      <FilmGrain />

      {/* 레터박스 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: 170,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 170,
          background: "#000",
        }}
      />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════
// 전체 이어붙이기
// ═════════════════════════════════════════════

export const ToneSamples: React.FC = () => {
  const seg = LABEL_FRAMES + SAMPLE_FRAMES;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={LABEL_FRAMES}>
        <LabelCard tag="SAMPLE A" title={"블라인드 리빌\n미스터리 톤"} accent="#D9B36C" />
      </Sequence>
      <Sequence from={LABEL_FRAMES} durationInFrames={SAMPLE_FRAMES}>
        <SampleA />
      </Sequence>

      <Sequence from={seg} durationInFrames={LABEL_FRAMES}>
        <LabelCard tag="SAMPLE B" title={"키네틱 타이포\n통통 튀는 톤"} accent="#FFB3A0" />
      </Sequence>
      <Sequence from={seg + LABEL_FRAMES} durationInFrames={SAMPLE_FRAMES}>
        <SampleB />
      </Sequence>

      <Sequence from={seg * 2} durationInFrames={LABEL_FRAMES}>
        <LabelCard tag="SAMPLE C" title={"필름 무드\n감성 시네마 톤"} accent="#C9A227" />
      </Sequence>
      <Sequence from={seg * 2 + LABEL_FRAMES} durationInFrames={SAMPLE_FRAMES}>
        <SampleC />
      </Sequence>
    </AbsoluteFill>
  );
};
