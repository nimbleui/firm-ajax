import { buildUrl, spliceUrl } from "../../lib/helpers/url";

describe("test url", () => {
  const url = "https://baidu.com";
  const params = {
    aa: 454,
    cc: 233,
  };

  const paramsArr = {
    aa: [1, 2, 3],
  };
  const date = new Date();
  const paramsDate = {
    aa: date,
  };

  test("is buildUrl", () => {
    expect(buildUrl(url, params)).toBe("https://baidu.com?aa=454&cc=233");
    expect(buildUrl(url, paramsArr)).toBe(
      "https://baidu.com?aa[]=1&aa[]=2&aa[]=3"
    );
    expect(buildUrl(url, paramsDate)).toBe(
      `https://baidu.com?aa=${date.toISOString()}`
    );
  });
  const baseUrl = "https://baidu.com";
  const URL = "aa/bb";
  const urls = "/aa/bb";
  test("is spliceUrl", () => {
    expect(spliceUrl(baseUrl, URL)).toBe("https://baidu.com/aa/bb");
    expect(spliceUrl(baseUrl, urls)).toBe("https://baidu.com/aa/bb");
  });
});
