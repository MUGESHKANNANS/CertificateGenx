import React, { useState, useEffect } from 'react';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TextElement } from '../../types';
import { useCanvas } from '../../context/CanvasContext';

interface TextPanelProps {
  element?: TextElement;
}

const TextPanel: React.FC<TextPanelProps> = ({ element }) => {
  const { updateElement } = useCanvas();
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fill, setFill] = useState('#000000');
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [hasPlaceholder, setHasPlaceholder] = useState(false);

  useEffect(() => {
    if (element) {
      setText(element.text);
      setFontSize(element.fontSize);
      setFontFamily(element.fontFamily);
      setFill(element.fill);
      setAlign(element.align);
      setIsBold(element.fontStyle.includes('bold'));
      setIsItalic(element.fontStyle.includes('italic'));
      setHasPlaceholder(element.hasPlaceholder);
    }
  }, [element]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (element) {
      updateElement({
        ...element,
        text: newText,
      });
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    if (element) {
      updateElement({
        ...element,
        fontSize: newSize,
      });
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFamily = e.target.value;
    setFontFamily(newFamily);
    if (element) {
      updateElement({
        ...element,
        fontFamily: newFamily,
      });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setFill(newColor);
    if (element) {
      updateElement({
        ...element,
        fill: newColor,
      });
    }
  };

  const handleAlignChange = (newAlign: 'left' | 'center' | 'right') => {
    setAlign(newAlign);
    if (element) {
      updateElement({
        ...element,
        align: newAlign,
      });
    }
  };

  const toggleBold = () => {
    const newValue = !isBold;
    setIsBold(newValue);
    if (element) {
      const currentStyle = element.fontStyle;
      let newStyle = '';
      
      if (newValue) {
        newStyle = currentStyle.includes('italic') ? 'bold italic' : 'bold';
      } else {
        newStyle = currentStyle.includes('italic') ? 'italic' : '';
      }
      
      updateElement({
        ...element,
        fontStyle: newStyle,
      });
    }
  };

  const toggleItalic = () => {
    const newValue = !isItalic;
    setIsItalic(newValue);
    if (element) {
      const currentStyle = element.fontStyle;
      let newStyle = '';
      
      if (newValue) {
        newStyle = currentStyle.includes('bold') ? 'bold italic' : 'italic';
      } else {
        newStyle = currentStyle.includes('bold') ? 'bold' : '';
      }
      
      updateElement({
        ...element,
        fontStyle: newStyle,
      });
    }
  };

  const togglePlaceholder = () => {
    const newValue = !hasPlaceholder;
    setHasPlaceholder(newValue);
    if (element) {
      updateElement({
        ...element,
        hasPlaceholder: newValue,
      });
    }
  };

  if (!element) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>Select a text element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-1">
          Text Content
        </label>
        <textarea
          id="text-content"
          className="w-full p-2 border border-gray-300 rounded-md h-24"
          value={text}
          onChange={handleTextChange}
        />
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
            value={fontSize}
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
            value={fontFamily}
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
            value={fill}
            onChange={handleColorChange}
          />
          <input
            type="text"
            className="flex-1 ml-2 p-2 border border-gray-300 rounded-md"
            value={fill}
            onChange={handleColorChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Style</label>
        <div className="flex space-x-2">
          <button
            className={`p-2 border rounded-md ${
              isBold ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={toggleBold}
          >
            <Bold size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              isItalic ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={toggleItalic}
          >
            <Italic size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              align === 'left' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={() => handleAlignChange('left')}
          >
            <AlignLeft size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              align === 'center' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={() => handleAlignChange('center')}
          >
            <AlignCenter size={20} />
          </button>
          <button
            className={`p-2 border rounded-md ${
              align === 'right' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
            }`}
            onClick={() => handleAlignChange('right')}
          >
            <AlignRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center pt-2">
        <input
          type="checkbox"
          id="has-placeholder"
          className="h-4 w-4 text-blue-600 rounded"
          checked={hasPlaceholder}
          onChange={togglePlaceholder}
        />
        <label htmlFor="has-placeholder" className="ml-2 text-sm text-gray-700">
          Text Contains Placeholders
        </label>
      </div>

      {hasPlaceholder && (
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
          <h4 className="text-sm font-medium text-blue-700 mb-2">Placeholder Usage</h4>
          <p className="text-xs text-blue-600">
            Use {'{placeholder}'} syntax to insert data from Excel. Example: {'{name}'} will be replaced with the actual name.
          </p>
        </div>
      )}
    </div>
  );
};

export default TextPanel;