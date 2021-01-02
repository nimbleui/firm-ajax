import { isFormData, isObject } from "./type";

export function transformRequest(data: unknown): any {
  if (isObject(data) && !isFormData(data)) {
    data = JSON.stringify(data);
  }
  return data;
}
