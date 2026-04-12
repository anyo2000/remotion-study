import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { CountUpNumber, CharacterReveal, WordHighlight } from "../../components";
import type { Palette } from "../../constants";
import type { KeywordSceneProps, AudioSync } from "../types";

type Props = KeywordSceneProps &
  AudioSync & { palette: Palette; durationInFrames?: number };

export const KeywordScene: React.FC<Props> = ({
  headline,
  sub,
  emoji,
  accentWord,
  number,
  palette,
  cues,
  durationInFrames: dur,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDur } = useVideoConfig();
  const duration = dur ?? configDur;

  // ── BEATS ────────────────────────────────────────
  const BEATS = {
    EMOJI_IN: cues?.emoji ?? 0,
    HEADLINE_IN: cues?.headline ?? 5,
    SUB_IN: cues?.sub ?? 20,
    HIGHLIGHT: cues?.highlight ?? Math.floor(duration * 0.35),
    DIM_OTHERS: Math.floor(duration * 0.6),
  };

  // ── 스프링 ────────────────────────────────────────
  const emojiIn = spring({
    frame: Math.max(0, frame - BEATS.EMOJI_IN),
    fps,
    config: SPRING.bouncy,
  });
  const subIn = spring({
    frame: Math.max(0, frame - BEATS.SUB_IN),
    fps,
    config: SPRING.smooth,
  });

  // HIGHLIGHT 단계: 나머지 요소 dim
  const dimProgress =
    frame >= BEATS.DIM_OTHERS
      ? interpolate(
          frame,
          [BEATS.DIM_OTHERS, BEATS.DIM_OTHERS + 15],
          [1, 0.4],
          { extrapolateRight: "clamp" }
        )
      : 1;

  // 강조 단어 하이라이트 활성화
  const highlightActive = frame >= BEATS.HIGHLIGHT;

  return (
    <AbsoluteFill>
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
          {/* 이모지 */}
          {emoji && (
            <div
              style={{
                fontSize: 140,
                opacity: emojiIn * dimProgress,
                transform: `scale(${emojiIn})`,
                lineHeight: 1,
              }}
            >
              {emoji}
            </div>
          )}

          {/* 헤드라인 — CharacterReveal */}
          <div style={{ position: "relative", textAlign: "center" }}>
            <CharacterReveal
              text={headline}
              delay={BEATS.HEADLINE_IN}
              stagger={2}
              fontSize={100}
              fontWeight={900}
              color={palette.text}
            />
            {/* 강조 단어 — 위에 겹쳐서 accent 색상 */}
            {accentWord && headline.includes(accentWord) && (
              <AccentOverlay
                headline={headline}
                accentWord={accentWord}
                delay={BEATS.HEADLINE_IN}
                highlightDelay={BEATS.HIGHLIGHT}
                palette={palette}
              />
            )}
          </div>

          {/* 서브 텍스트 */}
          {sub && (
            <div
              style={{
                opacity: subIn * dimProgress,
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

          {/* 숫자 카운트업 */}
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

/**
 * AccentOverlay — 헤드라인 위에 겹쳐서 강조 단어만 accent 색상으로 보여줌.
 * CharacterReveal이 전체 텍스트를 palette.text로 렌더한 위에,
 * 이 오버레이가 accentWord 부분만 accent 색상 + WordHighlight 배경 바로 덮음.
 *
 * 장점: CharacterReveal의 줄바꿈/정렬을 그대로 쓰면서 accent만 추가.
 * 구현: 동일한 CharacterReveal을 한 번 더 렌더하되 accentWord만 보이게.
 */
const AccentOverlay: React.FC<{
  headline: string;
  accentWord: string;
  delay: number;
  highlightDelay: number;
  palette: Palette;
}> = ({ headline, accentWord, delay, highlightDelay, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const idx = headline.indexOf(accentWord);
  const accentCharStart = idx;

  // accent 글자별 spring (CharacterReveal과 동일 타이밍)
  const chars = accentWord.split("");

  // WordHighlight 배경 바는 HIGHLIGHT 시점에 등장
  const highlightProgress = spring({
    frame: Math.max(0, frame - highlightDelay),
    fps,
    config: SPRING.smooth,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {/* 헤드라인과 동일 구조지만 accentWord만 보임 */}
      {headline.split("\n").map((line, li) => {
        // 이 줄에 accentWord가 있는지 확인
        const lineStart = headline.split("\n").slice(0, li).join("\n").length + (li > 0 ? 1 : 0);
        const lineEnd = lineStart + line.length;
        const accentEnd = idx + accentWord.length;
        const hasAccent = idx >= lineStart && idx < lineEnd;

        if (!hasAccent) {
          // 이 줄에 accent가 없으면 투명한 placeholder (높이 유지)
          return (
            <div key={li} style={{ fontSize: 100, fontWeight: 900, lineHeight: 1.3, visibility: "hidden" }}>
              {line}
            </div>
          );
        }

        const beforeInLine = line.slice(0, idx - lineStart);
        const accentInLine = accentWord;
        const afterInLine = line.slice(idx - lineStart + accentWord.length);

        return (
          <div
            key={li}
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 100,
              fontWeight: 900,
              lineHeight: 1.3,
              fontFamily: FONT_FAMILY,
            }}
          >
            {/* before: 투명 placeholder */}
            {beforeInLine && (
              <span style={{ visibility: "hidden" }}>{beforeInLine}</span>
            )}
            {/* accent word: 보이는 텍스트 + WordHighlight */}
            <WordHighlight
              color={palette.accent}
              delay={highlightDelay}
              fontSize={100}
              fontWeight={900}
              textColor={palette.accent}
              heightRatio={highlightProgress > 0.01 ? 0.35 : 0}
            >
              {accentInLine}
            </WordHighlight>
            {/* after: 투명 placeholder */}
            {afterInLine && (
              <span style={{ visibility: "hidden" }}>{afterInLine}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
