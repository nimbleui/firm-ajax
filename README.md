# firmAjax

## 安装

Using npm:

```bash
$ npm install firm-ajax
```

Using bower:

```bash
$ bower install firm-ajax
```

Using yarn:

```bash
$ yarn firm-ajax
```

## 例子

### `GET`请求

```js
import firmAjax from "firm-ajax";

firmAjax
  .get("/api?id=12345")
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });

firmAjax
  .get("/api", {
    params: {
      id: 12345,
    },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// 用 async await
async function getUser() {
  try {
    const response = await firmAjax.get("/api?id=12345");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

### `POST`请求

```js
firmAjax
  .post("/user", {
    firstName: "Fred",
    lastName: "Flintstone",
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

## firmAjax api

### firmAjax 方法

```js
firmAjax({
  url: "/get",
  params: {
    aa: 45654,
    cc: 6546,
  },
}).then((data) => {
  console.log(data);
});
```

### 配置参数 config

```js
{
  //
  baseUrl?: string;
  method?: Method;
  timeout?: number;
  headers?: any;
  params?: any;
  url?: string;
  data?: any;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  withCredentials?: boolean;
  isUploadProgress?: boolean;
  isDownloadProgress?: boolean;
  validateStatus?: Array<number>;
  responseType?: XMLHttpRequestResponseType;
}
```

### `use`中间件

```js
// 当前页面发起第一个请求执行中间件，
firmAjax.use("firstRequest", () => {
  console.log("发起第一个请求")
  const toast = Toast.loading({
    duration: 0,
    forbidClick: true,
    message: '加载中...',
  })
  return toast
})

// 当前页面所有请求结束执行中间件
firmAjax.use("allRequestEnd", (event) => {
  console.log(event)
  // event：firstResult：是firstRequest中间件执行返回值
  //        totalTime：所有请求结束所用时间
  const { firstResult, totalTime } = event;
  const time = 600 - totalTime;
  // 意思是加载框至少显示600ms
  if (time > 0) {
    return setTimeout(() => {
      firstResult.clear()
      console.log("关闭弹窗")
    }, time)
  }
  firstResult.clear()
})

// 每个请求发起之前执行中间件，必须有返回值，否则修改无效
firmAjax.use("beforeRequest", (config) => {
  // config是配置参数
  const { headers = {} } = config;
  const token = "token"

  // 修改配置参数
  config.headers = {
    ...headers,
    Authorization: token
  }

  return config;
})

// 每个请求结束执行中间件，必须有返回值，否则修改无效
firmAjax.use("beforeResponse", (response) => {
  const { data, config, headers } = response;
  // data: 请求返回值
  // config: 配置参数
  // headers: 响应头
  console.log(config)
  console.log(headers)
  if (data.Code === 0) {
    return data.Data;
  }
  return Promise.reject("请求错误");
})

// 每个请求失败执行中间件，必须返回值，否则修改无效
firmAjax.use("error", (error) => {
  console.log(error);
  console.log(error.code);
  return error;
});

// 监听上传的中间件，对应请求config中配置isUploadProgress: true
firmAjax.use("upload", (event) => {
  const { url, schedule, method } = event;
  // url: config中的url
  // method: config中的method
  // schedule: 上传进度
  console.log(url);
  console.log(method);
  console.log(schedule);
});

// 监听下载的中间件，对应请求config中配置isDownloadProgress: true
firmAjax.use("download", (event) => {
  const { url, schedule, method } = event;
  // url: config中的url
  // method: config中的method
  // schedule: 下载进度
  console.log(url);
  console.log(method);
  console.log(schedule);
});

// 注意：以上每个中间件都可以绑定多个
```

### 设置公共的配置项 firmAjax.setPublicConfig(config)

```js
firmAjax.setPublicConfig({
  baseUrl: "https://a.com",
  ...
});
```

## firmAjax 静态方法

##### firmAjax.request(config)

##### firmAjax.get(url[, config])

##### firmAjax.delete(url[, config])

##### firmAjax.head(url[, config])

##### firmAjax.options(url[, config])

##### firmAjax.post(url[, data[, config]])

##### firmAjax.put(url[, data[, config]])

##### firmAjax.patch(url[, data[, config]])
