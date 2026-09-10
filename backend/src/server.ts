import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// Hybrid Cadastral Intelligence Pipeline (Gemini Vision + On-Device EasyOCR Fallback)
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed/seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // Automatically seed default dataset if database is empty
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('No users found in database. Automatically initializing demo data...');
        try {
          await seedDatabase(false);
          console.log('Demo data successfully initialized.');
        } catch (seedErr) {
          console.error('Failed to auto-seed demo data:', seedErr);
        }
      }
    } catch (dbErr: any) {
      console.warn('Database query on startup failed (is PostgreSQL running?). Proceeding with server boot.');
    }

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
