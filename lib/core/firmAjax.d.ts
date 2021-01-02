import { Event, EventType, Handler } from "./events";
import { XhrRequestConfig, scheduleEvent, XhrResponse } from "../types/index";
declare class FirmAjax {
    event: Event;
    timer: number;
    firstResult: any;
    startTime: number;
    requestCount: number;
    defaults: XhrRequestConfig;
    constructor(instanceConfig: XhrRequestConfig);
    setPublicConfig(instanceConfig: XhrRequestConfig): void;
    use<T = any>(type: EventType, handler: Handler<T>): void;
    onSchedule(event: scheduleEvent): void;
    request<T = any>(config: XhrRequestConfig): Promise<XhrResponse<T>>;
    get<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>>;
    delete<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>>;
    head<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>>;
    options<T>(url: string, config?: XhrRequestConfig): Promise<XhrResponse<T>>;
    post<T>(url: string, data?: any, config?: XhrRequestConfig): Promise<XhrResponse<T>>;
    put<T>(url: string, data?: any, config?: XhrRequestConfig): Promise<XhrResponse<T>>;
    patch<T>(url: string, data?: any, config?: XhrRequestConfig): Promise<XhrResponse<T>>;
}
export default FirmAjax;
