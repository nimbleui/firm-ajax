import { XhrRequestConfig, XhrResponse, scheduleEvent } from "../types/index";
import { buildUrl, spliceUrl } from "../helpers/url";
import createError from "../helpers/createError";
import { transformRequest } from "../helpers/data";
import { isFormData } from "../helpers/type";
import { getCookie } from "../helpers/cookies";

function xhrAdapter<T = any>(
  config: XhrRequestConfig,
  schedule: (event: scheduleEvent) => void
): Promise<XhrResponse<T>> {
  const {
    url,
    data,
    params,
    timeout,
    baseUrl,
    headers = {},
    responseType,
    validateStatus,
    method = "GET",
    xsrfCookieName,
    xsrfHeaderName,
    withCredentials,
    isUploadProgress,
    isDownloadProgress,
  } = config;

  return new Promise<XhrResponse<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (isFormData(data)) {
      delete headers["Content-Type"];
    }

    // 合并链接，发起请求
    const completeUrl = buildUrl(spliceUrl(baseUrl, url), params);
    xhr.open(method.toUpperCase(), completeUrl, true);

    xhr.onreadystatechange = function handleLoad() {
      if (!xhr || xhr.readyState !== 4) return;

      if (
        xhr.status === 0 &&
        !(xhr.responseURL && xhr.responseURL.indexOf("file:") === 0)
      ) {
        return;
      }

      // 获取返回数据
      const responseData =
        !responseType || responseType === "text"
          ? xhr.responseText
          : xhr.response;

      const response: XhrResponse = {
        data: responseData,
        config,
        headers: headers,
        request: xhr,
        status: xhr.status,
        statusText: xhr.statusText,
      };
      // 判断请求状态码
      const [min, max] = validateStatus;
      if (xhr.status >= min && xhr.status < max) {
        resolve(response);
      } else {
        reject(
          createError(
            `Request failed with status code ${xhr.status}`,
            config,
            xhr.status.toString(),
            xhr,
            response
          )
        );
      }
    };

    // 设置请求超时时间
    timeout && (xhr.timeout = timeout);

    // 设置返回数据格式
    if (responseType) {
      try {
        xhr.responseType = config.responseType;
      } catch (e) {
        if (config.responseType !== "json") {
          throw e;
        }
      }
    }

    const value =
      withCredentials && xsrfCookieName ? getCookie(xsrfCookieName) : null;
    value && (headers[xsrfHeaderName] = value);
    // 跨域
    withCredentials && (xhr.withCredentials = withCredentials);

    // 设置响应头
    Object.keys(headers).forEach((key) => {
      if (typeof data === undefined && key.toLowerCase() === "content-type") {
        delete headers[key];
      } else {
        xhr.setRequestHeader(key, headers[key]);
      }
    });

    // 绑定请求超时
    xhr.addEventListener("timeout", () => {
      reject(createError("Network Error", config, null, xhr));
    });

    // 绑定请求错误
    xhr.addEventListener("error", () => {
      reject(
        createError(
          `timeout of ${config.timeout}ms exceeded`,
          config,
          null,
          xhr
        )
      );
    });

    // 监听下载进度
    isDownloadProgress &&
      xhr.addEventListener("progress", (event) => {
        const { loaded, total } = event;
        schedule({
          url,
          method,
          type: "download",
          schedule: loaded / total,
        });
      });

    // 监听上传进度
    isUploadProgress &&
      xhr.upload.addEventListener("progress", (event) => {
        const { loaded, total } = event;
        schedule({
          url,
          method,
          type: "upload",
          schedule: loaded / total,
        });
      });

    xhr.send(transformRequest(data));
  });
}

export default xhrAdapter;
