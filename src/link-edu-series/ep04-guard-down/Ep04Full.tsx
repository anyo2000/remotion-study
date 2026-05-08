import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Scene0_TitleCard } from "./Scene0_TitleCard";
import { Scene1_PhoneCall } from "./Scene1_PhoneCall";
import { Scene2_Pause } from "./Scene2_Pause";
import { Scene3_Cafe } from "./Scene3_Cafe";
import { Scene4_Wall } from "./Scene4_Wall";
import { Scene5_Replace } from "./Scene5_Replace";
import { Scene6_Retry } from "./Scene6_Retry";
import { Scene7_Closing } from "./Scene7_Closing";

import {
  TITLE_DUR,
  AUDIO_START,
  SCENE_STARTS,
  SCENE_DURS,
  TOTAL_FRAMES,
} from "./ep04-beats";

/**
 * EP04 단어 하나가 만든 벽 — 전체 빌드 (가로 1920x1080, 30fps)
 *
 * 오디오: public/audio/link-edu-ep04-guard-down.wav (~240초)
 * 타이틀 4초(120fr) → 오디오 시작 = 첫 씬 시작
 */

export const EP04_FULL_FRAMES = TOTAL_FRAMES;

export const Ep04Full: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 타이틀 카드 */}
      <Sequence from={SCENE_STARTS.TITLE} durationInFrames={TITLE_DUR} name="타이틀카드">
        <Scene0_TitleCard />
      </Sequence>

      {/* 씬 1~7: 음성 타임스탬프 기반 절대 배치 */}
      <Sequence from={SCENE_STARTS.S1} durationInFrames={SCENE_DURS.S1} name="김영숙전화">
        <Scene1_PhoneCall />
      </Sequence>
      <Sequence from={SCENE_STARTS.S2} durationInFrames={SCENE_DURS.S2} name="멈칫">
        <Scene2_Pause />
      </Sequence>
      <Sequence from={SCENE_STARTS.S3} durationInFrames={SCENE_DURS.S3} name="카페양쪽">
        <Scene3_Cafe />
      </Sequence>
      <Sequence from={SCENE_STARTS.S4} durationInFrames={SCENE_DURS.S4} name="벽의정체">
        <Scene4_Wall />
      </Sequence>
      <Sequence from={SCENE_STARTS.S5} durationInFrames={SCENE_DURS.S5} name="단어치환">
        <Scene5_Replace />
      </Sequence>
      <Sequence from={SCENE_STARTS.S6} durationInFrames={SCENE_DURS.S6} name="재도전">
        <Scene6_Retry />
      </Sequence>
      <Sequence from={SCENE_STARTS.S7} durationInFrames={SCENE_DURS.S7} name="클로징">
        <Scene7_Closing />
      </Sequence>

      {/* 오디오: 타이틀 카드 종료 후 시작 */}
      <Sequence from={AUDIO_START}>
        <Audio src={staticFile("audio/link-edu-ep04-guard-down.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
