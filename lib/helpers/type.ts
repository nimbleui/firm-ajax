const toString = {}.toString;

export function type(el: any): string {
  const typeStr = toString.call(el) as string;
  const len = typeStr.length;
  return typeStr.slice(8, len - 1).toLowerCase();
}

export function isObject(el: any): el is Record<string, any> {
  return el !== null && typeof el === "object";
}

export function isPlainObject(el: any): el is Record<string, any> {
  return type(el) === "object";
}

export function isArray(el: any): el is Array<any> {
  return type(el) === "array";
}

export function isDate(el: any): el is Date {
  return type(el) === "date";
}

export function isFormData(el: any): el is FormData {
  return type(el) === "formdata";
}

export function isNumber(el: any): el is number {
  return type(el) === "number";
}

export function isString(el: any): el is string {
  return type(el) === "string";
}
