import React from 'react';
import { Line, Group } from 'react-konva';

type CanvasGridProps = {
  width: number;
  height: number;
  gridSize?: number;
};

const CanvasGrid: React.FC<CanvasGridProps> = ({ width, height, gridSize = 20 }) => {
  const horizontalLines = [];
  const verticalLines = [];

  // Create horizontal grid lines
  for (let i = 0; i <= height; i += gridSize) {
    horizontalLines.push(
      <Line
        key={`h-${i}`}
        points={[0, i, width, i]}
        stroke="#ddd"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  // Create vertical grid lines
  for (let i = 0; i <= width; i += gridSize) {
    verticalLines.push(
      <Line
        key={`v-${i}`}
        points={[i, 0, i, height]}
        stroke="#ddd"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  return (
    <Group>
      {horizontalLines}
      {verticalLines}
    </Group>
  );
};

export default CanvasGrid;