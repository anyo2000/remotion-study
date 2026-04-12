import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SAFE, FONT_FAMILY } from "../../constants";
import { SpeechBubble } from "../../components/SpeechBubble";
import type { Palette } from "../../constants";
import type { DialogueSceneProps, AudioSync } from "../types";

type Props = DialogueSceneProps & AudioSync & { palette: Palette };

// 강제 최소 폰트
const FONT = {
  HEADLINE: 72,
} as const;

export const DialogueScene: React.FC<Props> = ({
  exchanges,
  headline,
  palette,
}) => {
  const frame = useCurrentFrame();

  // 최근 3개만 표시 — 이전 것은 페이드아웃
  const visibleExchanges = exchanges.filter((ex) => frame >= ex.delay);
  const displayExchanges = visibleExchanges.slice(-3);

  return (
    <AbsoluteFill>
      {headline && (
        <div
          style={{
            position: "absolute",
            top: SAFE.top + 20,
            left: SAFE.side,
            right: SAFE.side,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: FONT.HEADLINE,
              fontWeight: 900,
              color: palette.text,
            }}
          >
            {headline}
          </span>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: headline ? SAFE.top + 160 : SAFE.top + 40,
          bottom: SAFE.bottom + 40,
          left: SAFE.side,
          right: SAFE.side,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {displayExchanges.map((exchange, i) => (
          <SpeechBubble
            key={`${exchange.speaker}-${exchange.delay}`}
            speaker={exchange.speaker}
            text={exchange.text}
            emoji={exchange.emoji}
            delay={exchange.delay}
            palette={palette}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
