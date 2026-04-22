import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep02SceneLayout } from "./Ep02SceneLayout";
import { BEATS_CLIFF } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_CLIFF;

/**
 * 씬 1: 첫 통화의 절벽
 *
 * 📞 크게 중앙 등장 → "관심 없어요" 말풍선 팝업 → 📞 dim → "영영 못 만나요" 키워드
 */
export const Scene1_Cliff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 📞 등장
  const phoneIn = spring({
    frame: Math.max(0, frame - B.PHONE_IN),
    fps,
    config: SPRING.bouncy,
  });

  // 말풍선 "관심 없어요" 팝업
  const bubbleIn = spring({
    frame: Math.max(0, frame - B.REJECT_BUBBLE),
    fps,
    config: SPRING.bouncy,
  });

  // 전화 끊김 → 📞 dim
  const hangupProgress = interpolate(
    frame,
    [B.HANGUP, B.HANGUP + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "영영 못 만나요" 등장
  const neverIn = spring({
    frame: Math.max(0, frame - B.NEVER_AGAIN),
    fps,
    config: SPRING.smooth,
  });

  // 📞 dim (전화 끊기면 어두워짐)
  const phoneDim = interpolate(hangupProgress, [0, 1], [1, 0.15]);
  // 📞 크기 (끊기면 줄어듦)
  const phoneScale = interpolate(hangupProgress, [0, 1], [1, 0.7]);

  // "영영 못 만나요" 등장 시 말풍선 살짝 dim
  const bubbleDim = interpolate(
    frame,
    [B.NEVER_AGAIN, B.NEVER_AGAIN + 12],
    [1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Ep02SceneLayout pageTitle="DB 콜 첫 3초">
      {/* GlowOrb — accent 포인트 */}
      <GlowOrb
        color={palette.accent}
        opacity={0.05 * phoneIn}
        size={500}
        x="50%"
        y="45%"
        delay={B.PHONE_IN}
      />

      {/* 중앙 컨텐츠 컨테이너 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          position: "relative",
        }}
      >
        {/* 📞 이모지 */}
        <div
          style={{
            fontSize: 180,
            lineHeight: 1,
            opacity: phoneIn * phoneDim,
            transform: `scale(${interpolate(phoneIn, [0, 1], [0.4, 1]) * phoneScale})`,
            filter: hangupProgress > 0.3 ? `grayscale(${hangupProgress})` : "none",
            transition: "filter 0.1s",
          }}
        >
          📞
        </div>

        {/* "관심 없어요" 말풍선 */}
        <div
          style={{
            opacity: bubbleIn * bubbleDim,
            transform: `scale(${interpolate(bubbleIn, [0, 1], [0.5, 1])}) translateY(${interpolate(bubbleIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: `2px solid rgba(255, 255, 255, 0.15)`,
              borderRadius: 24,
              padding: "20px 48px",
            }}
          >
            {/* 말풍선 꼬리 (위쪽 삼각형) */}
            <div
              style={{
                position: "absolute",
                top: -18,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "14px solid transparent",
                borderRight: "14px solid transparent",
                borderBottom: "18px solid rgba(255, 255, 255, 0.08)",
              }}
            />
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 72,
                fontWeight: 700,
                color: palette.text,
                whiteSpace: "nowrap",
              }}
            >
              "관심 없어요"
            </span>
          </div>
        </div>

        {/* "영영 못 만나요" 키워드 */}
        <div
          style={{
            marginTop: 16,
            opacity: neverIn,
            transform: `translateY(${interpolate(neverIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 80,
              fontWeight: 900,
              color: palette.accent,
            }}
          >
            영영 못 만나요
          </span>
        </div>
      </div>
    </Ep02SceneLayout>
  );
};
