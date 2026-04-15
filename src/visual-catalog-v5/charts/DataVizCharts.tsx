import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY, PALETTES, SAFE_WIDE } from "../../constants";
import { GradientBackground, GlowOrb } from "../../components";

const palette = PALETTES.coolBlue;
const SAFE = SAFE_WIDE;

// ── 차트 세그먼트 색상 ──────────────────────────────────────
const SEGMENT_COLORS = [
  palette.accent,      // #5b9bd5
  palette.accentLight, // #7db8e8
  "#4ECDC4",           // teal
  "#FF8C38",           // orange
  "rgba(91, 155, 213, 0.5)", // light accent
];

const COLOR_BAD = "rgba(224, 90, 90, 0.8)";
const COLOR_GOOD = "#4ECDC4";

// ── 공통 스타일 ─────────────────────────────────────────────
const headlineStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontSize: 64,
  fontWeight: 800,
  color: palette.text,
  textAlign: "center" as const,
  marginBottom: 40,
};

const legendStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontSize: 52,
  fontWeight: 600,
  color: palette.sub,
};

// ═══════════════════════════════════════════════════════════════
// 1. DonutChart — 보장 영역별 비중
// ═══════════════════════════════════════════════════════════════
const donutData = [
  { label: "생명", value: 40, color: SEGMENT_COLORS[0] },
  { label: "건강", value: 30, color: SEGMENT_COLORS[1] },
  { label: "상해", value: 20, color: SEGMENT_COLORS[2] },
  { label: "기타", value: 10, color: SEGMENT_COLORS[3] },
];

