import { createLogger, format, Logger, transports } from 'winston';
import dotenv from "dotenv";

dotenv.config();

export class LoggerUtils {
  private static instance: Logger | null = null;
  private static readonly LOG_DIR = process.env.LOG_DIR;
  private static readonly LOG_FILE = process.env.LOG_FILE;

  static initialize(): void {
    if (!this.instance) {
      // Initialize Winston logger
      this.instance = createLogger({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
        transports: [
          // Console transport for local development
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.simple()
            )
          }),
          // File transport for writing logs to the mounted drive
          new transports.File({
            filename: `${this.LOG_DIR}/${this.LOG_FILE}`, // Log file path
            maxsize: 10485760, // 10MB max file size
            maxFiles: 5, // Keep up to 5 log files
            tailable: true, // Append to the same file
          })
        ]
      });
    }
  }

  static getLogger(): Logger {
    if (!this.instance) {
      this.initialize();
    }
    return this.instance!;
  }

  static info(message: string, additionalInfo?: Record<string, any>): void {
    this.log('info', message, additionalInfo);
  }

  static error(message: string, error?: Record<string, any>): void {
    this.log('error', message, error);
  }

  static warn(message: string, additionalInfo?: Record<string, any>): void {
    this.log('warn', message, additionalInfo);
  }

  static debug(message: string, additionalInfo?: Record<string, any>): void {
    this.log('debug', message, additionalInfo);
  }

  private static log(level: string, message: string, additionalInfo?: Record<string, any>): void {
    if (!this.instance) {
      this.initialize();
    }

    const logObject = {
      level,
      message,
      additionalInfo,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    this.instance?.log(logObject);
  }
}