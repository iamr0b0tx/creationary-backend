import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export class JWTUtils {
  private static readonly TOKEN_SECRET: string = process.env.JWT_SECRET || 'default_secret';
  private static ensureTokenSecret(): any {
    if (!JWTUtils.TOKEN_SECRET) {
      return {
        success: false, message: 'JWT_SECRET is not defined in environment variables',
      }
    }
  }
  static generateToken(payload: JWTPayload): string {
    this.ensureTokenSecret();
    const token = jwt.sign(payload, this.TOKEN_SECRET, { expiresIn: '24h' });
    return token;
  }

  static verifyAccessToken(token: string): JWTPayload | { error: string } {
    try {
      this.ensureTokenSecret();
      const decoded = jwt.verify(token, this.TOKEN_SECRET!) as JWTPayload;
      if (!decoded) {
        return { error: "Invalid access token" };
      }
      return decoded;
    } catch (error) {
      return { error: "Invalid access token" };
    }
  }

}