import { XhrRequestConfig } from "../types";

const defaultConfig: XhrRequestConfig = {
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
  baseUrl: "",
  responseType: "json",
  validateStatus: [200, 300],
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
};

export default defaultConfig;
