import express from "express";
import type { Request, Response } from "express";
import 'dotenv/config';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server running' });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});