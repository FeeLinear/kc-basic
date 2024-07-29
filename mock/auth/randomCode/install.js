const fs = require("fs");
const join = require("path").join;
const main = require("../../utils").main;
const build_api_expectation = require("../../utils").build_api_expectation;

// TEST: http POST http://localhost:1088/api/logout
const API = "/auth/randomCode";
const responseJSON = fs.readFileSync(join(__dirname, "response.json"), "utf8");
const expectation = build_api_expectation(API,  'post', responseJSON);

// 作为 main 函数执行
if (require.main === module) {
  main(API, expectation);
}

module.exports = expectation;
