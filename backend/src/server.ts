import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from multiple potential working directories without using import.meta
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(process.cwd(), '../backend/.env'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config();

// Hybrid Cadastral Intelligence Pipeline (Gemini Vision + On-Device EasyOCR Fallback)
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase, ensureDefaultAccounts } from './seed/seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // 1. Ensure core default system accounts always exist and are active
    try {
      await ensureDefaultAccounts();
      console.log('System core accounts (Admin, Officers, Verifiers, Citizen) verified and active.');
    } catch (accErr: any) {
      console.warn('Warning: Default accounts initialization check encountered an issue:', accErr?.message);
    }

    // 2. Automatically seed full dataset if database is empty
    try {
      const userCount = await User.countDocuments();
      if (userCount <= 6) {
        console.log('Database has minimal users. Initializing full demo land records and workflows...');
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
