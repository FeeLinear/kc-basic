const fs = require("fs");
const join = require("path").join;
const main = require("../../../../utils").main;

const API = '/api/test/koca/api';

// 创建 expectation 函数
function build_api_expectation(index) {
  const responseJSON = fs.readFileSync(join(__dirname, "response_" + index + ".json"), "utf8");

  const expectation = {
    httpRequest: {
      method: "POST",
      path: API,
      queryStringParameters : {
        type: [ String(index) ]
      },
    },

    httpResponse: {
      body: {
        type: "JSON",
        json: responseJSON,
        contentType: "application/plain; charset=utf-8"
      }
    }
  };

  return expectation;
}

// 构造 expectations: [api/test/koca/api?type=1,  ..., /api/test/koca/api?type=5]
const expectations = [];
[1, 2, 3, 4, 5].forEach(index => expectations.push(build_api_expectation(index)));

// 作为 main 函数执行
if (require.main === module) {
    main(API, expectations);
}

module.exports = expectations;
