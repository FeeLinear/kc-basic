/*
 * <p>文件名称: ${file_name}</p>
 * <p>项目描述: KOCA 金证云原生平台 V1.0.0</p>
 * <p>公司名称: 深圳市金证科技股份有限公司</p>
 * <p>版权所有: 版权所有(C)2019-2020</p>
 */
// 要在vue引用前
import "babel-polyfill";
import "fetch-polyfill";

import Vue from "vue";
import { getModule } from "vuex-module-decorators";
import { startApp } from "szkingdom.yf.koca-template/lib";

import { httpClient } from "szkingdom.yf.koca-template/lib/http/request";

import { CacheHubModule } from "./store/CacheHub";
// import cacheConfig from "@/config/cache";

// 自定义http请求
// import { httpClient } from "./config/request.adaptor";

// 业务自定义静态路由
import { frameRouter, basicRouter } from "@/router/static";

// 业务国际化配置
import { messages } from "./locale";

import Settings from "./config/setting";

import { Message } from "element-ui";

// vue-svgicon图标引入
import "./assets/icons";

// 业务自定义样式
import "./assets/scss/index.scss";

const basicRouterList = [ ...basicRouter ];
const frameRouterList = [ ...frameRouter ];

/* Vue.prototype.settings = Settings; */
/*
Vue.prototype.$message = Message({
  duration: 5000,
}); */

// :example: 将http放到vue全局使用
// :example: Vue.prototype.$http = httpClient;
Vue.prototype.$settings = Settings;
Vue.prototype.$http = httpClient;

// 临时处理方案，支持用户配置koca-ui 中的inputWidth和itemWidth
// Vue.prototype.$inputWidth = Settings.inputWidth;
// Vue.prototype.$itemWidth = Settings.itemWidth;

// 自定义http请求
// Vue.prototype.$http = request;

// start application


startApp({ messages,
  frameRoutes: frameRouterList,
  basicRoutes: basicRouterList,
  settings: Settings
},  (vueInstance: any) => {
  // 自定义VuexModule：业务缓存中心
  // const cacheHub = getModule(CacheHubModule);
  const cacheHub = getModule(CacheHubModule, vueInstance.$store);

  Vue.prototype.$cacheHub = cacheHub;

  // 初始话cacheHub
  // cacheHub.init(cacheConfig);
});
