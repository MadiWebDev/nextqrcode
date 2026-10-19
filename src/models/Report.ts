import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type ReportStatus = 'open' | 'reviewed' | 'dismissed';

export interface IReport extends Document {
  qrId: Types.ObjectId;
  reason: string;
  reporterHash?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    qrId: { type: Schema.Types.ObjectId, ref: 'QrCode', required: true, index: true },
    reason: { type: String, required: true, trim: true },
    reporterHash: { type: String },
    status: {
      type: String,
      enum: ['open', 'reviewed', 'dismissed'],
      default: 'open',
      required: true,
    },
  },
  { timestamps: true }
);

export const Report: mongoose.Model<IReport> =
  (mongoose.models.Report as mongoose.Model<IReport> | undefined) ??
  mongoose.model<IReport>('Report', ReportSchema);
