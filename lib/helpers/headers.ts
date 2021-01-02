import { XhrRequestConfig } from "../types";
import { isString } from "../helpers/type";

export function normalizeHeaderName(
  headers: XhrRequestConfig,
  normalizedName: string | string[]
): void {
  const names = isString(normalizedName) ? [normalizedName] : normalizedName;

  Object.keys(headers).forEach((key) => {
    const findName = names.find(
      (item) => key !== item && key.toLowerCase() === item.toLowerCase()
    );
    if (findName) {
      headers[findName] = headers[key];
      delete headers[key];
    }
  });
}
