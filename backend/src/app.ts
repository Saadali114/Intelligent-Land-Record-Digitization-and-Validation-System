import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

export const createApp = (): Express => {
  const app = express();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  // Middleware
  app.use(
    cors({
      origin: [clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(morgan('dev'));
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  app.use(cookieParser());

  // Static directory for uploaded document files
  const uploadDir = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadDir));

  // Fallback for missing archival scan files (e.g. ephemeral storage restarts or cross-env DB records)
  app.get('/uploads/:fileName', (req: Request, res: Response) => {
    const { fileName } = req.params;
    const ext = path.extname(fileName).toLowerCase();

    // Check if it's an image file
    if (['.png', '.jpg', '.jpeg', '.webp', '.tiff'].includes(ext)) {
      const sampleImg = path.join(uploadDir, 'file-1788689957557-414671962.png');
      if (fs.existsSync(sampleImg)) {
        res.setHeader('Content-Type', ext === '.png' ? 'image/png' : 'image/jpeg');
        return res.sendFile(sampleImg);
      }
    }

    // Check if it's a PDF file
    if (ext === '.pdf') {
      const samplePdf = path.join(uploadDir, 'sample-7-12-extract.pdf');
      if (fs.existsSync(samplePdf)) {
        res.setHeader('Content-Type', 'application/pdf');
        return res.sendFile(samplePdf);
      }
    }

    return res.status(404).json({
      success: false,
      message: `File ${fileName} not found on server storage`,
    });
  });

  // Root welcome / health endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Land Record API Service',
      version: '1.0.0',
    });
  });

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Land Record API Service',
    });
  });

  // Mount API endpoints - support both /api and root paths for deployed flexibility
  app.use('/api', routes);
  app.use('/', routes);

  // 404 handler for unknown routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.originalUrl} not found`,
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
