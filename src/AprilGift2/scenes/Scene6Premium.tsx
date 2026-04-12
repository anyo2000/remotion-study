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
const DUR = 498;

export const Scene6Premium: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 30, DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  const numIn = spring({ frame, fps, config: SPRING.bouncy });
  const headIn = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.smooth });
  const subIn = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING.smooth });

  const punchFrame = 160;
  const punch = spring({ frame: Math.max(0, frame - punchFrame), fps, config: SPRING.bouncy });
  const punchScale = interpolate(punch, [0, 0.5, 1], [1, 1.06, 1]);

  const muryeoIn = spring({ frame: Math.max(0, frame - punchFrame + 10), fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 배경 원 */}
      <div
        style={{
          position: "absolute", top: "42%", left: "50%",
          width: 700, height: 700, borderRadius: "50%",
          backgroundColor: "rgba(255, 107, 53, 0.06)",
          transform: "translate(-50%, -50%)",
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
        <div style={{ opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)`, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 60 }}>👑</span>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.text }}>
            프리미엄올인원
          </span>
        </div>
      </div>

      {/* 중앙: 암치료비 합산한도 + 숫자 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ opacity: subIn, marginBottom: 16 }}>
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 600, color: P.sub }}>
              암치료비 합산한도
            </span>
          </div>

          <div style={{ transform: `scale(${punchScale})` }}>
            <CountUpNumber
              from={4000}
              to={7000}
              startFrame={90}
              duration={50}
              fontSize={180}
              color={frame >= punchFrame ? P.accent : P.text}
              suffix="만원"
              formatter={(n) => n.toLocaleString("ko-KR")}
            />
          </div>

          {/* "무려 7천!" */}
          <div
            style={{
              marginTop: 30, opacity: muryeoIn,
              transform: `scale(${muryeoIn})`,
            }}
          >
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.accent }}>
              무려 7천!
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
