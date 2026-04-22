import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Scene0_TitleCard } from "./Scene0_TitleCard";
import { Scene1_Restaurant } from "./Scene1_Restaurant";
import { Scene2_OldEducation } from "./Scene2_OldEducation";
import { Scene3_MzReject } from "./Scene3_MzReject";
import { Scene4a_LoyaltyEnd } from "./Scene4a_LoyaltyEnd";
import { Scene4b_TenMan } from "./Scene4b_TenMan";
import { Scene5_Wall } from "./Scene5_Wall";
import { Scene6_Summary } from "./Scene6_Summary";
import { Scene7_StageChanged } from "./Scene7_StageChanged";
import { Scene8_Flip } from "./Scene8_Flip";
import { Scene9_Closing } from "./Scene9_Closing";

import {
  TITLE_DUR,
  AUDIO_START,
  SCENE_STARTS,
  SCENE_DURS,
  TOTAL_FRAMES,
} from "./ep01-beats";

/**
 * EP01 세상이 바뀌었다 — 전체 빌드 (가로 1920x1080, 30fps)
 *
 * 오디오: public/audio/link-edu-ep01-world-changed.wav (~167초)
 * 타이틀 4초(120fr) → 오디오 시작 = 첫 씬 시작
 */

export const EP01_FULL_FRAMES = TOTAL_FRAMES;

export const Ep01Full: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 타이틀 카드 */}
      <Sequence from={SCENE_STARTS.TITLE} durationInFrames={TITLE_DUR} name="타이틀카드">
        <Scene0_TitleCard />
      </Sequence>

      {/* 씬 1~9: 음성 타임스탬프 기반 절대 배치 (GAP 없음) */}
      <Sequence from={SCENE_STARTS.S1} durationInFrames={SCENE_DURS.S1} name="여의도식당">
        <Scene1_Restaurant />
      </Sequence>
      <Sequence from={SCENE_STARTS.S2} durationInFrames={SCENE_DURS.S2} name="과거의교육">
        <Scene2_OldEducation />
      </Sequence>
      <Sequence from={SCENE_STARTS.S3} durationInFrames={SCENE_DURS.S3} name="MZ고객거부">
        <Scene3_MzReject />
      </Sequence>
      <Sequence from={SCENE_STARTS.S4A} durationInFrames={SCENE_DURS.S4A} name="의리가입종말">
        <Scene4a_LoyaltyEnd />
      </Sequence>
      <Sequence from={SCENE_STARTS.S4B} durationInFrames={SCENE_DURS.S4B} name="10만원">
        <Scene4b_TenMan />
      </Sequence>
      <Sequence from={SCENE_STARTS.S5} durationInFrames={SCENE_DURS.S5} name="보장분석의벽">
        <Scene5_Wall />
      </Sequence>
      <Sequence from={SCENE_STARTS.S6} durationInFrames={SCENE_DURS.S6} name="4가지막힘">
        <Scene6_Summary />
      </Sequence>
      <Sequence from={SCENE_STARTS.S7} durationInFrames={SCENE_DURS.S7} name="무대가바뀌었다">
        <Scene7_StageChanged />
      </Sequence>
      <Sequence from={SCENE_STARTS.S8} durationInFrames={SCENE_DURS.S8} name="순서를뒤집다">
        <Scene8_Flip />
      </Sequence>
      <Sequence from={SCENE_STARTS.S9} durationInFrames={SCENE_DURS.S9} name="클로징">
        <Scene9_Closing />
      </Sequence>

      {/* 오디오: 타이틀 카드 종료 후 시작 */}
      <Sequence from={AUDIO_START}>
        <Audio src={staticFile("audio/link-edu-ep01-world-changed.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
