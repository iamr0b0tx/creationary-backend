import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  role: 'user' | 'creator';
  posts?: mongoose.Types.ObjectId[];
  Subscription?: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'creator'], default: 'user' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  Subscription: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
});

export const User = mongoose.model<IUser>('User', userSchema);
