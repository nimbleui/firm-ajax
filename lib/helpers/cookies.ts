import { isNumber, isString } from "../helpers/type";

type Options = {
  expires?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
};

export function setCookie(
  name: string,
  value: string,
  options?: Options
): void {
  const { expires, path, domain, secure } = options || {};
  const cookie: Array<string> = [];
  cookie.push(`${name}=${encodeURIComponent(value)}`);
  if (expires) {
    let date = null;
    if (isNumber(expires)) {
      const time = options.expires * 24 * 60 * 60 * 1000;
      date = new Date();
      date.setTime(date.getTime() + time);
    } else {
      date = expires;
    }
    cookie.push(`expires=${date.toUTCString()}`);
  }

  path && isString(path) && cookie.push(`path=${path}`);
  domain && isString(domain) && cookie.push(`domain=${domain}`);
  secure && cookie.push("secure");
  document.cookie = cookie.join(";");
}

export function getCookie(key: string): string {
  const result = new RegExp(
    "(?:^|; )" + encodeURIComponent(key) + "=([^;]*)"
  ).exec(document.cookie);
  console.log(result);
  return result ? decodeURIComponent(result[1]) : null;
}

export function removeCookie(name: string) {
  setCookie(name, "", {
    expires: 0,
  });
}
