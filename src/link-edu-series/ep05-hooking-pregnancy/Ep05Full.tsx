import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Scene0_TitleCard } from "./Scene0_TitleCard";
import { Scene1_CafeReject } from "./Scene1_CafeReject";
import { Scene2_CustomerMind } from "./Scene2_CustomerMind";
import { Scene3_NewCombo } from "./Scene3_NewCombo";
import { Scene4_HookLine } from "./Scene4_HookLine";
import { Scene5_Reaction } from "./Scene5_Reaction";
import { Scene6_CoverageCards } from "./Scene6_CoverageCards";
import { Scene7_CustomerCurious } from "./Scene7_CustomerCurious";
import { Scene8_MistakeAndStepBack } from "./Scene8_MistakeAndStepBack";
import { Scene9_ObjectionHandle } from "./Scene9_ObjectionHandle";
import { Scene10_ReverseOrder } from "./Scene10_ReverseOrder";
import { Scene11_Summary } from "./Scene11_Summary";
import { Scene12_Closing } from "./Scene12_Closing";

import {
  TITLE_DUR,
  AUDIO_START,
  SCENE_STARTS,
  SCENE_DURS,
  TOTAL_FRAMES,
} from "./ep05-beats";

export const EP05_FULL_FRAMES = TOTAL_FRAMES;

export const Ep05Full: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={SCENE_STARTS.TITLE} durationInFrames={TITLE_DUR} name="타이틀카드">
        <Scene0_TitleCard />
      </Sequence>
      <Sequence from={SCENE_STARTS.S1} durationInFrames={SCENE_DURS.S1} name="카페거절">
        <Scene1_CafeReject />
      </Sequence>
      <Sequence from={SCENE_STARTS.S2} durationInFrames={SCENE_DURS.S2} name="고객예측">
        <Scene2_CustomerMind />
      </Sequence>
      <Sequence from={SCENE_STARTS.S3} durationInFrames={SCENE_DURS.S3} name="새로운조합">
        <Scene3_NewCombo />
      </Sequence>
      <Sequence from={SCENE_STARTS.S4} durationInFrames={SCENE_DURS.S4} name="후킹멘트">
        <Scene4_HookLine />
      </Sequence>
      <Sequence from={SCENE_STARTS.S5} durationInFrames={SCENE_DURS.S5} name="고객반응">
        <Scene5_Reaction />
      </Sequence>
      <Sequence from={SCENE_STARTS.S6} durationInFrames={SCENE_DURS.S6} name="보장카드">
        <Scene6_CoverageCards />
      </Sequence>
      <Sequence from={SCENE_STARTS.S7} durationInFrames={SCENE_DURS.S7} name="고객궁금">
        <Scene7_CustomerCurious />
      </Sequence>
      <Sequence from={SCENE_STARTS.S8} durationInFrames={SCENE_DURS.S8} name="실수와물러남">
        <Scene8_MistakeAndStepBack />
      </Sequence>
      <Sequence from={SCENE_STARTS.S9} durationInFrames={SCENE_DURS.S9} name="거절대응">
        <Scene9_ObjectionHandle />
      </Sequence>
      <Sequence from={SCENE_STARTS.S10} durationInFrames={SCENE_DURS.S10} name="순서반전">
        <Scene10_ReverseOrder />
      </Sequence>
      <Sequence from={SCENE_STARTS.S11} durationInFrames={SCENE_DURS.S11} name="정리3포인트">
        <Scene11_Summary />
      </Sequence>
      <Sequence from={SCENE_STARTS.S12} durationInFrames={SCENE_DURS.S12} name="클로징">
        <Scene12_Closing />
      </Sequence>

      <Sequence from={AUDIO_START}>
        <Audio src={staticFile("audio/link-edu-ep05-hooking-pregnancy.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
