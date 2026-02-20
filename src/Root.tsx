import "./index.css";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Composition, staticFile } from "remotion";
import { MyComposition } from "./Composition";

const FPS = 30;
const TAIL_SECONDS = 3;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        calculateMetadata={async () => {
          const audioPath = staticFile("audio/hibot-vo-es.mp3");
          const durationInSeconds = await getAudioDurationInSeconds(audioPath);
          return {
            durationInFrames: Math.ceil((durationInSeconds + TAIL_SECONDS) * FPS),
          };
        }}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
