import React from 'react';
import { Rect } from 'react-konva';
import { CanvasBackground as CanvasBackgroundType } from '../../types';

interface CanvasBackgroundProps {
  background: CanvasBackgroundType;
  width: number;
  height: number;
}

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ background, width, height }) => {
  if (background.type === 'color') {
    return (
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={background.color || '#ffffff'}
      />
    );
  }

  // For gradient backgrounds
  if (background.type === 'gradient' && background.gradient) {
    const { type: gradientType, colors, angle = 0 } = background.gradient;
    
    let fillLinearGradientStartPoint = { x: 0, y: 0 };
    let fillLinearGradientEndPoint = { x: width, y: 0 };
    
    if (angle !== 0) {
      const radian = (angle * Math.PI) / 180;
      fillLinearGradientEndPoint = {
        x: Math.cos(radian) * width,
        y: Math.sin(radian) * height,
      };
    }

    return (
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fillLinearGradientStartPoint={fillLinearGradientStartPoint}
        fillLinearGradientEndPoint={fillLinearGradientEndPoint}
        fillLinearGradientColorStops={
          colors.reduce((arr: number[], color, index) => {
            arr.push(index / (colors.length - 1));
            arr.push(color);
            return arr;
          }, [])
        }
      />
    );
  }

  return null;
};

export default CanvasBackground;