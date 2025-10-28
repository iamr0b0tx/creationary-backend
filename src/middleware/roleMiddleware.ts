import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;

      if (!user || !user.role) {
        res.status(403).json({
          success: false,
          message: 'User role not found. Access denied.',
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action.',
        });
        return;
      }

      next();
    };
}
