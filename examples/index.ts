import firmAjax from "../lib/index";

interface ResultData {
  Code: number;
  Data: any;
  Message: string;
  ReqCode: number;
}

const file = document.getElementById("file");
file.addEventListener(
  "input",
  (e) => {
    const formData = new FormData();
    const target = e.target as HTMLInputElement;
    formData.append("file", target.files[0]);

    firmAjax
      .post("/post", formData, {
        isUploadProgress: true,
      })
      .then((data) => {
        console.log(data);
      });
  },
  false
);

firmAjax.use("beforeRequest", (config) => {
  const { headers = {} } = config;
  config.headers = {
    ...headers,
  };

  return config;
});

firmAjax.use<"beforeResponse", ResultData>("beforeResponse", (response) => {
  const { data } = response;
  if (data.Code === 0) {
    return data.Data;
  }
  return Promise.reject("请求错误");
});

firmAjax.use("error", (error) => {
  console.log(error.code);
  return error;
});

firmAjax.use("firstRequest", () => {
  console.log("第一个发起请求");
  return {
    loading: {},
  };
});

firmAjax.use("allRequestEnd", (time) => {
  console.log(time);
});

firmAjax.use("upload", (event) => {
  console.log(event.schedule);
  return "";
});

firmAjax.use("upload", (event) => {
  console.log(event.schedule);
});

firmAjax.use("download", (event) => {
  console.log(event.url);
});

firmAjax.setPublicConfig({
  timeout: 3000,
  baseUrl: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

firmAjax
  .request({
    method: "get",
    url: "/get",
  })
  .then((data) => {
    console.log(data);
  });

firmAjax
  .request({
    method: "post",
    url: "/post",
    data: {
      aa: 111,
      bb: 222,
    },
  })
  .then((data) => {
    console.log(data);
  });

firmAjax.get("/get").then((data) => {
  console.log(data);
});

firmAjax
  .delete("/delete", {
    params: {
      aa: [11, 333],
      test: "dfdf",
    },
    data: [11, 22, 33],
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((data) => {
    console.log(data);
  });

firmAjax
  .request({
    url: "/get/error",
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

firmAjax({
  url: "/get",
  params: {
    aa: 45654,
    cc: 6546,
  },
}).then((data) => {
  console.log(data);
});

(async function () {
  const res = await firmAjax.get("/get");
  console.log("res", res);
  const aa = await firmAjax.post("/post");
  console.log("aa", aa);
  const bb = await firmAjax.post("/post");
  console.log("bb", bb);
})();

const formData = new FormData();
formData.append("aa", "56656");
formData.append("bb", "dfd");

firmAjax.post("/post", formData).then((data) => {
  console.log(data);
});
