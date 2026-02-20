import "./index.css";
import { Composition, staticFile } from "remotion";
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";
import { MyComposition } from "./Composition";

const getAudioDuration = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  return input.computeDuration();
};

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        calculateMetadata={async () => {
          const durationInSeconds = await getAudioDuration(
            staticFile("/audio/hibot-vo-es.mp3")
          );
          return {
            durationInFrames: Math.ceil(durationInSeconds * FPS),
          };
        }}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
