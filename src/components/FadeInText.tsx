import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING, FONT_FAMILY } from "../constants";

type Props = {
  children: React.ReactNode;
  /** 등장 지연 (프레임) */
  delay?: number;
  /** 스프링 설정 (기본: SPRING.heavy) */
  springConfig?: Record<string, number>;
  /** 이동 거리 px (기본: 20) */
  translateY?: number;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  style?: React.CSSProperties;
};

export const FadeInText: React.FC<Props> = ({
  children,
  delay = 0,
  springConfig = SPRING.heavy,
  translateY: ty = 20,
  fontSize,
  fontWeight,
  color,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: springConfig,
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [ty, 0])}px)`,
        fontFamily: FONT_FAMILY,
        ...(fontSize !== undefined && { fontSize }),
        ...(fontWeight !== undefined && { fontWeight }),
        ...(color !== undefined && { color }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
