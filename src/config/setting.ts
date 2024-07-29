/*
 * <p>文件名称: ${file_name}</p>
 * <p>项目描述: KOCA 金证云原生平台 V1.0.0</p>
 * <p>公司名称: 深圳市金证科技股份有限公司</p>
 * <p>版权所有: 版权所有(C)2019-2020</p>
 */
import { i18n, messages } from "szkingdom.yf.koca-template/lib/locale";
import sockjs from "./sockjs";

const $t = (msg) => i18n(messages).t(msg);

export default {
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the sider footer
   */
  siderFooter: false,

  darkMode: "light",
  /**
   * @type {boolean} true | false
   * @description 菜单收藏
   */
  favorMenu: true,
  /**
   * @type {boolean} true | false
   * @description 是否展示搜索菜单
   */
  searchMenu: true,
  /**
   * @type {enum} 'sidebar' | 'mix' | 'top-menu' | 'fullscreen' | 'multi-level-mix-sidebar'
   * @description 导航栏模式
   */
  layout: "sidebar",
  /**
   * @type {enum} 'BACK' | 'FRONT'
   * @description 菜单路由渲染模式
   */
  menuMode: "BACK",

  /**
   * @type {boolean} true | false
   * @description 是否分割菜单，仅在layout 为mix模式时可配置
   */
  split: false,
  /**
   * @type {enum} content-fixed | content-fluid
   * @description 内容区域高度：定高|流式
   */
  contentMode: "content-fluid",
  /**
   * @type {boolean} true | false
   * @description 是否开启按钮权限控制
   */
  isAuth: true,
  /**
   * @type {boolean} true | false
   * @description 是否展示多页签
   */
  showTabs: true,

  /**
   * @type {boolean} true | false
   * @description 是否开启自适应优化显示效果, 开启此功能还需要进行对应的配置，请查看
   */
  flexible: false,

  /**
   * @type {boolean} true | false
   * @description 用户登录后是否请求租户列表
   */
  defaultQueryTenant: false,

  /**
   * @type {boolean} true | false
   * @description 用户登录后是否默认设置租户id
   */
  defaultSetTenantId: false,

  // message消息提示设置
  messageSettings: {
    // message: "", // 消息文字
    // type: "", // 主题 【success/warning/info/error】
    // iconClass: "", // 自定义图标的类名，会覆盖type
    dangerouslyUseHTMLString: false, // 是否将 message 属性作为 HTML 片段处理
    // customClass: "", // 自定义类名
    duration: 5000, // 显示时间，毫秒。设为0则不会自动关闭
    showClose: true, // 是否显示关闭按钮
    center: false, // 文字是否居中
    // onClose: fn // 关闭时的回调函数，参数为被关闭的message实例
    offset: 20 // Message距离窗口顶部的偏移量
  },
  disableCompiledConfig: false,
  // 使用自主研发的全屏组件
  fullscreenSettings: {
    fullscreenBtnVisible: true,
    showText: false,
    fullscreenIcon: "kui-icon-full-screen",
    exitFullscreenIcon: "kui-icon-full-screen-exit",
    view: () => import("szkingdom.yf.koca-template/lib/components/FullscreenBtn.vue")
  },
  // 自定义aboutus视图文件
  aboutusSettings: {
    view: () => import("szkingdom.yf.koca-template/lib/components/AboutUs.vue"),
    img: require("szkingdom.yf.koca-template/lib/assets/images/svg/about-us.svg"), // 图片路径
  },
  frameTop: {
    show: true,
    logo: require("szkingdom.yf.koca-template/lib/assets/images/logo-light.png"), // 页面导航条logo路径
    smallLogo: require("szkingdom.yf.koca-template/lib/assets/images/logo-small.png"),
    // 用户信息下拉展示列表
    ownItems: [{
      label: $t("frame.geren_xinxi"),
      icon: "kui-icon-user",
      component: "/admin-basic/views/user/OwnInfo.vue"
    }, {
      label: $t("frame.xiaoxi_zhongxin"),
      icon: "kui-icon-bell",
      component: "/admin-basic/views/user/MessageManager.vue",
      divided: true,
    }, {
      label: $t("frame.mima_xiugai"),
      icon: "kui-icon-lock",
      component: "/admin-basic/views/user/OwnPwdChange.vue",
      divided: true,
    }],
    // 顶部个人信息展开时，是否显示关闭并退出按钮
    // chrome等浏览器需要使用window.open打开的页面才能关闭标签
    closeAndExitBtn: false,
    // 框架顶部右上角图标的开关配置，[主题，中英文，消息通知，换肤] 1/true表示开启，0/false表示关闭
    iconsOnoff: [1, 1, 1, 1]
  },
  login: {
    logo: require("szkingdom.yf.koca-template/lib/assets/images/logo-dark.png"),
    showForgetPwd: true,
    showPhoneLogin: true,
    showPassPortLogin: true
  },
  topbar: {
    view: () => import("szkingdom.yf.koca-template/lib/layout/FrameTop.vue")
  },
  tagbar: {
    view: () => import("szkingdom.yf.koca-template/lib/layout/FrameTags.vue")
  },
  tenantSelect: {
    view: () => import("szkingdom.yf.koca-template/lib/layout/components/TenantSelect.vue")
  },
  // 订阅
  frameUrlList: {
    login: "login", // 登录接口
    smsCodeUrl: "SMScode", // 发送短信接口
    loginByAuthCode: "phone/authcode", // 手机号+随机码登录
    loginByPhonePwd: "phone/password", // 手机号+密码登录
    randomCode: "randomCode", // 随机码接口
    logout: "logout",  // 登出接口
    queryDict: "dict/item/query",  // 字典查询接口
    queryMenu: "menu-exec/query",   // 菜单查询接口
    queryFavorMenus: "favorite/query",  // 收藏菜单查询接口
    setMenuFavor: "favorite/save",  // 设置菜单收藏状态
    queryUserInfo: "userInfo",  // SSO登录查询用户信息
    wechatLogin: "wechat/login", // 企业微信登录
    wechatApp: "wechat/app", // // 企业微信app信息获取
    updateBacklogStatus: "api/update-backlog-status",  // 更新消息状态
    backlogList: "api/backlog-list",  // 消息列表
    queryHomePage: "homepage/query", // 查询首页接口
    setHomePage: "homepage/save", // 设置首页接口
    clearHomePage: "homepage/clear", // 取消设置首页接口
    waterMark: "watermark", // 获取水印文本
    downloadAvatar: "user/icon/download", // 头像下载
    queryTenantList: "tenant/user_tenant", // 查询租户列表接口
    queryProfiles: "front/profiles", // 获取系统的一些配置信息
    //queryPanelConfig: "front/user/parameter", // 获取系统右侧项目配置
    //updatePanelConfig: "front/user/parameter/maintain", // 更新系统右侧项目配置
    // querySign: "auth/sign" // 获取生成签名信息
  },
  skins: {
    // 亮色模式
    light: [
      { title: "经典蓝", color: "#3261ff", key: null }, // key: null, // null 无需加载皮肤文件
      { title: "商务红", color: "#E13C39", key: null },
      { title: "雅致青", color: "#5ABFC1", key: null },
    ],
    // 暗色模式
    dark: [
      { title: "深邃蓝", color: "#3079FF", key: "dark" },
      { title: "亮彩蓝", color: "#3365FF", key: "blue" },
    ],
  },
  sockjs,
  /**
   * @type {boolean} true | false
   * @description 弹窗遮罩是否只遮盖指定内容区域
   */
  partialDialog: false,
  // /**
  //  * @type {boolean}
  //  * @description 初始化进入内容全屏
  //  */
  // firstEnterFullscreen: false,
  /**
   * @type {string} $mode easy | tight
   * @type {string} easy | tight
   * @type {string} easy | tight
   * @description KOCA-UI组件宽松&紧凑模式
   */
  elementConfig: {
    $mode: "easy",
    easyInputWidth: 230,
    tightInputWidth: 200,

    // 自适应高度
    // 建议的tableHeight;
    tableBtnsHeight: 32, // 表格上按钮高度
    tableBtnsMargin: 16, // 表格与按钮间距
    pagiHeight: 24,      // 分页组件高度
    pagiMargin: 16,  // 表格与分页组件间距
  },
  /**
   * 为vue-router懒加载时添加loading提示避免无响应
   */
  asyncLoadingRoutes: [
  ],
  /**
   * @type {string} integrate | separate
   * @description 微应用集成方式，共享主应用依赖或者相互独立
   */
  microMode: "separate",

  /**
   * 混合菜单触发方式
   */
  triggerMode: "click",

  /**
   * 页签拖动开关
   */
  tagDragEnable: true,

  /**
   * xss配置 【https://github.com/leizongmin/js-xss/blob/master/README.zh.md】
   */
  xssOptions: {},

  /**
   * 用户访问没有权限的路由地址时展示的页面地址(例：'/home')
   */
  forbiddenRouteRedirect: "",

  // 缓存存储类型：SESSION || LOCAL
  permissionCacheType: "SESSION",

  /**
   * 屏幕或浏览器缩放提示开关
   */
  zoomAlertEnable: true,

  /**
   * 是否执行校验当前代码版本是否与服务器版本一致（刷新弹窗）
   * false则不会有刷新弹窗出现
   */
  checkVersionTood: true,

  /**
   * 读取硬件信息开关
   */
  checkHardwareEnable: false,

  /**
   * 读取硬件插件的下载地址
  */
  hardwarePluginDownloadSrc: "https://koca.szkingdom.com/site/getDownloadFileById?id=383",

  /**
   * 自定义部署版本号
  */
  deployVersion: "",
};
