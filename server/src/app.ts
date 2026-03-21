import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
export const app = express();

// automatically convert requests to json
app.use(express.json());
// can specify what services can use this server by doing for example: cors(http://localhost:5174/)
app.use(cors());

// set up routes


app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Global Error Handler ---
// This catches any errors thrown in your services or routes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});