/* eslint-disable */
// @ts-check
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
let libs = require("./external-details");
const package = require("../package.json");
const KOCA_UI_PACKAGE_NAME = "szkingdom.yf.koca-ui";
const KOCA_TEMPLATE_PACKAGE_NAME = "szkingdom.yf.koca-template";

const is_production = process.env.NODE_ENV === "production";
const cdn_prefix = "https://cdn.bootcdn.net/ajax/libs";

const mode = is_production ? "prod" : "dev";

const use_common_dependence = false;
libs = use_common_dependence ? libs : [];



/**
 * 构造(本地)依赖库路径
 * cdn_url:    https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.js
 * cdn_format: https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{file_name}
 *
 * @param {boolean} use_cdn
 * @returns {{name: string, script: string}[]}
 */
function cdn_scripts(use_cdn, publicPath) {
  const scripts = libs.map(lib => {
    const package = path.resolve(process.cwd(), "node_modules", lib.name, "package.json");
    const { version } = require(package);
    lib.version = version;
    const prefix = (use_cdn && lib.has_cdn) ? cdn_prefix : publicPath + "/venders";
    /* const script = is_production ?
      `${prefix}/${lib.name}/${version}/${lib[mode]}` :
      `${prefix}/${lib.name}/${lib.dist}/${lib[mode]}?version=${version}`; */
    const script = `${prefix}/${lib.name}/${version}/${lib[mode]}`;
    return { name: lib.name, script }
  });

  return scripts;
}


function get_envs(configArgv){
  let { original } = configArgv;
  let envs = {}
  if(original && original.length){
    original.forEach(str => {
      if (str.indexOf("--") === 0) {
        let arr = str.substr(2).split(":");
        if (arr.length === 2) {
          envs[arr[0]] = arr[1];
        }
      }
    });

  }
  return envs;
}

/**
 * 拷贝(本地)依赖库, 微应用不拷贝VUE的基础模块（Vue, VueRouter, Vuex, VueI18n, ElementUI）
 *
 * @param {string} outputDir
 * @param {string[]} exclude_libs
 * @returns
 */
function copy_scripts(outputDir, exclude_libs) {
  return libs
    .filter(lib => !exclude_libs.includes(lib.name))
    .map(lib => {
      const from = path.resolve(process.cwd(), "node_modules", lib.name, lib.dist, lib[mode]);
      const to = path.resolve(process.cwd(), outputDir, "venders", lib.name, lib.version, lib[mode]);
      return { from, to };
    });
}

/* COPY依赖库 */
function copy_venders(outputDir, exclude_libs = []) {
  libs.forEach(lib => {
    const package = path.resolve(process.cwd(), "node_modules", lib.name, "package.json");
    const { version } = require(package);
    lib.version = version;
  });

  const scripts = copy_scripts(outputDir, exclude_libs);

  scripts.forEach(script => {
    const { from, to } = script;
    if (!fs.existsSync(path.dirname(to))) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
    }

    fs.copyFileSync(from, to);
  });
}

/**
 * 保存懒加载依赖库 src/config/lazy-libs.ts
 *
 * @param {{name: string, script: string}[]} lazyLibs
 * @returns
 */
function save_lazy_libs(lazyLibs) {
  const file = path.resolve(process.cwd(), "src/config/lazy-libs.ts");
  const contents = [
    'import { ScriptModel } from "szkingdom.yf.koca-template/lib/utils/browser";',
    "",
    "export const LazyLibs: ScriptModel[] = ["
  ];
  lazyLibs.forEach(lib => {
    contents.push(`  { name: "${lib.name}", src: "${lib.script}", loaded: false },`);
  });

  contents.push("];");
  contents.push("");
  fs.writeFileSync(file, contents.join("\n"));
}

// webpack-html-plugin处理index.html的cdn配置
function cdn(use_cdn, publicPath, exclude_libs = []) {
  const scripts = cdn_scripts(use_cdn, publicPath);

  // 懒加载的依赖脚本
  const lazyLibs = scripts.filter(s => {
    const lib = libs.find(l => l.name === s.name);
    return lib.lazy;
  });
  save_lazy_libs(lazyLibs);

  // 非懒加载的依赖脚本
  const nonLazyScripts = scripts.filter(s => {
    const lib = libs.find(l => l.name === s.name);
    return !lib.lazy && !exclude_libs.includes(lib.name);
  }).map(s => s.script);

  return { scripts: nonLazyScripts }
}

// 修改webpack路径别名
function config_alias(config, not_dev = true) {
  console.log('build app config_alias:', path.resolve(process.cwd(), "src/assets/scss/"));
  if (not_dev) {
    config.resolve.alias
      .set("scss", path.resolve(process.cwd(), "src/assets/scss/"));
  } else {
    config.resolve.alias
      .set("szkingdom.yf.koca-template", path.resolve(process.cwd(), "."))
      .set("scss", path.resolve(process.cwd(), "src/assets/scss/"));
  }
}

