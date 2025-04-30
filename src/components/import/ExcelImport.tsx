import React, { useState, useCallback } from 'react';
import { Upload, X, FileSpreadsheet, Maximize2, Minimize2, Move } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { ExcelRow } from '../../types';
import { useData } from '../../context/DataContext';
import MappingTable from './MappingTable';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ExcelImport: React.FC = () => {
  const { setExcelData, setColumnMappings, setHasHeaderRow, hasHeaderRow, excelData } = useData();
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'upload' | 'mapping'>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState({ width: 400, height: 500 });
  const [isProcessing, setIsProcessing] = useState(false);

  const processExcelFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      if (workbook.SheetNames.length === 0) {
        throw new Error('The Excel file is empty');
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
        header: hasHeaderRow ? undefined : 'A',
        raw: false,
        defval: '',
      });

      if (jsonData.length === 0) {
        throw new Error('No data found in the Excel file');
      }

      const extractedHeaders = hasHeaderRow 
        ? Object.keys(jsonData[0])
        : Object.keys(jsonData[0]).map(key => key);

      if (extractedHeaders.length === 0) {
        throw new Error('No columns found in the Excel file');
      }

      setHeaders(extractedHeaders);
      setExcelData(jsonData);
      
      const placeholders = ['name', 'date', 'course', 'instructor', 'achievement'];
      const initialMappings = extractedHeaders.map((header, index) => ({
        excelColumn: header,
        placeholderField: index < placeholders.length ? placeholders[index] : '',
      }));
      setColumnMappings(initialMappings);
      
      setFileName(file.name);
      setStep('mapping');
    } catch (err) {
      console.error('Error processing Excel file:', err);
      setError(err instanceof Error ? err.message : 'Failed to process the Excel file');
      setFileName('');
    } finally {
      setIsProcessing(false);
    }
  }, [hasHeaderRow, setExcelData, setColumnMappings]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      setError('Please upload an Excel (.xlsx) or CSV (.csv) file');
      return;
    }

    processExcelFile(file);
  }, [processExcelFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setFileName('');
    setExcelData([]);
    setHeaders([]);
    setStep('upload');
    setError('');
  };

  const handleToggleHeaderRow = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasHeaderRow(e.target.checked);
    if (fileName) {
      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (fileInput?.files?.[0]) {
        processExcelFile(fileInput.files[0]);
      }
    }
  };

  const handleResize = (e: any, { size: newSize }: any) => {
    setSize({ width: newSize.width, height: newSize.height });
  };

  const panelContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div className="flex items-center">
          <Move className="text-gray-400 mr-2 cursor-move" size={16} />
          <h2 className="text-sm font-semibold">Import Data</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={handleRemoveFile}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-auto p-4">
          {step === 'upload' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has-header"
                    checked={hasHeaderRow}
                    onChange={handleToggleHeaderRow}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="has-header" className="ml-2 text-sm text-gray-700">
                    First row is header
                  </label>
                </div>
              </div>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <input {...getInputProps()} disabled={isProcessing} />
                <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-3" />
                <span className="text-lg font-medium text-gray-700 mb-1 block">
                  {isDragActive ? 'Drop the file here' : 'Upload Excel or CSV file'}
                </span>
                <span className="text-sm text-gray-500 mb-4 block">
                  Drag and drop or click to browse
                </span>
                {!isDragActive && (
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                    disabled={isProcessing}
                  >
                    <Upload size={16} className="mr-2" />
                    Choose File
                  </button>
                )}
                {isProcessing && (
                  <div className="mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <span className="text-sm text-gray-600 mt-2 block">Processing file...</span>
                  </div>
                )}
              </div>

              {fileName && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center">
                    <FileSpreadsheet size={20} className="text-blue-600 mr-2" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={handleRemoveFile}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <MappingTable headers={headers} onBack={() => setStep('upload')} />
          )}
        </div>
      )}
    </div>
  );

  return (
    <Draggable handle=".cursor-move" bounds="parent">
      <Resizable
        width={size.width}
        height={size.height}
        onResize={handleResize}
        minConstraints={[300, 400]}
        maxConstraints={[800, 800]}
      >
        <div
          className="absolute top-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden"
          style={{ width: size.width, height: isMinimized ? 'auto' : size.height }}
        >
          {panelContent}
        </div>
      </Resizable>
    </Draggable>
  );
};

export default ExcelImport;