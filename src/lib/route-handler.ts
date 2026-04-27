import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError } from './handle-route-error';

type RouteContext = { params: Promise<Record<string, string | string[]>> };

type RouteHandler = (
  req: NextRequest,
  context: RouteContext
) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleRouteError(error);
    }
  };
}
