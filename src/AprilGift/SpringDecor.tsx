import React from "react";
import { AbsoluteFill } from "remotion";

// CSS 꽃잎 하나
const Petal: React.FC<{
  x: number;
  y: number;
  size: number;
  rotate: number;
  color: string;
  opacity: number;
}> = ({ x, y, size, rotate, color, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size * 0.65,
      borderRadius: "50% 0 50% 0",
      backgroundColor: color,
      opacity,
      transform: `rotate(${rotate}deg)`,
    }}
  />
);

// 꽃 클러스터 (꽃잎 5개)
const FlowerCluster: React.FC<{
  cx: number;
  cy: number;
  scale?: number;
  baseOpacity?: number;
}> = ({ cx, cy, scale = 1, baseOpacity = 0.18 }) => {
  const petals = [
    { dx: 0, dy: -20, rot: 0 },
    { dx: 18, dy: -6, rot: 72 },
    { dx: 11, dy: 16, rot: 144 },
    { dx: -11, dy: 16, rot: 216 },
    { dx: -18, dy: -6, rot: 288 },
  ];
  const colors = ["#FFB8A0", "#FFC4B0", "#FFAA90", "#FFD0C0", "#FFB0A0"];

  return (
    <>
      {petals.map((p, i) => (
        <Petal
          key={i}
          x={cx + p.dx * scale}
          y={cy + p.dy * scale}
          size={32 * scale}
          rotate={p.rot}
          color={colors[i]}
          opacity={baseOpacity}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: cx - 4 * scale,
          top: cy - 4 * scale,
          width: 8 * scale,
          height: 8 * scale,
          borderRadius: "50%",
          backgroundColor: "#FFD4A0",
          opacity: baseOpacity + 0.1,
        }}
      />
    </>
  );
};

export const SpringDecor: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 그라데이션 배경 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #FFF8F0 0%, #FFF4EA 35%, #FFE8DB 70%, #FFE0D0 100%)`,
        }}
      />

      {/* 코랄 글로우 */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ===== 상단 우측 (메인 꽃 덩어리) ===== */}
      <FlowerCluster cx={900} cy={60} scale={3.2} baseOpacity={0.22} />
      <FlowerCluster cx={980} cy={150} scale={2.5} baseOpacity={0.18} />
      <FlowerCluster cx={820} cy={140} scale={2.0} baseOpacity={0.15} />
      <FlowerCluster cx={950} cy={250} scale={1.6} baseOpacity={0.12} />
      <FlowerCluster cx={760} cy={60} scale={1.8} baseOpacity={0.13} />

      {/* ===== 상단 좌측 ===== */}
      <FlowerCluster cx={80} cy={80} scale={2.2} baseOpacity={0.16} />
      <FlowerCluster cx={160} cy={160} scale={1.5} baseOpacity={0.12} />
      <FlowerCluster cx={50} cy={200} scale={1.3} baseOpacity={0.10} />

      {/* ===== 하단 좌측 (메인 꽃 덩어리) ===== */}
      <FlowerCluster cx={80} cy={1700} scale={3.0} baseOpacity={0.22} />
      <FlowerCluster cx={180} cy={1800} scale={2.5} baseOpacity={0.18} />
      <FlowerCluster cx={50} cy={1840} scale={2.0} baseOpacity={0.15} />
      <FlowerCluster cx={250} cy={1750} scale={1.6} baseOpacity={0.12} />
      <FlowerCluster cx={120} cy={1880} scale={1.4} baseOpacity={0.10} />

      {/* ===== 하단 우측 ===== */}
      <FlowerCluster cx={900} cy={1760} scale={2.0} baseOpacity={0.16} />
      <FlowerCluster cx={980} cy={1850} scale={1.6} baseOpacity={0.12} />
      <FlowerCluster cx={830} cy={1860} scale={1.3} baseOpacity={0.10} />

      {/* ===== 중간 산재 (좌우 가장자리) ===== */}
      <FlowerCluster cx={30} cy={500} scale={1.2} baseOpacity={0.08} />
      <FlowerCluster cx={1020} cy={700} scale={1.0} baseOpacity={0.07} />
      <FlowerCluster cx={50} cy={1000} scale={1.1} baseOpacity={0.07} />
      <FlowerCluster cx={1000} cy={1200} scale={1.3} baseOpacity={0.08} />
      <FlowerCluster cx={30} cy={1400} scale={1.0} baseOpacity={0.07} />

      {/* ===== 흩뿌린 낱 꽃잎 ===== */}
      {[
        { x: 200, y: 300, s: 22, r: 30, o: 0.09 },
        { x: 850, y: 400, s: 18, r: 120, o: 0.08 },
        { x: 100, y: 650, s: 20, r: 200, o: 0.07 },
        { x: 950, y: 550, s: 16, r: 80, o: 0.08 },
        { x: 70, y: 900, s: 24, r: 310, o: 0.07 },
        { x: 980, y: 950, s: 18, r: 160, o: 0.08 },
        { x: 200, y: 1150, s: 20, r: 45, o: 0.07 },
        { x: 900, y: 1350, s: 22, r: 250, o: 0.08 },
        { x: 150, y: 1500, s: 16, r: 170, o: 0.07 },
        { x: 950, y: 1550, s: 20, r: 90, o: 0.08 },
        { x: 500, y: 100, s: 14, r: 60, o: 0.06 },
        { x: 550, y: 1850, s: 16, r: 220, o: 0.06 },
      ].map((p, i) => (
        <Petal
          key={`lone-${i}`}
          x={p.x}
          y={p.y}
          size={p.s}
          rotate={p.r}
          color="#FFB8A0"
          opacity={p.o}
        />
      ))}
    </AbsoluteFill>
  );
};
