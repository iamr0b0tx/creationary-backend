import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import postRoutes from './routes/postRoute';
import { LoggerUtils } from './utils/loggerUtils';

dotenv.config();

const app: Application = express();

LoggerUtils.initialize();

const allowedOrigins = [
  'http://localhost:5173',
  'https://time-zone-app.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use('/api/posts', postRoutes);

const PORT: number = parseInt(process.env.PORT as string, 10);
const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  LoggerUtils.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    LoggerUtils.info('Successfully Connected to MongoDB');
  })
  .catch((error) => {
    LoggerUtils.error('Error connecting to MongoDB:', error);
  });


const server = app.listen(PORT, () => {
  LoggerUtils.info(`Server is running on port ${PORT}`);
});
process.on('SIGTERM', async () => {
  LoggerUtils.info('Shutting down gracefully');
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});