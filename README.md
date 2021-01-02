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

### `use`中间件

```js
// 发起第一个请求中间件，返回值是给`allRequestEnd`中间件用
firmAjax.use("firstRequest", () => {
  // 这个中间件是一个页面里发起第一个请求，可以用于显示加载提示等等操作
  console.log("第一个发起请求");
  return {
    loading: {},
  };
});

// 所有请求结束，res是{firstResult: firstRequest中间件返回值,totalTime:所有请求完所有时间}
firmAjax.use("allRequestEnd", (res) => {
  // 所有请求完所有时间，可以防止加载提示框闪烁，如果totalTime小于350ms，可以用定时器延迟，firstResult可以是加载提示框对象，这样就可以用于加载提示框
  const { totalTime, firstResult } = res;
  if (totalTime < 450) {
    setTimeout(() => {
      firstResult.close();
    }, 450 - totalTime);
  } else {
    firstResult.close();
  }
});

// 请求前执行中间 config是配置参数
firmAjax.use("beforeRequest", (config) => {
  const { headers = {} } = config;
  config.headers = {
    ...headers,
  };

  // 必须有return，否则修改无效
  return config;
});

// 返回值之前执行中间件，response是返回值，该函数必须返回值，否则修改无效
firmAjax.use("beforeResponse", (response) => {
  const { data } = response;
  if (data.Code === 0) {
    return data.Data;
  }
  return Promise.reject("请求错误");
});

// 请求失败执行中间件，error是返回值，该函数必须返回值，否则修改无效
firmAjax.use("error", (error) => {
  console.log(error);
  console.log(error.code);
  return error;
});

// 监听上传的中间件，要在config中配置isUploadProgress: true
firmAjax.use("upload", (event) => {
  const { url, schedule, method } = event;
  // url: config中的url
  // method: config中的method
  // schedule: 上传进度
  console.log(event.schedule);
});

// 监听下载的中间件，要在config中配置isDownloadProgress: true
firmAjax.use("download", (event) => {
  const { url, schedule, method } = event;
  // url: config中的url
  // method: config中的method
  // schedule: 下载进度
  console.log(event);
});
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
