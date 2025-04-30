import React, { useRef, useEffect } from 'react';
import { Rect, Circle, Line, Transformer } from 'react-konva';
import { ShapeElement as ShapeElementType } from '../../types';

interface ShapeElementProps {
  element: ShapeElementType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: any) => void;
}

const ShapeElement: React.FC<ShapeElementProps> = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // Reset scale to 1 and adjust width and height
      node.scaleX(1);
      node.scaleY(1);

      onTransformEnd({
        x: node.x(),
        y: node.y(),
        width: Math.abs(node.width() * scaleX),
        height: Math.abs(node.height() * scaleY),
        rotation: node.rotation(),
      });
    }
  };

  // Render different shapes based on shape type
  const renderShape = () => {
    switch (element.shapeType) {
      case 'rectangle':
        return (
          <Rect
            ref={shapeRef}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
              onDragEnd(e.target.x(), e.target.y());
            }}
            onTransformEnd={handleTransformEnd}
            rotation={element.rotation}
          />
        );
      case 'circle':
        return (
          <Circle
            ref={shapeRef}
            x={element.x + element.width / 2}
            y={element.y + element.height / 2}
            width={element.width}
            height={element.height}
            radius={Math.min(element.width, element.height) / 2}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
              onDragEnd(e.target.x() - element.width / 2, e.target.y() - element.height / 2);
            }}
            onTransformEnd={handleTransformEnd}
            rotation={element.rotation}
          />
        );
      case 'line':
        return (
          <Line
            ref={shapeRef}
            x={element.x}
            y={element.y}
            points={[0, 0, element.width, element.height]}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
              onDragEnd(e.target.x(), e.target.y());
            }}
            onTransformEnd={handleTransformEnd}
            rotation={element.rotation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ShapeElement;