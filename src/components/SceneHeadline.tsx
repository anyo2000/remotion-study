import React from "react";
import { SAFE, FONT_FAMILY, PALETTES, type PaletteName } from "../constants";

type Props = {
  text: string;
  opacity: number;
  /** 강조색 직접 지정 (기본: blue 팔레트의 accent) */
  accentColor?: string;
  /** 팔레트 이름으로 accent 결정 */
  palette?: PaletteName;
  fontSize?: number;
};

export const SceneHeadline: React.FC<Props> = ({
  text,
  opacity,
  accentColor,
  palette = "blue",
  fontSize = 72,
}) => {
  const color = accentColor ?? PALETTES[palette].accent;

  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 40,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
      }}
    >
      <p
        style={{
          color,
          fontSize,
          fontWeight: "bold",
          margin: 0,
          fontFamily: FONT_FAMILY,
        }}
      >
        {text}
      </p>
    </div>
  );
};
