/* eslint-disable */
// @ts-check
const path = require("path");
const utils = require("./build/utils");
const externals = require("./build/externals");
const { generate_app_routes } = require("./build/projects_routes");

const use_cdn = false;
const is_app = true;
const is_prod = process.env.NODE_ENV === "production";
// 默认不使用swc编译，需要时放开
const use_swc = false;
// 微前端是否使用相同版本的依赖
const use_common_dependence = false;

const exclude_libs = use_common_dependence ? ["vue", "vue-router", "vuex", "vue-i18n", "element-ui", "axios"] : [];

// 项目启动/打包命令跟随的参数。
const configArgv = JSON.parse(process.env.npm_config_argv);
const envs = utils.get_envs(configArgv);

const app_name = process.env.VUE_APP_NAME || envs.VUE_APP_NAME;
const port = process.env.VUE_APP_PORT || envs.VUE_APP_PORT;
const app_ip = process.env.VUE_APP_IP || envs.VUE_APP_IP;

// **** 微应用需要有明确的地址，不然主用加载资源是会404:
// **** 如果微应用和主应用部署在同一个nginx下的同一个IP和端口，
// publicPath可以配置为`/${app_name}`
// const publicPath = `//localhost:${port}/${app_name}`;
const publicPath = utils.build_publicPath({ app_name, port, app_ip });

const outputDir = path.resolve(__dirname, "dist/apps/" + app_name);

// views 页面目录, 如：/pages/, /views/, ""
const views = "/views/";
generate_app_routes(app_name, views);

// 拷贝venders依赖库
utils.copy_venders(`public/apps/${app_name}`, exclude_libs);

module.exports = {
  pages: {
    index: {
      entry: "src/microfront-app.ts",
      template: `public/apps/${app_name}/index.html`,
    },
  },
  devServer: {
    port,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  publicPath,
  outputDir,
  lintOnSave: true,
  runtimeCompiler: false,
  productionSourceMap: false,
  transpileDependencies: ["vuex-persist", "element-ui", "szkingdom.yf.koca-ui", "szkingdom.yf.koca-template"],
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

  // 自定义webpack配置
  configureWebpack: {
    externals: use_common_dependence ? externals : {},
    // qiankun要求把子应用打包成 umd 库格式
    output: {
      library: `${app_name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${app_name}`,
    },
  },

  chainWebpack: (config) => {
    config.plugins.delete("prefetch-index");
    utils.config_define(config, configArgv);
    utils.config_alias(config);
    // config.plugin("html-index").tap(args => {
    //   args[0].app_name = app_name.replace("/", "-");
    //   return args
    // })
    utils.config_html(config, app_name, use_cdn, publicPath, "html-index", exclude_libs);
    utils.config_copy(config, app_name, use_cdn, outputDir, is_app, exclude_libs);
    
    utils.config_zip(config, is_prod);

    // 目前swc不支持vue文件，所以vue文件调试有问题，VUE文件要把js，ts独立成一个文件就没问题。
    // 如：<script lang="ts" src="./ElementPage.ts"></script>
    // 或：<script lang="js" src="./ElementPage.js"></script>
    utils.config_swc(config, use_swc);
  },
};
