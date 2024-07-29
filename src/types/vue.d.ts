/*
 * <p>文件名称: ${file_name}</p>
 * <p>项目描述: KOCA 金证云原生平台 V1.0.0</p>
 * <p>公司名称: 深圳市金证科技股份有限公司</p>
 * <p>版权所有: 版权所有(C)2019-2020</p>
 */
// 1. Make sure to import 'vue' before declaring augmented types
import { CacheHubModule } from "@/store/CacheHub";
import { BroadcastClass } from "szkingdom.yf.koca-template/lib/http/broadcast";
import { AxiosClass } from "szkingdom.yf.koca-template/lib/http/request";
import { AppModule } from "szkingdom.yf.koca-template/lib/store/modules/app";
import { CacheModule } from "szkingdom.yf.koca-template/lib/store/modules/cache";
import { DictModule } from "szkingdom.yf.koca-template/lib/store/modules/dict";
import { MenusModule } from "szkingdom.yf.koca-template/lib/store/modules/menus";
import { PermissionModule } from "szkingdom.yf.koca-template/lib/store/modules/permission";
import { UserModule } from "szkingdom.yf.koca-template/lib/store/modules/user";
import theme from "szkingdom.yf.koca-template/lib/utils/theme";
import VueI18n from "vue-i18n";
import VueRouter, { Route } from "vue-router";


interface I18nTypes {
  (key: string, values?: VueI18n.Values): VueI18n.TranslateResult;
  (key: string, locale: string, values?: VueI18n.Values): VueI18n.TranslateResult;
}

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    $http: AxiosClass;
    $broadcast: BroadcastClass;
    $app: AppModule;
    $user: UserModule;
    $dict: DictModule;
    $menus: MenusModule;
    $cache: CacheModule;
    $cacheHub: CacheHubModule;
    $permission: PermissionModule;
    $route: Route;
    $t: I18nTypes;
    $router: VueRouter;
    $changeTheme: theme;
    _locale: Function;
  }
}
