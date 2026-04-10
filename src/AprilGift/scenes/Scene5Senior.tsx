import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { PALETTES, SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { CountUpNumber } from "../../components";

const P = PALETTES.aprilGift;
const DUR = 519;

export const Scene5Senior: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 30, DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  const numIn = spring({ frame, fps, config: SPRING.bouncy });
  const headIn = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.smooth });
  const ageIn = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING.smooth });

  const punchFrame = 170;
  const punch = spring({ frame: Math.max(0, frame - punchFrame), fps, config: SPRING.bouncy });
  const punchScale = interpolate(punch, [0, 0.5, 1], [1, 1.08, 1]);

  const x4In = spring({ frame: Math.max(0, frame - 220), fps, config: SPRING.bouncy });

  const glowPulse = spring({ frame: Math.max(0, frame - 220), fps, config: SPRING.heavy });
  const glowOpacity = interpolate(glowPulse, [0, 0.3, 1], [0, 0.1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 글로우 펄스 */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          width: 600, height: 600, borderRadius: "50%",
          backgroundColor: P.accent, transform: "translate(-50%, -50%)",
          opacity: glowOpacity, filter: "blur(80px)",
        }}
      />

      {/* 상단: 번호 + 제목 */}
      <div
        style={{
          position: "absolute", top: SAFE.top + 30, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}
      >
        <div
          style={{
            opacity: numIn, transform: `scale(${numIn})`,
            width: 80, height: 80, borderRadius: "50%", backgroundColor: P.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 900, color: "#FFF" }}>04</span>
        </div>
        <div style={{ opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.text }}>
            고령 생활비
          </span>
        </div>
      </div>

      {/* 중앙 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ opacity: ageIn, marginBottom: 10 }}>
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 700, color: P.sub }}>
              61세 ~ 70세
            </span>
          </div>

          <div style={{ transform: `scale(${punchScale})`, textAlign: "center" }}>
            <CountUpNumber
              from={500}
              to={2000}
              startFrame={90}
              duration={60}
              fontSize={170}
              color={frame >= punchFrame ? P.accent : P.text}
              suffix="만원"
              formatter={(n) => n.toLocaleString("ko-KR")}
            />
          </div>

          <div
            style={{
              marginTop: 30,
              transform: `scale(${interpolate(x4In, [0, 1], [0, 1])}) rotate(${interpolate(x4In, [0, 1], [-10, 0])}deg)`,
              opacity: x4In,
            }}
          >
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 140, fontWeight: 900, color: P.accent }}>
              ×4배!
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
