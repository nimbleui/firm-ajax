(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["firmAjax"] = factory();
	else
		root["firmAjax"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/core/events.ts":
/*!****************************!*\
  !*** ./lib/core/events.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Events = /** @class */ (function () {
    function Events() {
        this.list = new Map();
    }
    Events.prototype.has = function (type) {
        return !!this.list.get(type);
    };
    Events.prototype.on = function (type, handler) {
        var handlers = this.list.get(type);
        var added = handlers && handlers.push(handler);
        if (!added) {
            this.list.set(type, [handler]);
        }
    };
    Events.prototype.off = function (type, handler) {
        var handlers = this.list.get(type);
        if (handlers) {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        }
    };
    Events.prototype.emit = function (type, event, isResult) {
        var handlers = this.list.get(type) || [];
        var result = handlers.slice().reduce(function (acc, handler) {
            var res = handler(acc);
            return isResult ? res : event;
        }, event);
        return result;
    };
    return Events;
}());
__exportStar(__webpack_require__(/*! ../types/index */ "./lib/types/index.ts"), exports);
exports.default = Events;


/***/ }),

/***/ "./lib/core/firmAjax.ts":
/*!******************************!*\
  !*** ./lib/core/firmAjax.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var events_1 = __webpack_require__(/*! ./events */ "./lib/core/events.ts");
var merge_1 = __webpack_require__(/*! ../helpers/merge */ "./lib/helpers/merge.ts");
var xhr_1 = __webpack_require__(/*! ../handles/xhr */ "./lib/handles/xhr.ts");
var FirmAjax = /** @class */ (function () {
    function FirmAjax(instanceConfig) {
        this.timer = null;
        this.startTime = null;
        this.requestCount = 0;
        this.firstResult = null;
        this.defaults = instanceConfig;
        this.event = new events_1.default();
    }
    FirmAjax.prototype.setPublicConfig = function (instanceConfig) {
        this.defaults = merge_1.default(instanceConfig, this.defaults);
    };
    FirmAjax.prototype.use = function (type, handler) {
        this.event.on(type, handler);
    };
    FirmAjax.prototype.onSchedule = function (event) {
        var url = event.url, type = event.type, method = event.method;
        var eventType = type + ":" + method + "-" + url;
        var has = this.event.has(eventType);
        has && this.event.emit(eventType, event);
        !has && this.event.emit(type, event);
    };
    FirmAjax.prototype.request = function (config) {
        var _this = this;
        // 设置起始时间
        if (!this.startTime) {
            this.startTime = Date.now();
            this.firstResult = this.event.emit("firstRequest", null, true);
        }
        this.timer && clearTimeout(this.timer);
        // 计算请求数量
        this.requestCount++;
        // 请求前执行中间件
        config = this.event.emit("beforeRequest", config, true);
        return xhr_1.default(merge_1.default(config, this.defaults), this.onSchedule.bind(this))
            .then(function (response) {
            // 拿到数据返回去前执行中间件
            response = _this.event.emit("beforeResponse", response, true);
            return Promise.resolve(response);
        })
            .catch(function (error) {
            // 请求失败执行
            error = _this.event.emit("error", error, true);
            return Promise.reject(error);
        })
            .finally(function () {
            _this.requestCount--;
            if (!_this.requestCount) {
                _this.timer = window.setTimeout(function () {
                    var now = Date.now();
                    _this.event.emit("allRequestEnd", {
                        firstResult: _this.firstResult,
                        totalTime: now - _this.startTime + 20,
                    });
                    _this.startTime = null;
                }, 20);
            }
        });
    };
    FirmAjax.prototype.get = function (url, config) {
        return this.request(__assign(__assign({}, config), { method: "get", url: url }));
    };
    FirmAjax.prototype.delete = function (url, config) {
        return this.request(__assign(__assign({}, config), { method: "delete", url: url }));
    };
    FirmAjax.prototype.head = function (url, config) {
        return this.request(__assign(__assign({}, config), { method: "head", url: url }));
    };
    FirmAjax.prototype.options = function (url, config) {
        return this.request(__assign(__assign({}, config), { method: "options", url: url }));
    };
    FirmAjax.prototype.post = function (url, data, config) {
        return this.request(__assign(__assign({}, config), { method: "post", data: data,
            url: url }));
    };
    FirmAjax.prototype.put = function (url, data, config) {
        return this.request(__assign(__assign({}, config), { method: "put", data: data,
            url: url }));
    };
    FirmAjax.prototype.patch = function (url, data, config) {
        return this.request(__assign(__assign({}, config), { method: "patch", data: data,
            url: url }));
    };
    return FirmAjax;
}());
exports.default = FirmAjax;


