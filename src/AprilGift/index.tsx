import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { PALETTES } from "../constants";
import { SpringDecor } from "./SpringDecor";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Nursing } from "./scenes/Scene2Nursing";
import { Scene3Living } from "./scenes/Scene3Living";
import { Scene4Circulation } from "./scenes/Scene4Circulation";
import { Scene5Senior } from "./scenes/Scene5Senior";
import { Scene6Premium } from "./scenes/Scene6Premium";
import { Scene7MinPremium } from "./scenes/Scene7MinPremium";
import { Scene8Children } from "./scenes/Scene8Children";
import { Scene9CTA } from "./scenes/Scene9CTA";

// Gemini 타임스탬프 기반 장면 시작 프레임
const S = [0, 615, 1173, 1791, 2190, 2709, 3207, 3630, 4173] as const;
const TOTAL = 5040;

const P = PALETTES.aprilGift;

export const AprilGift: React.FC = () => {
  return (
    <AbsoluteFill>
      <SpringDecor />

      <Sequence from={S[0]} durationInFrames={S[1] - S[0]} name="도입">
        <Scene1Intro />
      </Sequence>

      <Sequence from={S[1]} durationInFrames={S[2] - S[1]} name="간병한도">
        <Scene2Nursing />
      </Sequence>

      <Sequence from={S[2]} durationInFrames={S[3] - S[2]} name="생활비한도">
        <Scene3Living />
      </Sequence>

      <Sequence from={S[3]} durationInFrames={S[4] - S[3]} name="순환계">
        <Scene4Circulation />
      </Sequence>

      <Sequence from={S[4]} durationInFrames={S[5] - S[4]} name="고령생활비">
        <Scene5Senior />
      </Sequence>

      <Sequence from={S[5]} durationInFrames={S[6] - S[5]} name="프리미엄올인원">
        <Scene6Premium />
      </Sequence>

      <Sequence from={S[6]} durationInFrames={S[7] - S[6]} name="최저보험료">
        <Scene7MinPremium />
      </Sequence>

      <Sequence from={S[7]} durationInFrames={S[8] - S[7]} name="0540어린이">
        <Scene8Children />
      </Sequence>

      <Sequence from={S[8]} durationInFrames={TOTAL - S[8]} name="마무리CTA">
        <Scene9CTA />
      </Sequence>

      <Audio src={staticFile("audio/april-gift-aoede.wav")} />
      <Audio src={staticFile("audio/bgm-april-gift.mp3")} volume={0.1} />
    </AbsoluteFill>
  );
};
