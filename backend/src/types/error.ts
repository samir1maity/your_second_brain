export enum ErrorType {
  VALIDATION = "VALIDATION_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND_ERROR",
  CONFLICT = "CONFLICT_ERROR",
  INTERNAL = "INTERNAL_ERROR",
  BAD_REQUEST = "BAD_REQUEST_ERROR",
}

export interface ErrorResponse {
  status: string;
  type: ErrorType;
  message: string;
  errors?: any[];
  code?: string;
  stack?: string;
}
