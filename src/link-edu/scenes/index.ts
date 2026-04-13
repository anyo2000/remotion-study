import React from "react";
import { KeywordScene } from "./KeywordScene";
import { DialogueScene } from "./DialogueScene";
import { ComparisonScene } from "./ComparisonScene";
import { TitleCardScene } from "./TitleCardScene";
import { ClosingScene } from "./ClosingScene";
import { EyeFocusScene } from "./EyeFocusScene";
import { ImpactScene } from "./ImpactScene";
import { VisualStoryScene } from "./VisualStoryScene";
import { QuestionSplitScene } from "./QuestionSplitScene";
import { RisingQuestionsScene } from "./RisingQuestionsScene";
import { ChainReactionScene } from "./ChainReactionScene";
import { PuzzleBurstScene } from "./PuzzleBurstScene";
import { FilmStripScene } from "./FilmStripScene";
import { FishingScene } from "./FishingScene";
import { HourglassScene } from "./HourglassScene";
import { BrickDialogueScene } from "./BrickDialogueScene";
import { SubwayFrameScene } from "./SubwayFrameScene";
import { SubwayLineScene } from "./SubwayLineScene";
import { ArrowFocusScene } from "./ArrowFocusScene";
import { WaveFocusScene } from "./WaveFocusScene";

export const SCENE_MAP: Record<string, React.FC<any>> = {
  keyword: KeywordScene,
  dialogue: DialogueScene,
  comparison: ComparisonScene,
  titlecard: TitleCardScene,
  closing: ClosingScene,
  eyefocus: EyeFocusScene,
  impact: ImpactScene,
  visualstory: VisualStoryScene,
  questionsplit: QuestionSplitScene,
  risingquestions: RisingQuestionsScene,
  chainreaction: ChainReactionScene,
  puzzleburst: PuzzleBurstScene,
  filmstrip: FilmStripScene,
  fishing: FishingScene,
  hourglass: HourglassScene,
  brickdialogue: BrickDialogueScene,
  subwayframe: SubwayFrameScene,
  subwayline: SubwayLineScene,
  arrowfocus: ArrowFocusScene,
  wavefocus: WaveFocusScene,
};

export {
  KeywordScene, DialogueScene, ComparisonScene,
  TitleCardScene, ClosingScene,
  EyeFocusScene, ImpactScene, VisualStoryScene,
  QuestionSplitScene, RisingQuestionsScene,
  ChainReactionScene, PuzzleBurstScene,
  FilmStripScene, FishingScene, HourglassScene, BrickDialogueScene,
  SubwayFrameScene, SubwayLineScene, ArrowFocusScene, WaveFocusScene,
};
