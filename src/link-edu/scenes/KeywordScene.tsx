import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { CountUpNumber } from "../../components";
import type { Palette } from "../../constants";
import type { KeywordSceneProps, AudioSync } from "../types";

type Props = KeywordSceneProps & AudioSync & { palette: Palette };


export const KeywordScene: React.FC<Props> = ({
  headline,
  sub,
  emoji,
  accentWord,
  number,
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiIn = spring({ frame: Math.max(0, frame - 2), fps, config: SPRING.bouncy });
  const headIn = spring({ frame: Math.max(0, frame - 5), fps, config: SPRING.smooth });
  const subIn = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING.smooth });

  // 배경 원형 글로우
  const glowIn = spring({ frame: Math.max(0, frame - 3), fps, config: SPRING.heavy });

  const renderHeadline = () => {
    if (!accentWord || !headline.includes(accentWord)) {
      return <span style={{ color: palette.text }}>{headline}</span>;
    }
    const idx = headline.indexOf(accentWord);
    const before = headline.slice(0, idx);
    const after = headline.slice(idx + accentWord.length);
    return (
      <>
        {before && <span style={{ color: palette.text }}>{before}</span>}
        <span style={{ color: palette.accent }}>{accentWord}</span>
        {after && <span style={{ color: palette.text }}>{after}</span>}
      </>
    );
  };

  return (
    <AbsoluteFill>
      {/* 배경 글로우 원 */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          backgroundColor: palette.accent,
          opacity: glowIn * 0.05,
          transform: `translate(-50%, -50%) scale(${glowIn})`,
          filter: "blur(60px)",
        }}
      />


      {/* 메인 콘텐츠 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: `0 ${SAFE.side + 20}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {emoji && (
            <div
              style={{
                fontSize: 140,
                opacity: emojiIn,
                transform: `scale(${emojiIn})`,
                lineHeight: 1,
              }}
            >
              {emoji}
            </div>
          )}

          <div
            style={{
              opacity: headIn,
              transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 100,
                fontWeight: 900,
                lineHeight: 1.3,
              }}
            >
              {renderHeadline()}
            </span>
          </div>

          {sub && (
            <div
              style={{
                opacity: subIn,
                transform: `translateY(${interpolate(subIn, [0, 1], [10, 0])}px)`,
                textAlign: "center",
                maxWidth: 900,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 60,
                  fontWeight: 600,
                  color: palette.sub,
                  lineHeight: 1.5,
                }}
              >
                {sub}
              </span>
            </div>
          )}

          {number && (
            <div style={{ marginTop: 20 }}>
              <CountUpNumber
                from={number.from}
                to={number.to}
                startFrame={10}
                duration={40}
                fontSize={180}
                color={palette.accent}
                fontWeight={900}
                suffix={number.suffix}
              />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
