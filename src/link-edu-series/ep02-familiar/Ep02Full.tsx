import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Scene0_TitleCard } from "./Scene0_TitleCard";
import { Scene1_Cliff } from "./Scene1_Cliff";
import { Scene2_SfpReality } from "./Scene2_SfpReality";
import { Scene3_HalfGone } from "./Scene3_HalfGone";
import { Scene4_Relationship } from "./Scene4_Relationship";
import { Scene5_Flip } from "./Scene5_Flip";
import { Scene6_Complexity } from "./Scene6_Complexity";
import { Scene7_OneMinute } from "./Scene7_OneMinute";
import { Scene8_Closing } from "./Scene8_Closing";

import {
  TITLE_DUR,
  AUDIO_START,
  SCENE_STARTS,
  SCENE_DURS,
  TOTAL_FRAMES,
} from "./ep02-beats";

/**
 * EP02 친숙보다 중요한 것 — 전체 빌드 (가로 1920x1080, 30fps)
 *
 * 오디오: public/audio/link-edu-ep02-familiar.wav (~171초)
 * 타이틀 4초(120fr) → 오디오 시작 = 첫 씬 시작
 */

export const EP02_FULL_FRAMES = TOTAL_FRAMES;

export const Ep02Full: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 타이틀 카드 */}
      <Sequence from={SCENE_STARTS.TITLE} durationInFrames={TITLE_DUR} name="타이틀카드">
        <Scene0_TitleCard />
      </Sequence>

      {/* 씬 1~8: 음성 타임스탬프 기반 절대 배치 (GAP 없음) */}
      <Sequence from={SCENE_STARTS.S1} durationInFrames={SCENE_DURS.S1} name="첫통화의절벽">
        <Scene1_Cliff />
      </Sequence>
      <Sequence from={SCENE_STARTS.S2} durationInFrames={SCENE_DURS.S2} name="SFP의현실">
        <Scene2_SfpReality />
      </Sequence>
      <Sequence from={SCENE_STARTS.S3} durationInFrames={SCENE_DURS.S3} name="FP절반소멸">
        <Scene3_HalfGone />
      </Sequence>
      <Sequence from={SCENE_STARTS.S4} durationInFrames={SCENE_DURS.S4} name="딱하나관계">
        <Scene4_Relationship />
      </Sequence>
      <Sequence from={SCENE_STARTS.S5} durationInFrames={SCENE_DURS.S5} name="순서를바꾸다">
        <Scene5_Flip />
      </Sequence>
      <Sequence from={SCENE_STARTS.S6} durationInFrames={SCENE_DURS.S6} name="복잡함이기회다">
        <Scene6_Complexity />
      </Sequence>
      <Sequence from={SCENE_STARTS.S7} durationInFrames={SCENE_DURS.S7} name="1분의조건">
        <Scene7_OneMinute />
      </Sequence>
      <Sequence from={SCENE_STARTS.S8} durationInFrames={SCENE_DURS.S8} name="클로징">
        <Scene8_Closing />
      </Sequence>

      {/* 오디오: 타이틀 카드 종료 후 시작 */}
      <Sequence from={AUDIO_START}>
        <Audio src={staticFile("audio/link-edu-ep02-familiar.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
