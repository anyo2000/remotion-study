import React from "react";
import { AbsoluteFill } from "remotion";
import { PALETTES, type PaletteName } from "../constants";

type Props = {
  /** 팔레트 이름 (constants.ts에서 가져옴) */
  palette?: PaletteName;
  /** 직접 지정할 경우 */
  bgColor?: string;
  glowColor?: string;
  glowPosition?: string;
};

export const GradientBackground: React.FC<Props> = ({
  palette,
  bgColor,
  glowColor,
  glowPosition,
}) => {
  const p = palette ? PALETTES[palette] : null;
  const bg = bgColor ?? p?.bg ?? "#0c1117";
  const glow = glowColor ?? p?.glow ?? "rgba(91, 155, 213, 0.05)";
  const pos = glowPosition ?? p?.glowPosition ?? "50% 40%";

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: bg }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at ${pos}, ${glow}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
