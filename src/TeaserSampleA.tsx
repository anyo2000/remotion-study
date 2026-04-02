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

// 아이콘
const CheckIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// 글자별 낙하 방향
const FALL = [
  { tx: -120, ty: 400, rot: -35 },
  { tx: 60, ty: 500, rot: 25 },
  { tx: -80, ty: 350, rot: -50 },
  { tx: 150, ty: 450, rot: 40 },
  { tx: -40, ty: 550, rot: -20 },
  { tx: 100, ty: 380, rot: 55 },
  { tx: -160, ty: 480, rot: -45 },
  { tx: 30, ty: 420, rot: 30 },
  { tx: -100, ty: 500, rot: -60 },
];

// ===== 버전 A: 글자 파쇄형 =====
export const TeaserSampleA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = "정답을 주지 마세요.";
  const chars = text.split("");

  // 아이콘 등장
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // 텍스트 등장
  const textOpacity = interpolate(frame, [6, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [6, 16], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 낙하 시작
  const fallStart = 28;

  // 아이콘 낙하
  const iconFall = interpolate(
    frame,
    [fallStart, fallStart + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
  );

  // shake
  const shakeX = frame >= fallStart && frame <= fallStart + 10
    ? Math.sin(frame * 8) * 12
    : 0;
  const shakeY = frame >= fallStart && frame <= fallStart + 10
    ? Math.cos(frame * 6) * 8
    : 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <Background />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* 아이콘 */}
        <div
          style={{
            transform: `scale(${iconScale}) translateY(${iconFall * 600}px) rotate(${iconFall * -30}deg)`,
            opacity: 1 - iconFall,
          }}
        >
          <CheckIcon size={160} color={P.text} />
        </div>

        {/* 글자별 낙하 */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {chars.map((char, i) => {
            const dir = FALL[i % FALL.length];
            const charFall = interpolate(
              frame,
              [fallStart + i * 2, fallStart + i * 2 + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
            );

            return (
              <span
                key={i}
                style={{
                  color: P.text,
                  fontSize: 80,
                  fontWeight: 700,
                  fontFamily: "Pretendard, sans-serif",
                  display: "inline-block",
                  transform: charFall > 0
                    ? `translate(${dir.tx * charFall}px, ${dir.ty * charFall}px) rotate(${dir.rot * charFall}deg)`
                    : "none",
                  opacity: 1 - charFall * 0.8,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
