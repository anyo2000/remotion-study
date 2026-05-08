import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb } from "../../components";
import { Ep04SceneLayout } from "./Ep04SceneLayout";
import { BEATS_PHONE_CALL } from "./ep04-beats";

const palette = PALETTES.ep01;
const B = BEATS_PHONE_CALL;

/**
 * 씬 1: 김영숙 FP의 전화
 * 📱 + 음파 → FP 말풍선 → 고객 거절 말풍선 → 전화 끊김
 */
export const Scene1_PhoneCall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({
    frame: Math.max(0, frame - B.PHONE_IN),
    fps,
    config: SPRING.bouncy,
  });

  const fpBubbleIn = spring({
    frame: Math.max(0, frame - B.FP_BUBBLE),
    fps,
    config: SPRING.smooth,
  });

  const customerBubbleIn = spring({
    frame: Math.max(0, frame - B.CUSTOMER_BUBBLE),
    fps,
    config: SPRING.smooth,
  });

  const phoneCut = frame >= B.PHONE_CUT;
  const cutProgress = phoneCut
    ? spring({
        frame: Math.max(0, frame - B.PHONE_CUT),
        fps,
        config: SPRING.heavy,
      })
    : 0;

  // 음파 동심원 (전화 끊기면 사라짐)
  const waveOpacity = phoneCut
    ? interpolate(cutProgress, [0, 1], [0.15, 0])
    : interpolate(phoneIn, [0, 1], [0, 0.15]);

  // shake 효과
  const shakeX = phoneCut && frame < B.PHONE_CUT + 12
    ? Math.sin((frame - B.PHONE_CUT) * 2.5) * 8 * (1 - cutProgress)
    : 0;

  return (
    <Ep04SceneLayout pageTitle="늘 하던 대로">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          width: "100%",
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* 📱 전화 이모지 + 음파 */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 120,
              lineHeight: 1,
              opacity: phoneIn,
              transform: `scale(${interpolate(phoneIn, [0, 1], [0.5, 1])})`,
            }}
          >
            📱
          </div>
          {/* 음파 동심원 */}
          {[100, 160, 220].map((size, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `2px solid ${palette.accent}`,
                opacity: waveOpacity * (1 - i * 0.3),
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* 말풍선 영역 */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            gap: 60,
            alignItems: "flex-start",
          }}
        >
          {/* FP 말풍선 (좌) */}
          <div
            style={{
              maxWidth: 520,
              padding: "24px 32px",
              borderRadius: 20,
              backgroundColor: palette.card,
              border: `1px solid ${palette.cardBorder}`,
              opacity: fpBubbleIn,
              transform: `translateX(${interpolate(fpBubbleIn, [0, 1], [-40, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
                marginBottom: 8,
              }}
            >
              🧑‍💼 FP
            </div>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.text,
                lineHeight: 1.5,
              }}
            >
              "보장 분석 좀{"\n"}해드리려고요"
            </div>
          </div>

          {/* 고객 말풍선 (우) */}
          <div
            style={{
              maxWidth: 560,
              padding: "24px 32px",
              borderRadius: 20,
              backgroundColor: "rgba(224, 90, 90, 0.08)",
              border: "1px solid rgba(224, 90, 90, 0.2)",
              opacity: customerBubbleIn,
              transform: `translateX(${interpolate(customerBubbleIn, [0, 1], [40, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.sub,
                marginBottom: 8,
              }}
            >
              😐 고객
            </div>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: palette.text,
                lineHeight: 1.5,
              }}
            >
              "또 다 해약하라는{"\n"}거 아니에요?"
            </div>
          </div>
        </div>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.04}
        size={500}
        x="50%"
        y="35%"
        delay={B.PHONE_IN}
      />
    </Ep04SceneLayout>
  );
};
