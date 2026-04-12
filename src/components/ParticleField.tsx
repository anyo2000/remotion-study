import React from "react";
import { useCurrentFrame, random } from "remotion";

type Props = {
  /** 파티클 개수 */
  count?: number;
  /** 파티클 색상 */
  color?: string;
  /** 최대 opacity */
  maxOpacity?: number;
  /** 떠다니는 속도 (작을수록 느림) */
  speed?: number;
  /** 파티클 크기 범위 [min, max] */
  sizeRange?: [number, number];
  /** 시드 (결정론적 위치) */
  seed?: string;
  style?: React.CSSProperties;
};

export const ParticleField: React.FC<Props> = ({
  count = 60,
  color = "#FFFFFF",
  maxOpacity = 0.15,
  speed = 0.02,
  sizeRange = [2, 6],
  seed = "particles",
  style,
}) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: random(`${seed}-x-${i}`) * 100,
      y: random(`${seed}-y-${i}`) * 100,
      size:
        sizeRange[0] +
        random(`${seed}-s-${i}`) * (sizeRange[1] - sizeRange[0]),
      opacity: (0.3 + random(`${seed}-o-${i}`) * 0.7) * maxOpacity,
      phaseX: random(`${seed}-px-${i}`) * Math.PI * 2,
      phaseY: random(`${seed}-py-${i}`) * Math.PI * 2,
      drift: 10 + random(`${seed}-d-${i}`) * 20,
    }));
  }, [count, seed, sizeRange, maxOpacity]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {particles.map((p, i) => {
        const dx = Math.sin(frame * speed + p.phaseX) * p.drift;
        const dy = Math.cos(frame * speed * 0.8 + p.phaseY) * p.drift;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: p.opacity,
              transform: `translate(${dx}px, ${dy}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
