import React from "react";

// ── 와인병 (실루엣 + 라벨 디테일) ──
export const WineBottle: React.FC<{
  width?: number;
  fill: string;
  label?: boolean;
  labelColor?: string;
  stroke?: string;
}> = ({ width = 220, fill, label = true, labelColor = "#F5EEE2", stroke }) => (
  <svg width={width} height={(width * 620) / 200} viewBox="0 0 200 620">
    <path
      d="M85 10 L115 10 L115 150 C115 195 150 205 150 265 L150 560 C150 592 128 612 100 612 C72 612 50 592 50 560 L50 265 C50 205 85 195 85 150 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke ? 3 : 0}
    />
    {label && (
      <g>
        <rect x="62" y="330" width="76" height="120" rx="10" fill={labelColor} />
        <rect x="74" y="358" width="52" height="9" rx="4" fill={fill} opacity="0.55" />
        <rect x="80" y="380" width="40" height="9" rx="4" fill={fill} opacity="0.35" />
        <circle cx="100" cy="420" r="15" fill={fill} opacity="0.5" />
      </g>
    )}
  </svg>
);

// ── 와인잔 (수위 조절 가능) ──
export const WineGlass: React.FC<{
  height?: number;
  level: number; // 0(빈 잔) ~ 1(가득)
  wine: string;
  stroke: string;
  clipId: string;
}> = ({ height = 300, level, wine, stroke, clipId }) => {
  const wineTop = 134 - (134 - 34) * Math.max(0, Math.min(1, level));
  return (
    <svg
      width={(height * 200) / 300}
      height={height}
      viewBox="0 0 200 300"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M40 15 C40 95 70 128 96 134 L104 134 C130 128 160 95 160 15 Z" />
        </clipPath>
      </defs>
      <rect
        x="30"
        y={wineTop}
        width="140"
        height={140 - wineTop + 10}
        fill={wine}
        clipPath={`url(#${clipId})`}
      />
      <path
        d="M40 15 C40 95 70 128 96 134 L104 134 C130 128 160 95 160 15 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="6"
      />
      <line x1="100" y1="134" x2="100" y2="242" stroke={stroke} strokeWidth="6" />
      <path
        d="M55 262 C55 250 75 244 100 244 C125 244 145 250 145 262"
        fill="none"
        stroke={stroke}
        strokeWidth="6"
      />
    </svg>
  );
};

// ── WINE 01/05 진행 표시 ──
export const WineProgress: React.FC<{
  current: number;
  total?: number;
  active: string;
  dim: string;
  text: string;
}> = ({ current, total = 5, active, dim, text }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
    <div style={{ display: "flex", gap: 18 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            background: i < current ? active : dim,
          }}
        />
      ))}
    </div>
    <div
      style={{
        fontSize: 52,
        fontWeight: 700,
        letterSpacing: 8,
        color: active,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {text}
    </div>
  </div>
);
