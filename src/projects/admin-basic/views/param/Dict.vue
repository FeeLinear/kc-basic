<!-- 系统数据字典 -->
<template>
  <div class="DictContain">
    <kui-page
      ref="page1"
      title="$t[dict.xitong_zidian]"
      remote-pagi
      :table-height="tableHeight"
      :query-url="getApiList.queryDictInfoPage"
      :add-url="getApiList.addDictInfo"
      :upd-url="getApiList.updateDictInfo"
      :del-url="getApiList.deleteDictInfo"
      :form-prop="formProp"
      :table-prop="tableProp"
      :dialog-prop="dialogProp"
      :auth="getPermissions"
      @query-callback="queryCallback"
      @row-click="rowClick"
    >
      <template slot="subContent">
        <kui-page
          ref="page2"
          class="subContent"
          title="$t[dict.xitong_zidianxiang]"
          :is-block="false"
          remote-pagi
          :query-url="getApiList.queryDictItemInfoPage"
          :upd-url="getApiList.updateDictItem"
          :del-url="getApiList.delDictItem"
          :auto-query="false"
          :form-prop="formProp2"
          :table-prop="tableProp2"
          :dialog-prop="dialogProp2"
          :trans-add-data="transData"
          :trans-del-data="transData"
          :trans-upd-data="transData"
        ></kui-page>
      </template>
    </kui-page>
    <!-- <div v-if="curRow" style="margin-bottom:16px;font-weight:600;color:#555">
      {{ $t("dict.zidian_daima")+"：" + curRow.dictName +"【"+ curRow.dictCode+"】" }}
    </div>
     -->
  </div>
</template>

