export class AppError extends Error {
    constructor(
      public statusCode: number,
      message: string,
      public errors?: { field?: string; message: string }[]
    ) {
      super(message);
      this.name = 'AppError';
    }
  }
  