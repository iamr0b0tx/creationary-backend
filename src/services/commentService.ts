import { commentInput, commentResponse } from "../types/comment";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";

export class CommentService {
  static async addComment(data: commentInput): Promise<commentResponse> {
    const { post, author, content } = data;
    if (!post || !author || !content) {
      return { success: false, message: "Post, author, and content are required." };
    }
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return {
        success: false,
        message: "Post not found."
      };
    }
    const newComment = new Comment({ post, author, content });
    const savedComment = await newComment.save();
    if (!savedComment) {
      return {
        success: false,
        message: "Failed to add comment."
      };
    }
    return {
      success: true,
      message: "Comment added successfully.",
      data: savedComment,
    };

  }

  static async getCommentsForPost(postId: string, page = 1, limit = 5): Promise<commentResponse> {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));

    const comments = await Comment.find({ post: postId })
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize).limit(pageSize);
    if (!comments) {
      return {
        success: false,
        message: "No comments found for this post."
      };
    }
    const totalComments = await Comment.countDocuments({ post: postId });

    return {
      success: true,
      message: "Comments fetched successfully.",
      data: {
        comments,
        pagination: {
          totalComments,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalComments / pageSize),
          limit: pageSize,
        },
      },
    };
  }

  static async updateComment(id: string, authorId: string, content: string): Promise<commentResponse> {
    if (!content) {
      return {
        success: false,
        message: "Content cannot be empty."
      };
    }
    const comment = await Comment.findOne({ _id: id, author: authorId });
    if (!comment) {
      return {
        success: false,
        message: "Comment not found or unauthorized."
      };
    }
    comment.content = content || comment.content;
    await comment.save();
    return {
      success: true,
      message: "Comment updated successfully.",
      data: comment,
    };
  }

  static async deleteComment(id: string, authorId: string): Promise<commentResponse> {
    const comment = await Comment.findOneAndDelete({ _id: id, author: authorId });
    if (!comment) {
      return {
        success: false,
        message: "Comment not found or unauthorized."
      };
    }
    return {
      success: true,
      message: "Comment deleted successfully.",
    };
  }
}