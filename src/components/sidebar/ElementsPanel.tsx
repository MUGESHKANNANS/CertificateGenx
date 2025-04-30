import React from 'react';
import { Type, Image, Square, Circle, Minus, Tag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useCanvas } from '../../context/CanvasContext';
import { TextElement, ImageElement, ShapeElement, PlaceholderElement } from '../../types';

const ElementsPanel: React.FC = () => {
  const { addElement, canvasSize } = useCanvas();

  const handleAddText = () => {
    const element: TextElement = {
      id: uuidv4(),
      type: 'text',
      x: canvasSize.width / 2 - 100,
      y: canvasSize.height / 2 - 20,
      width: 200,
      height: 40,
      rotation: 0,
      selected: false,
      text: 'Double click to edit text',
      fontSize: 18,
      fontFamily: 'Arial',
      fill: '#000000',
      align: 'center',
      fontStyle: '',
      zIndex: 1,
      hasPlaceholder: false,
    };
    addElement(element);
  };

  const handleAddImage = () => {
    const element: ImageElement = {
      id: uuidv4(),
      type: 'image',
      x: canvasSize.width / 2 - 100,
      y: canvasSize.height / 2 - 100,
      width: 200,
      height: 200,
      rotation: 0,
      selected: false,
      src: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      opacity: 1,
      zIndex: 1,
    };
    addElement(element);
  };

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'line') => {
    const element: ShapeElement = {
      id: uuidv4(),
      type: 'shape',
      x: canvasSize.width / 2 - 50,
      y: canvasSize.height / 2 - 50,
      width: 100,
      height: shapeType === 'line' ? 2 : 100,
      rotation: 0,
      selected: false,
      shapeType,
      fill: shapeType === 'line' ? 'transparent' : '#e9e9e9',
      stroke: '#000000',
      strokeWidth: 1,
      zIndex: 1,
    };
    addElement(element);
  };

  const handleAddPlaceholder = () => {
    const element: PlaceholderElement = {
      id: uuidv4(),
      type: 'placeholder',
      x: canvasSize.width / 2 - 75,
      y: canvasSize.height / 2 - 20,
      width: 150,
      height: 40,
      rotation: 0,
      selected: false,
      field: 'name',
      fontSize: 18,
      fontFamily: 'Arial',
      fill: '#3B82F6',
      displayText: '{name}',
      align: 'center',
      fontStyle: '',
      textDecoration: '',
      letterSpacing: 0,
      zIndex: 1,
    };
    addElement(element);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Add Elements</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleAddText}
          >
            <Type size={24} className="text-gray-600 mb-2" />
            <span className="text-xs font-medium">Text</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleAddImage}
          >
            <Image size={24} className="text-gray-600 mb-2" />
            <span className="text-xs font-medium">Image</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => handleAddShape('rectangle')}
          >
            <Square size={24} className="text-gray-600 mb-2" />
            <span className="text-xs font-medium">Rectangle</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => handleAddShape('circle')}
          >
            <Circle size={24} className="text-gray-600 mb-2" />
            <span className="text-xs font-medium">Circle</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => handleAddShape('line')}
          >
            <Minus size={24} className="text-gray-600 mb-2" />
            <span className="text-xs font-medium">Line</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleAddPlaceholder}
          >
            <Tag size={24} className="text-gray-600 mb-2" />
            <span className="text-xs font-medium">Placeholder</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Common Placeholders</h3>
        <div className="space-y-2">
          {['name', 'date', 'course', 'instructor', 'achievement'].map((field) => (
            <button
              key={field}
              className="flex items-center w-full p-2 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              onClick={() => {
                const element: PlaceholderElement = {
                  id: uuidv4(),
                  type: 'placeholder',
                  x: canvasSize.width / 2 - 75,
                  y: canvasSize.height / 2 - 20,
                  width: 150,
                  height: 40,
                  rotation: 0,
                  selected: false,
                  field,
                  fontSize: 18,
                  fontFamily: 'Arial',
                  fill: '#3B82F6',
                  displayText: `{${field}}`,
                  align: 'center',
                  fontStyle: '',
                  textDecoration: '',
                  letterSpacing: 0,
                  zIndex: 1,
                };
                addElement(element);
              }}
            >
              <Tag size={16} className="text-blue-500 mr-2" />
              <span className="text-sm">{`{${field}}`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementsPanel;