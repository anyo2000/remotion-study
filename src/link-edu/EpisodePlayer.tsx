import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { GradientBackground } from "../components";
import { PALETTES } from "../constants";
import { EpisodeLayout } from "./EpisodeLayout";
import { SCENE_MAP } from "./scenes";
import type { EpisodeData } from "./types";

export const EpisodePlayer: React.FC<{ data: EpisodeData }> = ({ data }) => {
  const { meta, scenes } = data;
  const palette = PALETTES[meta.palette as keyof typeof PALETTES];

  return (
    <AbsoluteFill>
      <GradientBackground
        bgColor={palette.bg}
        glowColor={palette.glow}
        glowPosition={palette.glowPosition}
      />

      {scenes.map((scene, i) => {
        const SceneComponent = SCENE_MAP[scene.type];
        if (!SceneComponent) return null;

        const from = scene.startFrame;
        const nextStart = scenes[i + 1]?.startFrame ?? meta.totalDurationFrames;
        const duration = nextStart - from;

        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={duration}
            name={`${scene.type}-${i}`}
          >
            {scene.type === "titlecard" ? (
              <SceneComponent {...(scene as any)} palette={palette} />
            ) : (
              <EpisodeLayout
                meta={meta}
                sceneIndex={i}
                totalScenes={scenes.length}
                palette={palette}
              >
                <SceneComponent {...(scene as any)} palette={palette} />
              </EpisodeLayout>
            )}
          </Sequence>
        );
      })}

      <Audio src={staticFile(meta.audioFile)} />
      {meta.bgmFile && (
        <Audio src={staticFile(meta.bgmFile)} volume={meta.bgmVolume ?? 0.1} />
      )}
    </AbsoluteFill>
  );
};
