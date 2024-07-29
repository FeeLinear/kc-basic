
/*
 * @Description: Tenant 模块 后台接口
 * @Author: luoxiang
 * @Time: 2022-9-2 10:53:43
 */

const ApiList = {

  // tenant
  uploadTenantLogo: "tenant/logo/upload", //租户logo上传
  downloadTenantLogo: "tenant/logo/download",  //租户logo下载
  queryTenant: "tenant/query", //租户查询
  // queryTenantList: "tenant/page", //租户列表查询（全量）
  queryTenantList: "tenant/user_tenant", // 租户列表查询（只查询用户有权限的租户）
  addTenant: "tenant/add",  // 添加租户
  updateTenant: "tenant/update",  // 修改租户
  deleteTenant: "tenant/delete", // 删除租户

  // user
  queryTenantUser: "tenant/user/page", //查询租户下的用户
  addTenantUser: "tenant/user/add", //添加用户至某租户下
  deleteTenantUser: "tenant/user/delete", // 删除租户下的用户
  queryUser: "tenant/user/add_page", //查询未在租户的用户

  // role
  queryRoleInfoSimple: "role/query-simple",  // 角色信息查询（分页）
};

export function getApiList(instance: Vue) {
  const apiList = {};
  const moduleName = instance.$app.apiPrefix.TENANT_URL_PREFIX;

  for (const key in ApiList) {
    apiList[key] = moduleName + ApiList[key];
  }

  return apiList;
}
