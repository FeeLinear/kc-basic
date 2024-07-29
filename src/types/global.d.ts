import { IMenuRecord } from "szkingdom.yf.koca-template/lib/store/modules/menus";

type MICRO_APPS = {
  name: string;
  entry: string;
  container: string;
  prefixPath: string;
  props: object;
}

declare global {
  declare const KOCA_MICRO_APPS: MICRO_APPS[];
  declare const LOAD_FULL_DICT_ROUTE: string[];
  declare function addFragmentRouter(routes: IMenuRecord[]): void;
}
