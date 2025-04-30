import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ParkingMeter as LetterSpacing } from 'lucide-react';
import { PlaceholderElement } from '../../types';
import { useCanvas } from '../../context/CanvasContext';

interface PlaceholderPanelProps {
  element?: PlaceholderElement;
}

const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({ element }) => {
  const { updateElement } = useCanvas();

  if (!element) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>Select a placeholder element to edit its properties</p>
      </div>
    );
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    updateElement({
      ...element,
      fontSize: newSize,
    });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement({
      ...element,
      fontFamily: e.target.value,
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement({
      ...element,
      fill: e.target.value,
    });
  };

  const handleAlignChange = (align: 'left' | 'center' | 'right') => {
    updateElement({
      ...element,
      align,
    });
  };

  const toggleBold = () => {
    const newStyle = element.fontStyle.includes('bold')
      ? element.fontStyle.replace('bold', '').trim()
      : `${element.fontStyle} bold`.trim();
    updateElement({
      ...element,
      fontStyle: newStyle,
    });
  };

  const toggleItalic = () => {
    const newStyle = element.fontStyle.includes('italic')
      ? element.fontStyle.replace('italic', '').trim()
      : `${element.fontStyle} italic`.trim();
    updateElement({
      ...element,
      fontStyle: newStyle,
    });
  };

  const toggleUnderline = () => {
    const newDecoration = element.textDecoration === 'underline' ? '' : 'underline';
    updateElement({
      ...element,
      textDecoration: newDecoration,
    });
  };

  const handleLetterSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpacing = parseFloat(e.target.value);
    updateElement({
      ...element,
      letterSpacing: newSpacing,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Placeholder Field
        </label>
        <div className="p-2 bg-gray-100 rounded-md">
          <code className="text-sm">{`{${element.field}}`}</code>
        </div>
      </div>

      <div className="flex space-x-2">
        <div className="flex-1">
          <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <input
            type="number"
            id="font-size"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={element.fontSize}
            min={8}
            max={72}
            onChange={handleFontSizeChange}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            id="font-family"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={element.fontFamily}
            onChange={handleFontFamilyChange}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 mb-1">
          Text Color
        </label>
        <div className="flex items-center">
          <input
            type="color"
            id="text-color"
            className="w-8 h-8 p-0 border-0"
            value={element.fill}
            onChange={handleColorChange}
          />
          <input
            type="text"
            className="flex-1 ml-2 p-2 border border-gray-300 rounded-md"
            value={element.fill}
            onChange={handleColorChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Style</label>
        <div className="flex space-x-2">
          <button
            className={`p-2 border rounded-md ${
              element.fontStyle.includes('bold') ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={toggleBold}
            title="Bold"
          >
            <Bold size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              element.fontStyle.includes('italic') ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={toggleItalic}
            title="Italic"
          >
            <Italic size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              element.textDecoration === 'underline' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={toggleUnderline}
            title="Underline"
          >
            <Underline size={20} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
        <div className="flex space-x-2">
          <button
            className={`p-2 border rounded-md ${
              element.align === 'left' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={() => handleAlignChange('left')}
          >
            <AlignLeft size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              element.align === 'center' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={() => handleAlignChange('center')}
          >
            <AlignCenter size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              element.align === 'right' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={() => handleAlignChange('right')}
          >
            <AlignRight size={20} />
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="letter-spacing" className="block text-sm font-medium text-gray-700 mb-1">
          Letter Spacing
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            id="letter-spacing"
            min="0"
            max="10"
            step="0.5"
            value={element.letterSpacing}
            onChange={handleLetterSpacingChange}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-10">{element.letterSpacing}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPanel;