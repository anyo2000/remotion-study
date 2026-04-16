import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SampleScene1 } from "./SampleScene1";
import { SampleScene3 } from "./SampleScene3";
import { SampleScene5 } from "./SampleScene5";
import { SampleScene9 } from "./SampleScene9";
import { SampleScene11 } from "./SampleScene11";

const DUR = 150; // 각 장면 5초

/**
 * 후킹 오프닝 미니샘플 — 5장면, 각 5초, 총 25초
 * 1(반전) → 3(키워드) → 5(비교) → 9(숫자 타이머) → 11(클로징)
 */
export const HookingOpeningSample: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={DUR * 0} durationInFrames={DUR}>
        <SampleScene1 />
      </Sequence>
      <Sequence from={DUR * 1} durationInFrames={DUR}>
        <SampleScene3 />
      </Sequence>
      <Sequence from={DUR * 2} durationInFrames={DUR}>
        <SampleScene5 />
      </Sequence>
      <Sequence from={DUR * 3} durationInFrames={DUR}>
        <SampleScene9 />
      </Sequence>
      <Sequence from={DUR * 4} durationInFrames={DUR}>
        <SampleScene11 />
      </Sequence>
    </AbsoluteFill>
  );
};
