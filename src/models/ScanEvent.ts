import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IScanEvent extends Document {
  qrId: Types.ObjectId;
  ts: Date;
  country?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  referrerHost?: string;
  ipHash?: string;
}

const ScanEventSchema = new Schema<IScanEvent>({
  qrId: { type: Schema.Types.ObjectId, ref: 'QrCode', required: true, index: true },
  ts: { type: Date, default: () => new Date(), index: true },
  country: { type: String },
  deviceType: { type: String },
  os: { type: String },
  browser: { type: String },
  referrerHost: { type: String },
  ipHash: { type: String, index: true },
});

// Keep raw scan events for 400 days, then expire them automatically.
ScanEventSchema.index({ ts: 1 }, { expireAfterSeconds: 34560000 });

export const ScanEvent: mongoose.Model<IScanEvent> =
  (mongoose.models.ScanEvent as mongoose.Model<IScanEvent> | undefined) ??
  mongoose.model<IScanEvent>('ScanEvent', ScanEventSchema);
