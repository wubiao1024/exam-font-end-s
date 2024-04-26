import { message } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseURL } from '../../config/global';

export const instance = axios.create({ baseURL });

// 白名单
export const whiteList = ['/api/user/login', '/api/hello'];

// 请求拦截器
export const requestInterceptor = (config: AxiosRequestConfig<any>) => {
  if (whiteList.includes(config.url as string)) {
    return config;
  }
  const headers = { ...config.headers, token: localStorage.getItem('token') };
  return { ...config, headers };
};

// 响应拦截器
export const responseInterceptorFulfilled = (response: AxiosResponse<any, any>) => {
  const { success, message: info } = response.data;
  // 失败弹窗
  if (!success) {
    message.error(info);
  }
  // 返回data
  return response.data;
};

// 响应码超过200拦截器
export const responseInterceptorReject = (err: any) => {
  message.error(err);
  return Promise.reject(err);
};
