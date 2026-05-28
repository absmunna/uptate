import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { safeStorage } from "@/utils/storage";

export const onRequest = (config: InternalAxiosRequestConfig) => {
  const token = safeStorage.getItem('pm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const onResponse = (response: AxiosResponse) => response;

export const onError = (error: AxiosError) => {
  // Centralized error handling
  return Promise.reject(error);
};
