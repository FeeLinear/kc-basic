
/*
 * <p>文件名称: ${file_name}</p>
 * <p>项目描述: KOCA 金证云原生平台 V1.0.0</p>
 * <p>公司名称: 深圳市金证科技股份有限公司</p>
 * <p>版权所有: 版权所有(C)2019-2020</p>
 */
/*
 * @Description: server 模块 后台接口
 * @Author: zhubc
 * @Time: 2019-10-26 15:32:09
 * @LastAuthor   : yuanyong
 * @LastTime     : 2020-09-17 17:57:50
 */

const ApiList = {
  // baisc
  basicExport: "export", // 导出接口
  // user
  queryUserInfoAll: "api/user-query-all",  // 人员信息查询（综合）
  queryUserDetail: "user/detail", // 人员信息查询（详情）
  queryUserDetailBex: "api/user-detail", // 人员信息查询（详情）
  queryUserInfoSimple: "user/query-simple",  // 人员信息查询（简约）
  queryUserInfoSimpleBex: "api/user-query-simple",  // 人员信息查询（简约）
  addUserInfo: "user/add", // 人员信息新增
  updateUserInfo: "user/update", // 人员信息修改
  saveUserRole: "user/role/save", // 人员角色保存
  saveUserOrg: "user/org/save", // 人员机构保存
  userFreezeUrl: "user/freeze", // 人员冻结
  userUnfreezeUrl: "user/unfreeze", // 人员解冻
  userCancelUrl: "user/cancel",  // 人员注销
  userPwdReset: "pwd/reset",  // 人员密码重置
  batchPwdReset: "pwd/batchReset", //批量密码重置
  templateDownload: "template/download",// 导入模板文件下载
  uploadAvatar: "user/icon/upload",
  avatarDownload: "user/icon/download",

  // menu-auth
  queryMenuGrant: "menu-grant/query", // 授权菜单权限查询
  queryUserMenuExec: "menu-exec/query-user", // 人员菜单执行权限查询
  saveUserMenuExec: "menu-exec/save-user", // 人员菜单执行权限设置
  queryRoleMenuExec: "menu-exec/query-role",  // 角色菜单执行权限查询
  saveRoleMenuExec: "menu-exec/save-role",  // 角色菜单执行权限设置
  queryTenantMenuGrant: "tenant/grant-menu", // 授权租户菜单权限查询

  // role
  queryRoleInfo: "role/query-page",  // 角色信息查询（分页）
  addRoleInfo: "role/add",  // 角色信息新增
  updateRoleInfo: "role/update",  // 角色信息修改
  queryRoleInfoSimple: "role/query-simple", // 角色信息查询（简约）
  queryRoleUserInfo: "role/user/query",  // 角色人员信息查询
  saveRoleUserInfo: "role/user/save",  // 角色人员信息保存

  // org
  queryOrgTreeUrl: "org/query-tree",  // 机构信息查询（tree）
  queryOrgDetail: "org/detail",  // 机构信息查询（详情）
  addOrgInfo: "org/add",  // 机构信息新增
  updateOrgInfo: "org/update",  // 机构信息修改
  queryOrgUserInfo: "org/user/query",  // 机构人员信息查询
  saveOrgUserInfo: "org/user/save",  // 机构人员信息保存

  // own
  queryOwnUserBex: "api/own-user-query",  // 个人信息查询
  queryOwnUser: "own/user/query",  // 个人信息查询
  updateOwnUser: "own/user/update",  // 个人信息修改
  updateOwnPwd: "own/pwd/update",  // 个人密码修改
  getOwnMenuExec: "menu-exec/query", // 查询当前登录人员菜单权限

  // menu
  queryMenuTree: "menu/query",  // 菜单查询
};

export function getApiList(instance: Vue) {
  const apiList = {};
  const moduleName = instance.$app.apiPrefix.USER_URL_PREFIX;

  for (const key in ApiList) {
    apiList[key] = moduleName + ApiList[key];
  }

  return apiList;
}
