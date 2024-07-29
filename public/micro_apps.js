// 微应用定义, 为空数组表示没有定义
var KOCA_MICRO_APPS = [
  {
    name: "admin-basic",
    entry: "http://localhost:7001/apps/admin-basic/",
    container: "#admin-basic-container",
    prefixPath: "#/admin-basic",
    activeRules: [ {
      name: 'portal',
      prefix: "#/portal",
      container: '#portal-viewport',
      microPath: [
        '/admin-basic/views/param/Dict',
        '/admin-basic/views/user/UserInfoManager',
        '/admin-basic/views/param/Param'
      ]
    }]
  },
  {
    name: "admin-app-access",
    entry: "http://localhost:7002/apps/admin-app-access/",
    container: "#admin-app-access-container",
    prefixPath: "#/admin-app-access",
  },
];

// 拥有全量的dict 的routePath 列表
var LOAD_FULL_DICT_ROUTE = [

]

// 翻译字典时，子应用默认查找的字典集所对应的系统ID
var DEFAULT_SYSID_ON_DICT_ROUTE = {
  "admin-basic": [],
}
