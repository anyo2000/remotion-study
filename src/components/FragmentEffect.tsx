import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

type Fragment = {
  /** X 이동 거리 */
  tx: number;
  /** Y 이동 거리 */
  ty: number;
  /** 회전 각도 (도) */
  rot: number;
  /** clipPath 영역 (기본: 자동 분할) */
  clipPath?: string;
};

type Props = {
  children: React.ReactNode;
  /** 파쇄가 시작되는 프레임 */
  breakStart: number;
  /** 파쇄 지속 프레임 (기본: 18) */
  breakDuration?: number;
  /** 파편 정의 배열 */
  fragments: Fragment[];
  style?: React.CSSProperties;
};

/**
 * clipPath 기반 파쇄/낙하 효과.
 * breakStart 전까지는 children을 그대로 보여주고,
 * breakStart 이후 fragments 배열에 따라 각 조각이 떨어져 나감.
 */
export const FragmentEffect: React.FC<Props> = ({
  children,
  breakStart,
  breakDuration = 18,
  fragments,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 파쇄 전이면 원본 그대로
  if (frame < breakStart) {
    return <div style={{ position: "relative", ...style }}>{children}</div>;
  }

  const count = fragments.length;

  // 자동 clipPath 생성 (수직 분할)
  const autoClipPaths = fragments.map((_, i) => {
    const left = (i / count) * 100;
    const right = ((i + 1) / count) * 100;
    return `polygon(${left}% 0%, ${right}% 0%, ${right}% 100%, ${left}% 100%)`;
  });

  return (
    <div style={{ position: "relative", ...style }}>
      {fragments.map((frag, i) => {
        const elapsed = frame - breakStart;
        const t = Math.min(elapsed / breakDuration, 1);
        const eased = Easing.in(Easing.quad)(t);

        const x = frag.tx * eased;
        const y = frag.ty * eased;
        const r = frag.rot * eased;
        const opacity = interpolate(
          elapsed,
          [0, breakDuration],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: frag.clipPath ?? autoClipPaths[i],
              transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
              opacity,
            }}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
};
