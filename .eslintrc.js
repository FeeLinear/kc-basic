/* eslint-disable */
// npm run lint-fix  可修复部分格式问题
module.exports = {
  // eslint找当前配置文件不能往父级查找
  root: true,
  // 指定eslint解析器,指定javaScript语言类型和风格
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  // 指定环境的全局变量
  env: {
    browser: true,
    node: true,
    jquery: true,
  },
  /**
   * 规则继承
   * http://eslint.cn/docs/user-guide/configuring#extending-configuration-files
   *【】可继承的方式有以下几种
   *【】eslint内置推荐规则，就只有一个，即「eslint:recommended」
   *【】可共享的配置， 是一个 npm 包，它输出一个配置对象。即通过npm安装到node_module中
   *  可共享的配置可以省略包名的前缀 eslint-config-，即实际设置安装的包名是 eslint-config-standard
   *【】从插件中获取的规则，书写规则为 「plugin:插件包名/配置名」，其中插件报名也是可以忽略「eslint-plugin-」前缀。如'plugin:vue/essential'
   *【】从配置文件中继承，即继承另外的一个配置文件，如'./node_modules/coding-standard/eslintDefaults.js'
   */
  extends: [
    "plugin:vue/essential",
    "plugin:vue/recommended",
    "plugin:vue/strongly-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    // 使用tslint的标准配置 https://palantir.github.io/tslint/rules/
    // "@vue/typescript"
  ],
  /**
   * 每个规则有【3】个错误级别。
   * off或0: 关闭该规则；
   * warn或1: 开启规则，使用警告级别的错误，不会导致程序退出；
   * error或2: 开启规则，使用错误级别的错误，当被触发的时候，程序会退出。
   */
  rules: {
    // 禁止调用console对象方法 https://eslint.org/docs/rules/no-console
    "no-console": JSON.stringify(process.env.NODE_ENV) === "production" ? "error" : "off",

    // 禁止debugger声明 https://eslint.org/docs/rules/no-debugger
    "no-debugger": JSON.stringify(process.env.NODE_ENV) === "production" ? "error" : "off",

    // 不使用"__proto__"属性 https://eslint.org/docs/rules/no-proto
    "no-proto": "off",

    // 不允许正则表达式使用控制字符 https://eslint.org/docs/rules/no-control-regex
    "no-control-regex": "off",

    // 不收到不必要的转义通知 https://eslint.org/docs/rules/no-useless-escap
    "no-useless-escape": "off",

    // 使用2个空格缩进 https://eslint.org/docs/rules/indent
    indent: ["error", 2, { SwitchCase: 1 }],

    // 使用双引号 https://eslint.org/docs/rules/quotes
    quotes: ["error", "double", { allowTemplateLiterals: true }],

    // 使用分号 https://eslint.org/docs/rules/semi
    semi: ["error", "always"],

    // 使用Unix换行符 https://eslint.org/docs/rules/linebreak-style
    // "linebreak-style": [ "error", "unix" ],

    // 行的最大长度: https://eslint.org/docs/rules/max-len
    "max-len": ["error", { code: 100, ignorePattern: "\\w+" }],

    // 大括号风格 https://eslint.org/docs/rules/brace-style
    "brace-style": "error",

    // 驼峰命名： https://eslint.org/docs/rules/camelcase
    // "camelcase": [ "error", { "properties": "always" }],
    camelcase: "off",

    // 多行时不使用拖尾逗号: https://eslint.org/docs/rules/comma-dangle
    // "comma-dangle": ["error", "only-multiline"]
    "comma-dangle": "off",

    // 标识符匹配: https://eslint.org/docs/rules/id-match
    // "id-match": ["error", "^[a-zA-Z$]+[a-zA-Z0-9$_]{0,31}$"],

    // 允许使用v-html命令 https://eslint.vuejs.org/rules/no-v-html.html
    "vue/no-v-html": "off",

    // 自动闭合符号强制为已配置的样式 https://eslint.vuejs.org/rules/html-self-closing.html
    "vue/html-self-closing": "off",

    // HTML缩进设置 https://vuejs.github.io/eslint-plugin-vue/rules/html-indent.html
    "vue/html-indent": [
      "error",
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],

    // 每行最多属性个数 https://bit.ly/2RrnPRJ
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],

    // v-on 指令简写形式 https://eslint.vuejs.org/rules/v-on-style.html
    "vue/v-on-style": ["warn", "shorthand"],

    // 关闭多行元素的内容之前和之后强制换行 https://eslint.vuejs.org/rules/multiline-html-element-content-newline.html
    "vue/multiline-html-element-content-newline": "off",

    // 关闭单行元素的内容之前和之后强制换行 https://eslint.vuejs.org/rules/singleline-html-element-content-newline.html
    "vue/singleline-html-element-content-newline": "off",

    // 不允许多个空格 https://eslint.vuejs.org/rules/no-multi-spaces.html
    "no-multi-spaces": "off",

    // 禁止不必要的构造函数 https://eslint.org/docs/rules/no-useless-constructor
    "no-useless-constructor": "off",

    // 禁止声明未使用的变量 https://eslint.org/docs/rules/no-unused-vars
    "no-unused-vars": "off",

    // 检查v-bind有效 https://eslint.vuejs.org/rules/valid-v-bind.html
    "vue/valid-v-bind": "off",

    // 禁止解析错误 https://eslint.vuejs.org/rules/no-parsing-error.html
    "vue/no-parsing-error": "off",

    "no-empty": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/class-name-casing": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "vue/name-property-casing": "off",
  },
};
