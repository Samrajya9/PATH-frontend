import { CreateAxiosDefaults } from 'axios';
import { Http } from './http';
import { envServer } from '@/env/server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE } from '@/constants';

const RAW_URL = envServer.APP_BACKEND_URL || 'http://localhost:4000/api/';

const BASE_URL =
  RAW_URL.includes('://') && !RAW_URL.endsWith('/api/')
    ? RAW_URL.endsWith('/api')
      ? `${RAW_URL}/`
      : `${RAW_URL}/api/`
    : RAW_URL;

const config: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  proxy: false, // ✅ Fix Node 24 proxy warning
};
class ServerHttp extends Http {
  constructor() {
    super(config);
    this.axiosInstance.interceptors.request.use(async (config) => {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
  }
}

export const serverHttp = new ServerHttp();
