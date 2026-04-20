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
          return Promise.reject(response.data as unknown);
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.get<T>(url, config);
    return res.data;
  }

  async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.post<T>(url, body, config);
    return res.data;
  }

  async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.put<T>(url, body, config);
    return res.data;
  }

  async patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.patch<T>(url, body, config);
    return res.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const res = await this.axiosInstance.delete<T>(url, config);
    return res.data;
  }
}
