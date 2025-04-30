import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ExcelRow, ColumnMapping } from '../types';

type DataContextType = {
  excelData: ExcelRow[];
  columnMappings: ColumnMapping[];
  hasHeaderRow: boolean;
  currentPreviewIndex: number;
  setCurrentPreviewIndex: (index: number) => void;
  setExcelData: (data: ExcelRow[]) => void;
  setColumnMappings: (mappings: ColumnMapping[]) => void;
  setHasHeaderRow: (hasHeader: boolean) => void;
  updateColumnMapping: (index: number, mapping: ColumnMapping) => void;
  nextPreview: () => void;
  previousPreview: () => void;
  getReplacementValue: (field: string, rowIndex?: number) => string;
  clearData: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);

  const updateColumnMapping = useCallback((index: number, mapping: ColumnMapping) => {
    setColumnMappings((prev) => {
      const newMappings = [...prev];
      newMappings[index] = mapping;
      return newMappings;
    });
  }, []);

  const nextPreview = useCallback(() => {
    if (currentPreviewIndex < excelData.length - 1) {
      setCurrentPreviewIndex((prev) => prev + 1);
    }
  }, [currentPreviewIndex, excelData.length]);

  const previousPreview = useCallback(() => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex((prev) => prev - 1);
    }
  }, [currentPreviewIndex]);

  const getReplacementValue = useCallback((field: string, rowIndex?: number): string => {
    const index = rowIndex !== undefined ? rowIndex : currentPreviewIndex;
    if (!excelData.length || index < 0 || index >= excelData.length) {
      return `{${field}}`;
    }

    const row = excelData[index];
    const mapping = columnMappings.find((m) => m.placeholderField === field);
    
    if (!mapping) {
      return `{${field}}`;
    }

    const value = row[mapping.excelColumn];
    return value !== undefined ? String(value) : `{${field}}`;
  }, [excelData, columnMappings, currentPreviewIndex]);

  const clearData = useCallback(() => {
    setExcelData([]);
    setColumnMappings([]);
    setCurrentPreviewIndex(0);
  }, []);

  return (
    <DataContext.Provider
      value={{
        excelData,
        columnMappings,
        hasHeaderRow,
        currentPreviewIndex,
        setCurrentPreviewIndex,
        setExcelData,
        setColumnMappings,
        setHasHeaderRow,
        updateColumnMapping,
        nextPreview,
        previousPreview,
        getReplacementValue,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};