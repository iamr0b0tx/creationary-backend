import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IPost } from "./Post";

export interface IComment extends Document {
  post: mongoose.Types.ObjectId | IPost;
  author: mongoose.Types.ObjectId | IUser;
  content: string;
  likes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);