// 修改webpack-html-plugin参数, 增加（本地）依赖库处理
function config_html(config, app_name, use_cdn, publicPath = "", plugin = "html-index", exclude_libs = []) {
  config.plugin(plugin).tap(args => {
    args[0].cdn = cdn(use_cdn, publicPath, exclude_libs)
    args[0].app_name = app_name.replace("/", "-");
    return args
  });
}

// 修改webpack-copy-plugin参数，增加拷贝（本地）依赖库处理)
function config_copy(config, app_name, use_cdn, outputDir, is_app = false, exclude_libs = [], exclude_apps = []) {
  // cdn
  if (is_production && !use_cdn) {
    config.plugin("copy").tap(args => {
      // 微应用public目录为public/$app_name/
      if (is_app) {
        args[0][0].from = path.resolve(process.cwd(), "public", app_name);
      } else {
        // 主应用忽略 apps,  vendor, app_name folders
        const ignore_folders = exclude_apps.map(e => `${e}/**/*`)
        args[0][0].ignore.push(
          "apps/**/*",
          "vendor/**/*",
          ...ignore_folders
        );
      }
      args[0].push(...copy_scripts(outputDir, exclude_libs));
      return args ;
    });
  }
}

// 定义环境变量
function config_define(config, configArgv){
  config.plugin("define").tap(args => {

  let envs = get_envs(configArgv);
  Object.keys(envs).map(key => {
    args[0]["process.env"][key] = JSON.stringify(envs[key]);
  })
  // 加入软件信息
    args[0]["process.env"]["VUE_APP_UI_VERSION"] =  JSON.stringify(package.dependencies[KOCA_UI_PACKAGE_NAME]);
    args[0]["process.env"]["VUE_APP_TEMPLATE_VERSION"] = JSON.stringify(package.dependencies[KOCA_TEMPLATE_PACKAGE_NAME]);
    args[0]["process.env"]["VUE_APP_BUILD_TIME"] = JSON.stringify(getNowDateStr());
  return args;
  });
}

function getNowDateStr() {
  let now = new Date();
  let nowStr =
    now.getFullYear() + "-" +
    (now.getMonth() + 1) + '-' +
    now.getDate() + ' ' +
    now.getHours() + ':' +
    now.getMinutes() + ":" +
    now.getSeconds() + " " +
    now.getMilliseconds();
  return nowStr;
}

// 配置生产打包时压缩文件, 压缩大于４k的文件
function config_zip(config, is_prod) {
  if (is_prod) {
    config.plugin("compression-gzip").use(CompressionWebpackPlugin, [{
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: zlib.constants.Z_BEST_COMPRESSION,
      },
      threshold: 8192,
      minRatio: 0.9,
    }]);

    config.plugin("compression-brotli").use(CompressionWebpackPlugin, [{
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
        },
      },
      threshold: 4096,
      minRatio: 0.9,
      deleteOriginalAssets: false,
    }]);
  }
}

// 配置swc编译加快打包速度
function config_swc(config, use_swc) {
  if (use_swc) {
    const jsRule = config.module.rule('js');
    jsRule.uses.clear();
    jsRule.use('swc').loader('swc-loader');

    const tsRule = config.module.rule("ts");
    tsRule.uses.clear();
    tsRule.use('swc').loader('swc-loader');

    const tsxRule = config.module.rule("tsx");
    tsxRule.uses.clear();
    tsxRule.use('swc').loader('swc-loader');
  }
}

// **** 微应用需要有明确的地址，不然主用加载资源是会404:
// **** 如果微应用和主应用部署在同一个nginx下的同一个IP和端口，
// publicPath可以配置为`/${app_name}`
function build_publicPath(envInfo) {
  const { app_name, port, app_ip } = envInfo;
  if (app_ip && app_ip.length > 1) {
    return `//${app_ip}:${port}/apps/${app_name}`;
  }
  return `/apps/${app_name}`;
}

/**
 *　代理跳过JS依赖库
 *
 * @param {Request} req
 * @param {Response} res
 * @param {any} proxyOptions
 */
function bypass(req, res, proxyOptions) {
  const [uri, param] = req.url.split("?");

  const static_resources = [
    '.js',
    '.png',
    '.ttf',
    '.jpg',
    '.css',
    '.htm',
    '.html',
    '.gif',
    '.xml',
    '.map',
  ];

  // 1. ignore hot update
  if (
    static_resources.some(r => uri.endsWith(r)) ||
    uri.endsWith("-update.json")
  ) {
    return uri;
  }

  // 2. ignore js lib
  if (uri.endsWith(".js")) {
    return uri;
  }

  return null;
}

module.exports.build_publicPath = build_publicPath;
module.exports.config_alias = config_alias;
module.exports.config_html = config_html;
module.exports.config_copy = config_copy;
module.exports.copy_venders = copy_venders;
module.exports.config_zip = config_zip;
module.exports.config_swc = config_swc;
module.exports.config_define = config_define;
module.exports.get_envs = get_envs;
module.exports.bypass = bypass;
