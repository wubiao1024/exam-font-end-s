import {
  instance,
  requestInterceptor,
  responseInterceptorFulfilled,
  responseInterceptorReject,
} from '@/api/instance';

import {requestType,RequestDataEmmit} from './const'
import { AxiosRequestConfig, Method } from 'axios';
/*export interface requestType {
  path: string;
  method: Method;
  data?: any;
  options?: AxiosRequestConfig;
}

export type RequestDataEmmit<ReqType, ResType> = (
  data?: ReqType,
  option?: AxiosRequestConfig,
) => Promise<ResType>;*/

// 添加拦截器
instance.interceptors.request.use(requestInterceptor as any);
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

// 请求参数必须带有指定的字段
export const RequestEmit = async <reqType extends requestType,resType> (requestConfig:reqType):Promise< resType> => {
  const {path,method,data,options} = requestConfig
  const config: AxiosRequestConfig = {
    url: formatPath(path, data),
    [method === 'get' ? 'params' : 'data']: data,
    method,
    ...options,
  };
  return await instance.request(config);
};
