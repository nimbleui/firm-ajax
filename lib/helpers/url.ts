import { isArray, isDate, isPlainObject } from "./type";

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

export function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url;
  }

  const parts: Array<string> = Object.keys(params).reduce((acc, key) => {
    let val = params[key];
    if (val === null || typeof val === "undefined") return acc;

    isArray(val) ? (key += "[]") : (val = [val]);

    const parts = (val as Array<string>).map((el) => {
      if (isDate(el)) {
        el = el.toISOString();
      } else if (isPlainObject(el)) {
        el = JSON.stringify(el);
      }
      return `${encode(key)}=${encode(el)}`;
    });
    return [...acc, ...parts];
  }, []);

  const serializedParams = parts.join("&");

  if (serializedParams) {
    const hashMarkIndex = url.indexOf("#");
    if (hashMarkIndex !== -1) {
      url = url.slice(0, hashMarkIndex);
    }

    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }

  return url;
}

export function spliceUrl(baseUrl: string, url: string): string {
  const spliceUrl = `${baseUrl}/${url}`;
  return spliceUrl
    .replace(/\/+/g, "/")
    .replace(/^http:\//, "http://")
    .replace(/^https:\//, "https://");
}
