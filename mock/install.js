/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 14:44:40
 * @LastEditTime: 2019-11-28 16:28:06
 * @LastEditors: yuanyong
 */
// npm run-script mock/user_login
// https://blog.csdn.net/wxqee/article/details/50165581
// node mock/user_login.js
const fs = require("fs");
const path = require("path");
const utils = require("./utils");
const mockServerClient = require("mockserver-client").mockServerClient;

const mockServerHost = "localhost";
const mockServerPort = 1088;

const mock_api_list = [

  // login
  { api: "api/login", install: require("./api/login/install") },
  { api: "api/logout", install: require("./api/logout/install") },
  { api: "api/verify-code", install: require("./api/verify-code/install") },
  // dict
  { api: "api/query-dict", install: require("./api/query-dict/install") },

  // menu
  { api: "sys/menu/query/auth", install: require("./sys/menu/query/auth/install") },
  { api: "sys/menu-exec/query", install: require("./sys/menu-exec/query/install") },
  { api: "sys/dict/item/query", install: require("./api/dict/item/query/install") },

  // sys user
  { api: "sys/user/query/page", install: require("./sys/user/query/page/install") },

];

async function install_mock_expectations () {
  const ret = await mockServerClient(mockServerHost, mockServerPort).reset();
  console.log("reset api", ret);

  for (const { api, method = "POST", install = false } of mock_api_list) {
    let ret;
    let expectation;
    if(!install){
      const response = fs.readFileSync(path.join(__dirname, api, "response.json"), "utf8");
      expectation = utils.build_api_expectation(api, method, response);
    } else {
      expectation = require(path.join(__dirname, api, "install"));
    }
    if (expectation instanceof Array) {
      expectation.forEach(async e => {
        ret = await mockServerClient(mockServerHost, mockServerPort).mockAnyResponse(e);
        console.log(`install api ${api}, statusCode:`, ret.statusCode);
      });
    } else {
      ret = await mockServerClient(mockServerHost, mockServerPort).mockAnyResponse(expectation);
      console.log(`install api ${api}, statusCode:`, ret.statusCode);
    }
  }
}

install_mock_expectations();
