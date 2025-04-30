import React, { forwardRef, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useCanvas } from '../../context/CanvasContext';
import TextElement from '../elements/TextElement';
import ImageElement from '../elements/ImageElement';
import ShapeElement from '../elements/ShapeElement';
import PlaceholderElement from '../elements/PlaceholderElement';
import CanvasGrid from './CanvasGrid';
import CanvasBackground from './CanvasBackground';

interface CanvasProps {
  stageRef: React.RefObject<any>;
}

const Canvas = forwardRef<any, CanvasProps>(({ stageRef }, _ref) => {
  const { 
    elements, 
    selectedElement, 
    selectElement, 
    updateElement, 
    canvasSize, 
    showGrid,
    scale,
    background,
    copySelectedElement,
    pasteElement,
  } = useCanvas();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElement) {
        copySelectedElement();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        pasteElement();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
        e.preventDefault();
        copySelectedElement();
        pasteElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, copySelectedElement, pasteElement]);

  const handleStageClick = (e: any) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      updateElement({ ...element, x, y });
    }
  };

  const handleTransformEnd = (id: string, newProps: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    text?: string;
  }) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      updateElement({ ...element, ...newProps });
    }
  };

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div 
      className="flex justify-center items-center overflow-auto bg-gray-200 w-full h-full" 
      style={{ minHeight: '500px' }}
    >
      <div 
        className="relative bg-white shadow-lg" 
        style={{ 
          width: canvasSize.width * scale, 
          height: canvasSize.height * scale,
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasSize.width * scale}
          height={canvasSize.height * scale}
          onClick={handleStageClick}
          onTap={handleStageClick}
          scale={{ x: scale, y: scale }}
        >
          <Layer>
            <CanvasBackground background={background} width={canvasSize.width} height={canvasSize.height} />

            {showGrid && <CanvasGrid width={canvasSize.width} height={canvasSize.height} />}

            {sortedElements.map((element) => {
              switch (element.type) {
                case 'text':
                  return (
                    <TextElement
                      key={element.id}
                      element={element}
                      isSelected={element.selected}
                      onSelect={() => selectElement(element.id)}
                      onDragEnd={(x, y) => handleDragEnd(element.id, x, y)}
                      onTransformEnd={(props) => handleTransformEnd(element.id, props)}
                    />
                  );
                case 'image':
                  return (
                    <ImageElement
                      key={element.id}
                      element={element}
                      isSelected={element.selected}
                      onSelect={() => selectElement(element.id)}
                      onDragEnd={(x, y) => handleDragEnd(element.id, x, y)}
                      onTransformEnd={(props) => handleTransformEnd(element.id, props)}
                    />
                  );
                case 'shape':
                  return (
                    <ShapeElement
                      key={element.id}
                      element={element}
                      isSelected={element.selected}
                      onSelect={() => selectElement(element.id)}
                      onDragEnd={(x, y) => handleDragEnd(element.id, x, y)}
                      onTransformEnd={(props) => handleTransformEnd(element.id, props)}
                    />
                  );
                case 'placeholder':
                  return (
                    <PlaceholderElement
                      key={element.id}
                      element={element}
                      isSelected={element.selected}
                      onSelect={() => selectElement(element.id)}
                      onDragEnd={(x, y) => handleDragEnd(element.id, x, y)}
                      onTransformEnd={(props) => handleTransformEnd(element.id, props)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;