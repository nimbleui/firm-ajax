export type EventType = string | symbol;
export type Handler<T = any> = (event?: T) => T | any;
export type EventHandlerList = Array<Handler>;
export type EventHandlerMap = Map<EventType, EventHandlerList>;

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE";

export type scheduleEvent = {
  url: string;
  schedule: number;
  method: Method;
  type: "download" | "upload";
};

export interface Event {
  list: EventHandlerMap;
  has(type: EventType): boolean;
  on<T = any>(type: EventType, handler: Handler<T>): void;
  off<T = any>(type: EventType, handler: Handler<T>): void;
  emit<T = any>(type: EventType, event?: T, isResult?: boolean): T;
}

export interface XhrRequestConfig {
  baseUrl?: string;
  method?: Method;
  timeout?: number;
  headers?: any;
  params?: any;
  url?: string;
  data?: any;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  withCredentials?: boolean;
  isUploadProgress?: boolean;
  isDownloadProgress?: boolean;
  validateStatus?: Array<number>;
  responseType?: XMLHttpRequestResponseType;
}

export interface XhrResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: XhrRequestConfig;
  request?: XMLHttpRequest;
}

export interface XhrError<T = any> extends Error {
  config: XhrRequestConfig;
  code?: string;
  request?: XMLHttpRequest;
  response?: XhrResponse<T>;
}

export type FirstResult = { firstResult: any; totalTime: number };

interface EventTargetEventMap<T = any> {
  beforeRequest: (event: XhrRequestConfig) => XhrRequestConfig;
  beforeResponse: (event: XhrResponse<T>) => any;
  error: (event: XhrError<T>) => XhrError<T>;
  download: (event: scheduleEvent) => void;
  allRequestEnd: (event: FirstResult) => void;
  upload: (event: scheduleEvent) => void;
  firstRequest: () => T | void;
}

export interface FirmAjaxStatic {
  <T = any>(config: XhrRequestConfig): Promise<T>;
  use<K extends keyof EventTargetEventMap, R = any>(
    type: K,
    handler: EventTargetEventMap<R>[K]
  ): void;
  setPublicConfig(config: XhrRequestConfig): void;
  request<T = any>(config: XhrRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: XhrRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: XhrRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: XhrRequestConfig): Promise<T>;
  options<T = any>(url: string, config?: XhrRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: XhrRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: XhrRequestConfig): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: XhrRequestConfig
  ): Promise<T>;
}
