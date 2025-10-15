export type CategoryType = 'ic-cephe' | 'dis-cephe' | 'mobilya';

export interface Color {
  id: string;
  name: string;
  code: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  hex: string;
}

export interface Pattern {
  id: string;
  name: string;
  imageUrl: string;
  type: 'texture' | 'pattern';
}

export interface ColorPalette {
  id: string;
  name: string;
  category: CategoryType;
  colors: Color[];
  patterns?: Pattern[];
  description?: string;
}

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  icon: string;
  palettes: ColorPalette[];
}

export interface ImageProcessingRequest {
  image: string; // base64
  color: Color | Pattern;
  category: CategoryType;
}

export interface ImageProcessingResponse {
  processedImage: string; // base64
  success: boolean;
  error?: string;
}
