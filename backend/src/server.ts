import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`=================================================`);
      console.log(`Land Record API Server listening on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      console.log(`API base URL: http://localhost:${port}/api`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Fatal server startup error:', error);
    process.exit(1);
  }
};

startServer();
