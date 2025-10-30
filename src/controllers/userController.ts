import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { LoggerUtils } from '../utils/loggerUtils';

export class UserController {
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const result = await UserService.getUserById(userId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error(`Error fetching user with ID: ${req.params.id}`, { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}