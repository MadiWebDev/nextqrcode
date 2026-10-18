import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type QrMode = 'static' | 'dynamic';
export type QrVisibility = 'private' | 'unlisted' | 'public';
export type QrStatus = 'active' | 'paused' | 'blocked' | 'expired';
export type ModerationStatus = 'pending' | 'passed' | 'flagged';

export interface IModeration {
  status: ModerationStatus;
  checkedAt?: Date;
  reason?: string;
}

export interface IQrCode extends Document {
  publicId: string;
  ownerId?: Types.ObjectId;
  type: string;
  mode: QrMode;
  payload?: string;
  destinationUrl?: string;
  design?: unknown;
  assets: string[];
  title?: string;
  tags: string[];
  visibility: QrVisibility;
  status: QrStatus;
  expiresAt?: Date;
  scanCount: number;
  /** SHA-256 hex of the unlock password (set only for password-protected dynamic links). */
  passwordHash?: string;
  moderation: IModeration;
  createdAt: Date;
  updatedAt: Date;
}

const ModerationSchema = new Schema<IModeration>(
  {
    status: {
      type: String,
      enum: ['pending', 'passed', 'flagged'],
      default: 'pending',
      required: true,
    },
    checkedAt: { type: Date },
    reason: { type: String },
  },
  { _id: false }
);

const QrCodeSchema = new Schema<IQrCode>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true },
    mode: { type: String, enum: ['static', 'dynamic'], default: 'dynamic', required: true },
    payload: { type: String },
    destinationUrl: { type: String },
    design: { type: Schema.Types.Mixed },
    assets: { type: [String], default: [] },
    title: { type: String },
    tags: { type: [String], default: [] },
    visibility: {
      type: String,
      enum: ['private', 'unlisted', 'public'],
      default: 'private',
      index: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'blocked', 'expired'],
      default: 'active',
      index: true,
      required: true,
    },
    expiresAt: { type: Date, index: true },
    scanCount: { type: Number, default: 0, required: true },
    passwordHash: { type: String, default: undefined },
    moderation: { type: ModerationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

QrCodeSchema.index({ ownerId: 1, createdAt: -1 });

export const QrCode: mongoose.Model<IQrCode> =
  (mongoose.models.QrCode as mongoose.Model<IQrCode> | undefined) ??
  mongoose.model<IQrCode>('QrCode', QrCodeSchema);
