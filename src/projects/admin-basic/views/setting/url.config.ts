/*
 * @Descripttion:
 * @Author: sueRimn
 * @Date: 2020-12-11 18:30:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-11 12:41:01
 */

const apiList = {
  // 密码策略
  getPwd: "pwd/parameter/list",
  updatePwd: "pwd/parameter/update",

  // 节假日管理
  calendarInitializeVo: "calendar/initialize",
  calendarQuery: "calendar/query",
  sysCalendar: "calendar/save"
};

const apiListUser = {
  // 在线用户
  getUser: "user/online",
  updateUser: "user/kick"
};

export interface ApiTypes {
  getPwd: string;
  updatePwd: string;
  calendarInitializeVo: string;
  calendarQuery: string;
  sysCalendar: string;
}

export interface ApiUserTypes {
  getUser: string;
  updateUser: string;
}

export function getApiList(instance: Vue): ApiTypes {
  const ApiList = {} as ApiTypes;
  const moduleName = instance.$app.apiPrefix.PARAM_URL_PREFIX;
  for (const key in apiList) {
    ApiList[key] = moduleName + apiList[key];
  }

  return ApiList;
}

export function getApiUserList(instance: Vue): ApiUserTypes {
  const ApiList = {} as ApiUserTypes;
  const moduleName = instance.$app.apiPrefix.AUTH_URL_PREFIX;
  for (const key in apiListUser) {
    ApiList[key] = moduleName + apiListUser[key];
  }

  return ApiList;
}
export default apiList;
