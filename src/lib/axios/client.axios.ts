import { AxiosResponse, CreateAxiosDefaults } from 'axios';
import { Http } from './http';
import { envClient } from '@/env/client';

const RAW_URL = envClient.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/api/';

const BASE_URL =
  RAW_URL.includes('://') && !RAW_URL.endsWith('/api/')
    ? RAW_URL.endsWith('/api')
      ? `${RAW_URL}/`
      : `${RAW_URL}/api/`
    : RAW_URL;

const config: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15_000,
};
class ClientHttp extends Http {
  private static instance: ClientHttp | null = null;
  private isRefreshing = false;

  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  private processQueue(error: unknown = null, result: unknown = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(result);
    });
    this.failedQueue = [];
  }

  constructor() {
    super(config);
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        // Network error / timeout — no response object
        if (!error.response) {
          return Promise.reject({
            success: false,
            data: null,
            statusCode: undefined,
            message: error.message ?? 'Network error',
          });
        }

        const status: number = error.response.status;
        const responseData: any & { shouldRefresh?: boolean } =
          error.response.data;

        // Server explicitly says not to attempt a refresh (e.g. refresh token itself is expired)
        const shouldNotRefresh =
          status === 401 && responseData?.shouldRefresh === false;
        if (shouldNotRefresh) {
          return Promise.reject(responseData);
        }

        // Attempt a silent token refresh on 401
        const shouldAttemptRefresh =
          status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/auth/refresh' &&
          originalRequest.url !== '/auth/login';

        if (shouldAttemptRefresh) {
          originalRequest._retry = true;

          // Another refresh is already in flight — queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => this.axiosInstance(originalRequest));
          }

          this.isRefreshing = true;

          try {
            await this.axiosInstance.get('/auth/refresh');
            this.processQueue(null);
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(responseData);
      }
    );
  }

  public static getInstance(): ClientHttp {
    if (!ClientHttp.instance) {
      ClientHttp.instance = new ClientHttp();
    }
    return ClientHttp.instance;
  }

  public static resetInstance(): void {
    if (ClientHttp.instance) {
      ClientHttp.instance.processQueue(new Error('Instance reset'));
    }
    ClientHttp.instance = null;
  }
}

export const clientHttp = ClientHttp.getInstance();
export type { ClientHttp };
