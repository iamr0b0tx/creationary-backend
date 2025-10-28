import mongoose, { Document } from 'mongoose';

export type ICategory =
  | "Photography"
  | "Music"
  | "Fitness"
  | "Cooking"
  | "Art"
  | "Business"
  | "Technology"
  | "All";

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string;
  category: ICategory;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  views: number;
  likes: number;
  description: string;
  features: string[];
}

const postSchema = new mongoose.Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isFree: { type: Boolean, default: false },
    thumbnail: { type: String, required: false },
    category: {
      type: String,
      enum: ["Photography", "Music", "Fitness", "Cooking", "Art", "Business", "Technology", "All"],
      default: "All",
    },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: null },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    description: { type: String, required: false },
    features: { type: [String], default: [] },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>('Post', postSchema);