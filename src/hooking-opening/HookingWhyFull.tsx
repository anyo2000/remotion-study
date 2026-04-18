import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Scene0_TitleCard } from "./Scene0_TitleCard";
import { SampleScene1 } from "./SampleScene1";
import { SampleScene3 } from "./SampleScene3";
import { Scene3_Subway } from "./Scene3_Subway";
import { Scene4_Voice } from "./Scene4_Voice";
import { Scene5_EyeFocus } from "./Scene5_EyeFocus";
import { Scene6_Impact } from "./Scene6_Impact";
import { Scene7_DramaCliff } from "./Scene7_DramaCliff";
import { SampleScene5 } from "./SampleScene5";
import { SampleScene9 } from "./SampleScene9";
import { Scene10_Dialogue } from "./Scene10_Dialogue";
import { SampleScene11 } from "./SampleScene11";

/**
 * 후킹 왜 후킹인가 — 전체 빌드 (가로 1920×1080, 30fps)
 *
 * 오디오: public/audio/link-edu-hooking-why.wav (~104초)
 * 타이틀 2초 → 오프닝 2초(무음) → 오디오 시작
 *
 * T(sec) = Math.round(sec × 30) + AUDIO_START
 */

import { TITLE_DUR, AUDIO_START, T } from "./hooking-why-beats";
const SCENE_TAIL = 75; // 마지막 장면 여유

// ── 장면별 시작 프레임 (2차 타임스탬프 기준) ──────────
const SCENES = [
  { start: 0, name: "titlecard" },           // 0: 0~120 (4초)
  { start: TITLE_DUR, name: "반전-오프닝질문" }, // 1: 120 — 오디오와 동시
  { start: T(4.4), name: "후킹의결과" },        // 2: 252
  { start: T(10.8), name: "지하철" },          // 3: 444
  { start: T(18.8), name: "아저씨질문" },       // 4: 684
  { start: T(26.3), name: "다들쳐다봄" },       // 5: 909
  { start: T(31.2), name: "왜-답답함" },        // 6: 1056
  { start: T(40.7), name: "드라마비유" },        // 7: 1341
  { start: T(45.2), name: "홈쇼핑비교" },       // 8: 1476
  { start: T(65.3), name: "3초" },             // 9: 2079
  { start: T(73.5), name: "대화비교" },         // 10: 2325
  { start: T(93.5), name: "클로징" },           // 11: 2925
] as const;

const TOTAL = T(103) + SCENE_TAIL; // ~3285

/** 장면 duration 계산: 다음 장면 시작까지 */
const dur = (i: number) => {
  const nextStart = i < SCENES.length - 1 ? SCENES[i + 1].start : TOTAL;
  return nextStart - SCENES[i].start;
};

export const HOOKING_WHY_FULL_FRAMES = TOTAL;

export const HookingWhyFull: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ── 장면 시퀀스 ── */}
      <Sequence from={SCENES[0].start} durationInFrames={dur(0)} name="titlecard">
        <Scene0_TitleCard />
      </Sequence>

      <Sequence from={SCENES[1].start} durationInFrames={dur(1)} name="반전-오프닝질문">
        <SampleScene1 />
      </Sequence>

      <Sequence from={SCENES[2].start} durationInFrames={dur(2)} name="후킹의결과">
        <SampleScene3 />
      </Sequence>

      <Sequence from={SCENES[3].start} durationInFrames={dur(3)} name="지하철">
        <Scene3_Subway />
      </Sequence>

      <Sequence from={SCENES[4].start} durationInFrames={dur(4)} name="아저씨질문">
        <Scene4_Voice />
      </Sequence>

      <Sequence from={SCENES[5].start} durationInFrames={dur(5)} name="다들쳐다봄">
        <Scene5_EyeFocus />
      </Sequence>

      <Sequence from={SCENES[6].start} durationInFrames={dur(6)} name="왜-답답함">
        <Scene6_Impact />
      </Sequence>

      <Sequence from={SCENES[7].start} durationInFrames={dur(7)} name="드라마비유">
        <Scene7_DramaCliff />
      </Sequence>

      <Sequence from={SCENES[8].start} durationInFrames={dur(8)} name="홈쇼핑비교">
        <SampleScene5 />
      </Sequence>

      <Sequence from={SCENES[9].start} durationInFrames={dur(9)} name="3초">
        <SampleScene9 />
      </Sequence>

      <Sequence from={SCENES[10].start} durationInFrames={dur(10)} name="대화비교">
        <Scene10_Dialogue />
      </Sequence>

      <Sequence from={SCENES[11].start} durationInFrames={dur(11)} name="클로징">
        <SampleScene11 />
      </Sequence>

      {/* ── 오디오: 타이틀+오프닝 이후 시작 ── */}
      <Sequence from={AUDIO_START}>
        <Audio src={staticFile("audio/link-edu-hooking-why.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
