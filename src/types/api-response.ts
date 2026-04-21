export enum ErrorCode {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

type BaseApiResponse = {
  success: boolean;
  status: number;
};

export type ApiSuccess<T> = BaseApiResponse & {
  success: true;
  data: T;
  error: null;
};

export type ApiError = BaseApiResponse & {
  success: false;
  data: null;
  error: {
    code: ErrorCode;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
