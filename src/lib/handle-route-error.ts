import { ApiError } from '@/types/api-response';
import { NextResponse } from 'next/server';

export function handleRouteError(error: unknown): NextResponse {
  const apiError = error as ApiError;

  if (apiError.success === false) {
    return NextResponse.json(apiError, {
      status: apiError.status ?? 500,
    });
  }
  // Fallback for anything unexpected
  return NextResponse.json(
    {
      success: false,
      data: null,
      message: 'Internal server error',
      status: 500,
      error: {
        code: "BACKEND DIDN'T SEND A ERROR",
      },
    } satisfies ApiError,
    { status: 500 }
  );
}
