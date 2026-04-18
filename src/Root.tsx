import { Composition, Folder } from "remotion";
import { LinkTeaser4, linkTeaser4Schema } from "./LinkTeaser4";
import { LinkCounsel } from "./LinkCounsel";
import { AprilGift } from "./AprilGift";
import { AprilGift2 } from "./AprilGift2";
import { EpisodePlayer } from "./link-edu/EpisodePlayer";
import { templateTest } from "./link-edu/episodes/template-test";
import { hookingWhy } from "./link-edu/episodes/hooking-why";
import { hookingWhyV1 } from "./link-edu/episodes/hooking-why-v1";
import { hookingWhyV2 } from "./link-edu/episodes/hooking-why-v2";
import { VisualCatalog, VISUAL_CATALOG_FRAMES } from "./visual-catalog/VisualCatalog";
import { VisualCatalogV2, VISUAL_CATALOG_V2_FRAMES } from "./visual-catalog-v2/VisualCatalogV2";
import { VisualCatalogV3, VISUAL_CATALOG_V3_FRAMES } from "./visual-catalog-v3/VisualCatalogV3";
import { VisualCatalogV4, VISUAL_CATALOG_V4_FRAMES } from "./visual-catalog-v4/VisualCatalogV4";
import { VisualCatalogV5, VISUAL_CATALOG_V5_FRAMES } from "./visual-catalog-v5/VisualCatalogV5";
import { HookingOpeningSample } from "./hooking-opening/HookingOpeningSample";
import { HookingWhyFull, HOOKING_WHY_FULL_FRAMES } from "./hooking-opening/HookingWhyFull";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── 완성 ── */}
      <Folder name="Done">
        <Folder name="LINK">
          <Composition
            id="LINK-L-WhyHooking"
            component={HookingWhyFull}
            durationInFrames={HOOKING_WHY_FULL_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Composition
          id="AprilGift"
          component={AprilGift}
          durationInFrames={5040}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="AprilGift2"
          component={AprilGift2}
          durationInFrames={4641}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LinkTeaser4"
          component={LinkTeaser4}
          schema={linkTeaser4Schema}
          defaultProps={{
            문제팔레트: "coolBlue",
            솔루션팔레트: "orange",
            질문: "상담하면 몇 건 체결하시나요?",
            숫자A: "2건?",
            숫자B: "1건?",
            핵심질문: "어디서 떨어진 걸까요?",
            카드1: "관심 없다는 고객",
            카드2: "인증번호를 안 주는 고객",
            카드3: '"생각해볼게요~" 고객',
            전환문구: "단계별로\n부수는 방법이\n있습니다",
            상단문구: "실력으로 계약하는 방법",
            하단문구: "Consulting",
            시기: "4월",
            마무리: "곧 찾아갑니다",
            장면쉼: 21,
            속도감: 1.0,
            BGM볼륨: 0.15,
          }}
          durationInFrames={885}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LinkCounsel"
          component={LinkCounsel}
          durationInFrames={1348}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ── 카탈로그 ── */}
      <Folder name="Catalog">
        <Composition
          id="VisualCatalog-V1"
          component={VisualCatalog}
          durationInFrames={VISUAL_CATALOG_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="VisualCatalog-V2"
          component={VisualCatalogV2}
          durationInFrames={VISUAL_CATALOG_V2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="VisualCatalog-V3"
          component={VisualCatalogV3}
          durationInFrames={VISUAL_CATALOG_V3_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="VisualCatalog-V4"
          component={VisualCatalogV4}
          durationInFrames={VISUAL_CATALOG_V4_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="VisualCatalog-V5"
          component={VisualCatalogV5}
          durationInFrames={VISUAL_CATALOG_V5_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ── 실험/폐기 ── */}
      <Folder name="Lab">
        <Composition
          id="LinkEdu-Test"
          component={() => <EpisodePlayer data={templateTest} />}
          durationInFrames={templateTest.meta.totalDurationFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LinkEdu-HookingWhy-Vertical"
          component={() => <EpisodePlayer data={hookingWhy} />}
          durationInFrames={hookingWhy.meta.totalDurationFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HookingWhy-V1"
          component={() => <EpisodePlayer data={hookingWhyV1} />}
          durationInFrames={hookingWhyV1.meta.totalDurationFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HookingWhy-V2"
          component={() => <EpisodePlayer data={hookingWhyV2} />}
          durationInFrames={hookingWhyV2.meta.totalDurationFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HookingOpening-Sample"
          component={HookingOpeningSample}
          durationInFrames={750}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
