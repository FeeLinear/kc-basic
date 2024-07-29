/*
 * @Description:
 * @Author:
 * @Date: 2019-11-22 14:38:38
 * @LastEditors: yuanyong
 */
const fs = require("fs");
const join = require("path").join;
const main = require("../../../utils").main;
const build_api_expectation = require("../../../utils").build_api_expectation;

// TEST: http POST http://localhost:1088/api/query-dict
// curl -X POST -H "Content-Type: application/json" --data '{"body": {"orgCode": "-1"}}' \
// http://10.202.63.10:8888/koca/dict/item/query

// 构造 expectation
const API = "/api/getAllAccessApp";
const responseJSON = fs.readFileSync(join(__dirname, "response.json"), "utf8");
const expectation = build_api_expectation(API, 'post', responseJSON);

// 作为 main 函数执行
if (require.main === module) {
  main(API, expectation);
}

module.exports = expectation;
