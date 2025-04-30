export type CanvasElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'placeholder';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  selected: boolean;
  zIndex: number;
  opacity: number;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  border?: {
    color: string;
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    radius: number;
  };
};

export type TextElement = CanvasElement & {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: 'left' | 'center' | 'right';
  fontStyle: string;
  hasPlaceholder: boolean;
};

export type ImageElement = CanvasElement & {
  type: 'image';
  src: string;
};

export type ShapeElement = CanvasElement & {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'line';
  fill: string;
  stroke: string;
  strokeWidth: number;
};

export type PlaceholderElement = CanvasElement & {
  type: 'placeholder';
  field: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  displayText: string;
  align: 'left' | 'center' | 'right';
  fontStyle: string;
  textDecoration: string;
  letterSpacing: number;
};

export type CanvasBackground = {
  type: 'color' | 'gradient';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
};

export type CanvasSize = {
  width: number;
  height: number;
  name: string;
};

export type ExcelRow = Record<string, string | number>;

export type ColumnMapping = {
  excelColumn: string;
  placeholderField: string;
};

export type TemplateData = {
  id: string;
  name: string;
  elements: AnyElement[];
  canvasSize: CanvasSize;
  background?: CanvasBackground;
  thumbnail?: string;
};

export type AnyElement = TextElement | ImageElement | ShapeElement | PlaceholderElement;