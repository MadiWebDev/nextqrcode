import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface ITemplate extends Document {
  ownerId?: Types.ObjectId;
  name: string;
  design: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true },
    design: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Template: mongoose.Model<ITemplate> =
  (mongoose.models.Template as mongoose.Model<ITemplate> | undefined) ??
  mongoose.model<ITemplate>('Template', TemplateSchema);
