"use strict";
import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { IDictRecord, IAppsDict, IDict } from "szkingdom.yf.koca-template/lib/store/modules/dict";
import { cloneDeep } from "lodash-es";

/**
 * 缓存配置项接口
 */
export interface ICacheConfigItem {
  prefix: string; // 请求地址前缀, 如：TA_SYSTEM_URL_PREFIX
  code: string;   // 缓存项代码, 各业务系统code要求不要相同，最好以应用名称为前缀区分
  url: string;    // 请求地址
  name: string;   // 缓存项名称
  param: any;     // 查询参数
  key: string;    // 主键字段
}

/**
 * 缓存配置接口
 */
export interface ICacheConfig {
  cache: { [key: string]: ICacheConfigItem };
}

/**
 * 缓存中心 state 接口定义
 */
export interface ICacheHubState {
  // 缓存配置
  cacheConfig: { [key: string]: ICacheConfigItem };
  // 业务数据
  cacheData: { [key: string]: any };
  // 是否已经被加载
  cacheLoaded: { [key: string]: boolean };
  // keepAlive缓存
  keepAliveCache: any;
}

@Module({dynamic: true, store: Vue.prototype.$mainStore, name: "cacheHub", namespaced: true })
export class CacheHubModule extends VuexModule implements ICacheHubState {
  public cacheConfig: { [key: string]: ICacheConfigItem } = {};
  public cacheData: { [key: string]: any } = {};
  public cacheLoaded: { [key: string]: boolean } = {};
  public keepAliveCache: any = null;

  @Mutation
  private SET_CACHE_CONFIG (cacheConfig: { [key: string]: ICacheConfigItem }) {
    this.cacheConfig = cacheConfig;
  }

  @Mutation
  private SET_CACHE (cacheData: { [key: string]: any }) {
    this.cacheData = cacheData;
  }

  @Mutation
  public SET_CACHE_LOADED (cacheLoaded: { [key: string]: boolean }) {
    this.cacheLoaded = cacheLoaded;
  }

  @Mutation
  public SET_KEEP_ALIVE_CACHE (cache: any) {
    this.keepAliveCache = cache;
  }

  /**
   * 加载缓存数据
   *
   * @param code 缓存项代码
   */
  @Action({ rawError: true })
  private async loadCache (code: string) {
    if (code) {
      if (this.cacheConfig.hasOwnProperty(code)) {
        const cfg = this.cacheConfig[code];
        const url = Vue.prototype.$app.apiPrefix[cfg.prefix] + cfg.url;
        const { data } = await Vue.prototype.$http.post( url, cfg.param, { waiting_tip: 0 });
        const cacheData: { [key: string]: any } = this.cacheData;
        cacheData[code] = data;
        this.SET_CACHE(cacheData);
        console.log("缓存【%s】获取成功！", code);
      } else {
        console.error("缓存配置中不存在缓存项【%s】的配置，请检查！", code);
      }
    } else {
      console.error("加载缓存失败，缓存代码不可以为空！");
    }
  }

  /**
   * 初始化缓存配置信息
   */
  @Action({ rawError: true })
  public init (config: ICacheConfig) {
    const loaded: {[key: string]: boolean} = {};
    this.SET_CACHE_CONFIG({ ...config.cache });
    for (const cache of Object.values(this.cacheConfig)) {
      loaded[cache.code] = false;
    }
    this.SET_CACHE_LOADED(loaded);
  }

  /**
   * 根据 dictCode 获取字典数据
   *
   * @param dictParam 字典编号、字典类型、字典筛选等
   */
  @Action({ rawError: true })
  public async getDictByCode (dictParam: any) {
    let dict: IAppsDict | IDict = Vue.prototype.$dict.dict;
    if (process.env.VUE_APP_SPA === "qiankun" && Vue.prototype.$app.sysId !== "0") {
      dict = Vue.prototype.$dict.appsDict[Vue.prototype.$app.sysId] || [];
    }

    let dictData: IDictRecord[];
    if (Object.prototype.toString.call(dictParam) === "[object String]") {
      dictData = dict[dictParam] === undefined ? [] : dict[dictParam];
    } else if (Object.prototype.toString.call(dictParam) === "[object Object]") {
      if (dictParam.dictCode && dictParam.dictCode !== "") {
        dictData = dict[dictParam.dictCode] === undefined ? [] : dict[dictParam.dictCode];
      } else {
        throw new Error("Function param `dictCode` is required!");
      }
    }

    if (dictParam.itemType) {
      const paramTypes = dictParam.itemType.split(",");
      let tmpData: IDictRecord[] = [];

      paramTypes.forEach((type: string) => {
        const list = dictData.filter(dict => type && dict.itemType.split(",").includes(type));
        tmpData = [...tmpData, ...list];
      });

      // 去重
      tmpData = [...new Set(tmpData)];

      // 排序
      tmpData.sort((a, b) => a.dictOrd - b.dictOrd);

      dictData = [...tmpData];
    }

    // 增加筛选逻辑
    const getFilterArr = function (str: string, flag: boolean, baseData: any) {
      const finalArr: IDictRecord[] = [];
      const arr = str.split(",");
      for (const dict of baseData) {
        if (flag) {
          if (arr.includes(dict.dictItem)) {
            finalArr.push(dict);
          }
        } else {
          if (!arr.includes(dict.dictItem)) {
            finalArr.push(dict);
          }
        }
      }
      return finalArr;
    };

    if (dictParam.includeCode) {
      const includeData = getFilterArr(dictParam.includeCode, true, dictData);
      dictData = [...includeData];
    }

    if (dictParam.excludeCode) {
      const excludeData = getFilterArr(dictParam.excludeCode, false, dictData);
      dictData = [...excludeData];
    }

    return dictData;
  }

  /**
   * 根据缓存项代码获取缓存数据
   *
   * @param cacheCode 缓存项代码
   */
  @Action({ rawError: true })
  public async getCacheByCode (cacheCode: string) {
    const cacheLoaded: { [key: string]: boolean } = this.cacheLoaded;
    if (!cacheLoaded[cacheCode]) {
      await this.loadCache(cacheCode);
      cacheLoaded[cacheCode] = true;
      this.SET_CACHE_LOADED(cacheLoaded);
    }
    // 解决值传递过程中缓存被更改问题
    return this.cacheData[cacheCode] === undefined ? [] : cloneDeep(this.cacheData[cacheCode]);
  }
}
