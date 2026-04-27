// export enum ErrorCode {
//   TOKEN_EXPIRED = 'TOKEN_EXPIRED',
//   INVALID_TOKEN = 'INVALID_TOKEN',
//   UNAUTHORIZED = 'UNAUTHORIZED',
//   FORBIDDEN = 'FORBIDDEN',
//   NOT_FOUND = 'NOT_FOUND',
//   NETWORK_ERROR = 'NETWORK_ERROR',
// }

type BaseApiResponse = {
  success: boolean;
  message: string;
  status: number; // HTTP staus code
};

export type ApiSuccess<T> = BaseApiResponse & {
  success: true;
  data: T;
  error: null;
};

export type FieldError = {
  message: string;
};

export type Error = {
  code: string; // machine-readable
  detail?: string; // optional deeper explanation
  fields?: Record<string, FieldError[]>; // 🔥 renamed
};

export type ApiError = BaseApiResponse & {
  success: false;
  data: null;
  error: Error; // 🔥 generic applied
  meta?: {
    timestamp?: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
