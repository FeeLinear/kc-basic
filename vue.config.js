/*
 * @Description:
 * @Author:
 * @Date: 2019-08-23 14:30:47
 */
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");

const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const ThemeColorReplacer = require("webpack-theme-color-replacer");
const forElementUI = require('webpack-theme-color-replacer/forElementUI');
const changeSelector = require("./build/webpack-theme-color-replacer/changeSelector");


const themeColor = "#3261FF";
const smp = new SpeedMeasurePlugin({
  outputFormat: "koca"
});

const utils = require("./build/utils");


const { generate_projects_routes } = require("./build/projects_routes");
const { genVersion} = require("./build/version-update");

// 是否是生产环境打包
const isPro = process.env.NODE_ENV === "production";



// 生成projects下模块的路由映射
// views 页面目录, 如：/pages/, /views/, ""
const views = "/views/";
generate_projects_routes(views);

const devServer = {
  port: process.env.PORT || 8000,
  open: true,
  historyApiFallback: {
    rewrites: [
      { from: /./, to: path.posix.join("/", "index.html") },
    ]
  },
  after: function (app, server) {
  },
  proxy: {
    // "^/sys": {
    //   // 本地mock服务器地址
    //   target: "http://localhost:1088/",
    //   changeOrigin: true,
    //   ws: false,
    //   logLevel: "debug"
    // },
    "^/": {
      // koca 服务器环境，请自定义更换
      target: "http://10.210.4.55:18066/",
      changeOrigin: true,
      // 当使用长链接时请设置ws为true, 否则在ie浏览器调整时会导致web服务挂掉
      ws: false,
      logLevel: "debug"
    },
  },
};

const configPlugin = [
  new webpack.DllReferencePlugin({
    context: process.cwd(), // 返回nodejs的当前工作目录
    manifest: require("./public/vendor/vue-manifest.json")
  }),
  new webpack.DllReferencePlugin({
    context: process.cwd(), // 返回nodejs的当前工作目录
    manifest: require("./public/vendor/vueBucket-manifest.json")
  }),
  // 将dll注入到生成的html模板中
  new AddAssetHtmlPlugin({
    // dll文件位置
    filepath: path.resolve(__dirname, "./public/vendor/*.js"),
    // dll 引入路径
    publicPath: "./vendor",
    // dll最终输出的目录
    outputPath: "./vendor"
  }),
  // 生成仅包含颜色的替换样式（主题色等）
  new ThemeColorReplacer({
    fileName: 'css/theme-colors.[contenthash:8].css',
    matchColors: [
      ...forElementUI.getElementUISeries(themeColor)
    ],
    // 修改原来的changeSelector方法，fix el-tabs,el-select下的el-tags，el-radio等组件的样式优先级出现问题
    // changeSelector: forElementUI.changeSelector,
    changeSelector,
    isJsUgly: isPro
  }),
];

// 项目启动/打包命令跟随的参数。
// 项目启动/打包命令跟随的参数。
var argv;
try {
  argv = JSON.parse(process.env.npm_config_argv);
  if(isPro &&  argv.original){
    let version = argv.original.find( p => p.startsWith('--VUE_APP_VERSION'));
    version = version.replace("--VUE_APP_VERSION:", '')
    genVersion(version);
  }
} catch (ex) {
  console.error(ex);
  argv = process.argv;
}

const commonCache = { priority: 10, reuseExistingChunk: true,enforce: true, };
const splitChunks = {
  chunks: "all", // 表示哪些代码需要优化，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async
  maxInitialRequests: Infinity, // 按需加载时候最大的并行请求数，默认为5
  minSize: 30000, // 依赖包超过300000bit将被单独打包
  // 缓存组
  // priority: 缓存组打包的先后优先级
  // minChunks: 表示被引用次数，默认为1
  cacheGroups: {
    //公共模块
    // src: {
    //   name: "chunk-commons",
    //   test: /[\\/]src[\\/]/, // can customize your rules
    //   minChunks: 1, //  minimum common number
    //   ...commonCache
    // },
    // 第三方库
    editor: {
      name: "chunk-editor",
      chunks: "async",
      test: /[\\/]node_modules[\\/](echarts|jsoneditor|@wangeditor|html2canvas)[\\/]/,
      // chunks: "all",
      ...commonCache,
      priority: 20,
    },

    tool: {
      name: "chunk-tool",
      test: /[\\/]node_modules[\\/](vue-grid-layout|jspdf|zrender|lodash-es|jquery)[\\/]/,
      ...commonCache
    },

    ui: {
      name: "chunk-ui",
      chunks: "async",
      test: /[\\/]node_modules[\\/](@antv|@logicflow)[\\/]/,
      ...commonCache
    },
    koca: {
      name: "chunk-koca",
      test: /[\\/]node_modules[\\/](szkingdom.yf.koca-template|szkingdom.yf.koca-ui|element-ui)[\\/]/,
      ...commonCache
    },
    kace:{
      name: "chunk-kace",
      test: /[\\/]node_modules[\\/](@szkingdom.yf.koca-ui)[\\/]/,
      ...commonCache
    },
    common: {
      name: "chunk-common",
      test: /[\\/]node_modules[\\/]/,
      chunks: "initial",
      minChunks: 2,
      ...commonCache,
      priority: 0,

    },
  },
};



