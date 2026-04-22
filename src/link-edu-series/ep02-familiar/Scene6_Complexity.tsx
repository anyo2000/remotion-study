import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GlowOrb, CountUpNumber } from "../../components";
import { Ep02SceneLayout } from "./Ep02SceneLayout";
import { BEATS_COMPLEXITY } from "./ep02-beats";

const palette = PALETTES.ep01;
const B = BEATS_COMPLEXITY;

/**
 * 씬 6: 복잡함이 기회다
 *
 * "역설" 소개 → "복잡해진 거" → "기회" 반전 →
 * 숫자 "200" / "30" 카운트업 → "고객이 물어보는 거예요" CTA
 */
export const Scene6_Complexity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "역설 하나"
  const paradoxIn = spring({
    frame: Math.max(0, frame - B.PARADOX),
    fps,
    config: SPRING.smooth,
  });

  // "복잡해진 거"
  const complexIn = spring({
    frame: Math.max(0, frame - B.COMPLEX),
    fps,
    config: SPRING.smooth,
  });

  // "기회라고 봐요" — 반전 강조
  const opportunityIn = spring({
    frame: Math.max(0, frame - B.OPPORTUNITY),
    fps,
    config: SPRING.bouncy,
  });

  // "200개" 카드 등장
  const num200In = spring({
    frame: Math.max(0, frame - B.NUM_200),
    fps,
    config: SPRING.bouncy,
  });

  // "30개" 카드 등장
  const num30In = spring({
    frame: Math.max(0, frame - B.NUM_30),
    fps,
    config: SPRING.bouncy,
  });

  // "고객이 우리한테 물어보는 거예요"
  const askUsIn = spring({
    frame: Math.max(0, frame - B.ASK_US),
    fps,
    config: SPRING.smooth,
  });

  // "남은 기회거든요"
  const chanceIn = spring({
    frame: Math.max(0, frame - B.CHANCE),
    fps,
    config: SPRING.smooth,
  });

  // OPPORTUNITY 등장 후 복잡 키워드 색상 전환 (sub → accent)
  const complexColor =
    frame >= B.OPPORTUNITY
      ? palette.accent
      : palette.sub;

  // NUM_200 등장 후 상단 헤드라인 dim
  const headerDim =
    frame >= B.NUM_200
      ? interpolate(frame, [B.NUM_200, B.NUM_200 + 15], [1, 0.4], {
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <Ep02SceneLayout pageTitle="숫자로 보는 기회" dense>
      {/* 상단: 역설 소개 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          marginBottom: 40,
          opacity: headerDim,
        }}
      >
        {/* "역설 하나" */}
        <div
          style={{
            opacity: paradoxIn,
            transform: `translateY(${interpolate(paradoxIn, [0, 1], [10, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
            }}
          >
            역설 하나
          </span>
        </div>

        {/* "복잡해진 거" ← → "기회" 색상 반전 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: complexIn,
            transform: `translateY(${interpolate(complexIn, [0, 1], [10, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 80,
              fontWeight: 900,
              color: complexColor,
              transition: "color 0.3s",
            }}
          >
            복잡해진 것
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 64,
              color: palette.sub,
              opacity: 0.6,
            }}
          >
            =
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 80,
              fontWeight: 900,
              color: palette.accent,
              opacity: opportunityIn,
              transform: `scale(${interpolate(opportunityIn, [0, 1], [0.8, 1])})`,
              display: "inline-block",
            }}
          >
            기회
          </span>
        </div>
      </div>

      {/* 숫자 카드 2개 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 32,
          width: "100%",
        }}
      >
        {/* 200개 카드 */}
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            padding: "40px 36px",
            borderRadius: 20,
            backgroundColor: "rgba(232, 168, 56, 0.07)",
            border: `2px solid rgba(232, 168, 56, 0.2)`,
            textAlign: "center",
            opacity: num200In,
            transform: `translateY(${interpolate(num200In, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              marginBottom: 12,
            }}
          >
            종합형 담보
          </div>
          <CountUpNumber
            from={0}
            to={200}
            startFrame={B.NUM_200}
            duration={35}
            fontSize={96}
            color={palette.accent}
            suffix="개"
          />
        </div>

        {/* 30개 카드 */}
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            padding: "40px 36px",
            borderRadius: 20,
            backgroundColor: "rgba(232, 168, 56, 0.07)",
            border: `2px solid rgba(232, 168, 56, 0.2)`,
            textAlign: "center",
            opacity: num30In,
            transform: `translateY(${interpolate(num30In, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 600,
              color: palette.sub,
              marginBottom: 12,
            }}
          >
            암 담보만
          </div>
          <CountUpNumber
            from={0}
            to={30}
            startFrame={B.NUM_30}
            duration={30}
            fontSize={96}
            color={palette.accent}
            suffix="개"
          />
        </div>
      </div>

      {/* 하단: CTA */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            opacity: askUsIn,
            transform: `translateY(${interpolate(askUsIn, [0, 1], [8, 0])}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 700,
              color: palette.text,
            }}
          >
            고객이 우리한테 물어보는 거예요
          </span>
        </div>

        <div
          style={{
            opacity: chanceIn,
            transform: `translateY(${interpolate(chanceIn, [0, 1], [8, 0])}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 700,
              color: palette.accent,
            }}
          >
            남은 기회거든요
          </span>
        </div>
      </div>

      <GlowOrb
        color={palette.accent}
        opacity={0.06}
        size={500}
        x="50%"
        y="55%"
        delay={B.OPPORTUNITY}
      />
    </Ep02SceneLayout>
  );
};
