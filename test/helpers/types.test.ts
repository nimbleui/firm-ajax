import {
  isString,
  isNumber,
  isArray,
  isDate,
  isFormData,
  isObject,
  isPlainObject,
} from "../../lib/helpers/type";

describe("test helpers", () => {
  describe("test type", () => {
    const srt = "";
    const arr = [];
    const obj = {};
    const num = 333;
    const bloo = true;
    const date = new Date();
    const fromData = new FormData();
    test("is isString", () => {
      expect(isString(srt)).toBeTruthy();
      expect(isString(num)).toBeFalsy();
      expect(isString(bloo)).toBeFalsy();
      expect(isString(date)).toBeFalsy();
      expect(isString(arr)).toBeFalsy();
      expect(isString(obj)).toBeFalsy();
      expect(isString(fromData)).toBeFalsy();
    });

    test("is isNumber", () => {
      expect(isNumber(srt)).toBeFalsy();
      expect(isNumber(num)).toBeTruthy();
      expect(isNumber(bloo)).toBeFalsy();
      expect(isNumber(date)).toBeFalsy();
      expect(isNumber(arr)).toBeFalsy();
      expect(isNumber(obj)).toBeFalsy();
      expect(isNumber(fromData)).toBeFalsy();
    });

    test("is isArray", () => {
      expect(isArray(srt)).toBeFalsy();
      expect(isArray(num)).toBeFalsy();
      expect(isArray(bloo)).toBeFalsy();
      expect(isArray(date)).toBeFalsy();
      expect(isArray(arr)).toBeTruthy();
      expect(isArray(obj)).toBeFalsy();
      expect(isArray(fromData)).toBeFalsy();
    });

    test("is isDate", () => {
      expect(isDate(srt)).toBeFalsy();
      expect(isDate(num)).toBeFalsy();
      expect(isDate(bloo)).toBeFalsy();
      expect(isDate(date)).toBeTruthy();
      expect(isDate(arr)).toBeFalsy();
      expect(isDate(obj)).toBeFalsy();
      expect(isDate(fromData)).toBeFalsy();
    });

    test("is isFormData", () => {
      expect(isFormData(srt)).toBeFalsy();
      expect(isFormData(num)).toBeFalsy();
      expect(isFormData(bloo)).toBeFalsy();
      expect(isFormData(date)).toBeFalsy();
      expect(isFormData(arr)).toBeFalsy();
      expect(isFormData(obj)).toBeFalsy();
      expect(isFormData(fromData)).toBeTruthy();
    });

    test("is isObject", () => {
      expect(isObject(srt)).toBeFalsy();
      expect(isObject(num)).toBeFalsy();
      expect(isObject(bloo)).toBeFalsy();
      expect(isObject(date)).toBeTruthy();
      expect(isObject(arr)).toBeTruthy();
      expect(isObject(obj)).toBeTruthy();
      expect(isObject(fromData)).toBeTruthy();
    });

    test("is isPlainObject", () => {
      expect(isPlainObject(srt)).toBeFalsy();
      expect(isPlainObject(num)).toBeFalsy();
      expect(isPlainObject(bloo)).toBeFalsy();
      expect(isPlainObject(date)).toBeFalsy();
      expect(isPlainObject(arr)).toBeFalsy();
      expect(isPlainObject(obj)).toBeTruthy();
      expect(isPlainObject(fromData)).toBeFalsy();
    });
  });
});
