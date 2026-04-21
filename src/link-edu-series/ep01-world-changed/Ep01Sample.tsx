import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene3_MzReject } from "./Scene3_MzReject";
import { Scene7_StageChanged } from "./Scene7_StageChanged";
import { SCENE3_DURATION, SCENE7_DURATION } from "./ep01-beats";

/**
 * EP01 세상이 바뀌었다 — 미니샘플 (V3)
 *
 * Scene 3: MZ 고객 거부 [대화 UI] — 465프레임 (~15.5초)
 * Scene 7: 무대가 바뀌었다 [반전] — 498프레임 (~16.6초)
 *
 * 1920×1080, 30fps
 */

const GAP = 21; // 0.7초 장면 간 쉼

export const EP01_SAMPLE_FRAMES = SCENE3_DURATION + GAP + SCENE7_DURATION;

export const Ep01Sample: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence
        from={0}
        durationInFrames={SCENE3_DURATION}
        name="MZ고객거부"
      >
        <Scene3_MzReject />
      </Sequence>

      <Sequence
        from={SCENE3_DURATION + GAP}
        durationInFrames={SCENE7_DURATION}
        name="무대가바뀌었다"
      >
        <Scene7_StageChanged />
      </Sequence>
    </AbsoluteFill>
  );
};
