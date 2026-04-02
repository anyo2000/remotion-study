import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Signature4 } from "./Signature4";
import { LifeLink } from "./LifeLink";
import { GiftReject } from "./GiftReject";
import { ColdWall } from "./ColdWall";
import { GuardDown } from "./GuardDown";
import { HookTalk } from "./HookTalk";
import { LinkTeaser1 } from "./LinkTeaser1";
import { TeaserSampleA } from "./TeaserSampleA";
import { TeaserSampleB } from "./TeaserSampleB";
import { LinkTeaser2 } from "./LinkTeaser2";
import { LinkTeaser3 } from "./LinkTeaser3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LinkTeaser3"
        component={LinkTeaser3}
        durationInFrames={555}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TeaserSampleA"
        component={TeaserSampleA}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TeaserSampleB"
        component={TeaserSampleB}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LinkTeaser2"
        component={LinkTeaser2}
        durationInFrames={515}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LinkTeaser1"
        component={LinkTeaser1}
        durationInFrames={435}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={1366}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Signature4"
        component={Signature4}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LifeLink"
        component={LifeLink}
        durationInFrames={915}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GiftReject"
        component={GiftReject}
        durationInFrames={741}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HookTalk"
        component={HookTalk}
        durationInFrames={1065}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GuardDown"
        component={GuardDown}
        durationInFrames={945}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ColdWall"
        component={ColdWall}
        durationInFrames={1295}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
