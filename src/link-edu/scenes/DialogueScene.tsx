import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SAFE } from "../../constants";
import { CharacterReveal, SpeechBubble } from "../../components";
import type { Palette } from "../../constants";
import type { DialogueSceneProps, AudioSync } from "../types";

type Props = DialogueSceneProps &
  AudioSync & { palette: Palette; durationInFrames?: number };

export const DialogueScene: React.FC<Props> = ({
  exchanges,
  headline,
  palette,
}) => {
  const frame = useCurrentFrame();

  // 최근 3개만 표시 — 이전 것은 페이드아웃
  const visibleExchanges = exchanges.filter((ex) => frame >= ex.delay);
  const displayExchanges = visibleExchanges.slice(-3);

  // 밀려난 버블 페이드아웃 계산
  const fadingOut = visibleExchanges.length > 3 ? visibleExchanges.slice(0, -3) : [];

  return (
    <AbsoluteFill>
      {headline && (
        <div
          style={{
            position: "absolute",
            top: SAFE.top + 40,
            left: SAFE.side,
            right: SAFE.side,
            textAlign: "center",
          }}
        >
          <CharacterReveal
            text={headline}
            delay={0}
            stagger={2}
            fontSize={72}
            fontWeight={900}
            color={palette.text}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: headline ? SAFE.top + 180 : SAFE.top + 40,
          bottom: SAFE.bottom + 40,
          left: SAFE.side,
          right: SAFE.side,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* 밀려나는 버블 (페이드아웃) */}
        {fadingOut.map((exchange) => {
          const nextDelay = visibleExchanges[3]?.delay ?? frame;
          const fadeOutProgress = interpolate(
            frame,
            [nextDelay, nextDelay + 10],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={`fade-${exchange.delay}`}
              style={{ opacity: fadeOutProgress, transform: `translateY(-10px)` }}
            >
              <SpeechBubble
                speaker={exchange.speaker}
                text={exchange.text}
                emoji={exchange.emoji}
                delay={exchange.delay}
                palette={palette}
                useTypewriter
              />
            </div>
          );
        })}

        {displayExchanges.map((exchange) => (
          <SpeechBubble
            key={`${exchange.speaker}-${exchange.delay}`}
            speaker={exchange.speaker}
            text={exchange.text}
            emoji={exchange.emoji}
            delay={exchange.delay}
            palette={palette}
            useTypewriter
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
