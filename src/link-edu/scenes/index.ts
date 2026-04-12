import React from "react";
import { KeywordScene } from "./KeywordScene";
import { DialogueScene } from "./DialogueScene";
import { ComparisonScene } from "./ComparisonScene";
import { TitleCardScene } from "./TitleCardScene";
import { ClosingScene } from "./ClosingScene";

export const SCENE_MAP: Record<string, React.FC<any>> = {
  keyword: KeywordScene,
  dialogue: DialogueScene,
  comparison: ComparisonScene,
  titlecard: TitleCardScene,
  closing: ClosingScene,
};

export { KeywordScene, DialogueScene, ComparisonScene, TitleCardScene, ClosingScene };
