# vue-minimum

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### package.json 中第三方依赖说明

```
"peerDependencies": {
    "vue": "2.6.1",  // vue
    "vue-template-compiler": "2.6.1" // 将Vue 2.0模板预编译为呈现函数，以避免运行时编译开销和CSP限制。在大多数情况下，应该将它与vue-loader一起使用
  },
  "dependencies": {
    "axios": "^0.21.1",  // 数据通信
    "babel-polyfill": "^6.26.0", //
    "core-js": "^3.6.5",
    "cross-env": "^7.0.3",  // 运行跨平台设置和使用环境变量的脚本
    "deepmerge": "^4.2.2",  // 深度合并，在合并翻译文件使用
    "driver.js": "^0.9.8",  // 引导式功能插件
    "element-ui": "^2.13.2",  // UI组件库
    "fetch-polyfill": "^0.8.2",  // 解决引入qiankun框架的IE get请求问题
    "js-cookie": "^2.2.1",  // 工具类方法 cache.js中使用
    "js-file-download": "^0.4.9",  // request.ts中下载文件
    "lodash-es": "^4.17.21",
    "normalize.css": "^8.0.1",
    "nprogress": "^0.2.0",
    "path": "^0.12.7",
    "qiankun": "^2.4.0",
    "resize-observer-polyfill": "^1.5.1",
    "sockjs-client": "^1.5.1",
    "stompjs": "^2.3.3",
    "vue-class-component": "^7.2.3",
    "vue-i18n": "^8.15.3",
    "vue-loader": "^15.9.5",
    "vue-property-decorator": "^9.1.2",
    "vue-router": "^3.2.0",
    "vue-svgicon": "^3.2.6",
    "vuex": "^3.4.0",
    "vuex-module-decorators": "^0.9.11",
    "vuex-persist": "^2.3.0"
  },

  "devDependencies": {
    "@types/faker": "^4.1.8",
    "@types/jest": "^24.0.19",
    "@types/js-cookie": "^2.2.4",
    "@types/node": "^12.6.9",
    "@types/nprogress": "^0.2.0",
    "@typescript-eslint/eslint-plugin": "^2.33.0",
    "@typescript-eslint/parser": "^2.33.0",
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-plugin-router": "~4.5.0",
    "@vue/cli-plugin-typescript": "~4.5.0",
    "@vue/cli-plugin-unit-jest": "~4.5.0",
    "@vue/cli-plugin-vuex": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "@vue/eslint-config-standard": "^4.0.0",
    "@vue/eslint-config-typescript": "^5.0.2",
    "add-asset-html-webpack-plugin": "^3.1.3",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "clean-webpack-plugin": "^3.0.0",
    "compression-webpack-plugin": "^6.1.1",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^6.2.2",
    "faker": "^4.1.0",
    "mockserver-client": "^5.8.1",
    "mockserver-node": "^5.8.1",
    "node-sass": "^4.13.0",
    "sass-loader": "^8.0.2",
    "speed-measure-webpack-plugin": "^1.3.3",
    "tslib": "^2.3.0",
    "typescript": "~3.9.3",
    "webpack-cli": "^4.5.0",
    "webpack-theme-color-replacer": "^1.3.26"
  },

```
