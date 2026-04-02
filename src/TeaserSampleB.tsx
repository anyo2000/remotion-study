import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ===== 팔레트 =====
const P = {
  bg: "#0B1120",
  text: "#F0F0F0",
  sub: "#8899AA",
  accent: "#FF8C38",
};

const Background: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: P.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 140, 56, 0.03), transparent)`,
      }}
    />
  </AbsoluteFill>
);

// ===== 버전 B: 도형 메타포형 =====
// 체크마크 도형들이 쌓이다가 깨지고, 파편 사이에서 텍스트 등장
export const TeaserSampleB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Phase 1: 체크마크 박스들이 쌓임 (0~35프레임) ===
  const boxes = [
    { x: 540, y: 1300, w: 200, h: 160 },
    { x: 540, y: 1120, w: 200, h: 160 },
    { x: 540, y: 940, w: 200, h: 160 },
  ];

  const boxScales = boxes.map((_, i) =>
    spring({
      frame: Math.max(0, frame - i * 10),
      fps,
      config: { damping: 10, stiffness: 150 },
    })
  );

  // 각 박스 안의 체크마크 진행도
  const checkProgresses = boxes.map((_, i) =>
    interpolate(
      frame,
      [i * 10 + 8, i * 10 + 18],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // === Phase 2: 깨짐 (35프레임~) ===
  const breakStart = 38;
  const breakProgress = interpolate(
    frame,
    [breakStart, breakStart + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
  );

  // 깨질 때 shake
  const shakeActive = frame >= breakStart && frame <= breakStart + 8;
  const shakeX = shakeActive ? Math.sin(frame * 10) * 15 : 0;
  const shakeY = shakeActive ? Math.cos(frame * 7) * 10 : 0;

  // 파편 방향 (박스 3개 → 각각 2조각 = 6파편)
  const fragments = [
    { tx: -250, ty: 300, rot: -40 },
    { tx: 200, ty: 350, rot: 35 },
    { tx: -180, ty: 250, rot: -55 },
    { tx: 280, ty: 280, rot: 45 },
    { tx: -300, ty: 200, rot: -30 },
    { tx: 150, ty: 400, rot: 60 },
  ];

  // === Phase 3: 텍스트 등장 (파편 사이에서) ===
  const textDelay = breakStart + 15;
  const textScale = spring({
    frame: Math.max(0, frame - textDelay),
    fps,
    config: { damping: 8, stiffness: 120 },
  });
  const textOpacity = interpolate(
    frame,
    [textDelay, textDelay + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 텍스트 뒤의 강조 라인
  const lineDelay = textDelay + 10;
  const lineWidth = interpolate(
    frame,
    [lineDelay, lineDelay + 15],
    [0, 600],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <Background />

      {/* 쌓이는 박스들 (깨지기 전) */}
      {breakProgress === 0 &&
        boxes.map((box, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: box.x - box.w / 2,
              top: box.y - box.h / 2,
              width: box.w,
              height: box.h,
              borderRadius: 20,
              border: `3px solid ${P.sub}`,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              transform: `scale(${boxScales[i]})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* 체크마크 SVG */}
            <svg width={80} height={80} viewBox="0 0 24 24">
              <path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke={P.accent}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={24}
                strokeDashoffset={24 * (1 - checkProgresses[i])}
              />
            </svg>
          </div>
        ))}

      {/* 깨지는 파편들 */}
      {breakProgress > 0 &&
        fragments.map((frag, i) => {
          const boxIdx = Math.floor(i / 2);
          const box = boxes[boxIdx];
          const isLeft = i % 2 === 0;

          return (
            <div
              key={`frag-${i}`}
              style={{
                position: "absolute",
                left: box.x - box.w / 2 + (isLeft ? 0 : box.w / 2),
                top: box.y - box.h / 2,
                width: box.w / 2,
                height: box.h,
                borderRadius: isLeft ? "20px 0 0 20px" : "0 20px 20px 0",
                border: `3px solid ${P.sub}`,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                transform: `translate(${frag.tx * breakProgress}px, ${frag.ty * breakProgress}px) rotate(${frag.rot * breakProgress}deg)`,
                opacity: 1 - breakProgress * 0.7,
              }}
            />
          );
        })}

      {/* 텍스트 — 파편 사이에서 등장 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          opacity: textOpacity,
          transform: `scale(${Math.max(0.7, textScale)})`,
        }}
      >
        {/* 강조 라인 (텍스트 뒤) */}
        <div
          style={{
            position: "absolute",
            width: lineWidth,
            height: 8,
            backgroundColor: P.accent,
            borderRadius: 4,
            opacity: 0.15,
            top: "52%",
          }}
        />

        <p
          style={{
            color: P.text,
            fontSize: 80,
            fontWeight: 700,
            fontFamily: "Pretendard, sans-serif",
            margin: 0,
            letterSpacing: "-0.02em",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          정답을 주지 마세요.
        </p>
      </div>
    </AbsoluteFill>
  );
};
