import { ApiError, ApiResponse, ErrorCode } from '@/types/api-response';
import axios, {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  AxiosRequestConfig,
} from 'axios';

export abstract class Http {
  protected axiosInstance: AxiosInstance;
  constructor(config: CreateAxiosDefaults) {
    this.axiosInstance = axios.create(config);

    this.axiosInstance.interceptors.request.use((config) => {
      if (config.url?.startsWith('/')) {
        config.url = config.url.substring(1);
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const apiResponseData = response.data;
        if (!apiResponseData.success) {
          return Promise.reject(apiResponseData as ApiError);
        }

        return response;
      },
      (error) => {
        const apiErr = error.response?.data ?? {
          success: false,
          status: error.response?.status ?? 0,
          data: null,
          error: {
            code: ErrorCode.NETWORK_ERROR,
            message: error.message ?? 'Network error',
          },
        };
        return Promise.reject(apiErr);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return res.data;
  }

  async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.post<ApiResponse<T>>(
      url,
      body,
      config
    );
    return res.data;
  }

  async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.put<ApiResponse<T>>(url, body, config);
    return res.data;
  }

  async patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.patch<ApiResponse<T>>(
      url,
      body,
      config
    );
    return res.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return res.data;
  }
}
