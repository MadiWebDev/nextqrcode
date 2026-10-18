import mongoose, { Schema, type Document } from 'mongoose';

export type UserPlan = 'free';

export interface IUser extends Document {
  email: string;
  name?: string | null;
  image?: string | null;
  plan: UserPlan;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name: { type: String, default: null },
    image: { type: String, default: null },
    plan: { type: String, enum: ['free'], default: 'free', required: true },
    locale: { type: String, default: 'en' },
  },
  { timestamps: true }
);

export const User: mongoose.Model<IUser> =
  (mongoose.models.User as mongoose.Model<IUser> | undefined) ??
  mongoose.model<IUser>('User', UserSchema);
