import React from "react";
import { KeywordScene } from "./KeywordScene";
import { DialogueScene } from "./DialogueScene";
import { ComparisonScene } from "./ComparisonScene";
import { TitleCardScene } from "./TitleCardScene";

export const SCENE_MAP: Record<string, React.FC<any>> = {
  keyword: KeywordScene,
  dialogue: DialogueScene,
  comparison: ComparisonScene,
  titlecard: TitleCardScene,
};

export { KeywordScene, DialogueScene, ComparisonScene, TitleCardScene };
