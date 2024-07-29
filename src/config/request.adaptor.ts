import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Message } from "element-ui";
import fileDownload from "js-file-download";
import { STATUS_ALIAS, STATUS_MSG } from "szkingdom.yf.koca-template/lib/http/constant";
import { AxiosClass, IKocaOptions, IKocaResponse, kocaOptions } from "szkingdom.yf.koca-template/lib/http/request";
import { router } from "szkingdom.yf.koca-template/lib/router";
import { app$ } from "szkingdom.yf.koca-template/lib/store";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "szkingdom.yf.koca-template/lib/utils/cache";

const VALIDATE_STATUS = Object.keys(STATUS_MSG).map(Number);

interface IRequest<T> extends AxiosRequestConfig {
  headers: {
    "Accept": string;
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
    "Lang": "en-US" | "zh-CN";
  };
  data: T;
}

// 规定请求数据体的格式
interface IRequestBody {
  [propName: string]: any;
}

interface IResponse<T> {
  // TODO: 定义返回参数的数据格式
  response: AxiosResponse;
  code?: string;
  msg?: string;
  detail?: string;
  level?: string;
  total?: number;
  data?: any | any[] | T;
}

/**
 * 请求格式化方法（示例）
 * @param config AxiosRequestConfig
 * @param option IKocaOptions
 */
function request_formater(config: AxiosRequestConfig, option: IKocaOptions) {
  config.headers = {
    "Accept": "application/json",
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Lang": app$.language || "zh-CN",
  };
  if (app$.appSettings.JWT_TOKEN_ENABLE) {
    if (getLocalStorage("token") !== null && getLocalStorage("token") !== "") {
      const Authorization = "Bearer " + (getLocalStorage("token") || "");
      config.headers["Authorization"] = Authorization;
    }
  } else {
    removeLocalStorage("token");
  }
  if (option.headers) {
    config.headers = Object.assign(config.headers, option.headers);
  }
  // 超时设置
  if (option.timeout) {
    config.timeout = option.timeout;
  }
  // Axios的其他配置可以在option.config中设置
  if (option.config) {
    Object.assign(config, option.config);
  }

  // 文件下载
  if (option.downloadFile) {
    config.responseType = "blob";
  }

  if (config.data && config.data.constructor === FormData) {
    delete config.headers["Accept"];
    delete config.headers["Content-Type"];
  }
  return config;
}

function response_formater (response: AxiosResponse, option: IKocaOptions) {
  let res: IKocaResponse;
  if (app$.appSettings.JWT_TOKEN_ENABLE) {
    const token = response.headers["authorization"];
    if (token) {
      setLocalStorage("token", token);
    }
  }
  // 文件下载
  if (option.downloadFile) {
    const disposition = response.headers["content-disposition"];
    if (disposition) {
      const filename = decodeURIComponent(disposition.match(/filename=(.*)/i)[1]);
      fileDownload(response.data, filename);
    }
    res = {
      response: response,
      data: response.data,
      msg: response.data.msg,
      code: response.data.code,
    };
  } else {
    const { data } = response;
    // 成功的返回数据，对结果集做转换处理。
    if (data) {
      res = {
        response: response,
        code: data.code,
        msg: data.msg,
        detail: data.detail,
        level: data.head && data.head.level,
      };
      const { body } = data;
      if (body) {
        if (body.constructor === Array) {
          // 后台直接返回数组
          res.total = body.length;
          res.data = body;
        } else if (body.constructor === Object && body.total !== undefined && body.data) {
          // 后台分页
          res.total = body.total;
          res.data = body.data;
        } else {
          // 其他情况
          res.data = body;
        }
      }
      // return res;
    } else {
      res = {} as IKocaResponse;
    }
  }
  return res;
}
// 拦截器 请求前触发
function interceptors_request(config: AxiosRequestConfig) {
  // axios的GET请求，不会对[]等特殊字符转码
  if (config.method.toUpperCase() === "GET" && config.params) {
    let url = config.url;
    url += "?";
    for (const key of Object.keys(config.params)) {
      url += `${key}=${encodeURIComponent(config.params[key])}&`;
    }
    config.url = url.substring(0, url.length - 1);
    config.params = {};
  }

  if (config.url && config.url.startsWith("/")) {
    config.baseURL = "";
  }
  if (config.data && config.headers["Content-Type"] === "application/x-www-form-urlencoded") {
    config.data = JSON.stringify(config.data);
  }
  return config;
}

