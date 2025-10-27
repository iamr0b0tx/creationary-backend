import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.signup(email, password);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const token = req.query.token as string;
      const { newPassword } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token is required',
        });
        return;
      }
      const result = await AuthService.resetPassword(token, newPassword);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

}