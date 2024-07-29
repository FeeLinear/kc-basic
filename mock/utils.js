// npm run-script mock/user_login
// https://blog.csdn.net/wxqee/article/details/50165581
// node mock/user_login.js
const mockServerClient = require("mockserver-client").mockServerClient;

async function main (api, expectation) {
  // const mockServerHost = "localhost";
  const mockServerHost = "10.203.0.114";

  // const mockServerPort = 1088;
  const mockServerPort = 8771;

  // 清除之前的数据
  const ret = await mockServerClient(mockServerHost, mockServerPort).clear({ path: api });
  console.log("clear api:", api, ret);

  // 安装新的模拟数据
  if (expectation instanceof Array) {
    expectation.forEach(async e => {
      const ret = await mockServerClient(mockServerHost, mockServerPort).mockAnyResponse(e);
      console.log("install api:", api, ret);
    });
  } else {
    const ret = await mockServerClient(mockServerHost, mockServerPort).mockAnyResponse(expectation);
    console.log("install api", api, ret);
  }
}

// 构造最常用的expection，POST请求返回JSON数据
function build_api_expectation (api, method, responseJSON) {
  const expectation = {
    httpRequest: {
      method,
      path: api,
    },

    httpResponse: {
      body: {
        type: "JSON",
        json: responseJSON,
        contentType: "application/json; charset=utf-8"
      }
    }
  };

  return expectation;
}

module.exports.build_api_expectation = build_api_expectation;
module.exports.main = main;