/***/ }),

/***/ "./lib/handles/xhr.ts":
/*!****************************!*\
  !*** ./lib/handles/xhr.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var url_1 = __webpack_require__(/*! ../helpers/url */ "./lib/helpers/url.ts");
var createError_1 = __webpack_require__(/*! ../helpers/createError */ "./lib/helpers/createError.ts");
var data_1 = __webpack_require__(/*! ../helpers/data */ "./lib/helpers/data.ts");
var type_1 = __webpack_require__(/*! ../helpers/type */ "./lib/helpers/type.ts");
var cookies_1 = __webpack_require__(/*! ../helpers/cookies */ "./lib/helpers/cookies.ts");
function xhrAdapter(config, schedule) {
    var url = config.url, data = config.data, params = config.params, timeout = config.timeout, baseUrl = config.baseUrl, _a = config.headers, headers = _a === void 0 ? {} : _a, responseType = config.responseType, validateStatus = config.validateStatus, _b = config.method, method = _b === void 0 ? "GET" : _b, xsrfCookieName = config.xsrfCookieName, xsrfHeaderName = config.xsrfHeaderName, withCredentials = config.withCredentials, isUploadProgress = config.isUploadProgress, isDownloadProgress = config.isDownloadProgress;
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        if (type_1.isFormData(data)) {
            delete headers["Content-Type"];
        }
        // 合并链接，发起请求
        var completeUrl = url_1.buildUrl(url_1.spliceUrl(baseUrl, url), params);
        xhr.open(method.toUpperCase(), completeUrl, true);
        xhr.onreadystatechange = function handleLoad() {
            if (!xhr || xhr.readyState !== 4)
                return;
            if (xhr.status === 0 &&
                !(xhr.responseURL && xhr.responseURL.indexOf("file:") === 0)) {
                return;
            }
            // 获取返回数据
            var responseData = !responseType || responseType === "text"
                ? xhr.responseText
                : xhr.response;
            var response = {
                data: responseData,
                config: config,
                headers: headers,
                request: xhr,
                status: xhr.status,
                statusText: xhr.statusText,
            };
            // 判断请求状态码
            var min = validateStatus[0], max = validateStatus[1];
            if (xhr.status >= min && xhr.status < max) {
                resolve(response);
            }
            else {
                reject(createError_1.default("Request failed with status code " + xhr.status, config, xhr.status.toString(), xhr, response));
            }
        };
        // 设置请求超时时间
        timeout && (xhr.timeout = timeout);
        // 设置返回数据格式
        if (responseType) {
            try {
                xhr.responseType = config.responseType;
            }
            catch (e) {
                if (config.responseType !== "json") {
                    throw e;
                }
            }
        }
        var value = withCredentials && xsrfCookieName ? cookies_1.getCookie(xsrfCookieName) : null;
        value && (headers[xsrfHeaderName] = value);
        // 跨域
        withCredentials && (xhr.withCredentials = withCredentials);
        // 设置响应头
        Object.keys(headers).forEach(function (key) {
            if (typeof data === undefined && key.toLowerCase() === "content-type") {
                delete headers[key];
            }
            else {
                xhr.setRequestHeader(key, headers[key]);
            }
        });
        // 绑定请求超时
        xhr.addEventListener("timeout", function () {
            reject(createError_1.default("Network Error", config, null, xhr));
        });
        // 绑定请求错误
        xhr.addEventListener("error", function () {
            reject(createError_1.default("timeout of " + config.timeout + "ms exceeded", config, null, xhr));
        });
        // 监听下载进度
        isDownloadProgress &&
            xhr.addEventListener("progress", function (event) {
                var loaded = event.loaded, total = event.total;
                schedule({
                    url: url,
                    method: method,
                    type: "download",
                    schedule: loaded / total,
                });
            });
        // 监听上传进度
        isUploadProgress &&
            xhr.upload.addEventListener("progress", function (event) {
                var loaded = event.loaded, total = event.total;
                schedule({
                    url: url,
                    method: method,
                    type: "upload",
                    schedule: loaded / total,
                });
            });
        xhr.send(data_1.transformRequest(data));
    });
}
exports.default = xhrAdapter;


