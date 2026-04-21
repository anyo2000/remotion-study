import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep01SceneLayout } from "./Ep01SceneLayout";
import { BEATS_MZ_REJECT } from "./ep01-beats";

const palette = PALETTES.ep01;
const B = BEATS_MZ_REJECT;

/**
 * 씬 3: MZ 고객 거부 [대화 UI]
 *
 * "선물 들고 가보세요" → "안 받을게요. 부담스러워서요."
 * → "목적 있는 선물을 싫어하거든요"
 */

type BubbleProps = {
  text: string;
  emoji: string;
  isFP: boolean;
  delay: number;
};

const Bubble: React.FC<BubbleProps> = ({ text, emoji, isFP, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const prog = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.smooth,
  });

  const slideX = interpolate(prog, [0, 1], [isFP ? 40 : -40, 0]);

  const bgColor = isFP
    ? "rgba(232, 168, 56, 0.10)"
    : palette.card;
  const borderColor = isFP
    ? "rgba(232, 168, 56, 0.25)"
    : palette.cardBorder;
  const textColor = isFP ? palette.accent : palette.text;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isFP ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 16,
        width: "100%",
        opacity: prog,
        transform: `translateX(${slideX}px)`,
      }}
    >
      {/* 화자 아이콘 */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: isFP
            ? "rgba(232, 168, 56, 0.15)"
            : "rgba(139, 146, 168, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 52 }}>{isFP ? "🧑‍💼" : "👤"}</span>
      </div>

      {/* 말풍선 */}
      <div
        style={{
          flex: 1,
          maxWidth: 620,
          padding: "28px 36px",
          borderRadius: 28,
          borderTopLeftRadius: isFP ? 28 : 8,
          borderTopRightRadius: isFP ? 8 : 28,
          backgroundColor: bgColor,
          border: `2px solid ${borderColor}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 56, flexShrink: 0 }}>{emoji}</span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 60,
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.4,
              whiteSpace: "pre-line",
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Scene3_MzReject: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 해설 텍스트 등장
  const insightProg = spring({
    frame: Math.max(0, frame - B.INSIGHT_TEXT),
    fps,
    config: SPRING.smooth,
  });

  // 핵심 강조 텍스트
  const accentProg = spring({
    frame: Math.max(0, frame - B.ACCENT_TEXT),
    fps,
    config: SPRING.smooth,
  });

  // 대화 버블 dim (해설 등장 후)
  const bubbleDim =
    frame >= B.INSIGHT_TEXT
      ? interpolate(frame, [B.INSIGHT_TEXT, B.INSIGHT_TEXT + 20], [1, 0.4], {
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <Ep01SceneLayout pageTitle="MZ 고객의 반응">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          width: "100%",
          opacity: bubbleDim,
        }}
      >
        <Bubble
          text={"선물 들고\n가보세요"}
          emoji="🎁"
          isFP
          delay={B.FP_BUBBLE}
        />
        <Bubble
          text={"안 받을게요.\n부담스러워서요."}
          emoji="🙅"
          isFP={false}
          delay={B.CUSTOMER_REJECT}
        />
      </div>

      {/* 해설 — 처음부터 렌더, opacity로 등장 */}
      <div
        style={{
          marginTop: 48,
          textAlign: "center",
          opacity: insightProg,
          transform: `translateY(${interpolate(insightProg, [0, 1], [12, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 60,
            fontWeight: 600,
            color: palette.sub,
            lineHeight: 1.5,
          }}
        >
          목적 있는 선물을 싫어하거든요
        </span>
      </div>

      {/* 핵심 강조 */}
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
          opacity: accentProg,
          transform: `scale(${interpolate(accentProg, [0, 1], [0.95, 1])})`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 900,
            color: palette.accent,
          }}
        >
          보험 얘기하려고 주는 건 더 싫은 거예요
        </span>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.05}
        size={500}
        x="50%"
        y="55%"
        delay={B.ACCENT_TEXT}
      />
    </Ep01SceneLayout>
  );
};
