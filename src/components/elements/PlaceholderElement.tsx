import React, { useRef, useEffect } from 'react';
import { Text, Transformer, Rect, Group } from 'react-konva';
import { PlaceholderElement as PlaceholderElementType } from '../../types';
import { useData } from '../../context/DataContext';

interface PlaceholderElementProps {
  element: PlaceholderElementType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: any) => void;
}

const PlaceholderElement: React.FC<PlaceholderElementProps> = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const { getReplacementValue } = useData();

  // Get the display value from the data context
  const displayValue = getReplacementValue(element.field);

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    if (groupRef.current) {
      const node = groupRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

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

  return (
    <>
      <Group
        ref={groupRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onDragEnd(e.target.x(), e.target.y());
        }}
        onTransformEnd={handleTransformEnd}
        rotation={element.rotation}
      >
        {/* Only show background and border when selected */}
        {isSelected && (
          <Rect
            width={element.width}
            height={element.height}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="#3B82F6"
            strokeWidth={1}
            dash={[5, 5]}
            cornerRadius={3}
          />
        )}
        
        {/* Field label - only show when selected */}
        {isSelected && (
          <Text
            y={-20}
            text={`{${element.field}}`}
            fontSize={12}
            fill="#3B82F6"
            width={element.width}
            align="center"
          />
        )}
        
        {/* Actual placeholder text */}
        <Text
          width={element.width}
          height={element.height}
          text={displayValue}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          fill={element.fill}
          align={element.align}
          verticalAlign="middle"
          fontStyle={element.fontStyle}
          textDecoration={element.textDecoration}
          letterSpacing={element.letterSpacing}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default PlaceholderElement