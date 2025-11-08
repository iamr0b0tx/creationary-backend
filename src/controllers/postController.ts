import { Request, Response } from 'express';
import { PostsService } from '../services/postsService';
import { LoggerUtils } from '../utils/loggerUtils';

export class PostController {
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const result = await PostsService.getAllPosts(Number(page), Number(limit), search as string);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error('Error fetching all posts', { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const postData = req.body;
      const author = (req as any).user?.id;
      if (author) {
        postData.author = author;
      }
      const result = await PostsService.createPost({ ...postData, author });
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      LoggerUtils.error('Error creating post', { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getSinglePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const pageNumber = Math.max(1, Number(page ?? 1));
      const pageSize = Math.max(1, Number(limit ?? 5));
      const result = await PostsService.getSinglePost(id, pageNumber, pageSize);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error(`Error fetching post with ID: ${req.params.id}`, { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      const postData = req.body;
      const result = await PostsService.updatePost(postId, postData);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error(`Error updating post with ID: ${req.params.id}`, { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      const result = await PostsService.deletePost(postId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error(`Error deleting post with ID: ${req.params.id}`, { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async searchPosts(req: Request, res: Response): Promise<void> {
    try {
      const searchQuery = req.query.q as string;
      if (!searchQuery) {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
        return;
      }

      const result = await PostsService.searchPosts(searchQuery);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error('Error searching posts', { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}