import { AxiosRequestConfig, Method } from 'axios';

export interface requestType {
  path: string;
  method: Method;
  data?: any;
  options?: AxiosRequestConfig;
}

export type RequestDataEmmit<ReqType, ResType> = (
  data?: ReqType,
  option?: AxiosRequestConfig,
) => Promise<ResType>;

export interface ResponseData {
  success?: boolean;
  data?: any;
  message?: string;
}
