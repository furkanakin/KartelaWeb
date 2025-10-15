import { Request } from 'express';

export interface Color {
  id?: string;
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
  id?: string;
  name: string;
  imageUrl: string;
  type: 'texture' | 'pattern';
}

export interface ColorOrPattern {
  type: 'color' | 'pattern';
  data: Color | Pattern;
}

export interface WebhookConfig {
  url: string;
  mode: 'test' | 'live';
  enabled: boolean;
}

export interface Palette {
  _id?: string;
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  items: ColorOrPattern[];
  webhook?: WebhookConfig;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}
