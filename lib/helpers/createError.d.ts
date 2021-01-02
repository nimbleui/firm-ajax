import { XhrRequestConfig, XhrResponse, XhrError } from "../types/index";
export default function createError<T = any>(message: string, config: XhrRequestConfig, code: string, request: XMLHttpRequest, response?: XhrResponse<T>): XhrError<T>;
