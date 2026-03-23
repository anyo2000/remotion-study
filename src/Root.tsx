import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={1366}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
