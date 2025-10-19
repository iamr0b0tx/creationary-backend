import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import postRoutes from './routes/postRoute';

dotenv.config();

const app: Application = express();

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
  throw new Error('MONGODB_URI is not defined in environment variables');
}

console.log(`Server will run on port ${PORT}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully');
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});