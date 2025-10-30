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
};