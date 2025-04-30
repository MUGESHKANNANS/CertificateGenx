import React, { useRef } from 'react';
import Canvas from '../components/canvas/Canvas';
import Sidebar from '../components/sidebar/Sidebar';
import CanvasControls from '../components/canvas/CanvasControls';
import ExcelImport from '../components/import/ExcelImport';
import PreviewGenerator from '../components/generation/PreviewGenerator';
import BatchProcessor from '../components/generation/BatchProcessor';
import { Award } from 'lucide-react';

const Editor: React.FC = () => {
  const stageRef = useRef<any>(null);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded-md mr-3">
            <Award size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Certificate Designer</h1>
        </div>
        <div className="flex items-center space-x-2">
          <BatchProcessor stageRef={stageRef} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CanvasControls />
          <div className="flex-1 overflow-auto relative">
            <Canvas stageRef={stageRef} />
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>

      {/* Bottom Panel for Data Import/Preview */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExcelImport />
          <PreviewGenerator onGenerateAll={() => {
            if (stageRef.current) {
              const batchProcessorButton = document.querySelector('button:not([disabled])[class*="bg-blue-600"]');
              if (batchProcessorButton instanceof HTMLButtonElement) {
                batchProcessorButton.click();
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export default Editor;