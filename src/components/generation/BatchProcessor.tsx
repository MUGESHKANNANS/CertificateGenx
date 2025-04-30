import React, { useState, useRef } from 'react';
import { Download, FileDown, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCanvas } from '../../context/CanvasContext';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

interface BatchProcessorProps {
  stageRef: React.RefObject<any>;
}

const BatchProcessor: React.FC<BatchProcessorProps> = ({ stageRef }) => {
  const { excelData, getReplacementValue, currentPreviewIndex, setCurrentPreviewIndex } = useData();
  const { canvasSize, selectElement } = useCanvas();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateCertificates = async () => {
    if (!excelData.length || !stageRef.current) {
      setError('No data or canvas available');
      setShowModal(true);
      return;
    }

    setGenerating(true);
    setProgress(0);
    setShowModal(true);
    setError(null);
    cancelRef.current = false;

    try {
      const zip = new JSZip();
      const certificatesFolder = zip.folder('certificates');
      const originalIndex = currentPreviewIndex;
      
      // Deselect any selected elements before generating
      selectElement(null);
      
      for (let i = 0; i < excelData.length; i++) {
        if (cancelRef.current) {
          break;
        }

        setCurrentPreviewIndex(i);
        await sleep(100);

        try {
          const orientation = canvasSize.width > canvasSize.height ? 'l' : 'p';
          const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [canvasSize.width, canvasSize.height],
            hotfixes: ['px_scaling']
          });

          const dataUrl = stageRef.current.toDataURL({
            pixelRatio: 3,
            mimeType: 'image/jpeg',
            quality: 1,
            width: canvasSize.width,
            height: canvasSize.height,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
          });

          pdf.addImage(
            dataUrl,
            'JPEG',
            0,
            0,
            canvasSize.width,
            canvasSize.height,
            undefined,
            'FAST'
          );

          // Get the exact name from the Excel sheet
          const name = getReplacementValue('name', i);
          
          // Use the exact name for the file (maintaining case, spaces, and punctuation)
          const fileName = `${name}.pdf`;

          if (certificatesFolder) {
            certificatesFolder.file(fileName, pdf.output('blob'));
          }
          
          setProgress(Math.round(((i + 1) / excelData.length) * 100));
          await sleep(10);
        } catch (err) {
          console.error(`Error generating certificate ${i + 1}:`, err);
          setError(`Failed to generate certificate ${i + 1}. Please try again.`);
          break;
        }
      }

      if (!cancelRef.current && !error) {
        const zipBlob = await zip.generateAsync({ 
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });
        
        FileSaver.saveAs(zipBlob, 'certificates.zip');
      }

      setCurrentPreviewIndex(originalIndex);
    } catch (err) {
      console.error('Error in batch processing:', err);
      setError('An error occurred while generating certificates. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setGenerating(false);
  };

  return (
    <>
      <button
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={generateCertificates}
        disabled={generating || excelData.length === 0}
      >
        <Download size={16} className="mr-2" />
        {generating ? 'Generating...' : 'Generate All Certificates'}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generating Certificates</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => !generating && setShowModal(false)}
                disabled={generating}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {generating
                  ? `Processing certificate ${Math.round((progress / 100) * excelData.length)} of ${excelData.length}`
                  : error 
                    ? 'Generation failed. Please try again.'
                    : 'Complete! Your certificates are ready to download.'}
              </p>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              {generating && (
                <button
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
              {!generating && (
                <button
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  <FileDown size={16} className="mr-2" />
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatchProcessor;