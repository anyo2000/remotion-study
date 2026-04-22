import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene5_Wall } from "./Scene5_Wall";
import { Scene7_StageChanged } from "./Scene7_StageChanged";
import { SCENE_DURS } from "./ep01-beats";

/**
 * EP01 세상이 바뀌었다 — 미니샘플
 *
 * Scene 5: 보장분석의 벽
 * Scene 7: 무대가 바뀌었다
 */

export const EP01_SAMPLE_FRAMES = SCENE_DURS.S5 + SCENE_DURS.S7;

export const Ep01Sample: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={SCENE_DURS.S5} name="보장분석의벽">
        <Scene5_Wall />
      </Sequence>
      <Sequence from={SCENE_DURS.S5} durationInFrames={SCENE_DURS.S7} name="무대가바뀌었다">
        <Scene7_StageChanged />
      </Sequence>
    </AbsoluteFill>
  );
};
