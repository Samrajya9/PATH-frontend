'use server';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const envServer = createEnv({
  server: {
    APP_BACKEND_URL: z.string({ error: 'APP_BACKEND_URL is required' }),
  },
  runtimeEnv: { APP_BACKEND_URL: process.env.APP_BACKEND_URL },
});
