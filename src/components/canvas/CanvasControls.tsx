import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Grid3x3, 
  Copy, 
  Trash, 
  ChevronUp, 
  ChevronDown,
  Undo,
  Redo 
} from 'lucide-react';
import { useCanvas } from '../../context/CanvasContext';
import { CANVAS_SIZES } from '../../context/CanvasContext';

const CanvasControls: React.FC = () => {
  const { 
    scale, 
    setScale, 
    showGrid, 
    toggleGrid, 
    canvasSize, 
    setCanvasSize,
    selectedElement,
    deleteElement,
    bringForward,
    sendBackward
  } = useCanvas();

  const handleZoomIn = () => {
    if (scale < 2) setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    if (scale > 0.3) setScale(scale - 0.1);
  };

  return (
    <div className="bg-white p-3 border-b border-gray-200 w-full flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 rounded-md hover:bg-gray-100 transition-colors" 
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
        <button 
          className="p-2 rounded-md hover:bg-gray-100 transition-colors" 
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button 
          className={`p-2 rounded-md transition-colors ${showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          onClick={toggleGrid}
          title="Toggle Grid"
        >
          <Grid3x3 size={20} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={canvasSize.name}
          onChange={(e) => {
            const selectedSize = CANVAS_SIZES.find((size) => size.name === e.target.value);
            if (selectedSize) setCanvasSize(selectedSize);
          }}
        >
          {CANVAS_SIZES.map((size) => (
            <option key={size.name} value={size.name}>
              {size.name} ({size.width}x{size.height})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        {selectedElement && (
          <>
            <button 
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => bringForward(selectedElement.id)}
              title="Bring Forward"
            >
              <ChevronUp size={20} />
            </button>
            <button 
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => sendBackward(selectedElement.id)}
              title="Send Backward"
            >
              <ChevronDown size={20} />
            </button>
            <button 
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              title="Copy"
            >
              <Copy size={20} />
            </button>
            <button 
              className="p-2 rounded-md hover:bg-gray-100 transition-colors text-red-500"
              onClick={() => deleteElement(selectedElement.id)}
              title="Delete"
            >
              <Trash size={20} />
            </button>
          </>
        )}

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button 
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          title="Undo"
          disabled
        >
          <Undo size={20} className="text-gray-400" />
        </button>
        <button 
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          title="Redo"
          disabled
        >
          <Redo size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default CanvasControls;