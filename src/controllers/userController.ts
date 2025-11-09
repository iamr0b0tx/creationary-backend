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

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, Number.parseInt(String(req.query.page)) || 1);
      const rawLimit = Number.parseInt(String(req.query.limit));
      const defaultLimit = 10;
      const maxLimit = 100;
      let limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;
      if (limit > maxLimit) limit = maxLimit;

      const result = await UserService.getAllUsers(page, limit);

      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      LoggerUtils.error('Error fetching all users', { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}