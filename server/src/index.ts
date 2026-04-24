import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connect';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import expenseRoute from './routes/expense';
import logger from './lib/logger';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173' }));
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/expenses', expenseRoute);
app.use(errorHandler);

const PORT = process.env.PORT ?? 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { error: (err as Error).message });
    process.exit(1);
  });

export { app };
