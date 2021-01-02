import { XhrRequestConfig, XhrResponse, scheduleEvent } from "../types/index";
declare function xhrAdapter<T = any>(config: XhrRequestConfig, schedule: (event: scheduleEvent) => void): Promise<XhrResponse<T>>;
export default xhrAdapter;
