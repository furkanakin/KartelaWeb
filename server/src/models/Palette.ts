import mongoose, { Schema, Document } from 'mongoose';

export interface IColor {
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

export interface IPattern {
  id: string;
  name: string;
  imageUrl: string;
  type: 'texture' | 'pattern';
}

export interface IColorOrPattern {
  type: 'color' | 'pattern';
  data: IColor | IPattern;
}

export interface IWebhookConfig {
  url: string;
  mode: 'test' | 'live';
  enabled: boolean;
}

export interface IPalette extends Document {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  items: IColorOrPattern[];
  webhook?: IWebhookConfig;
  createdAt: Date;
  updatedAt: Date;
}

const ColorSchema = new Schema<IColor>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    rgb: {
      r: { type: Number, required: true, min: 0, max: 255 },
      g: { type: Number, required: true, min: 0, max: 255 },
      b: { type: Number, required: true, min: 0, max: 255 },
    },
    hex: { type: String, required: true },
  },
  { _id: false }
);

const PatternSchema = new Schema<IPattern>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    type: { type: String, enum: ['texture', 'pattern'], required: true },
  },
  { _id: false }
);

const ColorOrPatternSchema = new Schema<IColorOrPattern>(
  {
    type: { type: String, enum: ['color', 'pattern'], required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const WebhookConfigSchema = new Schema<IWebhookConfig>(
  {
    url: { type: String, required: true },
    mode: { type: String, enum: ['test', 'live'], default: 'test' },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const PaletteSchema = new Schema<IPalette>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true,
      ref: 'Category',
    },
    description: {
      type: String,
      trim: true,
    },
    items: [ColorOrPatternSchema],
    webhook: WebhookConfigSchema,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPalette>('Palette', PaletteSchema);
