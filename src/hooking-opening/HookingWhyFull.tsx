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
 * 타이틀 2초(60fr) 후 오디오 시작
 *
 * T(sec) = Math.round(sec × 30) + 60
 */

const TITLE_DUR = 60; // 타이틀 카드 2초 후 오디오 시작
const T = (sec: number) => Math.round(sec * 30) + TITLE_DUR;
const SCENE_TAIL = 75; // 마지막 장면 여유

// ── 장면별 시작 프레임 (2차 타임스탬프 기준) ──────────
const SCENES = [
  { start: 0, name: "titlecard" },           // 0
  { start: T(0.0), name: "반전-오프닝질문" },   // 1: 60  — "의사가 귓구멍을..."
  { start: T(4.5), name: "후킹의결과" },        // 2: 195 — "지금 무슨소리인가..."
  { start: T(11.9), name: "지하철" },          // 3: 417 — "서울 지하철에서..."
  { start: T(19.4), name: "아저씨질문" },       // 4: 642 — "근데 한 아저씨가..."
  { start: T(27.0), name: "다들쳐다봄" },       // 5: 870 — "아무도 대답은..."
  { start: T(32.1), name: "왜-답답함" },        // 6: 1023 — "왜 쳐다봤을까요..."
  { start: T(41.9), name: "드라마비유" },        // 7: 1317 — "드라마 애매한..."
  { start: T(46.1), name: "홈쇼핑비교" },       // 8: 1443 — "홈쇼핑도..."
  { start: T(66.9), name: "3초" },             // 9: 2067 — "우리가 하는 상담도..."
  { start: T(75.5), name: "대화비교" },         // 10: 2325 — "똑같은 FP..."
  { start: T(94.9), name: "클로징" },           // 11: 2907 — "그러니까 우리..."
] as const;

const TOTAL = T(104) + SCENE_TAIL; // 3255

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

      {/* ── 오디오: 타이틀 카드 이후 시작 ── */}
      <Sequence from={TITLE_DUR}>
        <Audio src={staticFile("audio/link-edu-hooking-why.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
