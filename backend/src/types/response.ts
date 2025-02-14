export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      errors?: { field?: string; message: string }[];
    };
  };