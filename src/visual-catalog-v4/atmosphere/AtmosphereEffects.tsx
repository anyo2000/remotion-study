import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from "remotion";
import {
  SPRING,
  FONT_FAMILY,
  PALETTES,
  SAFE_WIDE,
} from "../../constants";
import {
  GradientBackground,
  GlowOrb,
  ParticleField,
  CharacterReveal,
} from "../../components";

// ── 공통 콘텐츠 ─────────────────────────────────────────
// 모든 샘플에서 동일한 텍스트를 보여줌
const SharedContent: React.FC<{
  textColor?: string;
  accentColor?: string;
  subColor?: string;
  delay?: number;
}> = ({
  textColor = PALETTES.coolBlue.text,
  accentColor = PALETTES.coolBlue.accent,
  subColor = PALETTES.coolBlue.sub,
  delay = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING.smooth,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: `${SAFE_WIDE.top}px ${SAFE_WIDE.side}px`,
      }}
    >
      {/* 이모지 */}
      <div
        style={{
          fontSize: 120,
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
          marginBottom: 32,
        }}
      >
        🔍
      </div>

      {/* 메인 타이틀 */}
      <CharacterReveal
        text="보장분석"
        delay={delay + 5}
        fontSize={96}
        fontWeight={900}
        color={textColor}
        blur
        style={{ marginBottom: 24 }}
      />

      {/* 서브 카피 */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 56,
          fontWeight: 600,
          color: subColor,
          opacity: interpolate(enter, [0, 0.5, 1], [0, 0, 1]),
          transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`,
          textAlign: "center",
        }}
      >
        고객의 빈틈이 보입니다
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Group 1: 파티클 밀도
// ══════════════════════════════════════════════════════════

/** 1. 파티클 없음 — GradientBackground만 */
export const NoParticle: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <SharedContent />
  </AbsoluteFill>
);

/** 2. 파티클 적음 — 15개, 느림, 은은 */
export const LightParticle: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <ParticleField
      count={15}
      color={PALETTES.coolBlue.accent}
      maxOpacity={0.08}
      speed={0.01}
      sizeRange={[2, 5]}
      seed="light"
    />
    <SharedContent />
  </AbsoluteFill>
);

/** 3. 파티클 밀집 — 50개, 빠름, 뚜렷 */
export const DenseParticle: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <ParticleField
      count={50}
      color={PALETTES.coolBlue.accentLight}
      maxOpacity={0.2}
      speed={0.04}
      sizeRange={[3, 8]}
      seed="dense"
    />
    <SharedContent />
  </AbsoluteFill>
);

// ══════════════════════════════════════════════════════════
// Group 2: 글로우 위치/크기
// ══════════════════════════════════════════════════════════

/** 4. 글로우 상단 — 큰 사이즈 */
export const GlowTop: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <GlowOrb
      color={PALETTES.coolBlue.accent}
      x="50%"
      y="20%"
      size={800}
      opacity={0.08}
      pulse={0.12}
    />
    <ParticleField
      count={20}
      color={PALETTES.coolBlue.accent}
      maxOpacity={0.1}
      speed={0.015}
      sizeRange={[2, 5]}
      seed="glowtop"
    />
    <SharedContent />
  </AbsoluteFill>
);

/** 5. 글로우 중앙 — 보통 사이즈 */
export const GlowCenter: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <GlowOrb
      color={PALETTES.coolBlue.accent}
      x="50%"
      y="50%"
      size={600}
      opacity={0.06}
      pulse={0.1}
    />
    <ParticleField
      count={20}
      color={PALETTES.coolBlue.accent}
      maxOpacity={0.1}
      speed={0.015}
      sizeRange={[2, 5]}
      seed="glowcenter"
    />
    <SharedContent />
  </AbsoluteFill>
);

/** 6. 글로우 다중 — 3곳 분산 */
export const GlowMulti: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <GlowOrb
      color={PALETTES.coolBlue.accent}
      x="20%"
      y="25%"
      size={500}
      opacity={0.06}
      pulse={0.08}
      delay={0}
    />
    <GlowOrb
      color={PALETTES.coolBlue.accentLight}
      x="75%"
      y="60%"
      size={450}
      opacity={0.05}
      pulse={0.1}
      delay={10}
    />
    <GlowOrb
      color={PALETTES.coolBlue.accent}
      x="50%"
      y="80%"
      size={400}
      opacity={0.04}
      pulse={0.12}
      delay={20}
    />
    <ParticleField
      count={20}
      color={PALETTES.coolBlue.accent}
      maxOpacity={0.1}
      speed={0.015}
      sizeRange={[2, 5]}
      seed="glowmulti"
    />
    <SharedContent />
  </AbsoluteFill>
);

// ══════════════════════════════════════════════════════════
// Group 3: 다크 vs 라이트
// ══════════════════════════════════════════════════════════

/** 7. 다크 모드 — coolBlue 팔레트 */
export const DarkMode: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <GlowOrb
      color={PALETTES.coolBlue.accent}
      x="50%"
      y="50%"
      size={600}
      opacity={0.05}
      pulse={0.1}
    />
    <ParticleField
      count={20}
      color={PALETTES.coolBlue.accent}
      maxOpacity={0.1}
      speed={0.015}
      sizeRange={[2, 5]}
      seed="dark"
    />
    <SharedContent
      textColor={PALETTES.coolBlue.text}
      accentColor={PALETTES.coolBlue.accent}
      subColor={PALETTES.coolBlue.sub}
    />
  </AbsoluteFill>
);

/** 8. 라이트 모드 — linkEdu 팔레트 */
export const LightMode: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="linkEdu" />
    <GlowOrb
      color={PALETTES.linkEdu.accent}
      x="50%"
      y="35%"
      size={600}
      opacity={0.06}
      pulse={0.1}
    />
    <ParticleField
      count={20}
      color={PALETTES.linkEdu.accent}
      maxOpacity={0.08}
      speed={0.015}
      sizeRange={[2, 5]}
      seed="light-mode"
    />
    <SharedContent
      textColor={PALETTES.linkEdu.text}
      accentColor={PALETTES.linkEdu.accent}
      subColor={PALETTES.linkEdu.sub}
    />
  </AbsoluteFill>
);

// ══════════════════════════════════════════════════════════
// Group 4: 시네마틱 효과
// ══════════════════════════════════════════════════════════

/** 9. 비네팅 — 가장자리 어둡게 */
export const Vignette: React.FC = () => (
  <AbsoluteFill>
    <GradientBackground palette="coolBlue" />
    <ParticleField
      count={20}
      color={PALETTES.coolBlue.accent}
      maxOpacity={0.1}
      speed={0.015}
      sizeRange={[2, 5]}
      seed="vignette"
    />
    <SharedContent />
    {/* 비네트 오버레이 */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        pointerEvents: "none",
      }}
    />
  </AbsoluteFill>
);

/** 10. 레터박스 — 시네마틱 상하 블랙바 (2.35:1 느낌) */
export const Letterbox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barEnter = spring({
    frame,
    fps,
    config: SPRING.heavy,
  });

  // 16:9 → 2.35:1 = 상하 약 87px씩
  const barHeight = interpolate(barEnter, [0, 1], [0, 87]);

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <ParticleField
        count={20}
        color={PALETTES.coolBlue.accent}
        maxOpacity={0.1}
        speed={0.015}
        sizeRange={[2, 5]}
        seed="letterbox"
      />
      <SharedContent />
      {/* 상단 바 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: "#000000",
        }}
      />
      {/* 하단 바 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: "#000000",
        }}
      />
    </AbsoluteFill>
  );
};

/** 11. 필름 그레인 — 결정론적 노이즈 텍스처 */
export const GrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // 결정론적 그레인: 프레임마다 다른 시드로 점 위치 생성
  const grainDots = React.useMemo(() => {
    const dots: Array<{ x: number; y: number; opacity: number }> = [];
    const GRAIN_COUNT = 300;
    for (let i = 0; i < GRAIN_COUNT; i++) {
      dots.push({
        x: random(`grain-x-${frame % 6}-${i}`) * 100,
        y: random(`grain-y-${frame % 6}-${i}`) * 100,
        opacity: random(`grain-o-${frame % 6}-${i}`) * 0.12,
      });
    }
    return dots;
  }, [Math.floor(frame / 2)]); // 2프레임마다 갱신 (필름 느낌)

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <ParticleField
        count={20}
        color={PALETTES.coolBlue.accent}
        maxOpacity={0.1}
        speed={0.015}
        sizeRange={[2, 5]}
        seed="grain"
      />
      <SharedContent />
      {/* 그레인 오버레이 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {grainDots.map((dot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: 2,
              height: 2,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** 12. 색상 시프트 — 배경 hue가 서서히 변화 */
export const ColorShift: React.FC = () => {
  const frame = useCurrentFrame();

  // 프레임에 따라 hue 값 변화 (0~360도를 천천히 순환)
  const hue = (frame * 0.8) % 360;
  const bgColor = `hsl(${hue}, 30%, 10%)`;
  const glowColor = `hsla(${hue}, 50%, 40%, 0.06)`;
  const accentColor = `hsl(${hue}, 50%, 60%)`;
  const accentLightColor = `hsl(${hue}, 50%, 70%)`;

  return (
    <AbsoluteFill>
      <GradientBackground
        bgColor={bgColor}
        glowColor={glowColor}
        glowPosition="50% 50%"
      />
      <ParticleField
        count={20}
        color={accentLightColor}
        maxOpacity={0.1}
        speed={0.015}
        sizeRange={[2, 5]}
        seed="colorshift"
      />
      <SharedContent
        textColor="#f0f0f0"
        accentColor={accentColor}
        subColor="#8899AA"
      />
    </AbsoluteFill>
  );
};
