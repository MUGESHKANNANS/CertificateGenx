import React, { useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { CanvasBackground } from '../../types';

const BackgroundPanel: React.FC = () => {
  const { background, setBackground } = useCanvas();
  const [gradientAngle, setGradientAngle] = useState(0);

  const handleColorChange = (color: string) => {
    setBackground({ type: 'color', color });
  };

  const handleGradientChange = (colors: string[], angle: number) => {
    setBackground({
      type: 'gradient',
      gradient: {
        type: 'linear',
        colors,
        angle,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Type
        </label>
        <div className="flex space-x-2">
          <button
            className={`flex-1 py-2 px-4 rounded-md ${
              background.type === 'color'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-white border-gray-300'
            } border`}
            onClick={() => setBackground({ type: 'color', color: '#ffffff' })}
          >
            Solid Color
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md ${
              background.type === 'gradient'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-white border-gray-300'
            } border`}
            onClick={() =>
              setBackground({
                type: 'gradient',
                gradient: {
                  type: 'linear',
                  colors: ['#ffffff', '#000000'],
                  angle: 0,
                },
              })
            }
          >
            Gradient
          </button>
        </div>
      </div>

      {background.type === 'color' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={background.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-10 h-10"
            />
            <input
              type="text"
              value={background.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}

      {background.type === 'gradient' && background.gradient && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gradient Colors
            </label>
            <div className="space-y-2">
              {background.gradient.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...background.gradient!.colors];
                      newColors[index] = e.target.value;
                      handleGradientChange(newColors, gradientAngle);
                    }}
                    className="w-10 h-10"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...background.gradient!.colors];
                      newColors[index] = e.target.value;
                      handleGradientChange(newColors, gradientAngle);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gradient Angle
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="360"
                value={background.gradient.angle}
                onChange={(e) => {
                  const newAngle = parseInt(e.target.value);
                  setGradientAngle(newAngle);
                  handleGradientChange(background.gradient.colors, newAngle);
                }}
                className="flex-1"
              />
              <span className="w-12 text-sm text-gray-600">
                {background.gradient.angle}°
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundPanel;