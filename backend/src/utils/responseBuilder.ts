import { Response } from 'express';

export class ResponseHandler {
  static success(res: Response, data: any, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data
    });
  }

  static error(res: Response, statusCode: number, message: string, errors?: any[]) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        errors
      }
    });
  }
}