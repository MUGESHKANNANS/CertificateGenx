import React, { useRef, useEffect } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { ImageElement as ImageElementType } from '../../types';

interface ImageElementProps {
  element: ImageElementType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: any) => void;
}

const ImageElement: React.FC<ImageElementProps> = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [image] = useImage(element.src);

  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    if (imageRef.current) {
      const node = imageRef.current;
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

  return (
    <>
      <Image
        ref={imageRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        image={image}
        opacity={element.opacity}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onDragEnd(e.target.x(), e.target.y());
        }}
        onTransformEnd={handleTransformEnd}
        rotation={element.rotation}
      />
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

export default ImageElement;