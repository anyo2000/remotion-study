/**
 * LinkCounsel — 망설이는 고객 설득 화법
 * 가로(16:9, 1920×1080), 남자고객 + 여자FP 대화형
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  staticFile,
} from "remotion";
import {
  PALETTES,
  SPRING,
  FONT_FAMILY,
  SAFE_WIDE as SAFE,
  GAP_FRAMES,
} from "./constants";
import { GradientBackground } from "./components/GradientBackground";

// ── 팔레트 ──
const P = PALETTES.counsel;

// ── 타이밍 (프레임 기준, 30fps) ──
// Whisper API 단어별 타임스탬프 기반 (extract-timestamps.py로 추출)
//
// S0: 제목 나레이션 — counsel-title.wav (3.4초 = 102fr) + 1초 여유(30fr)
// S1~S6: 기존 대화, 제목 끝난 후 시작
//
// 고객 음성: 5.9초 = 178fr
// FP 음성: 30.9초 = 927fr
// FP 키워드 시작 프레임 (FP 로컬): 맞아요=0, 근데=213, 첫째=324, 둘째=444, 보험은=701

const TITLE_DUR = 102 + 30; // 제목 음성 3.4초 + 1초 쉼 = 132fr
const CUSTOMER_DUR = 178;
const GAP = GAP_FRAMES; // 21fr = 0.7초

// 제목 뒤로 전체 밀림
const OFFSET = TITLE_DUR; // 132fr
const FP_START = OFFSET + CUSTOMER_DUR + GAP; // 331

const S0_START = 0;
const S0_DUR = TITLE_DUR; // 132fr (제목)

const S1_START = OFFSET; // 132 — 고객 대사 시작
const S1_DUR = CUSTOMER_DUR; // 178fr

const S2_START = FP_START; // 331 — FP "맞아요" 시작
const S2_DUR = 213; // FP 0~7.1s

const S3_START = FP_START + 213; // 544 — FP "근데"
const S3_DUR = 324 - 213; // 111fr

const S4_START = FP_START + 324; // 655 — FP "첫째"
const S4_DUR = 444 - 324; // 120fr

const S5_START = FP_START + 444; // 775 — FP "둘째"
const S5_DUR = 701 - 444; // 257fr

const S6_START = FP_START + 701; // 1032 — FP "보험은"
const S6_DUR = 927 - 701 + 90; // 316fr (보험은~끝 + 여유)

const TOTAL_DUR = S6_START + S6_DUR; // 1348fr

// ===================================================================
// S0 — 제목
// ===================================================================
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.dramatic,
  });

  const subIn = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: SPRING.heavy,
  });

  // 제목 끝나고 페이드아웃
  const fadeOut = interpolate(
    frame,
    [TITLE_DUR - 25, TITLE_DUR],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <GradientBackground palette="counsel" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
        }}
      >
        <p
          style={{
            color: P.accent,
            fontSize: 96,
            fontWeight: 800,
            fontFamily: FONT_FAMILY,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.4,
            opacity: titleIn,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.85, 1])})`,
          }}
        >
          망설이는 고객
          <br />
          설득하는 화법
        </p>
        <div
          style={{
            width: interpolate(subIn, [0, 1], [0, 200]),
            height: 3,
            backgroundColor: `${P.accent}50`,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// S1 — 고객 말풍선
// ===================================================================
const CustomerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubbleIn = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING.heavy,
  });

  const iconIn = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="counsel" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `0 ${SAFE.side + 40}px`,
          gap: 48,
        }}
      >
        {/* 남자 아이콘 */}
        <div
          style={{
            flexShrink: 0,
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: `${P.accent}20`,
            border: `3px solid ${P.accent}50`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 56,
            opacity: iconIn,
            transform: `scale(${iconIn})`,
          }}
        >
          🙋‍♂️
        </div>

        {/* 말풍선 */}
        <div
          style={{
            maxWidth: 1400,
            backgroundColor: P.card,
            border: `2px solid ${P.cardBorder}`,
            borderRadius: 32,
            padding: "64px 80px",
            opacity: bubbleIn,
            transform: `translateX(${interpolate(bubbleIn, [0, 1], [30, 0])}px)`,
          }}
        >
          <p
            style={{
              color: P.text,
              fontSize: 76,
              fontWeight: 500,
              fontFamily: FONT_FAMILY,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            좋은건 알겠는데,
            <br />
            솔직히 좀 고민되네요.
            <br />
            다음에 할까 싶기도 하고요.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// S2 — FP 공감
// ===================================================================
const EmpathyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubbleIn = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING.heavy,
  });

  const iconIn = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="counsel" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row-reverse",
          padding: `0 ${SAFE.side + 40}px`,
          gap: 48,
        }}
      >
        {/* 여자 FP 아이콘 */}
        <div
          style={{
            flexShrink: 0,
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: `${P.accent}20`,
            border: `3px solid ${P.accent}50`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 56,
            opacity: iconIn,
            transform: `scale(${iconIn})`,
          }}
        >
          👩‍💼
        </div>

        {/* 말풍선 */}
        <div
          style={{
            maxWidth: 1400,
            backgroundColor: P.card,
            border: `2px solid ${P.cardBorder}`,
            borderRadius: 32,
            padding: "64px 80px",
            opacity: bubbleIn,
            transform: `translateX(${interpolate(bubbleIn, [0, 1], [-30, 0])}px)`,
          }}
        >
          <p
            style={{
              color: P.text,
              fontSize: 72,
              fontWeight: 500,
              fontFamily: FONT_FAMILY,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            맞아요, 당장 급하지 않으니까요.
            <br />
            저도 억지로 권하고 싶지 않아요.
            <br />
            다음에 하셔도 됩니다.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// S3 — 전환점: "딱 두 가지"
// ===================================================================
const TwoThingsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.heavy,
  });

  const numberIn = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: SPRING.dramatic,
  });

  const subIn = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: SPRING.heavy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="counsel" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <p
          style={{
            color: P.sub,
            fontSize: 60,
            fontWeight: 400,
            fontFamily: FONT_FAMILY,
            margin: 0,
            opacity: lineIn,
            transform: `translateY(${interpolate(lineIn, [0, 1], [15, 0])}px)`,
          }}
        >
          근데 다음에 하면
        </p>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            margin: 0,
            opacity: numberIn,
            transform: `scale(${interpolate(numberIn, [0, 1], [0.8, 1])})`,
          }}
        >
          <span style={{ color: P.accent, fontSize: 140, fontWeight: 900 }}>
            딱 두 가지
          </span>
          <span
            style={{
              color: P.text,
              fontSize: 80,
              fontWeight: 500,
              opacity: subIn,
            }}
          >
            가 달라집니다
          </span>
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// S4 — 첫째: 나이
// ===================================================================
const FirstPointScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.bouncy,
  });

  const labelIn = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: SPRING.heavy,
  });

  const textIn = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: SPRING.heavy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="counsel" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 번호 뱃지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: emojiIn,
            transform: `scale(${emojiIn})`,
          }}
        >
          <span style={{ fontSize: 80 }}>☝️</span>
          <span
            style={{
              color: P.accent,
              fontSize: 80,
              fontWeight: 800,
              fontFamily: FONT_FAMILY,
              opacity: labelIn,
            }}
          >
            첫째
          </span>
        </div>

        {/* 본문 */}
        <div
          style={{
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
            padding: `0 ${SAFE.side}px`,
          }}
        >
          <p
            style={{
              color: P.text,
              fontSize: 84,
              fontWeight: 600,
              fontFamily: FONT_FAMILY,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            고객님은 내일이면{" "}
            <span style={{ color: P.accent, fontWeight: 800 }}>
              하루 더
            </span>{" "}
            나이 드세요
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// S5 — 둘째: 병원
// ===================================================================
const SecondPointScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING.bouncy,
  });

  const labelIn = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: SPRING.heavy,
  });

  const textIn = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: SPRING.heavy,
  });

  const accentIn = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: SPRING.dramatic,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="counsel" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 번호 뱃지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: emojiIn,
            transform: `scale(${emojiIn})`,
          }}
        >
          <span style={{ fontSize: 80 }}>✌️</span>
          <span
            style={{
              color: P.accent,
              fontSize: 80,
              fontWeight: 800,
              fontFamily: FONT_FAMILY,
              opacity: labelIn,
            }}
          >
            둘째
          </span>
        </div>

        {/* 본문 */}
        <div
          style={{
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
            padding: `0 ${SAFE.side}px`,
            maxWidth: 1600,
          }}
        >
          <p
            style={{
              color: P.text,
              fontSize: 72,
              fontWeight: 500,
              fontFamily: FONT_FAMILY,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            병원 한번이라도 다녀오시면
          </p>
          <p
            style={{
              color: P.accent,
              fontSize: 80,
              fontWeight: 800,
              fontFamily: FONT_FAMILY,
              margin: "24px 0 0 0",
              lineHeight: 1.5,
              opacity: accentIn,
              transform: `scale(${interpolate(accentIn, [0, 1], [0.95, 1])})`,
            }}
          >
            이 조건 그대로는
            <br />
            가입 못하실 수 있어요
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// S6 — 클로징: 핵심 메시지
// ===================================================================
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1In = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING.dramatic,
  });

  const line2In = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: SPRING.dramatic,
  });

  // 구분선
  const dividerIn = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: SPRING.heavy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="counsel" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
          padding: `0 ${SAFE.side + 40}px`,
        }}
      >
        {/* 1행: 보험은... */}
        <p
          style={{
            color: P.text,
            fontSize: 68,
            fontWeight: 600,
            fontFamily: FONT_FAMILY,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.5,
            opacity: line1In,
            transform: `translateY(${interpolate(line1In, [0, 1], [20, 0])}px)`,
          }}
        >
          보험은{" "}
          <span style={{ color: P.sub }}>돈</span>으로 사는 게 아니라
          <br />
          <span style={{ color: P.accent, fontWeight: 800 }}>건강</span>으로
          사는 거예요
        </p>

        {/* 구분선 */}
        <div
          style={{
            width: interpolate(dividerIn, [0, 1], [0, 400]),
            height: 3,
            backgroundColor: `${P.accent}40`,
            borderRadius: 2,
          }}
        />

        {/* 2행: 가장 건강하고... */}
        <p
          style={{
            color: P.accent,
            fontSize: 76,
            fontWeight: 800,
            fontFamily: FONT_FAMILY,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.5,
            opacity: line2In,
            transform: `scale(${interpolate(line2In, [0, 1], [0.9, 1])})`,
          }}
        >
          가장 건강하고 저렴한 오늘이
          <br />
          가장 좋은 조건입니다
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================
// 메인 컴포지션
// ===================================================================
export const LinkCounsel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      {/* S0 — 제목 */}
      <Sequence from={S0_START} durationInFrames={S0_DUR}>
        <TitleScene />
      </Sequence>

      {/* S1 — 고객 */}
      <Sequence from={S1_START} durationInFrames={S1_DUR}>
        <CustomerScene />
      </Sequence>

      {/* S2~S6 — FP */}
      <Sequence from={S2_START} durationInFrames={S2_DUR}>
        <EmpathyScene />
      </Sequence>
      <Sequence from={S3_START} durationInFrames={S3_DUR}>
        <TwoThingsScene />
      </Sequence>
      <Sequence from={S4_START} durationInFrames={S4_DUR}>
        <FirstPointScene />
      </Sequence>
      <Sequence from={S5_START} durationInFrames={S5_DUR}>
        <SecondPointScene />
      </Sequence>
      <Sequence from={S6_START} durationInFrames={S6_DUR}>
        <ClosingScene />
      </Sequence>

      {/* 음성 — 제목 (Zephyr) */}
      <Audio src={staticFile("audio/counsel-title.wav")} />

      {/* 음성 — 고객 (제목 끝난 후) */}
      <Sequence from={OFFSET}>
        <Audio src={staticFile("audio/counsel-customer.wav")} />
      </Sequence>

      {/* 음성 — FP (고객 끝 + 쉼 후) */}
      <Sequence from={FP_START}>
        <Audio src={staticFile("audio/counsel-fp.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
