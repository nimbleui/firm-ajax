import { XhrRequestConfig, XhrResponse, XhrError } from "../types/index";
class CreateError<T = any> extends Error {
  message: string;
  config: XhrRequestConfig;
  code: string;
  request: XMLHttpRequest;
  response?: XhrResponse<T>;
  constructor(
    message: string,
    config: XhrRequestConfig,
    code: string,
    request: XMLHttpRequest,
    response?: XhrResponse<T>
  ) {
    super(message);
    this.code = code;
    this.config = config;
    this.request = request;
    this.response = response;
  }
}

export default function createError<T = any>(
  message: string,
  config: XhrRequestConfig,
  code: string,
  request: XMLHttpRequest,
  response?: XhrResponse<T>
): XhrError<T> {
  return new CreateError<T>(message, config, code, request, response);
}
