import { prisma } from './prisma';

export const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn('DATABASE_URL is not set in environment variables. Falling back to default PostgreSQL connection.');
    }

    await prisma.$connect();
    console.log('PostgreSQL (Prisma) connected successfully');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL via Prisma:', error);
    // Don't exit immediately in local dev if DB isn't running yet, but log clear error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('PostgreSQL (Prisma) disconnected');
  } catch (error) {
    console.error('Error disconnecting from PostgreSQL:', error);
  }
};
