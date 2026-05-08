import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY, PALETTES } from "../../constants";
import { GradientBackground, ParticleField, GlowOrb } from "../../components";

const palette = PALETTES.ep01;

export const Scene0_TitleCard: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground
        bgColor={palette.bg}
        glowColor={palette.glow}
        glowPosition={palette.glowPosition}
      />
      <ParticleField
        count={18}
        color={palette.accent}
        maxOpacity={0.1}
        speed={0.25}
        sizeRange={[2, 4]}
        seed="ep05-title"
      />
      <GlowOrb color={palette.accent} opacity={0.06} size={800} x="50%" y="45%" delay={0} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub }}>
            LINK Consulting
          </div>
          <div style={{ width: 200, height: 2, backgroundColor: palette.accent, borderRadius: 1 }} />
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 24px",
              borderRadius: 20, backgroundColor: "rgba(232, 168, 56, 0.12)",
              border: "1px solid rgba(232, 168, 56, 0.25)",
            }}
          >
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 700, color: palette.accent }}>L</span>
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 600, color: palette.sub }}>연결</span>
          </div>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 84, fontWeight: 900, color: palette.text, marginTop: 16, textAlign: "center" }}>
            임신해도, 임신 안 돼도
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
