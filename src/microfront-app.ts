/*
 * <p>文件名称: ${file_name}</p>
 * <p>项目描述: KOCA 金证云原生平台 V1.0.0</p>
 * <p>公司名称: 深圳市金证科技股份有限公司</p>
 * <p>版权所有: 版权所有(C)2019-2020</p>
 */
import commonStore from "@szkingdom.koca/micro/common/store";
import { renderMicroApp, unmountMicroApp } from "@szkingdom.koca/micro/sub/service";
import store from "@szkingdom.koca/micro/sub/store";
import Vue from "vue";
import Component from "vue-class-component";
import { messages } from "./locale";
// 业务公共公共组件
// import XTA_UI from "@/xta/components/common/xta-ui";
// 业务国际化字典

// Vue.use(VueRouter);


// 业务cache配置
// import cacheConfig from "@/config/cache";
// 业务引入的图标
// vue-svgicon图标引入
// import "./assets/xta/icons";
// 业务自定义样式
// import "./assets/scss/xta.scss";

const app_name = process.env.VUE_APP_NAME.replace("/", "-");
let instance: Vue = null;
let router = null;

// Register Keep-Alive Hooks
Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate",
  "activated",
  "deactivated"
]);

// Sub App Lifecycles
export async function bootstrap () {
  console.log("subapp boot ...: ", app_name);
}

export async function mount (props) {
  // eslint-disable-next-line no-undef
  // __webpack_public_path__ = (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  console.log("subapp mounted: ", app_name);

  commonStore.globalRegister(store, props);
  instance = renderMicroApp(instance, router, messages, props, app_name);
  // console.log("instance:", instance);
}

export async function unmount (props) {
  unmountMicroApp( instance, router, app_name, props);
  instance.$destroy();
  instance = null;
  router = null;
}
