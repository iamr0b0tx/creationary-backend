import { IPost, Post } from '../models/Post';
import { User } from '../models/User';
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
    const post = await Post.findById(id).populate("author", "firstName lastName email");
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

  static async getAllPosts(page = 1, limit = 10, searchQuery?: string): Promise<postResponse> {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));

    const query: any = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate("author", "firstName lastName email")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    if (!posts || !Array.isArray(posts)) {
      return {
        success: false,
        message: 'Failed to retrieve posts'
      };
    }

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / pageSize);

    return {
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts,
        pagination: {
          totalPosts,
          currentPage: pageNumber,
          totalPages,
          limits: pageSize,
        }
      }
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

  static async searchPosts(searchQuery: string): Promise<postResponse> {
    try {
      const posts = await Post.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { content: { $regex: searchQuery, $options: 'i' } },
        ],
      })
        .populate('author', 'firstName lastName email')
        .sort({ createdAt: -1 });

      const users = await User.find({
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        ],
      }).select('firstName lastName email role');

      const hasResults = posts.length > 0 || users.length > 0;

      if (!hasResults) {
        return {
          success: false,
          message: 'No matching posts or users found',
        };
      }

      return {
        success: true,
        message: 'Search results retrieved successfully',
        data: {
          users,
          posts,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Search failed due to server error',
      };
    }
  }
}