import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SPRING } from "../constants";

type Node = {
  x: number;
  y: number;
  label?: string;
  /** 노드 등장 지연 프레임 (기본: 인덱스 * 10) */
  delay?: number;
};

type Edge = {
  from: number;
  to: number;
  /** 엣지 등장 지연 프레임 (기본: 노드 이후) */
  delay?: number;
};

type Props = {
  nodes: Node[];
  edges: Edge[];
  accentColor?: string;
  /** 노드 코어 반지름 (기본: 12) */
  nodeRadius?: number;
  /** 엣지 두께 (기본: 2.5) */
  edgeWidth?: number;
  width?: number;
  height?: number;
};

/**
 * SVG 기반 점+선 연결 애니메이션.
 * LinkTeaser 시리즈에서 반복 사용된 네트워크 시각화 패턴.
 */
export const NetworkGraph: React.FC<Props> = ({
  nodes,
  edges,
  accentColor = "#4A9EFF",
  nodeRadius = 12,
  edgeWidth = 2.5,
  width = 1080,
  height = 1920,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {/* 엣지 (선) */}
      {edges.map((edge, i) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        const edgeDelay =
          edge.delay ?? Math.max(
            fromNode.delay ?? edge.from * 10,
            toNode.delay ?? edge.to * 10,
          ) + 8;

        const progress = spring({
          frame: Math.max(0, frame - edgeDelay),
          fps,
          config: SPRING.network,
        });

        const endX = interpolate(progress, [0, 1], [fromNode.x, toNode.x]);
        const endY = interpolate(progress, [0, 1], [fromNode.y, toNode.y]);

        return (
          <line
            key={`edge-${i}`}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={endX}
            y2={endY}
            stroke={accentColor}
            strokeWidth={edgeWidth}
            strokeLinecap="round"
            opacity={progress * 0.6}
          />
        );
      })}

      {/* 노드 (점) */}
      {nodes.map((node, i) => {
        const nodeDelay = node.delay ?? i * 10;
        const progress = spring({
          frame: Math.max(0, frame - nodeDelay),
          fps,
          config: SPRING.network,
        });

        return (
          <g key={`node-${i}`} opacity={progress}>
            {/* 글로우 */}
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius * 3}
              fill={accentColor}
              opacity={0.08 * progress}
            />
            {/* 코어 */}
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius * interpolate(progress, [0, 1], [0.3, 1])}
              fill={accentColor}
              opacity={0.9}
            />
            {/* 라벨 */}
            {node.label && (
              <text
                x={node.x}
                y={node.y + nodeRadius + 28}
                textAnchor="middle"
                fill="#f0f0f0"
                fontSize={44}
                fontFamily="Pretendard, sans-serif"
                opacity={progress}
              >
                {node.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
