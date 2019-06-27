/**
 * 高阶兼容网络请求器
 * Created by XLBerry on 2018/8/22
 */

function initExec(obj) {
  if (window.fetch) {
    return fetchExec(obj);
  } else if (window.axios) {
    return axiosExec(obj);
  } else {
    window.M7GET("loadScript")({
      url: "./js/axios.min.js",
      type: "url",
      test: () => window.axios && window.axios.request,
      success: () => axiosExec(obj),
      fail: () => typeof obj.fail == "function" && obj.fail(obj, new Error("缺失网络请求执行器"))
    });
    return {};
  }
}

/** 初始化返回执行器对象 */
function initExecHandle() {
  let execHandle = {
    _onProgressArray: [],
    onProgress: onProgressUpdate => {
      typeof onProgressUpdate == "function" && execHandle._onProgressArray.push(onProgressUpdate);
      return execHandle;
    }
  };
  return execHandle;
}

/** 添加超时限制 */
function racePromise(promises, { timeout = 15000, url }) {
  let timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(`[fetch] Network request timeout of ${timeout}ms exceeded. ${url}`);
    }, timeout);
  });
  return Promise.race([timeoutPromise].concat(promises));
}

/**
 * https://github.github.io/fetch/
 * @param obj
 */
function fetchExec(obj) {
  let { url, data = {}, requestType = "json", responseType = "json", headers, timeout, method = "GET", success, fail } = obj,
    requestBody, execHandle = initExecHandle();
  method = method.toUpperCase();
  if (requestType === "json") {
    // Body types 为 String 格式
    if ("GET" === method) {
      let paramArray = Object.keys(data).map(key => `${key}=${data[key]}`);
      if (paramArray.length > 0) {
        url += `${url.indexOf("?") === -1 ? "?" : ""}${paramArray.join("&")}`;
      }
    } else {
      requestBody = JSON.stringify(data);
    }
  } else {
    requestBody = data; // Body types 为 URLSearchParams、FormData、Blob、ArrayBuffer、TypedArray、DataView 格式
  }

  racePromise(window.fetch(url, {
    method,
    headers,
    // mode: "no-cors",
    credentials: "include", // 携带cookie，其他配置 include omit same-origin
    body: requestBody
  }), { timeout, url }).then(res => {
    if (["text", "json"].includes(responseType)) {
      const { status, statusText } = res;
      if ((status >= 200 && status < 300) || status === 304) {
        res[responseType]().then(resultData => {
          !execHandle.abort && typeof success == "function" && success({
            data: resultData,
            headers: res.headers,
            response: res,
            status, statusText
          });
        });
      } else {
        return Promise.reject(new Error(`响应状态:${status},内容:${statusText}`));
      }
    } else {
      let current = 0, total = parseInt(res.headers.get("Content-Length") || "0", 10), reader = res.body.getReader();
      let typedArray = [], fileType = { type: res.headers.get("Content-Type") || "application/octet-binary" },
        fileName = res.headers.get("Content-Disposition") || Date.now();
      new Promise((resolve, reject) => {
        function pump() {
          reader.read().then(({ done, value }) => {
            if (done) {
              let tmpTagA = document.createElement("a"),
                url = window.URL.createObjectURL(new Blob(typedArray, fileType)); // 获取blob本地文件链接
              tmpTagA.href = url;
              tmpTagA.download = fileName;
              tmpTagA.click();
              window.URL.revokeObjectURL(url);

              resolve();
              return;
            }
            typedArray = typedArray.concat(value);
            current += value.byteLength;
            !execHandle.abort && execHandle._onProgressArray.forEach(callback => callback({ current, total }));
            pump();
          }).catch(reject);
        }

        pump();
      }).then(() => {
        // 下载完成
        !execHandle.abort && typeof success == "function" && success({ status: 200, data: { current, total } });
      });
    }
  }).catch(error => {
    console.error(error);
    !execHandle.abort && typeof fail == "function" && fail(error);
  });
  return execHandle;
}

/**
 * 低阶环境兼容器
 * @param obj
 */
function axiosExec(obj) {
  let { url, data, responseType = "json", headers, timeout, method = "GET", success, fail } = obj,
    execHandle = initExecHandle();
  method = method.toUpperCase();
  window.axios.request({
    url,
    method,
    timeout,
    headers,
    params: "GET" === method ? data : null,
    data: "PUT POST PATCH".indexOf(method) ? data : null,
    responseType,
    validateStatus: status => (status >= 200 && status < 300) || status === 304,
    onUploadProgress: ({ current, total }) => execHandle._onProgressArray.forEach(callback => callback({
      current,
      total
    })),
    onDownloadProgress: ({ current, total }) => execHandle._onProgressArray.forEach(callback => callback({
      current,
      total
    }))
  }).then(res => {
    !execHandle.abort && typeof success == "function" && success({
      data: res.data,
      headers: res.headers,
      response: res,
      status: res.status,
      statusText: res.statusText
    });
  }).catch(error => {
    !execHandle.abort && typeof fail == "function" && fail(error);
  });
  return execHandle;
}

/**
 * 请求执行器
 * @param obj
 * @returns {{}} 返回对象可以设置：上传或者下载回调[func-onProgress]，请求中止标记阀[bool-abort]
 */
export function requestAsync(obj = {}) {
  return new Promise((resolve, reject) => {
    initExec({
      ...obj,
      success: (res) => resolve(res),
      fail: (error) => reject(error),
    });
  });
}

/**
 * 请求执行器
 * @param obj
 * @returns {{}} 返回对象可以设置：上传或者下载回调[func-onProgress]，请求中止标记阀[bool-abort]
 */
export default function request(obj = {}) {
  return initExec(obj);
}