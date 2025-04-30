import React, { useRef, useEffect, useState } from 'react';
import { Text, Transformer, Group } from 'react-konva';
import { TextElement as TextElementType } from '../../types';
import { useData } from '../../context/DataContext';

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: any) => void;
}

const TextElement: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const textRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const { getReplacementValue } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.text);

  // Process text for placeholders
  const processText = (text: string): string => {
    if (!element.hasPlaceholder) return text;
    
    // Find all placeholders in the format {placeholder}
    return text.replace(/\{([^}]+)\}/g, (match, placeholder) => {
      return getReplacementValue(placeholder);
    });
  };

  const displayText = isEditing ? editText : processText(element.text);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    setEditText(element.text);
  }, [element.text]);

  const handleTransformEnd = () => {
    if (textRef.current) {
      const node = textRef.current;
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

  const handleDblClick = () => {
    if (!element.hasPlaceholder) {
      setIsEditing(true);
      if (textRef.current) {
        textRef.current.show();
      }
    }
  };

  const handleTextChange = (e: any) => {
    const newText = e.target.value;
    setEditText(newText);
    if (textRef.current) {
      textRef.current.text(newText);
      textRef.current.getLayer().batchDraw();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onTransformEnd({
      ...element,
      text: editText,
    });
  };

  return (
    <>
      <Group>
        <Text
          ref={textRef}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          text={displayText}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          fill={element.fill}
          align={element.align}
          fontStyle={element.fontStyle}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDblClick={handleDblClick}
          onDragEnd={(e) => {
            onDragEnd(e.target.x(), e.target.y());
          }}
          onTransformEnd={handleTransformEnd}
          rotation={element.rotation}
        />
        {isEditing && (
          <textarea
            value={editText}
            onChange={handleTextChange}
            onBlur={handleBlur}
            style={{
              position: 'absolute',
              top: element.y + 'px',
              left: element.x + 'px',
              width: element.width + 'px',
              height: element.height + 'px',
              fontSize: element.fontSize + 'px',
              fontFamily: element.fontFamily,
              color: element.fill,
              textAlign: element.align,
              border: 'none',
              padding: '0',
              margin: '0',
              background: 'transparent',
              resize: 'none',
              outline: 'none',
              zIndex: 1000,
            }}
            autoFocus
          />
        )}
        {element.hasPlaceholder && isSelected && (
          <Text
            x={element.x}
            y={element.y - 20}
            text="Placeholder"
            fontSize={12}
            fill="#3B82F6"
            opacity={0.8}
          />
        )}
      </Group>
      {isSelected && !isEditing && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
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

export default TextElement;