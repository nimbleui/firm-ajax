import { XhrRequestConfig } from "../types";
import { isPlainObject } from "./type";
import { normalizeHeaderName } from "../helpers/headers";

function merge(
  target: XhrRequestConfig,
  form: XhrRequestConfig
): XhrRequestConfig {
  normalizeHeaderName(target, ["Content-Type", "Accept"]);

  Object.keys(form).forEach((key) => {
    const el = form[key];
    if (!target[key]) {
      return (target[key] = el);
    }
    if (isPlainObject(el) && isPlainObject(target[key])) {
      merge(target[key], el);
    }
  });
  return target;
}

export default merge;
