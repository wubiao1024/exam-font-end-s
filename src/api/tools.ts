import {
  instance,
  requestInterceptor,
  responseInterceptorFulfilled,
  responseInterceptorReject,
} from '@/api/instance';
import { AxiosRequestConfig, Method } from 'axios';
export type RequestEmitType = (config: {
  path: string;
  method: Method;
  data?: any;
  options?: AxiosRequestConfig;
}) => Promise<any>;

export type RequestDataEmmit<rerType, ResType> = (
  data?: rerType,
  option?: AxiosRequestConfig,
) => Promise<ResType>;
// 添加拦截器
instance.interceptors.request.use(requestInterceptor);
instance.interceptors.response.use(responseInterceptorFulfilled, responseInterceptorReject);

// 替换路径参数占位符
const replacePathParams = (path: string, params?: any): string => {
  if (!params) return path;
  return path.replace(/:(\w+)/g, (_, param) => encodeURIComponent(params[param]));
};

// 格式化 path
const formatPath = (path: string, data?: any): string => {
  const trimmedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  return replacePathParams(trimmedPath, data);
};
export const RequestEmit: RequestEmitType = async ({ path, data, method, options }) => {
  const config: AxiosRequestConfig = {
    url: formatPath(path, data),
    [method === 'get' ? 'params' : 'data']: data,
    method,
    ...options,
  };
  return await instance.request(config);
};
