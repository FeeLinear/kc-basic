const fs = require("fs");
const join = require("path").join;
const main = require("../../utils").main;

// 构造最常用的expection，POST请求返回JSON数据
function build_api_expectation (api, responseDATA) {
  const expectation = {
    httpRequest: {
      path: api,
    },
    httpResponse: {
      headers: {
        "content-type": ["image/png"],
        "content-disposition": ["form-data; name=\"test.png\"; filename=\"test.png\""]
      },
      body: {
        type: "BINARY",
        base64Bytes: responseDATA,
      }
    }
  };

  return expectation;
}

// TEST: http://localhost:1088/api/verify-code
const API = "/auth/verify-code";
const responseDATA = fs.readFileSync(join(__dirname, "verify-code.png")).toString("base64");
const expectation = build_api_expectation(API, responseDATA);

// 作为 main 函数执行
if (require.main === module) {
  main(API, expectation);
}

module.exports = expectation;
