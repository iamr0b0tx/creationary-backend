import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class JWTUtils {
  private static readonly TOKEN_SECRET: string = process.env.JWT_SECRET || 'default_secret';
  private static ensureTokenSecret(): any {
    if (!JWTUtils.TOKEN_SECRET) {
      return {
        success: false, message: 'JWT_SECRET is not defined in environment variables',
      }
    }
  }
  static generateToken(id: string) {
    this.ensureTokenSecret();
    const token = jwt.sign({ id }, this.TOKEN_SECRET, { expiresIn: '24h' });
    return token;
  }

  static verifyAccessToken(token: string): any {
    try {
      this.ensureTokenSecret();
      return jwt.verify(token, this.TOKEN_SECRET!);
    } catch (error) {
      return { error: "Invalid access token" };
    }
  }

}