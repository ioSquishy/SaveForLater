import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
export const app = express();
import searchRouter from './routes/search.routes';
import HttpError from './errors/HttpError';

// automatically convert requests to json
// set json body size limit to 18mb (default is 10mb) b/c max gemini inline data request size is 20mb
app.use(express.json({ limit: '18mb' }));
// can specify what services can use this server by doing for example: cors(http://localhost:5174/)
app.use(cors());

// routes
app.use("/search", searchRouter);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Global Error Handler ---
// This catches any errors thrown in your services or routes
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = err instanceof Error ? err : new Error('Internal Server Error');
  const status = err instanceof HttpError ? err.statusCode : 500;

  console.error(error.stack);
  res.status(status).json({
    error: error.message,
    code: err instanceof HttpError ? err.code : 'INTERNAL_ERROR',
    details: err instanceof HttpError ? err.details : undefined,
  });
});