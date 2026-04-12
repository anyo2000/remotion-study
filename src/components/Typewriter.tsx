import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "../constants";

type Props = {
  /** 표시할 텍스트 */
  text: string;
  /** 시작 프레임 */
  delay?: number;
  /** 초당 글자 수 */
  charsPerSecond?: number;
  /** 커서 표시 여부 */
  showCursor?: boolean;
  /** 커서 문자 */
  cursor?: string;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  style?: React.CSSProperties;
};

export const Typewriter: React.FC<Props> = ({
  text,
  delay = 0,
  charsPerSecond = 20,
  showCursor = true,
  cursor = "│",
  fontSize = 64,
  fontWeight = 700,
  color = "#F0F0F0",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - delay);
  const charsPerFrame = charsPerSecond / fps;
  const visibleChars = Math.min(
    Math.floor(elapsed * charsPerFrame),
    text.length
  );
  const done = visibleChars >= text.length;

  // 커서 깜빡임: 타이핑 중엔 항상 보임, 완료 후 깜빡
  const cursorVisible = !done || Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.4,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {text.slice(0, visibleChars)}
      {showCursor && (
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>{cursor}</span>
      )}
    </div>
  );
};