// 拦截器，处理请求应答
async function interceptors_response(response: AxiosResponse) {
  const { status, headers } = response;
  let {  data } = response;
  const contentTypeKey = Object.keys(headers).find(key => key.toLowerCase() === "content-type");
  if (contentTypeKey && headers[contentTypeKey].includes("application/json")) {
    // 文件下载，如果返回的是json数据，需要转换格式为JSON:
    if (data instanceof Blob) {
      try {
        data = JSON.parse(await data.text());
      } catch {
        return Promise.reject(response);
      }
    }

    if (status >= 200 && status < 300) {
      if (data && data.code && data.code !== "0") {
        // 后台约定的错误码 不等于0报错。
        return Promise.reject(data);
      }
      return Promise.resolve(response);
    } else if (VALIDATE_STATUS.indexOf(status) !== -1) {
      if (status === STATUS_ALIAS.SESSION_EXPIRATION) {
        const fullPath = app$.tags.orders.slice(-1)[0];
        if (fullPath && !fullPath.startsWith("/login")) {
          if (data.body && data.body.redirectUri) {
            window.location.href = data.body.redirectUri;
          } else {
            router.routerInstance.push(`/login?redirect=${fullPath}`);
          }
        }
      }
      const msg = STATUS_MSG[status] ? STATUS_MSG[status][app$.language] : STATUS_MSG["unknown"][app$.language];
      return Promise.reject({ status, msg });
    }
  }else{
    if (status >= 200 && status < 300) {
      return Promise.resolve(response);
    } else if (VALIDATE_STATUS.indexOf(status) !== -1) {
      const msg = STATUS_MSG[status] ? STATUS_MSG[status][app$.language] : STATUS_MSG["unknown"][app$.language];
      return Promise.reject({ status, msg });
    }
  }

  return Promise.resolve(response);
}

function response_error_formater (error) {
  let message = error;
  // 返回axiosError类型的错误
  if (error.isAxiosError) {
    if (error.response) {
      message = error.response.status + ": " + error.response.statusText;
    } else if (error.code) {
      message = error.code && error.code + ": " + error.message;
    } else {
      // 断网时没有code
      message = error.message;
    }
  }
  // 后端返回报错
  if (error.msg) {
    message = error.msg;
  }
  // 服务器报错 4XX、5XX
  if (error.response && error.response.data && error.response.data.msg) {
    message = error.response.data.msg;
  }
  // 解决token验证过期,返回登录页面,因为发送多次请求,导致消息多次提示的问题.
  if (error.status && error.status === STATUS_ALIAS.SESSION_EXPIRATION) {
    if(getLocalStorage("userNo")){
      Message({
        showClose: true,
        message: message,
        type: "error",
        duration: 3000
      });
    }
    removeLocalStorage("userNo");
  } else if (error.status && error.status === STATUS_ALIAS.FILE_TOO_LARGE){
    message = STATUS_MSG[error.status] ? STATUS_MSG[error.status][app$.language] : message;
    Message({
      showClose: true,
      message: message,
      type: "error",
      duration: 3000
    });
  } else {
    Message({
      showClose: true,
      message: message,
      type: "error",
      duration: 3000
    });
  }
  throw error;
}

const adaptorOptions: IKocaOptions = {
  request_formater: request_formater,
  response_formater: response_formater,
  interceptors_request: interceptors_request,
  interceptors_response: interceptors_response,
  response_error_formater: response_error_formater,

  // 默认等待类型 0-无提示，1-loading提示（ElmentUI-Loading），2-进度条提示（nprogress插件）
  waiting_tip: 2,
  // 那些返回状态当做成功返回
  validateStatus (status: number) {
    return VALIDATE_STATUS.concat(200).indexOf(status) !== -1;
  }
};

const requestAdaptorOptions = Object.assign({}, kocaOptions, adaptorOptions);

export const httpClient =  new AxiosClass(requestAdaptorOptions);
