import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AnyElement, CanvasSize, CanvasBackground } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const CANVAS_SIZES = [
  { width: 794, height: 1123, name: 'A4' },
  { width: 816, height: 1056, name: 'Letter' },
  { width: 1123, height: 794, name: 'A4 Landscape' },
  { width: 1056, height: 816, name: 'Letter Landscape' },
  { width: 1000, height: 600, name: 'Custom Certificate' },
];

type CanvasContextType = {
  elements: AnyElement[];
  selectedElement: AnyElement | null;
  canvasSize: CanvasSize;
  showGrid: boolean;
  scale: number;
  background: CanvasBackground;
  addElement: (element: AnyElement) => void;
  updateElement: (updatedElement: AnyElement) => void;
  selectElement: (id: string | null) => void;
  deleteElement: (id: string) => void;
  setCanvasSize: (size: CanvasSize) => void;
  setBackground: (background: CanvasBackground) => void;
  toggleGrid: () => void;
  setScale: (scale: number) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  clearCanvas: () => void;
  loadTemplate: (elements: AnyElement[], size: CanvasSize, background?: CanvasBackground) => void;
  copySelectedElement: () => void;
  pasteElement: () => void;
  duplicateElement: (id: string) => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<AnyElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<AnyElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [copiedElement, setCopiedElement] = useState<AnyElement | null>(null);
  const [background, setBackground] = useState<CanvasBackground>({ type: 'color', color: '#ffffff' });

  const addElement = useCallback((element: AnyElement) => {
    setElements((prev) => [...prev, element]);
  }, []);

  const updateElement = useCallback((updatedElement: AnyElement) => {
    setElements((prev) =>
      prev.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
    if (selectedElement?.id === updatedElement.id) {
      setSelectedElement(updatedElement);
    }
  }, [selectedElement]);

  const selectElement = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedElement(null);
      return;
    }
    
    setElements((prev) =>
      prev.map((el) => ({
        ...el,
        selected: el.id === id,
      }))
    );
    
    const element = elements.find((el) => el.id === id);
    if (element) {
      setSelectedElement(element);
    }
  }, [elements]);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev);
  }, []);

  const bringForward = useCallback((id: string) => {
    setElements((prev) => {
      const elementIndex = prev.findIndex((el) => el.id === id);
      if (elementIndex === prev.length - 1) return prev;
      
      const newElements = [...prev];
      const element = newElements[elementIndex];
      newElements.splice(elementIndex, 1);
      newElements.splice(elementIndex + 1, 0, element);
      
      return newElements.map((el, idx) => ({
        ...el,
        zIndex: idx,
      }));
    });
  }, []);

  const sendBackward = useCallback((id: string) => {
    setElements((prev) => {
      const elementIndex = prev.findIndex((el) => el.id === id);
      if (elementIndex === 0) return prev;
      
      const newElements = [...prev];
      const element = newElements[elementIndex];
      newElements.splice(elementIndex, 1);
      newElements.splice(elementIndex - 1, 0, element);
      
      return newElements.map((el, idx) => ({
        ...el,
        zIndex: idx,
      }));
    });
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
    setBackground({ type: 'color', color: '#ffffff' });
  }, []);

  const loadTemplate = useCallback((newElements: AnyElement[], size: CanvasSize, newBackground?: CanvasBackground) => {
    setElements(newElements);
    setCanvasSize(size);
    if (newBackground) {
      setBackground(newBackground);
    }
    setSelectedElement(null);
  }, []);

  const copySelectedElement = useCallback(() => {
    if (selectedElement) {
      setCopiedElement(selectedElement);
    }
  }, [selectedElement]);

  const pasteElement = useCallback(() => {
    if (copiedElement) {
      const newElement = {
        ...copiedElement,
        id: uuidv4(),
        x: copiedElement.x + 20,
        y: copiedElement.y + 20,
        selected: false,
      };
      addElement(newElement);
    }
  }, [copiedElement, addElement]);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: uuidv4(),
        x: element.x + 20,
        y: element.y + 20,
        selected: false,
      };
      addElement(newElement);
    }
  }, [elements, addElement]);

  return (
    <CanvasContext.Provider
      value={{
        elements,
        selectedElement,
        canvasSize,
        showGrid,
        scale,
        background,
        addElement,
        updateElement,
        selectElement,
        deleteElement,
        setCanvasSize,
        setBackground,
        toggleGrid,
        setScale,
        bringForward,
        sendBackward,
        clearCanvas,
        loadTemplate,
        copySelectedElement,
        pasteElement,
        duplicateElement,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};