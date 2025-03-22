import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ResponseHandler } from '../utils/responseBuilder.js';
import { AppError } from '../utils/errors.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return ResponseHandler.error(
      res,
      400,
      'Validation failed',
      err.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }))
    );
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle unique constraint violations
    if (err.code === 'P2002') {
      return ResponseHandler.error(
        res,
        409,
        'Resource already exists',
        [{
          field: (err.meta?.target as string[])[0],
          message: 'This value already exists'
        }]
      );
    }
  }

  // Handle custom AppErrors
  if (err instanceof AppError) {
    return ResponseHandler.error(
      res,
      err.statusCode,
      err.message,
      err.errors
    );
  }

  // Handle unknown errors
  return ResponseHandler.error(
    res,
    500,
    'Internal server error'
  );
};