export const DonutChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 960;
  const cy = 480;
  const r = 200;
  const strokeWidth = 80;
  const circumference = 2 * Math.PI * r;

  let cumulativeOffset = 0;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>보장 영역별 비중</div>

        <svg width={600} height={600} viewBox="560 180 800 600">
          {donutData.map((seg, i) => {
            const segLen = (seg.value / 100) * circumference;
            const offset = cumulativeOffset;
            cumulativeOffset += seg.value;

            const segProgress = spring({
              frame: Math.max(0, frame - i * 8),
              fps,
              config: SPRING.chart,
            });

            const dashLen = segLen * segProgress;
            const dashGap = circumference - dashLen;
            const rotation = (offset / 100) * 360 - 90;

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLen} ${dashGap}`}
                transform={`rotate(${rotation} ${cx} ${cy})`}
                strokeLinecap="round"
              />
            );
          })}
          {/* Center label */}
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={palette.text}
            fontFamily={FONT_FAMILY}
            fontSize={64}
            fontWeight={800}
          >
            보장 구성
          </text>
          <text
            x={cx}
            y={cy + 50}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={palette.sub}
            fontFamily={FONT_FAMILY}
            fontSize={52}
            fontWeight={600}
          >
            100%
          </text>
        </svg>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 30,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {donutData.map((seg, i) => {
            const legendFade = spring({
              frame: Math.max(0, frame - 20 - i * 5),
              fps,
              config: SPRING.smooth,
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: legendFade,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: seg.color,
                  }}
                />
                <span style={legendStyle}>
                  {seg.label} {seg.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. LineGraph — 월별 상담 건수 추이
// ═══════════════════════════════════════════════════════════════
const lineData = [
  { month: "1월", value: 12 },
  { month: "2월", value: 18 },
  { month: "3월", value: 15 },
  { month: "4월", value: 25 },
  { month: "5월", value: 22 },
  { month: "6월", value: 30 },
];

export const LineGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartLeft = 200;
  const chartRight = 1720;
  const chartTop = 200;
  const chartBottom = 700;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;
  const maxVal = 35;

  const points = lineData.map((d, i) => ({
    x: chartLeft + (i / (lineData.length - 1)) * chartW,
    y: chartBottom - (d.value / maxVal) * chartH,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Approximate total path length
  let totalLen = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLen += Math.sqrt(dx * dx + dy * dy);
  }

  const drawProgress = spring({
    frame,
    fps,
    config: { damping: 40, stiffness: 20 },
  });

  const dashOffset = totalLen * (1 - drawProgress);

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>월별 상담 건수 추이</div>

        <svg width={1920} height={900} viewBox="0 0 1920 900">
          {/* Grid lines */}
          {[0, 10, 20, 30].map((v) => {
            const y = chartBottom - (v / maxVal) * chartH;
            return (
              <line
                key={v}
                x1={chartLeft}
                y1={y}
                x2={chartRight}
                y2={y}
                stroke={palette.cardBorder}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Polyline */}
          <polyline
            points={polyline}
            fill="none"
            stroke={palette.accent}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={totalLen}
            strokeDashoffset={dashOffset}
          />

          {/* Data points */}
          {points.map((p, i) => {
            const pointProgress = spring({
              frame: Math.max(0, frame - 10 - i * 8),
              fps,
              config: SPRING.bouncy,
            });
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={14 * pointProgress}
                  fill={palette.accent}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={6 * pointProgress}
                  fill={palette.bg}
                />
                {/* Value label */}
                <text
                  x={p.x}
                  y={p.y - 30}
                  textAnchor="middle"
                  fill={palette.text}
                  fontFamily={FONT_FAMILY}
                  fontSize={52}
                  fontWeight={700}
                  opacity={pointProgress}
                >
                  {lineData[i].value}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={chartBottom + 60}
              textAnchor="middle"
              fill={palette.sub}
              fontFamily={FONT_FAMILY}
              fontSize={52}
              fontWeight={600}
            >
              {lineData[i].month}
            </text>
          ))}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. FunnelChart — 상담 프로세스 전환율
// ═══════════════════════════════════════════════════════════════
const funnelData = [
  { label: "접촉", pct: 100 },
  { label: "분석", pct: 65 },
  { label: "제안", pct: 40 },
  { label: "계약", pct: 20 },
];

const funnelColors = [
  "rgba(91, 155, 213, 0.4)",
  "rgba(91, 155, 213, 0.55)",
  "rgba(91, 155, 213, 0.75)",
  palette.accent,
];

export const FunnelChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalH = 600;
  const stepH = totalH / funnelData.length;
  const maxWidth = 1000;
  const startY = 180;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>상담 프로세스 전환율</div>

        <svg width={1920} height={750} viewBox="0 0 1920 750">
          {funnelData.map((d, i) => {
            const nextPct =
              i < funnelData.length - 1 ? funnelData[i + 1].pct : d.pct * 0.6;
            const topW = (d.pct / 100) * maxWidth;
            const botW = (nextPct / 100) * maxWidth;
            const cx = 960;
            const y = startY + i * stepH;

            const progress = spring({
              frame: Math.max(0, frame - i * 10),
              fps,
              config: SPRING.chart,
            });

            const topWAnim = topW * progress;
            const botWAnim = botW * progress;

            const path = [
              `M ${cx - topWAnim / 2} ${y}`,
              `L ${cx + topWAnim / 2} ${y}`,
              `L ${cx + botWAnim / 2} ${y + stepH - 8}`,
              `L ${cx - botWAnim / 2} ${y + stepH - 8}`,
              "Z",
            ].join(" ");

            return (
              <g key={i}>
                <path d={path} fill={funnelColors[i]} />
                <text
                  x={cx}
                  y={y + stepH / 2 + 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={palette.text}
                  fontFamily={FONT_FAMILY}
                  fontSize={56}
                  fontWeight={700}
                  opacity={progress}
                >
                  {d.label} {d.pct}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. RadarChart — 보장 커버리지
// ═══════════════════════════════════════════════════════════════
const radarLabels = ["사망", "질병", "상해", "입원", "수술"];
const radarValues = [0.9, 0.65, 0.8, 0.5, 0.7]; // 0~1
const radarLevels = [0.25, 0.5, 0.75, 1.0];

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function polygonPoints(
  cx: number,
  cy: number,
  values: number[],
  maxR: number
) {
  return values
    .map((v, i) => {
      const angle = (360 / values.length) * i;
      const p = polarToXY(cx, cy, v * maxR, angle);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

export const RadarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 960;
  const cy = 430;
  const maxR = 260;
  const n = radarLabels.length;

  const radarProgress = spring({
    frame,
    fps,
    config: SPRING.chart,
  });

  const animatedValues = radarValues.map((v) => v * radarProgress);

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>보장 커버리지</div>

        <svg width={1920} height={800} viewBox="0 0 1920 800">
          {/* Grid pentagons */}
          {radarLevels.map((level, li) => {
            const gridVals = Array(n).fill(level);
            return (
              <polygon
                key={li}
                points={polygonPoints(cx, cy, gridVals, maxR)}
                fill="none"
                stroke={palette.cardBorder}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Axis lines */}
          {radarLabels.map((_, i) => {
            const angle = (360 / n) * i;
            const p = polarToXY(cx, cy, maxR, angle);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke={palette.cardBorder}
                strokeWidth={1}
              />
            );
          })}

          {/* Radar shape */}
          <polygon
            points={polygonPoints(cx, cy, animatedValues, maxR)}
            fill="rgba(91, 155, 213, 0.2)"
            stroke={palette.accent}
            strokeWidth={3}
          />

          {/* Data points */}
          {animatedValues.map((v, i) => {
            const angle = (360 / n) * i;
            const p = polarToXY(cx, cy, v * maxR, angle);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={8 * radarProgress}
                fill={palette.accent}
              />
            );
          })}

          {/* Labels */}
          {radarLabels.map((label, i) => {
            const angle = (360 / n) * i;
            const p = polarToXY(cx, cy, maxR + 55, angle);
            const labelFade = spring({
              frame: Math.max(0, frame - 15),
              fps,
              config: SPRING.smooth,
            });
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={palette.text}
                fontFamily={FONT_FAMILY}
                fontSize={52}
                fontWeight={700}
                opacity={labelFade}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. TimelineHorizontal — 보험 라이프사이클
// ═══════════════════════════════════════════════════════════════
const timelineData = [
  { label: "가입", emoji: "📝" },
  { label: "유지", emoji: "🛡️" },
  { label: "갱신", emoji: "🔄" },
  { label: "만기", emoji: "📅" },
  { label: "재설계", emoji: "🔧" },
];

const ACTIVE_INDEX = 1; // "유지" highlighted

export const TimelineHorizontal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n = timelineData.length;
  const lineY = 460;
  const startX = 250;
  const endX = 1670;
  const gap = (endX - startX) / (n - 1);

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>보험 라이프사이클</div>

        <svg width={1920} height={700} viewBox="0 0 1920 700">
          {/* Connecting lines between nodes */}
          {timelineData.map((_, i) => {
            if (i === 0) return null;
            const lineProgress = spring({
              frame: Math.max(0, frame - i * 12),
              fps,
              config: SPRING.chart,
            });
            const x1 = startX + (i - 1) * gap;
            const x2 = startX + i * gap;
            const xEnd = x1 + (x2 - x1) * lineProgress;
            return (
              <line
                key={`line-${i}`}
                x1={x1}
                y1={lineY}
                x2={xEnd}
                y2={lineY}
                stroke={palette.cardBorder}
                strokeWidth={4}
              />
            );
          })}

          {/* Nodes */}
          {timelineData.map((d, i) => {
            const nodeProgress = spring({
              frame: Math.max(0, frame - i * 12),
              fps,
              config: SPRING.bouncy,
            });
            const x = startX + i * gap;
            const isActive = i === ACTIVE_INDEX;
            const nodeR = isActive ? 36 : 28;
            const pulseScale =
              isActive ? 1 + Math.sin(frame * 0.08) * 0.12 : 1;

            return (
              <g key={i} opacity={nodeProgress}>
                {/* Glow for active */}
                {isActive && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r={50 * pulseScale * nodeProgress}
                    fill="rgba(91, 155, 213, 0.15)"
                  />
                )}
                <circle
                  cx={x}
                  cy={lineY}
                  r={nodeR * nodeProgress}
                  fill={isActive ? palette.accent : palette.card}
                  stroke={isActive ? palette.accent : palette.cardBorder}
                  strokeWidth={3}
                />
                {/* Emoji above */}
                <text
                  x={x}
                  y={lineY - 80}
                  textAnchor="middle"
                  fontSize={56}
                  opacity={nodeProgress}
                >
                  {d.emoji}
                </text>
                {/* Label below */}
                <text
                  x={x}
                  y={lineY + 80}
                  textAnchor="middle"
                  fill={isActive ? palette.accent : palette.sub}
                  fontFamily={FONT_FAMILY}
                  fontSize={52}
                  fontWeight={isActive ? 800 : 600}
                  opacity={nodeProgress}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. BeforeAfterGauge — 보장분석 전/후 비교
// ═══════════════════════════════════════════════════════════════
export const BeforeAfterGauge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeTarget = 35;
  const afterTarget = 78;

  const beforeProgress = spring({ frame, fps, config: SPRING.chart });
  const afterProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING.chart,
  });

  const beforeVal = Math.round(beforeTarget * beforeProgress);
  const afterVal = Math.round(afterTarget * afterProgress);

  const barMaxW = 600;
  const barH = 70;

  const GaugeBarLocal: React.FC<{
    label: string;
    value: number;
    target: number;
    progress: number;
    color: string;
    y: number;
  }> = ({ label, value, target, progress, color, y }) => (
    <g>
      {/* Label */}
      <text
        x={960}
        y={y}
        textAnchor="middle"
        fill={palette.text}
        fontFamily={FONT_FAMILY}
        fontSize={56}
        fontWeight={700}
        opacity={progress}
      >
        {label}
      </text>
      {/* BG bar */}
      <rect
        x={960 - barMaxW / 2}
        y={y + 20}
        width={barMaxW}
        height={barH}
        rx={barH / 2}
        fill={palette.card}
      />
      {/* Fill bar */}
      <rect
        x={960 - barMaxW / 2}
        y={y + 20}
        width={barMaxW * (target / 100) * progress}
        height={barH}
        rx={barH / 2}
        fill={color}
      />
      {/* Percentage */}
      <text
        x={960}
        y={y + 130}
        textAnchor="middle"
        fill={color}
        fontFamily={FONT_FAMILY}
        fontSize={72}
        fontWeight={900}
        opacity={progress}
        style={{ fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
      >
        {value}%
      </text>
    </g>
  );

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>보장분석 전/후 비교</div>

        <svg width={1920} height={750} viewBox="0 0 1920 750">
          <GaugeBarLocal
            label="보장분석 전"
            value={beforeVal}
            target={beforeTarget}
            progress={beforeProgress}
            color={COLOR_BAD}
            y={160}
          />
          <GaugeBarLocal
            label="보장분석 후"
            value={afterVal}
            target={afterTarget}
            progress={afterProgress}
            color={COLOR_GOOD}
            y={430}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 7. StackedBar — 월별 실적 구성
// ═══════════════════════════════════════════════════════════════
const stackedData = [
  { month: "1월", segments: [8, 4, 3] },
  { month: "2월", segments: [10, 6, 2] },
  { month: "3월", segments: [12, 5, 5] },
  { month: "4월", segments: [15, 7, 4] },
];
const stackLabels = ["신규", "갱신", "추가"];
const stackColors = [palette.accent, "#4ECDC4", "#FF8C38"];

export const StackedBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartBottom = 650;
  const chartTop = 180;
  const chartH = chartBottom - chartTop;
  const maxTotal = 30;
  const barW = 160;
  const barGap = 240;
  const startX = 960 - ((stackedData.length - 1) * barGap) / 2;

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>월별 실적 구성</div>

        <svg width={1920} height={800} viewBox="0 0 1920 800">
          {/* Baseline */}
          <line
            x1={startX - barW}
            y1={chartBottom}
            x2={startX + (stackedData.length - 1) * barGap + barW}
            y2={chartBottom}
            stroke={palette.cardBorder}
            strokeWidth={2}
          />

          {stackedData.map((bar, bi) => {
            const cx = startX + bi * barGap;
            let segBottom = chartBottom;

            return (
              <g key={bi}>
                {bar.segments.map((val, si) => {
                  const segH = (val / maxTotal) * chartH;
                  const segProgress = spring({
                    frame: Math.max(0, frame - bi * 8 - si * 5),
                    fps,
                    config: SPRING.chart,
                  });
                  const animH = segH * segProgress;
                  const y = segBottom - animH;
                  segBottom = segBottom - segH;

                  return (
                    <rect
                      key={si}
                      x={cx - barW / 2}
                      y={chartBottom - (chartBottom - y) * segProgress}
                      width={barW}
                      height={animH}
                      rx={si === bar.segments.length - 1 ? 8 : 0}
                      fill={stackColors[si]}
                    />
                  );
                })}
                {/* Month label */}
                <text
                  x={cx}
                  y={chartBottom + 55}
                  textAnchor="middle"
                  fill={palette.sub}
                  fontFamily={FONT_FAMILY}
                  fontSize={52}
                  fontWeight={600}
                >
                  {bar.month}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          {stackLabels.map((label, i) => {
            const legendFade = spring({
              frame: Math.max(0, frame - 30),
              fps,
              config: SPRING.smooth,
            });
            const lx = 960 - 250 + i * 250;
            return (
              <g key={i} opacity={legendFade}>
                <rect
                  x={lx - 50}
                  y={chartBottom + 100}
                  width={24}
                  height={24}
                  rx={6}
                  fill={stackColors[i]}
                />
                <text
                  x={lx - 16}
                  y={chartBottom + 122}
                  fill={palette.sub}
                  fontFamily={FONT_FAMILY}
                  fontSize={52}
                  fontWeight={600}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 8. ProgressSteps — 단계별 진행 표시
// ═══════════════════════════════════════════════════════════════
const stepsData = [
  { label: "접수", completed: true },
  { label: "심사", completed: true },
  { label: "승인", completed: false }, // current
  { label: "완료", completed: false },
];

export const ProgressSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n = stepsData.length;
  const lineY = 440;
  const startX = 320;
  const endX = 1600;
  const gap = (endX - startX) / (n - 1);
  const currentIdx = 2; // "승인" is current

  return (
    <AbsoluteFill>
      <GradientBackground palette="coolBlue" />
      <GlowOrb color={palette.accent} opacity={0.03} size={800} />

      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.side,
          right: SAFE.side,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={headlineStyle}>단계별 진행 표시</div>

        <svg width={1920} height={700} viewBox="0 0 1920 700">
          {/* Connecting lines */}
          {stepsData.map((_, i) => {
            if (i === 0) return null;
            const x1 = startX + (i - 1) * gap;
            const x2 = startX + i * gap;
            const lineProgress = spring({
              frame: Math.max(0, frame - i * 15),
              fps,
              config: SPRING.chart,
            });
            const isCompleted = i <= currentIdx;
            const xEnd = x1 + (x2 - x1) * lineProgress;
            return (
              <line
                key={`conn-${i}`}
                x1={x1}
                y1={lineY}
                x2={xEnd}
                y2={lineY}
                stroke={
                  isCompleted && i < currentIdx
                    ? palette.accent
                    : palette.cardBorder
                }
                strokeWidth={4}
              />
            );
          })}

          {/* Steps */}
          {stepsData.map((d, i) => {
            const x = startX + i * gap;
            const nodeProgress = spring({
              frame: Math.max(0, frame - i * 15),
              fps,
              config: SPRING.bouncy,
            });
            const isCurrent = i === currentIdx;
            const isCompleted = d.completed;
            const pulseScale =
              isCurrent ? 1 + Math.sin(frame * 0.1) * 0.1 : 1;

            const nodeColor = isCompleted
              ? palette.accent
              : isCurrent
                ? palette.accentLight
                : palette.card;
            const borderColor = isCompleted
              ? palette.accent
              : isCurrent
                ? palette.accentLight
                : palette.cardBorder;

            return (
              <g key={i} opacity={nodeProgress}>
                {/* Pulse ring for current */}
                {isCurrent && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r={55 * pulseScale * nodeProgress}
                    fill="none"
                    stroke={palette.accentLight}
                    strokeWidth={2}
                    opacity={0.4}
                  />
                )}
                <circle
                  cx={x}
                  cy={lineY}
                  r={38 * nodeProgress * pulseScale}
                  fill={nodeColor}
                  stroke={borderColor}
                  strokeWidth={3}
                />
                {/* Checkmark for completed */}
                {isCompleted && (
                  <text
                    x={x}
                    y={lineY + 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={palette.bg}
                    fontFamily={FONT_FAMILY}
                    fontSize={52}
                    fontWeight={900}
                  >
                    ✓
                  </text>
                )}
                {/* Step number for non-completed */}
                {!isCompleted && (
                  <text
                    x={x}
                    y={lineY + 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isCurrent ? palette.bg : palette.sub}
                    fontFamily={FONT_FAMILY}
                    fontSize={52}
                    fontWeight={700}
                  >
                    {i + 1}
                  </text>
                )}
                {/* Label below */}
                <text
                  x={x}
                  y={lineY + 95}
                  textAnchor="middle"
                  fill={
                    isCompleted || isCurrent ? palette.text : palette.sub
                  }
                  fontFamily={FONT_FAMILY}
                  fontSize={52}
                  fontWeight={isCompleted || isCurrent ? 800 : 600}
                  opacity={nodeProgress}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
