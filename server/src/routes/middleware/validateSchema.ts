import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

const ValidateRequest = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse will throw an error if the data is invalid
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'Invalid Request',
          errors: error.issues.map(e => ({ path: e.path, message: e.message }))
        });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

export default ValidateRequest;