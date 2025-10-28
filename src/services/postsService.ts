import { IPost, Post } from '../models/Post';
import { postValidations } from '../validations/postValidation';
import { postResponse } from '../types/post';

export class PostsService {
  static async createPost(data: IPost): Promise<postResponse> {
    const validatePostInput = postValidations.validatePostInput(data);
    if (validatePostInput) {
      return {
        success: false,
        message: validatePostInput
      }
    }
    const post = new Post(data);
    const savedPost = await post.save();
    
    if (!savedPost) {
      return { 
        success: false,
        message: 'Post creation failed'
       };
    }
    return {
      success: true,
      message: 'Post created successfully',
      data: savedPost
    };
  }

  static async getSinglePost(id: string): Promise<postResponse> {
    const post = await Post.findById(id);
    if (!post) {
      return {
        success: false,
        message: 'Post not found'
      };
    }
    // Confirm if post is a valid document
    if (!post._id) {
      return {
        success: false,
        message: 'Failed to retrieve post from database'
      };
    }

    return {
      success: true,
      message: 'Post retrieved successfully',
      data: post
    };
  }
  
  static async getAllPosts(): Promise<postResponse> {
    const posts = await Post.find();
    if (!posts || !Array.isArray(posts)) {
      return {
        success: false,
        message: 'Failed to retrieve posts'
      };
    }
    return {
      success: true,
      message: 'Posts retrieved successfully',
      data: posts
    };
  }

  static async updatePost(id: string, data: Partial<IPost>): Promise<postResponse> {
    const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPost) {
      return {
        success: false,
        message: 'Post update failed'
      };
    }
    // Confirm if update was successful
    if (!updatedPost._id) {
      return {
        success: false,
        message: 'Failed to update post in database'
      };
    }
    return {
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    };
  }

  static async deletePost(id: string): Promise<postResponse> {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return {
        success: false,
        message: 'Post deletion failed'
      };
    }
    // Confirm if deletion was successful
    if (!deletedPost._id) {
      return {
        success: false,
        message: 'Failed to delete post from database'
      };
    }
    return {
      success: true,
      message: 'Post deleted successfully',
      data: deletedPost
    };
  }
}