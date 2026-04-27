import { serverHttp } from '@/lib/axios/server.axios';
import { withErrorHandler } from '@/lib/route-handler';
import { NextResponse } from 'next/server';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const handler = withErrorHandler(async (req) => {
  console.log('{Iniside the [...path]}');
  const { pathname, search } = new URL(req.url);
  const path = pathname.split('/api/')[1] + search;

  const method = req.method.toLowerCase() as HttpMethod;

  const hasBody = !['get', 'delete'].includes(method);
  const body = hasBody ? await req.json().catch(() => undefined) : undefined;

  const response =
    method === 'delete'
      ? await serverHttp.delete(path)
      : method === 'get'
        ? await serverHttp.get(path)
        : await serverHttp[method](path, body);

  return NextResponse.json(response, { status: response.status });
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
