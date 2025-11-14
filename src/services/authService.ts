import { MailerUtils } from '../utils/mailerUtils';
import { User } from '../models/User';
import { JWTUtils } from '../utils/jwtUtils';
import { mailTemplate } from '../utils/mailTemplateUtils';
import { HashUtils } from '../utils/hashUtils';
import { signUpInput } from '../types/auth';

export class AuthService {
  static async signup(data: signUpInput) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }
    const hashedPassword = await HashUtils.hashPassword(data.password);
    const { email, firstName, lastName } = data;
    const userData = { email, password: hashedPassword, firstName, lastName };
    const user = new User(userData);
    const savedUser = await user.save();
    if (!savedUser) {
      return {
        success: false,
        message: 'User signup failed',
      };
    }

    const userSafe = savedUser.toObject();
    const { password: _, ...userWithoutPassword } = userSafe;

    MailerUtils.sendEmail(user.email, 'Welcome to Creationary', mailTemplate.welcome(user.email)).catch((err) => {
      console.error('Error sending welcome email:', err);
    });

    return {
      success: true,
      message: 'User signed up successfully',
      user: userWithoutPassword,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    const isPasswordValid = await HashUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    const token = JWTUtils.generateToken({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
    
    const userSafe = user.toObject();
    const { password: _, ...userWithoutPassword } = userSafe;
    return {
      success: true,
      message: 'User logged in successfully',
      user: userWithoutPassword,
      token,
    };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    const resetToken = JWTUtils.generateToken(user.id);
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    await MailerUtils.sendPasswordResetEmail(
      user.email,
      'Password Reset Request',
      mailTemplate.passwordReset(resetLink),
    );

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    const decoded: any = JWTUtils.verifyAccessToken(token);
    console.log(decoded)
    if (decoded.error) {
      return {
        success: false,
        message: 'Invalid or expired token'
      };
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    user.password = await HashUtils.hashPassword(newPassword);
    await user.save();

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}