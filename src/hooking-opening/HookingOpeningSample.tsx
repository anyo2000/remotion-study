import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SampleScene1 } from "./SampleScene1";
import { SampleScene5 } from "./SampleScene5";

/**
 * 후킹 오프닝 미니샘플 — 장면 1(반전) + 장면 5(비교)
 * 각 5초(150프레임), 총 10초
 */
export const HookingOpeningSample: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={150}>
        <SampleScene1 />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <SampleScene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
