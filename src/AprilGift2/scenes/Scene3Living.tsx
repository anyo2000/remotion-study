import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { PALETTES, SPRING, SAFE, FONT_FAMILY } from "../../constants";
import { CountUpNumber, GaugeBar } from "../../components";

const P = PALETTES.aprilGift;
const DUR = 618;

const TAGS = ["암치료비", "비급여", "암생활비"];

export const Scene3Living: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 30, DUR], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  const numIn = spring({ frame, fps, config: SPRING.bouncy });
  const headIn = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING.smooth });
  const gaugeIn = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING.smooth });

  const punchFrame = 140;
  const punch = spring({ frame: Math.max(0, frame - punchFrame), fps, config: SPRING.bouncy });
  const punchScale = interpolate(punch, [0, 0.5, 1], [1, 1.06, 1]);

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
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 900, color: "#FFF" }}>02</span>
        </div>
        <div style={{ opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [15, 0])}px)` }}>
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 80, fontWeight: 900, color: P.text }}>
            암생활비 한도
          </span>
        </div>
      </div>

      {/* 중앙: 숫자 + 게이지 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ transform: `scale(${punchScale})`, marginBottom: 30 }}>
            <CountUpNumber
              from={4000}
              to={5000}
              startFrame={70}
              duration={50}
              fontSize={160}
              color={frame >= punchFrame ? P.accent : P.text}
              suffix="만원"
              formatter={(n) => n.toLocaleString("ko-KR")}
            />
          </div>

          <div style={{ opacity: gaugeIn, transform: `translateY(${interpolate(gaugeIn, [0, 1], [20, 0])}px)` }}>
            <GaugeBar
              fromRatio={4000 / 6000}
              toRatio={5000 / 6000}
              startFrame={70}
              barColor={P.accent}
              width={860}
              height={44}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* 하단: 태그들 (제목급 크기) */}
      <div
        style={{
          position: "absolute", bottom: SAFE.bottom + 80, left: SAFE.side, right: SAFE.side,
          display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap",
        }}
      >
        {TAGS.map((tag, i) => {
          const tagIn = spring({
            frame: Math.max(0, frame - (200 + i * 30)), fps, config: SPRING.snappy,
          });
          return (
            <div
              key={tag}
              style={{
                opacity: tagIn,
                transform: `scale(${tagIn})`,
                padding: "14px 36px", borderRadius: 40,
                backgroundColor: "rgba(255, 107, 53, 0.12)",
                border: `2px solid ${P.cardBorder}`,
              }}
            >
              <span style={{ fontFamily: FONT_FAMILY, fontSize: 56, fontWeight: 700, color: P.text }}>
                {tag}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
