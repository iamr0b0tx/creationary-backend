import { Request, Response } from 'express';
import { PostsService } from '../services/postsService';
import { LoggerUtils } from '../utils/loggerUtils';

export class PostController {
  static async getAllPosts(_: Request, res: Response): Promise<void> {
    try {
      const result = await PostsService.getAllPosts();
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
      const author =  (req as any).user?.id;
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
      const postId = req.params.id;
      const result = await PostsService.getSinglePost(postId);
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
}