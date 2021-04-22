import { Request, Response, NextFunction } from 'express';

export function passportMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};