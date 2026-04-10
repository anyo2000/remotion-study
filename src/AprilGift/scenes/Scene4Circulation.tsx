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
const DUR = 399;

export const Scene4Circulation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 30, DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  const numIn = spring({ frame, fps, config: SPRING.bouncy });
  const headIn = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.smooth });
  const heartIn = spring({ frame: Math.max(0, frame - 15), fps, config: SPRING.bouncy });

  const punchFrame = 130;
  const punch = spring({ frame: Math.max(0, frame - punchFrame), fps, config: SPRING.bouncy });
  const punchScale = interpolate(punch, [0, 0.5, 1], [1, 1.06, 1]);

  const badgeIn = spring({ frame: Math.max(0, frame - 170), fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ opacity }}>
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
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 900, color: "#FFF" }}>03</span>
        </div>
        <div style={{ opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.text }}>
            순환계 치료비
          </span>
        </div>
      </div>

      {/* 중앙: ❤️ + 숫자 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
        <div style={{ fontSize: 100, transform: `scale(${heartIn})`, marginBottom: 20 }}>❤️</div>
        <div style={{ transform: `scale(${punchScale})`, textAlign: "center" }}>
          <CountUpNumber
            from={2000}
            to={3000}
            startFrame={70}
            duration={40}
            fontSize={170}
            color={frame >= punchFrame ? P.accent : P.text}
            suffix="만원"
            formatter={(n) => n.toLocaleString("ko-KR")}
          />
        </div>
      </AbsoluteFill>

      {/* 하단: "경증 포함" 뱃지 크게 */}
      <div
        style={{
          position: "absolute", bottom: SAFE.bottom + 100, left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: badgeIn, transform: `scale(${badgeIn})`,
            padding: "18px 56px", borderRadius: 50, backgroundColor: P.accent,
          }}
        >
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 800, color: "#FFFFFF" }}>
            경증 포함
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
