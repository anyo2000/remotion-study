import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES } from "../../constants";
import { GradientBackground, GlowOrb } from "../../components";

const palette = PALETTES.coolBlue;
const CX = 960; // 1920/2 중앙
const CY = 540; // 1080/2 중앙

// ── A-1: Line Draw ──────────────────────────────────
// SVG 선이 왼쪽에서 오른쪽으로 그려지는 효과
export const SvgLineDraw: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.heavy,
  });

  const totalLength = 1200;
  const dashOffset = totalLength * (1 - drawProgress);

  // 도착점에 원 표시
  const dotProgress = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width="1400" height="400" viewBox="0 0 1400 400">
          {/* 배경 가이드 */}
          <line
            x1="100" y1="200" x2="1300" y2="200"
            stroke="rgba(255,255,255,0.06)" strokeWidth="3"
          />
          {/* 메인 선 — stroke-dashoffset 애니메이션 */}
          <line
            x1="100" y1="200" x2="1300" y2="200"
            stroke={palette.accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
          />
          {/* 시작점 */}
          <circle cx="100" cy="200" r={8} fill={palette.accent} opacity={drawProgress} />
          {/* 도착점 */}
          <circle
            cx="1300" cy="200"
            r={12 * dotProgress}
            fill={palette.accent}
            opacity={dotProgress}
          />
          {/* 글로우 */}
          <circle
            cx="1300" cy="200"
            r={30 * dotProgress}
            fill={palette.accent}
            opacity={0.15 * dotProgress}
          />
        </svg>

        {/* 라벨 */}
        <div
          style={{
            position: "absolute",
            bottom: 160,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: dotProgress,
          }}
        >
          stroke-dashoffset 선 그리기
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── A-2: Expanding Rings ────────────────────────────
// 중심에서 동심원이 퍼져나가는 펄스 효과
export const SvgExpandingRings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rings = [0, 12, 24, 36, 48];

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width="1000" height="800" viewBox="0 0 1000 800">
          {rings.map((delay, i) => {
            const progress = spring({
              frame: Math.max(0, frame - delay - 10),
              fps,
              config: SPRING.smooth,
            });
            const radius = interpolate(progress, [0, 1], [20, 120 + i * 70]);
            const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.6, 0.08]);

            return (
              <circle
                key={i}
                cx="500" cy="400"
                r={radius}
                fill="none"
                stroke={palette.accent}
                strokeWidth={3 - i * 0.4}
                opacity={opacity}
              />
            );
          })}
          {/* 중심점 */}
          <circle cx="500" cy="400" r="16" fill={palette.accent} opacity={0.9} />
          <circle cx="500" cy="400" r="40" fill={palette.accent} opacity={0.1} />
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 120,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 30), fps, config: SPRING.heavy }),
          }}
        >
          동심원 펄스 파동
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── A-3: Checkmark Draw ─────────────────────────────
// 체크마크가 한 획씩 그려지는 효과
export const SvgCheckmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 원 그리기
  const circleProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING.heavy,
  });

  // 체크 그리기
  const checkProgress = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: SPRING.smooth,
  });

  const circlePath = 2 * Math.PI * 140; // 둘레
  const checkLength = 280;

  // 완료 후 글로우
  const glowProgress = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width="600" height="600" viewBox="0 0 600 600">
          {/* 글로우 배경 */}
          <circle
            cx="300" cy="300" r={180 * glowProgress}
            fill="#4ECDC4" opacity={0.06 * glowProgress}
          />
          {/* 원 */}
          <circle
            cx="300" cy="300" r="140"
            fill="none"
            stroke="#4ECDC4"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circlePath}
            strokeDashoffset={circlePath * (1 - circleProgress)}
            transform="rotate(-90 300 300)"
          />
          {/* 체크 */}
          <polyline
            points="190,310 265,380 410,230"
            fill="none"
            stroke="#4ECDC4"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={checkLength}
            strokeDashoffset={checkLength * (1 - checkProgress)}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 140,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: glowProgress,
          }}
        >
          SVG 체크마크 드로잉
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── A-4: X Mark Slash ───────────────────────────────
// X 표시가 대각선으로 그려지는 거절/실패 표현
export const SvgXMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 15 },
  });
  const line2 = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 15 },
  });

  // 충격파 — X 완성 후
  const shockProgress = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width="500" height="500" viewBox="0 0 500 500">
          {/* 충격파 링 */}
          <circle
            cx="250" cy="250"
            r={interpolate(shockProgress, [0, 1], [50, 200])}
            fill="none"
            stroke="#E05A5A"
            strokeWidth="2"
            opacity={interpolate(shockProgress, [0, 0.3, 1], [0, 0.4, 0])}
          />
          {/* 배경 원 */}
          <circle
            cx="250" cy="250" r="160"
            fill="rgba(224, 90, 90, 0.06)"
            stroke="rgba(224, 90, 90, 0.2)"
            strokeWidth="2"
            opacity={line1}
          />
          {/* X 대각선 1 */}
          <line
            x1="150" y1="150"
            x2={150 + 200 * line1} y2={150 + 200 * line1}
            stroke="#E05A5A" strokeWidth="8" strokeLinecap="round"
          />
          {/* X 대각선 2 */}
          <line
            x1="350" y1="150"
            x2={350 - 200 * line2} y2={150 + 200 * line2}
            stroke="#E05A5A" strokeWidth="8" strokeLinecap="round"
          />
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 140,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: shockProgress,
          }}
        >
          X 마크 슬래시
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── A-5: Connected Nodes ────────────────────────────
// 점+선 네트워크 그래프 (NetworkGraph 컴포넌트 직접 활용 대신 인라인)
export const SvgConnectedNodes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodes = [
    { x: 400, y: 300, label: "고객" },
    { x: 700, y: 180, label: "니즈" },
    { x: 1000, y: 300, label: "상품" },
    { x: 700, y: 500, label: "보장" },
    { x: 1300, y: 400, label: "계약" },
  ];

  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 0, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 2 },
  ];

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          {/* 엣지 */}
          {edges.map((edge, i) => {
            const edgeDelay = 15 + Math.max(edge.from, edge.to) * 12;
            const progress = spring({
              frame: Math.max(0, frame - edgeDelay),
              fps,
              config: SPRING.network,
            });
            const f = nodes[edge.from];
            const t = nodes[edge.to];
            const endX = interpolate(progress, [0, 1], [f.x, t.x]);
            const endY = interpolate(progress, [0, 1], [f.y, t.y]);

            return (
              <line
                key={`e-${i}`}
                x1={f.x} y1={f.y}
                x2={endX} y2={endY}
                stroke={palette.accent}
                strokeWidth="3"
                strokeLinecap="round"
                opacity={progress * 0.5}
              />
            );
          })}

          {/* 노드 */}
          {nodes.map((node, i) => {
            const nodeDelay = 10 + i * 10;
            const progress = spring({
              frame: Math.max(0, frame - nodeDelay),
              fps,
              config: SPRING.network,
            });

            return (
              <g key={`n-${i}`} opacity={progress}>
                <circle cx={node.x} cy={node.y} r={40} fill={palette.accent} opacity={0.08} />
                <circle
                  cx={node.x} cy={node.y}
                  r={14 * interpolate(progress, [0, 1], [0.3, 1])}
                  fill={palette.accent} opacity={0.9}
                />
                <text
                  x={node.x} y={node.y + 50}
                  textAnchor="middle"
                  fill={palette.text}
                  fontSize="52"
                  fontWeight="700"
                  fontFamily={FONT_FAMILY}
                  opacity={progress}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 60), fps, config: SPRING.heavy }),
          }}
        >
          점+선 네트워크 그래프
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── A-6: Bar Chart Grow ─────────────────────────────
// 막대 차트가 아래서 자라는 효과
export const SvgBarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [
    { label: "1월", value: 0.45, color: palette.accent },
    { label: "2월", value: 0.62, color: palette.accentLight },
    { label: "3월", value: 0.78, color: palette.accent },
    { label: "4월", value: 0.91, color: palette.accentLight },
    { label: "5월", value: 0.55, color: palette.accent },
  ];

  const barWidth = 120;
  const gap = 60;
  const maxHeight = 450;
  const baseY = 650;
  const startX = (1920 - (bars.length * barWidth + (bars.length - 1) * gap)) / 2;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          {/* 기준선 */}
          <line
            x1={startX - 40} y1={baseY}
            x2={startX + bars.length * (barWidth + gap)} y2={baseY}
            stroke="rgba(255,255,255,0.1)" strokeWidth="2"
          />

          {bars.map((bar, i) => {
            const barDelay = 12 + i * 8;
            const progress = spring({
              frame: Math.max(0, frame - barDelay),
              fps,
              config: SPRING.chart,
            });

            const barHeight = maxHeight * bar.value * progress;
            const x = startX + i * (barWidth + gap);

            return (
              <g key={i}>
                {/* 막대 */}
                <rect
                  x={x}
                  y={baseY - barHeight}
                  width={barWidth}
                  height={barHeight}
                  rx="8"
                  fill={bar.color}
                  opacity={0.85}
                />
                {/* 값 */}
                <text
                  x={x + barWidth / 2}
                  y={baseY - barHeight - 16}
                  textAnchor="middle"
                  fill={palette.text}
                  fontSize="52"
                  fontWeight="800"
                  fontFamily={FONT_FAMILY}
                  opacity={progress}
                >
                  {Math.round(bar.value * 100)}
                </text>
                {/* 라벨 */}
                <text
                  x={x + barWidth / 2}
                  y={baseY + 52}
                  textAnchor="middle"
                  fill={palette.sub}
                  fontSize="52"
                  fontWeight="600"
                  fontFamily={FONT_FAMILY}
                  opacity={progress}
                >
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: spring({ frame: Math.max(0, frame - 5), fps, config: SPRING.heavy }),
          }}
        >
          SVG 막대 차트
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── A-7: Circle Progress ────────────────────────────
// 원형 프로그레스 바 (도넛)
export const SvgCircleProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fillProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.chart,
  });

  const targetPercent = 73;
  const currentPercent = Math.round(targetPercent * fillProgress);
  const radius = 160;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - (targetPercent / 100) * fillProgress);

  // 숫자 바운스
  const numProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: SPRING.smooth,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.05} size={500} x="50%" y="45%" delay={20} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width="600" height="600" viewBox="0 0 600 600">
          {/* 배경 링 */}
          <circle
            cx="300" cy="300" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="20"
          />
          {/* 프로그레스 링 */}
          <circle
            cx="300" cy="300" r={radius}
            fill="none"
            stroke={palette.accent}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 300 300)"
          />
          {/* 숫자 */}
          <text
            x="300" y="300"
            textAnchor="middle"
            dominantBaseline="central"
            fill={palette.text}
            fontSize="120"
            fontWeight="900"
            fontFamily={FONT_FAMILY}
            opacity={numProgress}
          >
            {currentPercent}%
          </text>
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 140,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: numProgress,
          }}
        >
          원형 프로그레스
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── A-8: Arrow Path ─────────────────────────────────
// 곡선 화살표가 경로를 따라가는 효과
export const SvgArrowPath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING.heavy,
  });

  const pathLength = 1000;
  const dashOffset = pathLength * (1 - drawProgress);

  // 화살촉 — 끝점에 도달 시
  const arrowheadProgress = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: SPRING.bouncy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width="1400" height="600" viewBox="0 0 1400 600">
          {/* 가이드 배경 */}
          <path
            d="M 150 450 C 400 450, 400 150, 700 150 C 1000 150, 1000 450, 1250 300"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          {/* 메인 경로 */}
          <path
            d="M 150 450 C 400 450, 400 150, 700 150 C 1000 150, 1000 450, 1250 300"
            fill="none"
            stroke={palette.accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={dashOffset}
          />
          {/* 시작점 */}
          <circle cx="150" cy="450" r="10" fill={palette.accent} opacity={drawProgress} />
          {/* 끝점 화살촉 */}
          <polygon
            points="1250,285 1280,300 1250,315"
            fill={palette.accent}
            opacity={arrowheadProgress}
            transform={`scale(${arrowheadProgress})`}
            style={{ transformOrigin: "1250px 300px" }}
          />
          {/* 경로상 점들 */}
          {[0.25, 0.5, 0.75].map((t, i) => {
            const dotProgress = spring({
              frame: Math.max(0, frame - 15 - i * 10),
              fps,
              config: SPRING.network,
            });
            // 대략적 위치 (곡선 위 점)
            const positions = [
              { x: 400, y: 350 },
              { x: 700, y: 150 },
              { x: 1050, y: 350 },
            ];
            return (
              <circle
                key={i}
                cx={positions[i].x}
                cy={positions[i].y}
                r={8 * dotProgress}
                fill={palette.accentLight}
                opacity={dotProgress * 0.7}
              />
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 120,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: palette.sub,
            opacity: arrowheadProgress,
          }}
        >
          곡선 화살표 경로
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