<script >
import { getApiList } from "./url.config";
import { PERMISSIONS } from "../../permissions";
export default {
  name: "Dict",
  data() {
    return {
      PERMISSIONS : Object.freeze(PERMISSIONS),
      formProp: {
        "is-test": true,
        "test-suffix": "form",
        labelWidth: 68,
        // 查询项
        items: [
          {
            prop: "dictCode",
            label: "$t[dict.zidian_daima]",
            rules: [{ valid: "length[1,32]" }],
            labelWidth: 80,
          },
          {
            prop: "dictName",
            label: "$t[dict.zidian_mingcheng]",
            rules: [{ valid: "length[1,32]" }],
            labelWidth: 80,
          },
          {
            mold: "select",
            prop: "dictType",
            label: "$t[dict.zidian_leixing]",
            dict: "DICT_TYPE",
            clearable: true,
            labelWidth: 80,
          },
        ],
      },
      tableProp: {
        "is-test": true,
        multipleTable: true,
        // pagiProp: {
        //   layout: "total,sizes,prev,pager,next",
        // },
        // 表单展示项，新增，编辑输入项。
        items: [
          {
            prop: "dictCode",
            label: "$t[dict.zidian_daima]",
            sortable: true,
            minWidth: 150,
            editFlag: "1",
            required: true,
            rules: [{ valid: "length[1,32]" }],
            inputWidth: 435,
          },
          {
            prop: "dictName",
            label: "$t[dict.zidian_mingcheng]",
            minWidth: 150,
            required: true,
            rules: { valid: "length[1,32]" },
            inputWidth: 435,
          },
          {
            mold: "select",
            prop: "dictType",
            label: "$t[dict.zidian_leixing]",
            required: true,
            sortable: true,
            dict: "DICT_TYPE",
            minWidth: 120,
          },
          {
            mold: "select",
            prop: "maintainFlag",
            label: "$t[dict.weihu_biaozhi]",
            wrap: true,
            sortable: true,
            required: true,
            loadFilter: "1,2,3,@",
            dict: "MAINTAIN_FLAG",
            minWidth: 120,
          },
          {
            prop: "remark",
            label: "$t[dict.beizhu_xinxi]",
            minWidth: 200,
            mold: "textarea",
            inputWidth: 435,
            maxlength: 128,
            showWordLimit: true,
            rules: { valid: "length[1,128]" },
          },
          {
            type: "button",
            fixed: "right",
            minWidth: 120,
            // btnFilter: this.btnFilter
          },
        ],
      },
      dialogProp: {
        "is-test": true,
        width: 750,
        // 新增 默认值
        addDefault: {
          dictType: "0",
          maintainFlag: "@",
        },
      },
      formProp2: {
        "is-test": true,
        "test-suffix": "form",
        labelWidth: 90,
        "enable-enter-search":true,
        // 查询项
        items: [
          {
            prop: "dictCode",
            label: "$t[dict.zidian_daima]",
            required: true,
            disabled: true,
            visible: false,
          },
          {
            prop: "dictItemName",
            label: "$t[dict.zidian_xiang]",
            rules: [{ valid: "length[1,32]" }],
            labelWidth: 90,
            itemWidth: 270,
            visible: false,
          },
          {
            prop: "dictItem",
            // label: "$t[dict.zidian_xiang_mingcheng]",
            size:"mini",
            rules: [{ valid: "length[1,32]" }],
            labelWidth: 90,
            itemWidth: 198,
            height:28,
            placeholder:"$t[dict.zidian_xiang_huo_zidian_xiang_mingcheng]",
            keyup:this.handleInput
          },
        ],
        btns: [
          {
            key: "query",
            type: "text",
            icon: "kui-icon-search",
            text: "",
          },
        ],
      },
      tableProp2: {
        "is-test": true,
        // 表单展示项，新增，编辑输入项。
        items: [
          {
            prop: "dictItem",
            label: "$t[dict.zidian_xiang]",
            minWidth: 120,
            editFlag: "1",
            required: true,
            sortable: true,
            rules: [{ valid: "length[1,32]" }],
            inputWidth: 425,
          },
          {
            prop: "dictItemName",
            label: "$t[dict.zidian_xiang_mingcheng]",
            minWidth: 140,
            required: true,
            rules: { valid: "length[1,32]" },
            inputWidth: 425,
          },
          {
            mold: "number",
            prop: "dictOrd",
            label: "$t[dict.shun_xu]",
            minWidth: 120,
            min: 0,
            // 后端限制八位整数
            max: 99999,
            precision: 0,
            required: true,
            sortable: true,
          },
          {
            prop: "remark",
            label: "$t[dict.beizhu_xinxi]",
            mold: "textarea",
            minWidth: 120,
            inputWidth: 425,
            maxlength: 128,
            showWordLimit: true,
            rules: { valid: "length[1,128]" },
          },
          {
            type: "button",
            fixed: "right",
            minWidth: 120,
            btnFilter: this.btnFilter,
          },
        ],
        btns: [
          {
            key: "itemadd",
            type: "text",
            icon: "kui-icon-plus-circle",
            size: "mini",
            text: "$t[dict.xinzeng_zidianxiang]",
            auth: PERMISSIONS["Dict:itemadd"],
            click:this.addDictItem
          },
        ],
        showPagi: true,
        size: "mini",
      },
      dialogProp2: {
        "is-test": true,
        labelWidth: 95,
        width: 750
      },
      curRow: null,
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
        query: PERMISSIONS["Dict:query"],
        add: PERMISSIONS["Dict:add"],
        update: PERMISSIONS["Dict:update"],
        delete:PERMISSIONS["Dict:delete"]
      };
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tablePage2 = this.$refs.page2.tablePage;
      this.formPage2 = this.$refs.page2.formPage;
      this.btnGrp2 = this.tablePage2.btnGrpEl;
      this.btnGrp2.disabledBtns("add");
    });
  },
  methods: {
    addDictItem(){
      const { dialogPage, dialogProp, addType } = this.$refs.page2;
      dialogPage.showAddDialog((data) => {
        dialogProp.loading = true;
        this.transData(data);
        this.$http[addType](this.getApiList.addDictItem, data)
          .then((res) => {
            dialogProp.loading = false;
            this.$message.success(this.$t("dict.zidian_xiang_tianjia_chenggong"));
            dialogPage.hideDialog();
            this.$refs.page2.queryPage();
          })
          .catch((err) => {
            dialogProp.loading = false;
          });
      });
    },
    handleInput(){
      this.$refs.page2.queryPage();
    },
    btnFilter(row, btn) {
      if (!this.curRow.maintainFlag || this.curRow.maintainFlag === "@") {
        return true;
      }
      if (btn.key === "update") {
        return this.curRow.maintainFlag === "1";
      }
      if (btn.key === "delete") {
        return this.curRow.maintainFlag === "2";
      }
      return true;
    },
    rowClick(row, column, event) {
      this.curRow = row;
      this.formProp2.model.dictCode = row.dictCode;
      this.$refs.page2.queryPage();
      if (
        !this.curRow.maintainFlag ||
        this.curRow.maintainFlag === "@" ||
        this.curRow.maintainFlag === "3"
      ) {
        this.btnGrp2.enabledBtns("add");
      } else {
        this.btnGrp2.disabledBtns("add");
      }
    },
    queryCallback(data) {
      this.curRow = null;
      this.formProp2.model.dictCode = "";
      this.btnGrp2.disabledBtns("add");
      this.tablePage2.clearData();
      this.$refs.page1.tableEl.$refs.table.setCurrentRow(data[0]);
      this.rowClick(data[0]);
    },
    transData(data) {
      if (data.dictItem.trim() === "") {
        this.$message.warning(this.$t("dict.warning1"));
        return false;
      }
      data.dictCode = this.curRow.dictCode;
    },
  },
};
</script>
<style lang="scss">
.DictContain {
  .page-btns {
    margin-bottom: 10px;
  }
  .page-pagi {
    margin-top: 15px;
  }
  .sub-table-wrapper{
    padding: 0px 0px 16px 16px !important;
  }
}
.subContent{
  position: relative;
  .kui-header{
    position: absolute;
    right: 0;
    margin: 0;
    z-index: 1;
    .el-form-item{
      margin-right: 0px;
    }
    .el-input{
      width: 198px !important;
    }
    .el-input__suffix {
      right: 32px !important;
    }
  }
  .form-left{
    margin-right: 0px !important;
    text-align: right;
    .kui-form.el-form--inline {
      margin: 0 auto;
    }
    .kui-form--tight.el-form--inline .el-form-item{
      margin-bottom: 12px;
      margin-top: 12px;
    }
    .kui-form--easy.el-form--inline .el-form-item {
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
  .form-right{
    position: absolute;
    right: 10px;
    height: 100%;
    align-items: center !important;
    .el-button--text{
      color: #8E9095;
      padding: 7px 0px 7px 0;
    }
    .el-button-mini{
      padding: 7px 0px;
    }
  }
  .kui-table-btns{
    margin: 10px 0px !important;
    height: 32px;
    .kui-button{
      color: #111111;
      & > i{
        color: $--color-primary;
      }
    }
  }
}
</style>
