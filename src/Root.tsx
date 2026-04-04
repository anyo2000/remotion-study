import { Composition } from "remotion";
import { LinkTeaser4, linkTeaser4Schema } from "./LinkTeaser4";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
    </>
  );
};
