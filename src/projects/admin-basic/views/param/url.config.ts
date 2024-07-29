/*
 * <p>文件名称: ${file_name}</p>
 * <p>项目描述: KOCA 金证云原生平台 V1.0.0</p>
 * <p>公司名称: 深圳市金证科技股份有限公司</p>
 * <p>版权所有: 版权所有(C)2019-2020</p>
 */
/*
 * @Description: server 模块 参数、字典、菜单
 * @Author: zhubc
 * @Time: 2019-10-26 15:32:09
 * @LastAuthor   : zhubc
 * @LastTime     : 2019-12-20 11:54:09
 */
const ApiList = {
  // param
  queryParamInfo: "par/query",  // 系统参数查询
  queryParamInfoPage: "par/query/page",  // 系统参数查询
  addParamInfo: "par/add",  // 系统参数新增
  updateParamInfo: "par/update",  // 系统参数修改
  addParamInfoOrg: "par/org/add",  // 机构参数新增
  updateParamInfoOrg: "par/org/update",  // 机构参数修改

  // dict
  queryDictInfo: "dict/query",  // 字典查询
  queryDictInfoPage: "dict/query/page",  // 字典查询(page)
  addDictInfo: "dict/add",  // 字典新增
  updateDictInfo: "dict/update",  // 字典修改
  deleteDictInfo: "dict/delete",  // 字典删除
  queryDictItemInfo: "dict/item/query",  // 数据字典项查询
  queryDictItemInfoPage: "dict/item/query/page",  // 数据字典项分页查询
  addDictItem: "dict/item/add",  // 数据字典项新增
  updateDictItem: "dict/item/update",  // 数据字典项修改
  delDictItem: "dict/item/delete",  // 字典项删除

  // menu
  queryMenuTree: "menu/query",  // 菜单查询
  addMenuInfo: "menu/add",  // 菜单查询
  updateMenuInfo: "menu/update",  // 菜单信息保存
  // getMenuByAuth: "server/menu/query/auth",  // 对应权限菜单查询（暂未实现）
  saveMenuDrag: "menu/drag",  // 菜单拖拽
};

export function getApiList(instance: Vue) {
  const apiList = {};
  const moduleName = instance.$app.apiPrefix.PARAM_URL_PREFIX;

  for (const key in ApiList) {
    apiList[key] = moduleName + ApiList[key];
  }

  return apiList;
}
