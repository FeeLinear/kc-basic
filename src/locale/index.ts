// 业务的国际化配置
import { LocaleMessages } from "vue-i18n";

import zhCHLocale from "./lang/zh-CN";
import enUSLocale from "./lang/en-US";

export const messages: LocaleMessages = {
  "zh-CN": {
    ...zhCHLocale,
  },
  "en-US": {
    ...enUSLocale,
  }
};