const config = {
  // 部署应用包时的基本 URL
  publicPath: "./",
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录
  outputDir: "dist",
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: "",
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  indexPath: "index.html",
  // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  /* filenameHashing: false, */
  // 在 multi-page 模式下构建应用。详见：https://cli.vuejs.org/zh/config/#pages
  pages: undefined,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  lintOnSave: !isPro,
  // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  runtimeCompiler: false,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  // 将依赖 vuex-persist 显示的转化为es5的语法展示。
  transpileDependencies: ["vuex-persist", "element-ui", "szkingdom.yf.koca-ui", "szkingdom.yf.koca-template"],
  // 打包编译是否产生 source map 用于调试。
  productionSourceMap: !isPro,
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。用于跨域属性的凭据标志
  crossorigin: undefined,
  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性。
  integrity: false,
  // share your variables, mixins, functions across all style files, so you don't need to @import them manually.

  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
  // 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  configureWebpack: config => {
      // 解决使用ts写的模块keep-alive不生效
    if (isPro) {
      config.optimization.minimizer[0].options.terserOptions.keep_fnames = true;
    }
    const configs =  {
      plugins: configPlugin,
      externals: {
        "wxLogin": "WwLogin" // 企业微信登录
      },
      resolve: {
        alias: {
          "scss": path.resolve(__dirname, "./src/assets/scss/"),
          // "szkingdom.yf.koca-template": path.resolve(__dirname, "./")
        }
      }
    }
    return isPro ? smp.wrap(configs) : configs;

  },
  chainWebpack: config => {
    config.plugins.delete("preload"); // 取消样式预加载，可能产生字体乱码问题
    config.plugins.delete("prefetch");

    // 清除包更新的缓存问题 20200515 added
    config.module
    .rule("vue")
    .test(/\.vue$/)
    .use("vue-loader")
    .loader("vue-loader")
    .options({
      compilerOptions: {
        preserveWhitespace: false,
        directives: {
          html(node, directiveMeta) {
            (node.props || (node.props = [])).push({
              name: 'innerHTML',
              value: `xss(_s(${directiveMeta.value}))`
            })
          }
        }
      }
    });

    if (isPro) {
      // 为生产环境修改配置...

      // 打包的时候开启gzip可以大大减少体积
      config.plugin("compression").use(new CompressionPlugin({
        test: /\.js$|\.css$|\.html$|\.otf$|\.ttf/,
        threshold: 10240,
        minRatio: 0.8
      }));

      // 性能配置
      config.optimization
        .mergeDuplicateChunks(true)
        .removeAvailableModules(true)
        .removeEmptyChunks(true)
        .usedExports(true)
        .minimize(true);

      // 优化配置
      config.performance
        .hints("warning")
        .maxEntrypointSize(1024000)
        .maxAssetSize(3000000);
    } else {
      // 为开发环境修改配置...
      config.devtool("source-map");
    }
    // 优化打包配置
    config.optimization.splitChunks(splitChunks);
    // 将参数传入项目中，可在main.js或者项目中的config 通过process.env 获取
    utils.config_define(config, argv);
    // config.entry("main").add("babel-polyfill");
  },
  css: {
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    extract: isPro,
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。
    sourceMap: !isPro,
    // 向 CSS 相关的 loader 传递选项 详见：https://cli.vuejs.org/zh/guide/css.html
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
  devServer: devServer,
};

module.exports = config ;
