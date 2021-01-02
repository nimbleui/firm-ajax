/* eslint-disable @typescript-eslint/ban-types */
import FirmAjax from "./core/firmAjax";
import { FirmAjaxStatic, XhrRequestConfig } from "./types";
import defaultConfig from "./helpers/defaultConfig";

const cloneKeys = [
  "use",
  "get",
  "put",
  "head",
  "post",
  "patch",
  "delete",
  "options",
  "request",
  "setPublicConfig",
];

function createInstance(defaultConfig: XhrRequestConfig): FirmAjaxStatic {
  const context = new FirmAjax(defaultConfig);
  const instance = FirmAjax.prototype.request.bind(context);
  cloneKeys.forEach((key) => {
    instance[key] = (FirmAjax.prototype[key] as Function).bind(context);
  });
  return instance;
}

const firmAjax = createInstance(defaultConfig);

export * from "./types";
export default firmAjax;
