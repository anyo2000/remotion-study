import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import {
  T,
  TITLE_END,
  AUDIO_START,
  TOTAL_FRAMES,
  SCENE_START,
} from "./wine-talk-beats";
import { Scene0_TitleCard } from "./Scene0_TitleCard";
import { Scene1_Intro } from "./Scene1_Intro";
import { Scene2_Champagne } from "./Scene2_Champagne";
import { Scene3_Sauvignon } from "./Scene3_Sauvignon";
import { Scene4_OregonRed } from "./Scene4_OregonRed";
import { Scene5_White } from "./Scene5_White";
import { Scene6_HostPick } from "./Scene6_HostPick";
import { Scene7_Closing } from "./Scene7_Closing";

export const WINE_TALK_FRAMES = TOTAL_FRAMES;

/**
 * YRC Wine Talk 인스타 티저 — 타이틀("짜잔!" 대사 재생) + 7씬 (음성 싱크)
 * 씬 시작 = 음성 타임스탬프 절대값 T(초). GAP 없음.
 */
export const WineTalkFull: React.FC = () => {
  const S = SCENE_START;
  return (
    <AbsoluteFill style={{ background: "#F0E4D2" }}>
      <Sequence durationInFrames={TITLE_END}>
        <Scene0_TitleCard />
      </Sequence>

      <Sequence from={T(S.S1_INTRO)} durationInFrames={T(S.S2_CHAMPAGNE) - T(S.S1_INTRO)}>
        <Scene1_Intro />
      </Sequence>
      <Sequence from={T(S.S2_CHAMPAGNE)} durationInFrames={T(S.S3_SAUVIGNON) - T(S.S2_CHAMPAGNE)}>
        <Scene2_Champagne />
      </Sequence>
      <Sequence from={T(S.S3_SAUVIGNON)} durationInFrames={T(S.S4_OREGON) - T(S.S3_SAUVIGNON)}>
        <Scene3_Sauvignon />
      </Sequence>
      <Sequence from={T(S.S4_OREGON)} durationInFrames={T(S.S5_WHITE) - T(S.S4_OREGON)}>
        <Scene4_OregonRed />
      </Sequence>
      <Sequence from={T(S.S5_WHITE)} durationInFrames={T(S.S6_HOSTPICK) - T(S.S5_WHITE)}>
        <Scene5_White />
      </Sequence>
      <Sequence from={T(S.S6_HOSTPICK)} durationInFrames={T(S.S7_CLOSING) - T(S.S6_HOSTPICK)}>
        <Scene6_HostPick />
      </Sequence>
      <Sequence from={T(S.S7_CLOSING)} durationInFrames={TOTAL_FRAMES - T(S.S7_CLOSING)}>
        <Scene7_Closing />
      </Sequence>

      <Sequence from={AUDIO_START}>
        <Audio src={staticFile("audio/wine-talk-teaser.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
