<!-- 系统参数管理 -->
<template>
  <kui-page
    ref="page"
    title="$t[param.xitong_canshu]"
    :table-height="tableHeight"
    :query-url="getApiList.queryParamInfoPage"
    :add-url="getApiList.addParamInfo"
    :upd-url="getApiList.updateParamInfo"
    remote-pagi
    :form-prop="formProp"
    :table-prop="tableProp"
    :dialog-prop="dialogProp"
    :auth="getPermissions"
  ></kui-page>
</template>
<script >
import { getApiList } from "./url.config";
import { PERMISSIONS } from "../../permissions";
export default {
  name: "Param",
  data () {
    return {
      PERMISSIONS : Object.freeze(PERMISSIONS),
      formProp: {
        "is-test": true,
        "test-suffix": "form",
        labelWidth: 68,
        // 查询项
        items: [
          {
            prop: "parCode",
            label: "$t[param.canshu_daima]",
            rules: { valid: "length[1,32]" },
            labelWidth: 70
          },
          {
            prop: "parName",
            label: "$t[param.canshu_mingcheng]",
            rules: { valid: "length[1,64]" },
            labelWidth: 70
          },
          {
            mold: "select",
            prop: "parType",
            clearable: true,
            label: "$t[param.canshu_leixing]",
            dict: "PAR_TYPE",
            labelWidth: 70
          },
          {
            mold: "select",
            prop: "parTypeSub",
            label: "$t[param.canshu_xiaolei]",
            clearable: true,
            dict: "PAR_TYPE_SUB",
            labelWidth: 70
          }
        ],
      },
      tableProp: {
        "is-test": true,
        // 表单展示项，新增，编辑输入项。
        items: [
          {
            prop: "parCode",
            label: "$t[param.canshu_daima]",
            sortable: true,
            minWidth: 150,
            required: true,
            editFlag: "1",
            // maxlength: 32,
            rules: { valid: "numEn_[1,32]" },
            labelWidth: 100,
            inputWidth: 435,
          },
          {
            prop: "parName",
            label: "$t[param.canshu_mingcheng]",
            minWidth: 150,
            required: true,
            rules: { valid: "length[1,64]" },
            labelWidth: 100,
            inputWidth: 435,
          },
          {
            prop: "parVal",
            label: "$t[param.canshu_zhi]",
            required: true,
            rules: { valid: "length[1,64]" },
            labelWidth: 100,
            inputWidth: 435,
          },
          {
            prop: "parType",
            label: "$t[param.canshu_leixing]",
            sortable: true,
            dict: "PAR_TYPE",
            mold: "select",
            required: true,
            labelWidth: 100,
            itemWidth: "100%",
            minWidth: 130,
          },
          {
            prop: "parTypeSub",
            label: "$t[param.canshu_xiaolei]",
            dict: "PAR_TYPE_SUB",
            mold: "select",
            wrap: true,
            minWidth: 100,
            itemWidth: "100%",
            labelWidth: 100,
            required: true,
          },
          {
            prop: "maintainFlag",
            label: "$t[param.weihu_biaozhi]",
            dict: "MAINTAIN_FLAG",
            mold: "select",
            required: true,
            sortable: true,
            wrap: true,
            minWidth: 120,
            itemWidth: "100%",
            labelWidth: 100,
            loadFilter: "1,0"
          },
          {
            prop: "remark",
            label: "$t[param.beizhu_xinxi]",
            minWidth: 190,
            mold: "textarea",
            labelWidth: 100,
            inputWidth: 435,
            maxlength: 64,
            showWordLimit: true,
            rules: { valid: "length[1,64]" },
          },
          {
            type: "button",
            btnFilter: this.btnFilter
          }
        ],
      },
      dialogProp: {
        "is-test": true,
        width: 750,
        // 新增 默认值
        addDefault: {
          parType: "0",
          parTypeSub: "0",
          maintainFlag: "1",
        },
      },
    };
  },
  computed: {
    tableHeight(){
      return this.$app.screen.CRUD_tableHeight;
    },
    getApiList() {
      return getApiList(this);
    },
    getPermissions(){
      return {
        query: PERMISSIONS["Param:query"],
        add: PERMISSIONS["Param:add"],
        update: PERMISSIONS["Param:update"],
      };
    }
  },
  methods: {
    // 控制行编辑按钮是否限制
    btnFilter (row, btn) {
      let flag = true;
      if (btn.key === "update") {
        flag = row.maintainFlag !== "0";
      }
      return flag;
    },
  }
};
</script>