/***/ }),

/***/ "./lib/helpers/cookies.ts":
/*!********************************!*\
  !*** ./lib/helpers/cookies.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.removeCookie = exports.getCookie = exports.setCookie = void 0;
var type_1 = __webpack_require__(/*! ../helpers/type */ "./lib/helpers/type.ts");
function setCookie(name, value, options) {
    var _a = options || {}, expires = _a.expires, path = _a.path, domain = _a.domain, secure = _a.secure;
    var cookie = [];
    cookie.push(name + "=" + encodeURIComponent(value));
    if (expires) {
        var date = null;
        if (type_1.isNumber(expires)) {
            var time = options.expires * 24 * 60 * 60 * 1000;
            date = new Date();
            date.setTime(date.getTime() + time);
        }
        else {
            date = expires;
        }
        cookie.push("expires=" + date.toUTCString());
    }
    path && type_1.isString(path) && cookie.push("path=" + path);
    domain && type_1.isString(domain) && cookie.push("domain=" + domain);
    secure && cookie.push("secure");
    document.cookie = cookie.join(";");
}
exports.setCookie = setCookie;
function getCookie(key) {
    var result = new RegExp("(?:^|; )" + encodeURIComponent(key) + "=([^;]*)").exec(document.cookie);
    console.log(result);
    return result ? decodeURIComponent(result[1]) : null;
}
exports.getCookie = getCookie;
function removeCookie(name) {
    setCookie(name, "", {
        expires: 0,
    });
}
exports.removeCookie = removeCookie;


/***/ }),

/***/ "./lib/helpers/createError.ts":
/*!************************************!*\
  !*** ./lib/helpers/createError.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var CreateError = /** @class */ (function (_super) {
    __extends(CreateError, _super);
    function CreateError(message, config, code, request, response) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.config = config;
        _this.request = request;
        _this.response = response;
        return _this;
    }
    return CreateError;
}(Error));
function createError(message, config, code, request, response) {
    return new CreateError(message, config, code, request, response);
}
exports.default = createError;


/***/ }),

/***/ "./lib/helpers/data.ts":
/*!*****************************!*\
  !*** ./lib/helpers/data.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformRequest = void 0;
var type_1 = __webpack_require__(/*! ./type */ "./lib/helpers/type.ts");
function transformRequest(data) {
    if (type_1.isObject(data) && !type_1.isFormData(data)) {
        data = JSON.stringify(data);
    }
    return data;
}
exports.transformRequest = transformRequest;


/***/ }),

/***/ "./lib/helpers/defaultConfig.ts":
/*!**************************************!*\
  !*** ./lib/helpers/defaultConfig.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var defaultConfig = {
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=utf-8",
    },
    baseUrl: "",
    responseType: "json",
    validateStatus: [200, 300],
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
};
exports.default = defaultConfig;


/***/ }),

/***/ "./lib/helpers/headers.ts":
/*!********************************!*\
  !*** ./lib/helpers/headers.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeHeaderName = void 0;
var type_1 = __webpack_require__(/*! ../helpers/type */ "./lib/helpers/type.ts");
function normalizeHeaderName(headers, normalizedName) {
    var names = type_1.isString(normalizedName) ? [normalizedName] : normalizedName;
    Object.keys(headers).forEach(function (key) {
        var findName = names.find(function (item) { return key !== item && key.toLowerCase() === item.toLowerCase(); });
        if (findName) {
            headers[findName] = headers[key];
            delete headers[key];
        }
    });
}
exports.normalizeHeaderName = normalizeHeaderName;


/***/ }),

/***/ "./lib/helpers/merge.ts":
/*!******************************!*\
  !*** ./lib/helpers/merge.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var type_1 = __webpack_require__(/*! ./type */ "./lib/helpers/type.ts");
