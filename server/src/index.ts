import 'dotenv/config';
import { connectDB } from './db/connect';
import { seedDemoAccount } from './db/seed';
import { app } from './app';
import logger from './lib/logger';

const PORT = process.env.PORT ?? 3001;

connectDB()
  .then(() => seedDemoAccount())
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { error: (err as Error).message });
    process.exit(1);
  });
