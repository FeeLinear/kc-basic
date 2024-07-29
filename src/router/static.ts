/*
 * <p>文件名称: ${file_name}</p>
 * <p>项目描述: KOCA 金证云原生平台 V1.0.0</p>
 * <p>公司名称: 深圳市金证科技股份有限公司</p>
 * <p>版权所有: 版权所有(C)2019-2020</p>
 */
import { RouteConfig } from "vue-router";

// 静态路由，固定写死的路由地址 该路由地址对应的组件不包含在vue 代码中
const basicRouter: RouteConfig[] = [
  {
    name: "登录页",
    path: "/login",
    // component: () => import(/* webpackChunkName: "static" */ "../../lib/layout/Login.vue")
    component: () => import(/* webpackChunkName: "login" */ "szkingdom.yf.koca-template/lib/layout/Login.vue")
  },
  { path: "*", name: "oops", component: () => import(/* webpackChunkName: "static" */ "szkingdom.yf.koca-template/lib/layout/statuspages/InfoPage.vue") },
  {
    name: "找回密码",
    path: "/findPassword",
    component: () => import(/* webpackChunkName: "static" */ "szkingdom.yf.koca-template/lib/layout/FindPassword.vue")
  }
];

// frame 框架界面的静态路由，
const frameRouter: RouteConfig[] = [
  {
    name: "首页",
    path: "/home",
    // 特殊语法 【webpackChunkName: "static"】 把组件按组分块
    component: () => import(/* webpackChunkName: "static" */ "szkingdom.yf.koca-template/lib/layout/FrameHome.vue")
  },
  {
    name: "租户首页",
    path: "/tenantHome",
    component: () => import(/* webpackChunkName: "static" */ "szkingdom.yf.koca-template/lib/layout/FrameTenantHome.vue")
  },
  { path: "/redirect/:path*", component: () => import(/* webpackChunkName: "static" */ "szkingdom.yf.koca-template/lib/layout/Redirect.vue") },
];

export {
  basicRouter,
  frameRouter
};
