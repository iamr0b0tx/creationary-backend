import { User } from '../models/User';

export class UserService {
  static async getUserById(userId: string) {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
      }
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      }
    }
    return {
      success: true,
      message: 'User fetched successfully',
      data: user,
    }
  }

  static async getAllUsers(page: number, limit: number) {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const total = await User.countDocuments();
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const usersList = await User.find().select('-password').skip(skip).limit(limit);
    if (!usersList || usersList.length === 0) {
      return {
        success: false,
        message: 'No users found',
      }
    }
    const users = {
      items: usersList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
    return {
      success: true,
      message: 'Users fetched successfully',
      data: users,
    }
  }
};