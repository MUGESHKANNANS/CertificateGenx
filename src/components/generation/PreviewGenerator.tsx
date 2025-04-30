import React from 'react';
import { ChevronLeft, ChevronRight, Download, List } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface PreviewGeneratorProps {
  onGenerateAll: () => void;
}

const PreviewGenerator: React.FC<PreviewGeneratorProps> = ({ onGenerateAll }) => {
  const { 
    excelData, 
    currentPreviewIndex, 
    nextPreview, 
    previousPreview 
  } = useData();

  if (excelData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No data imported. Please import an Excel file first.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Certificate Preview</h2>
        <div className="text-sm text-gray-600">
          {currentPreviewIndex + 1} of {excelData.length} certificates
        </div>
      </div>

      <div className="flex items-center justify-center space-x-3 mb-4">
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={previousPreview}
          disabled={currentPreviewIndex === 0}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-sm">
          Previewing data for row{' '}
          <span className="font-medium">{currentPreviewIndex + 1}</span>
        </div>
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={nextPreview}
          disabled={currentPreviewIndex === excelData.length - 1}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <button
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={onGenerateAll}
        >
          <Download size={16} className="mr-2" />
          Generate All Certificates
        </button>
        <button
          className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <List size={16} className="mr-2" />
          View All Data
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-100 text-sm text-yellow-800">
        <p className="font-medium">Tip:</p>
        <p>
          Use the navigation buttons to preview how each certificate will look with the actual data.
          The canvas shows the certificate with the current row's data.
        </p>
      </div>
    </div>
  );
};

export default PreviewGenerator;