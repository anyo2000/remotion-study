import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../constants";
import {
  GradientBackground,
  ParticleField,
  GlowOrb,
  CameraZoom,
} from "../components";
import { PALETTES } from "../constants";
import { EpisodeLayout } from "./EpisodeLayout";
import { SceneTransition } from "./SceneTransition";
import { SCENE_MAP } from "./scenes";
import type { EpisodeData } from "./types";

const OVERLAP = 12; // 장면 간 크로스 디졸브 프레임

export const EpisodePlayer: React.FC<{ data: EpisodeData }> = ({ data }) => {
  const { meta, scenes } = data;
  const palette = PALETTES[meta.palette as keyof typeof PALETTES];
  const frame = useCurrentFrame();

  // 타이틀 카드 이후에만 라벨 표시
  const titleEnd = scenes[0]?.type === "titlecard"
    ? (scenes[1]?.startFrame ?? 60)
    : 0;
  const showLabel = frame >= titleEnd;

  return (
    <AbsoluteFill>
      {/* 배경 레이어 */}
      <GradientBackground
        bgColor={palette.bg}
        glowColor={palette.glow}
        glowPosition={palette.glowPosition}
      />
      <ParticleField
        count={50}
        color={palette.accent}
        maxOpacity={0.12}
        speed={0.015}
        seed={meta.id}
      />
      <GlowOrb
        color={palette.accent}
        opacity={0.05}
        pulse={0.08}
        size={700}
      />

      {/* 장면 콘텐츠 — 카메라 줌 적용 */}
      <CameraZoom from={1.0} to={1.04}>
        {scenes.map((scene, i) => {
          const SceneComponent = SCENE_MAP[scene.type];
          if (!SceneComponent) return null;

          const from = scene.startFrame;
          const nextStart =
            scenes[i + 1]?.startFrame ?? meta.totalDurationFrames;
          const baseDuration = nextStart - from;
          const isLast = i === scenes.length - 1;
          const duration = isLast ? baseDuration : baseDuration + OVERLAP;

          return (
            <Sequence
              key={i}
              from={from}
              durationInFrames={duration}
              name={`${scene.type}-${i}`}
            >
              <SceneTransition
                durationInFrames={duration}
                fadeInFrames={i === 0 ? 0 : 12}
                fadeOutFrames={isLast ? 0 : 15}
              >
                {scene.type === "titlecard" ? (
                  <SceneComponent
                    {...(scene as any)}
                    palette={palette}
                    durationInFrames={duration}
                  />
                ) : (
                  <EpisodeLayout
                    meta={meta}
                    sceneIndex={i}
                    totalScenes={scenes.length}
                    palette={palette}
                    durationInFrames={duration}
                  >
                    <SceneComponent
                      {...(scene as any)}
                      palette={palette}
                      durationInFrames={duration}
                    />
                  </EpisodeLayout>
                )}
              </SceneTransition>
            </Sequence>
          );
        })}
      </CameraZoom>

      {/* 고정 라벨 — CameraZoom 밖, 움직이지 않음 */}
      {showLabel && (
        <div
          style={{
            position: "absolute",
            top: 55,
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              opacity: 0.4,
            }}
          >
            {meta.category}단계 · {meta.title}
          </span>
        </div>
      )}

      {/* 오디오: audioOffset 만큼 늦게 시작 (타이틀 카드 이후) */}
      <Sequence from={meta.audioOffset ?? 0}>
        <Audio src={staticFile(meta.audioFile)} />
        {meta.bgmFile && (
          <Audio src={staticFile(meta.bgmFile)} volume={meta.bgmVolume ?? 0.1} />
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
