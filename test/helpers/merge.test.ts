import merge from "../../lib/helpers/merge";
import { XhrRequestConfig } from "../../lib/types";

describe("test merge", () => {
  const defaults: XhrRequestConfig = {
    url: "chen",
    data: 22,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  const target: XhrRequestConfig = {
    url: "IT",
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  };

  test("is merge", () => {
    expect(merge(target, defaults)).toEqual({
      url: "IT",
      data: 22,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
});