var headers_1 = __webpack_require__(/*! ../helpers/headers */ "./lib/helpers/headers.ts");
function merge(target, form) {
    headers_1.normalizeHeaderName(target, ["Content-Type", "Accept"]);
    Object.keys(form).forEach(function (key) {
        var el = form[key];
        if (!target[key]) {
            return (target[key] = el);
        }
        if (type_1.isPlainObject(el) && type_1.isPlainObject(target[key])) {
            merge(target[key], el);
        }
    });
    return target;
}
exports.default = merge;


/***/ }),

/***/ "./lib/helpers/type.ts":
/*!*****************************!*\
  !*** ./lib/helpers/type.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isString = exports.isNumber = exports.isFormData = exports.isDate = exports.isArray = exports.isPlainObject = exports.isObject = exports.type = void 0;
var toString = {}.toString;
function type(el) {
    var typeStr = toString.call(el);
    var len = typeStr.length;
    return typeStr.slice(8, len - 1).toLowerCase();
}
exports.type = type;
function isObject(el) {
    return el !== null && typeof el === "object";
}
exports.isObject = isObject;
function isPlainObject(el) {
    return type(el) === "object";
}
exports.isPlainObject = isPlainObject;
function isArray(el) {
    return type(el) === "array";
}
exports.isArray = isArray;
function isDate(el) {
    return type(el) === "date";
}
exports.isDate = isDate;
function isFormData(el) {
    return type(el) === "formdata";
}
exports.isFormData = isFormData;
function isNumber(el) {
    return type(el) === "number";
}
exports.isNumber = isNumber;
function isString(el) {
    return type(el) === "string";
}
exports.isString = isString;


/***/ }),

/***/ "./lib/helpers/url.ts":
/*!****************************!*\
  !*** ./lib/helpers/url.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.spliceUrl = exports.buildUrl = void 0;
var type_1 = __webpack_require__(/*! ./type */ "./lib/helpers/type.ts");
function encode(val) {
    return encodeURIComponent(val)
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",")
        .replace(/%20/g, "+")
        .replace(/%5B/gi, "[")
        .replace(/%5D/gi, "]");
}
function buildUrl(url, params) {
    if (!params) {
        return url;
    }
    var parts = Object.keys(params).reduce(function (acc, key) {
        var val = params[key];
        if (val === null || typeof val === "undefined")
            return acc;
        type_1.isArray(val) ? (key += "[]") : (val = [val]);
        var parts = val.map(function (el) {
            if (type_1.isDate(el)) {
                el = el.toISOString();
            }
            else if (type_1.isPlainObject(el)) {
                el = JSON.stringify(el);
            }
            return encode(key) + "=" + encode(el);
        });
        return __spreadArrays(acc, parts);
    }, []);
    var serializedParams = parts.join("&");
    if (serializedParams) {
        var hashMarkIndex = url.indexOf("#");
        if (hashMarkIndex !== -1) {
            url = url.slice(0, hashMarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}
exports.buildUrl = buildUrl;
function spliceUrl(baseUrl, url) {
    var spliceUrl = baseUrl + "/" + url;
    return spliceUrl
        .replace(/\/+/g, "/")
        .replace(/^http:\//, "http://")
        .replace(/^https:\//, "https://");
}
exports.spliceUrl = spliceUrl;


/***/ }),

/***/ "./lib/index.ts":
/*!**********************!*\
  !*** ./lib/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint-disable @typescript-eslint/ban-types */
var firmAjax_1 = __webpack_require__(/*! ./core/firmAjax */ "./lib/core/firmAjax.ts");
var defaultConfig_1 = __webpack_require__(/*! ./helpers/defaultConfig */ "./lib/helpers/defaultConfig.ts");
var cloneKeys = [
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
function createInstance(defaultConfig) {
    var context = new firmAjax_1.default(defaultConfig);
    var instance = firmAjax_1.default.prototype.request.bind(context);
    cloneKeys.forEach(function (key) {
        instance[key] = firmAjax_1.default.prototype[key].bind(context);
    });
    return instance;
}
var firmAjax = createInstance(defaultConfig_1.default);
__exportStar(__webpack_require__(/*! ./types */ "./lib/types/index.ts"), exports);
exports.default = firmAjax;


/***/ }),

/***/ "./lib/types/index.ts":
/*!****************************!*\
  !*** ./lib/types/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./lib/index.ts");
/******/ })()
;
});
//# sourceMappingURL=firmAjax.js.map