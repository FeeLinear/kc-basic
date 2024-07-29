/* eslint-disable */
// @ts-check
console.log("vue config: vue.main.config.js");
const path = require("path");
const utils = require("./build/utils");
const externals = require("./build/externals");
const { generate_projects_routes } = require("./build/projects_routes");

const is_prod = process.env.NODE_ENV === "production";
const outputDir = is_prod ? path.resolve(__dirname, "dist/") : path.resolve(__dirname, "public/");
const port = process.env.PORT || 8000;
const use_cdn = false;
const publicPath = "/";
// 默认不使用swc编译，需要时放开
const use_swc = false;
// 微前端是否使用相同版本的依赖
const use_common_dependence = false;

const devServer = {
  port,
  open: true,
  historyApiFallback: {
    rewrites: [{ from: /./, to: path.posix.join("/", "index.html") }],
  },
  after: function (app, server) {},
  proxy: {
    "^/batch": {
      target: "http://10.202.63.57:9000/",
      // target: "http://10.202.63.11:8082/",
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
    },
    "^/": {
      // target: "http://192.168.8.147:8000/",
      target: "http://10.202.63.8:7000/",
      changeOrigin: true,
      ws: false,
      logLevel: "debug",
      bypass: utils.bypass,
    },
  },
};

// 生成projects下模块的路由映射
// 配置主应用不包含哪些模块
const excludes = ["admin-basic", "registry-manager"];
// views 页面目录, 如：/pages/, /views/, ""
const views = "/views/";
generate_projects_routes(views, excludes, true);

// 拷贝venders依赖库
utils.copy_venders("public");

module.exports = {
  pages: {
    index: {
      entry: "src/main.ts",
      template: `public/index.html`,
    },
  },
  publicPath,
  outputDir,
  lintOnSave: true,
  runtimeCompiler: false,
  productionSourceMap: false,
  devServer,
  css: {
    extract: false,
    sourceMap: !is_prod,
    loaderOptions: {
      // import json to scss
      scss: {
        sourceMap: false,
        // 将样式变量分享给所有文件
        prependData: `
          @import "scss/mixin/layout-variables.scss";
          @import "scss/mixin/_utils.scss";
          `
      }
    },
  },
  transpileDependencies: [
    "vuex-persist",
    "element-ui",
    "szkingdom.yf.koca-ui",
    "szkingdom.yf.koca-template",
  ],

  // 自定义webpack配置
  configureWebpack: {
    externals: use_common_dependence ? externals : {},
  },

  chainWebpack: (config) => {
    config.plugins.delete("prefetch-index");
    utils.config_alias(config);
    if(use_common_dependence) {
      utils.config_html(config, "", use_cdn);
      utils.config_copy(config, "", use_cdn, outputDir, false, [], excludes);
    }
    utils.config_zip(config, is_prod);

    // 目前swc不支持vue文件，所以vue文件调试有问题，VUE文件要把js，ts独立成一个文件就没问题。
    // 如：<script lang="ts" src="./ElementPage.ts"></script>
    // 或：<script lang="js" src="./ElementPage.js"></script>
    utils.config_swc(config, use_swc);
  },
};
