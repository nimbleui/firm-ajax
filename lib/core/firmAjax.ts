import Events, { Event, EventType, Handler } from "./events";
import merge from "../helpers/merge";
import xhr from "../handles/xhr";
import {
  XhrRequestConfig,
  scheduleEvent,
  FirstResult,
  XhrResponse,
  XhrError,
} from "../types/index";

class FirmAjax {
  event: Event;
  timer: number;
  firstResult: any;
  startTime: number;
  requestCount: number;
  defaults: XhrRequestConfig;

  constructor(instanceConfig: XhrRequestConfig) {
    this.timer = null;
    this.startTime = null;
    this.requestCount = 0;
    this.firstResult = null;
    this.defaults = instanceConfig;
    this.event = new Events();
  }

  setPublicConfig(instanceConfig: XhrRequestConfig) {
    this.defaults = merge(instanceConfig, this.defaults);
  }

  use<T = any>(type: EventType, handler: Handler<T>): void {
    this.event.on<T>(type, handler);
  }

  onSchedule(event: scheduleEvent): void {
    const { url, type, method } = event;
    const eventType = `${type}:${method}-${url}`;
    const has = this.event.has(eventType);
    has && this.event.emit(eventType, event);
    !has && this.event.emit(type, event);
  }

  request<T = any>(config: XhrRequestConfig): Promise<XhrResponse<T>> {
    // 设置起始时间
    if (!this.startTime) {
      this.startTime = Date.now();
      this.firstResult = this.event.emit<number>("firstRequest", null, true);
    }
    this.timer && clearTimeout(this.timer);
    // 计算请求数量
    this.requestCount++;

    // 请求前执行中间件
    config = this.event.emit<XhrRequestConfig>("beforeRequest", config, true);

    return xhr<T>(merge(config, this.defaults), this.onSchedule.bind(this))
      .then((response) => {
        // 拿到数据返回去前执行中间件
        response = this.event.emit<XhrResponse<T>>(
          "beforeResponse",
          response,
          true
        );
        return Promise.resolve(response);
      })
      .catch((error: XhrError<T>) => {
        // 请求失败执行
        error = this.event.emit<XhrError<T>>("error", error, true);

        return Promise.reject(error);
      })
      .finally(() => {
        this.requestCount--;
        if (!this.requestCount) {
          this.timer = window.setTimeout(() => {
            const now = Date.now();
            this.event.emit<FirstResult>("allRequestEnd", {
              firstResult: this.firstResult,
              totalTime: now - this.startTime + 20,
            });
            this.startTime = null;
          }, 20);
        }
      });
  }

  get<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>> {
    return this.request({
      ...config,
      method: "get",
      url,
    });
  }

  delete<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>> {
    return this.request({
      ...config,
      method: "delete",
      url,
    });
  }

  head<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>> {
    return this.request({
      ...config,
      method: "head",
      url,
    });
  }

  options<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>> {
    return this.request({
      ...config,
      method: "options",
      url,
    });
  }

  post<T>(
    url: string,
    data?: any,
    config?: XhrRequestConfig
  ): Promise<XhrResponse<T>> {
    return this.request({
      ...config,
      method: "post",
      data,
      url,
    });
  }

  put<T>(
    url: string,
    data?: any,
    config?: XhrRequestConfig
  ): Promise<XhrResponse<T>> {
    return this.request({
      ...config,
      method: "put",
      data,
      url,
    });
  }

  patch<T>(
    url: string,
    data?: any,
    config?: XhrRequestConfig
  ): Promise<XhrResponse<T>> {
    return this.request({
      ...config,
      method: "patch",
      data,
      url,
    });
  }
}

export default FirmAjax;
