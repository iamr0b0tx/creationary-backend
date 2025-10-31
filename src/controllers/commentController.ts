import { Request, Response } from "express";
import { CommentService } from "../services/commentService";
import { LoggerUtils } from "../utils/loggerUtils";


export class CommentController {
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const author = (req as any).user?.id;
      const { post, content } = req.body;

      if (!post || !content) {
        res.status(400).json({
          success: false,
          message: "Post ID and content are required.",
        });
        return;
      }

      const result = await CommentService.addComment({ post, author, content });
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      LoggerUtils.error("Error adding comment", { error });
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getCommentsForPost(req: Request, res: Response): Promise<void> {
    try {
      const { id: postId } = req.params;
      const { page = 1, limit = 5 } = req.query;

      const result = await CommentService.getCommentsForPost(
        postId,
        Number(page),
        Number(limit)
      );
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error(`Error fetching comments for post ID: ${req.params.id}`, { error });
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const authorId = (req as any).user?.id;
      const { content } = req.body;

      const result = await CommentService.updateComment(id, authorId, content);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      LoggerUtils.error(`Error updating comment with ID: ${req.params.id}`, { error });
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const authorId = (req as any).user?.id;

      const result = await CommentService.deleteComment(id, authorId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error(`Error deleting comment with ID: ${req.params.id}`, { error });
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}