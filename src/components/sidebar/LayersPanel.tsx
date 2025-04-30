import React from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Layers } from 'lucide-react';
import { useCanvas } from '../../context/CanvasContext';

const LayersPanel: React.FC = () => {
  const { elements, selectElement, bringForward, sendBackward, deleteElement } = useCanvas();

  // Sort elements by zIndex for display
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <span className="text-green-500">T</span>;
      case 'image':
        return <span className="text-blue-500">I</span>;
      case 'shape':
        return <span className="text-purple-500">S</span>;
      case 'placeholder':
        return <span className="text-yellow-500">P</span>;
      default:
        return <span className="text-gray-500">?</span>;
    }
  };

  const getElementName = (element: any) => {
    switch (element.type) {
      case 'text':
        return element.text.substring(0, 20) + (element.text.length > 20 ? '...' : '');
      case 'image':
        return 'Image';
      case 'shape':
        return `${element.shapeType.charAt(0).toUpperCase() + element.shapeType.slice(1)}`;
      case 'placeholder':
        return `{${element.field}}`;
      default:
        return 'Unknown Element';
    }
  };

  if (elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
        <Layers size={32} className="mb-2 opacity-50" />
        <p className="text-sm">No elements on canvas</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Layers ({elements.length})</h3>
      {sortedElements.map((element) => (
        <div
          key={element.id}
          className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
            element.selected
              ? 'bg-blue-50 border-blue-300'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => selectElement(element.id)}
        >
          <div className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded mr-2 bg-white">
            {getElementTypeIcon(element.type)}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm truncate">{getElementName(element)}</div>
          </div>
          <div className="flex space-x-1">
            <button
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                bringForward(element.id);
              }}
              title="Bring Forward"
            >
              <ArrowUp size={16} />
            </button>
            <button
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                sendBackward(element.id);
              }}
              title="Send Backward"
            >
              <ArrowDown size={16} />
            </button>
            <button
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title="Toggle Visibility"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayersPanel;