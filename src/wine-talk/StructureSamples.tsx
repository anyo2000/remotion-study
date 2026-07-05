import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Structure1Unboxing, STRUCTURE1_FRAMES } from "./Structure1Unboxing";
import { Structure2Quiz, STRUCTURE2_FRAMES } from "./Structure2Quiz";
import { Structure3Trailer, STRUCTURE3_FRAMES } from "./Structure3Trailer";

// ─────────────────────────────────────────────
// YRC Wine Talk — 구조안 샘플 3종 이어보기
// 1안 언박싱형 / 2안 블라인드 게임형 / 3안 토크쇼 예고편형
// ─────────────────────────────────────────────

const LABEL_FRAMES = 45;
export const STRUCTURE_SAMPLES_FRAMES =
  LABEL_FRAMES * 3 + STRUCTURE1_FRAMES + STRUCTURE2_FRAMES + STRUCTURE3_FRAMES;

// 라벨 카드 (타이틀카드 규칙: 즉시 표시)
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
    <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: 14, color: accent }}>
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

export const StructureSamples: React.FC = () => {
  const s1 = LABEL_FRAMES;
  const s2Label = s1 + STRUCTURE1_FRAMES;
  const s2 = s2Label + LABEL_FRAMES;
  const s3Label = s2 + STRUCTURE2_FRAMES;
  const s3 = s3Label + LABEL_FRAMES;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={LABEL_FRAMES}>
        <LabelCard tag="1안" title={"와인 5잔\n언박싱형"} accent="#C9A227" />
      </Sequence>
      <Sequence from={s1} durationInFrames={STRUCTURE1_FRAMES}>
        <Structure1Unboxing />
      </Sequence>

      <Sequence from={s2Label} durationInFrames={LABEL_FRAMES}>
        <LabelCard tag="2안" title={"얼마일까요?\n블라인드 게임형"} accent="#FF8E7A" />
      </Sequence>
      <Sequence from={s2} durationInFrames={STRUCTURE2_FRAMES}>
        <Structure2Quiz />
      </Sequence>

      <Sequence from={s3Label} durationInFrames={LABEL_FRAMES}>
        <LabelCard tag="3안" title={"와인 토크쇼\n예고편형"} accent="#C96F4A" />
      </Sequence>
      <Sequence from={s3} durationInFrames={STRUCTURE3_FRAMES}>
        <Structure3Trailer />
      </Sequence>
    </AbsoluteFill>
  );
};
