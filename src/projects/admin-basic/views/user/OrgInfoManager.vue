<template>
  <kui-layout
    v-resize="resize"
    class="org-info-manager"
    is-block
    :height="bodyHeight"
    aside-width="232"
    main-not-block
  >
    <div slot="aside">
      <div class="aside-header">
        <div style="font-size:16px;font-weight:bold">{{ $t("org.ji_gou") }}</div>
        <div>
          <kui-button
            type="text"
            text="$t[org.daoru]"
            test-id="reset"
            :is-test="true"
            :auth="PERMISSIONS['OrgInfoMananger:import']"
            @click="showImportDialog"
          ></kui-button>
          <kui-popover
            v-model="allVisible"
            placement="top"
            width="260"
            style="margin-left:10px;text-align:start"
          >
            <div slot="content">
              <div style="padding-top:10px">
                <div class="exportHeader">
                  <div style="text-align:start; margin-bottom: 5px">{{ this.$t("org.xuanzhe_daochu_geshi") }}</div>
                  <kui-radio v-model="allExportType" :opts="exportOpts"></kui-radio>
                </div>
                <div style="text-align: right; margin-top: 5px">
                  <kui-button
                    size="mini"
                    type="text"
                    :is-test="true"
                    test-id="exportCancel"
                    @click="allVisible = false"
                  >{{ this.$t("org.qu_xiao") }}</kui-button>
                  <kui-button
                    type="text"
                    size="mini"
                    :is-test="true"
                    test-id="exportOrg"
                    @click="exportOrginfo"
                  >{{ this.$t("org.que_ren") }}</kui-button>
                </div>
              </div>
            </div>
            <kui-button
              slot="reference"
              type="text"
              text="$t[org.daochu]"
              test-id="export"
              :is-test="true"
              :auth="PERMISSIONS['OrgInfoMananger:export']"
            ></kui-button>
          </kui-popover>
        </div>
      </div>
      <div class="aside-content">
        <kui-input
          v-model="filterVal"
          width="208"
          style="padding-left:8px"
          placeholder="$t[org.shuru_guanjianzi_guolv]"
          suffix-icon="el-icon-search"
          :is-test="true"
        ></kui-input>
        <kui-tree
          ref="tree"
          class="org-manager-tree"
          style="margin-top:8px;"
          :loading="loading"
          :data="data"
          :height="treeHeight"
          :label-width="160"
          :width="225"
          value-key="orgCode"
          label-key="orgName"
          :expand="1"
          icon="kui-icon-office-building"
          :is-test="true"
          test-id="tree"
          @node-click="orgClick"
        >
          <template #btns="{ node }">
            <div>
              <kui-tooltip effect="dark" :content="tooltip2">
                <kui-button
                  icon="kui-icon-plus"
                  type="text"
                  :is-test="true"
                  test-id="addSon"
                  style="padding:0 16px"
                  @click="addSonOrg(node.data)"
                ></kui-button>
              </kui-tooltip>
            </div>
          </template>
        </kui-tree>
      </div>
    </div>
      <kui-field :title="fieldTitle" is-block height="100%" style="overflow: auto" :loading="formLoading">
        <kui-button
          slot="title-right"
          class="view-btn"
          type="text"
          icon="kui-icon-group"
          text="$t[org.chakan_jigou_renyuan]"
          :auth="PERMISSIONS['OrgInfoMananger:user']"
          :is-test="true"
          test-id="user"
          @click="showOrgUser"
        />
        <kui-form
          ref="form"
          :model="model"
          :items="items"
          :label-width="95"
          :col-num="2"
          :is-test="true"
        ></kui-form>
        <template #bottom>
        <kui-button
          v-if="!showEditBtn"
          key="back"
          :type="null"
          text="$t[org.qu_xiao]"
          :is-test="true"
          test-id="back"
          @click="returnOrgInfo"
        />
        <kui-button
          v-if="showEditBtn"
          key="edit"
          icon="kui-icon-edit"
          text="$t[org.bian_ji]"
          :auth="PERMISSIONS['OrgInfoMananger:update']"
          :is-test="true"
          test-id="edit"
          @click="goOrgEdit"
        />
        <kui-button
          v-if="!showEditBtn"
          key="collection"
          text="$t[org.bao_cun]"
          :is-test="true"
          test-id="collection"
          @click="saveOrgInfo"
        />
      </template>
      </kui-field>
    <kui-drawer
      ref="drawer"
      size="600"
      :visible.sync="visible"
      :title="title"
      btn-close-test-id="close-drawer"
    >
      <kui-page
        ref="page1"
        title="$t[org.jigou_renyuan_xinxi]"
        :is-block="false"
        :query-url="queryOrgUserInfo"
        :del-url="saveOrgUserInfo"
        :add-url="saveOrgUserInfo"
        delete-key="userNo"
        :trans-query-data="transQueryData"
        :trans-add-data="transAddData"
        :trans-del-data="transDelData"
        :form-prop="formProp"
        :table-prop="tableProp"
        :dialog-prop="dialogProp"
      ></kui-page>
    </kui-drawer>
    <kui-dialog
      width="468"
      :visible.sync="importDialogVisible"
      :title="importDialogTitle"
      :show-cancel-btn="false"
      :show-ok-btn="false"
      :before-close="cancleImportDialogOkCallback"
      :ok-callback="importDialogOkCallback"
      :cancel-callback="cancleImportDialogOkCallback"
      :btns="importDialogBtns"
    >
      <div style="position:relative">
        <kui-loading :visible="importDialogLoading" :text="importDialogText"></kui-loading>
        <kui-upload-pro
          ref="orgInfoImport"
          :action="orgInfoImportAction"
          :file-list="fileList"
          :headers="importHeaders"
          template-id="org-import"
          width="100%"
          :auto-upload="false"
          :is-reconnect="false"
          :on-success="orgInfoImportSuccess"
          :on-error="orgInfoImportError"
          :before-upload="orgInfoImportBeforeUpload"
          :on-change="orgInfoImportChange"
        >
          <div slot="trigger">
            <kui-button size="small" type="primary" icon="kui-icon-files" :stop-click="false">{{ this.$t("org.xuanze_wenjian") }}</kui-button>
            <!-- <kui-tooltip effect="dark" :content="tooltip1" placement="right">
              <kui-button-group
                v-if="questionBtn"
                ref="btnGroup1"
                :style="{
                  display:'inline',
                  marginLeft: '10px'
                }"
                :btns="questionBtn"
              ></kui-button-group>
            </kui-tooltip> -->
          </div>
        </kui-upload-pro>
        <div class="upload-tips file" v-text="tooltip1"></div>
      </div>
      <kui-popover
        v-model="templatePopoverVisible"
        placement="top"
        width="260"
        style="margin-left:10px;text-align:start"
      >
        <div slot="content">
          <div style="padding-top:10px">
            <div class="exportHeader">
              <div style="text-align:start; margin-bottom: 5px">{{ this.$t("org.xuanzhe_wenjian_geshi") }}</div>
              <kui-radio v-model="templateType" :opts="templateTypeOpts"></kui-radio>
            </div>
            <div style="text-align: right; margin-top: 5px">
              <kui-button
                type="text"
                size="mini"
                @click="templateDownload"
              >{{ this.$t("org.que_ren") }}</kui-button>
              <kui-button
                size="mini"
                type="text"
                @click="templatePopoverVisible = false"
              >{{ this.$t("org.qu_xiao") }}</kui-button>
            </div>
          </div>
        </div>
        <kui-button
          slot="reference"
          class="download-template-btn"
          text="$t[org.xiazai_muban]"
          type="text"
        ></kui-button>
      </kui-popover>
    </kui-dialog>
  </kui-layout>
</template>
<script >
import { cloneDeep } from "lodash-es";
import { calcEleFitHeight } from "szkingdom.yf.koca-template/lib/utils/dom";
import { isEqual } from "szkingdom.yf.koca-template/lib/utils/utils";
import { getApiList } from "./url.config";
import { PERMISSIONS } from "../../permissions";
import { getLocalStorage, removeLocalStorage } from "szkingdom.yf.koca-template/lib/utils/cache";
export default {
  name: "OrgInfoManager",
  data () {
    return {
      PERMISSIONS : Object.freeze(PERMISSIONS),
      fileList: [],
      templatePopoverVisible: false,
      templateType: "xlsx",
      templateTypeOpts: [{
        value: "xlsx", label: "xlsx"
      }, {
        value: "txt", label: "txt"
      }],
      allExportType: "xlsx",
      exportOpts: [{
        value: "xlsx", label: "xlsx"
      }, {
        value: "txt", label: "txt"
      }],
      tooltip1: this.$t("org.tooltip1"),
      tooltip2:this.$t("org.tianjia_zijigou"),
      allVisible: false,
      importDialogVisible: false,
      importDialogTitle: "$t[org.daoru_jigou_xinxi]",
      questionBtn: [
        {
          key: "question",
          text: "",
          type: "text",
          color: "#ccc",
          size: "medium",
          icon: "kui-icon-question",
        }
      ],
      title: "$t[org.jigou_renyuan_xinxi]",
      queryOrgUserInfo: "",
      saveOrgUserInfo: "",
      visible: false,
      formProp: {
        "is-test": true,
        "test-suffix": "form",
        items: [
          {
            prop: "userNo",
            label: "$t[org.renyuan_bianhao]",
            rules: { valid: "length[1,8]" },
          },
        ]
      },
      tableProp: {
        "is-test": true,
        showPagi: false,
        showSmallPagi: false,
        btns: [
          {
            key: "add",
            text: "$t[kui.form.add]",
            icon: "kui-icon-plus",
            click: this.addOrgUser,
          }
        ],
        items: [
          {
            prop: "orgCode",
            label: "$t[org.jigou_daima]",
            editFlag: "4",
          },
          {
            mold: "auto",
            prop: "userNo",
            label: "$t[org.renyuan_bianhao]",
            itemWidth: "100%",
            inputWidth: "400",
            minWidth: 120,
            sortable: true,
            required: true,
            // queryUrl: ApiList.queryUserInfoSimple,
            // queryKey: "searchStr",
            // filterable: true,
            valueKey: "userNo",
            labelKey: ["userNo", "userName"],
            placeholder: "$t[org.renyuan_bianhao_tishi]",
            fetchSuggestions: this.fetchSuggestions,
            rules: { required: true, trigger: ["blur", "change"] }
          },
          {
            prop: "userName",
            label: "$t[org.renyuan_xingming]",
            editFlag: "4",
          },
        ]
      },
      dialogProp: {
        "is-test": true,
      },
      filterVal: "",
      treeHeight: 430,
      loading: false,
      formLoading: false,
      data: [],
      fieldTitle: "$t[org.zengjia_jigou_xinxi]",
      model: {
        orgCode: "",
        orgStatus: "0",
        orgType: "0",
        parentOrg: "",
        orgName: "",
        orgFullName: "",
        address: "",
        zipCode: "",
        tel: "",
        remark: "",
      },
      items: [
        {
          prop: "orgCode",
          label: "$t[org.jigou_daima]",
          required: true,
          rules: { valid: "num[1,8]" },
        },
        {
          mold: "select",
          prop: "orgStatus",
          label: "$t[org.jigou_zhuangtai]",
          required: true,
          dict: "ORG_STATUS",
        },
        {
          mold: "select",
          prop: "orgType",
          label: "$t[org.jigou_leixing]",
          required: true,
          dict: "ORG_TYPE",
        },
        {
          mold: "input",
          prop: "parentOrg",
          label: "$t[org.shangji_jigou]",
          disabled: true,
        },
        {
          prop: "orgName",
          label: "$t[org.jigou_mingcheng]",
          rules: [{ valid: "chEnNum[1,32]" }],
          required: true,
          width: 435,
          colspan: 2,
        },
        {
          prop: "orgFullName",
          label: "$t[org.jigou_quancheng]",
          rules: [{ valid: "chEnNum[1,64]" }],
          required: true,
          width: 435,
          colspan: 2,
        },
        {
          prop: "address",
          label: "$t[org.di_zhi]",
          rules: [{ valid: "chEnNum[1,64]" }],
          width: 435,
          colspan: 2,
        },
        {
          prop: "zipCode",
          label: "$t[org.you_bian]",
          rules: { valid: "num[6,6]" },
        },
        {
          prop: "tel",
          label: "$t[org.dian_hua]",
          rules: { valid: "length[0,16]" },
        },
        {
          mold: "textarea",
          prop: "remark",
          label: "$t[org.beizhu_xinxi]",
          width: 445,
          colspan: 2,
          maxlength: 64,
          // showWordLimit: true,
          rules: { valid: "length[1,64]" },
        },
      ],
      editFlag: false,
      curNode: null,
      showEditBtn: true,
      importDialogLoading: false,
      importDialogText: this.$t("org.daoruzhong") + "...",
      importDialogBtns: [
        {
          key: "cancle",
          text: "$t[org.qu_xiao]",
          type: null,
          click: this.cancleImportDialogOkCallback
        },
        {
          key: "import",
          text: "$t[org.daoru]",
          click: this.importDialogOkCallback
        },
      ],
      orgInfoImportAction: "",
      importHeaders: {},
    };
  },
  computed: {
    getApiList() {
      return getApiList(this);
    },
    bodyHeight(){
      return this.$app.screen.contentHeight;
    }
  },
  watch: {
    "filterVal" (val) {
      this.$refs.tree.filter(val);
    }
  },
  created () {
    this.queryOrgUserInfo = this.getApiList.queryOrgUserInfo;
    this.saveOrgUserInfo = this.getApiList.saveOrgUserInfo;
    const apiUrl = this.getBaseUrl(this.$app.apiUrl)  || "";
    this.orgInfoImportAction = (apiUrl + (this.$app.apiPrefix.USER_URL_PREFIX || "")) + "import";
    this.originalModel = cloneDeep(this.model);
  },
  mounted: function () {
    this.$nextTick(() => {
      this.queryOrgTree();
      this.resize();
    });
  },
  methods: {
    templateDownload (){
      this.templatePopoverVisible = false;
      this.$http.post(this.getApiList.templateDownload, { "displayName": "org_template." + this.templateType },{ downloadFile: true }).then((res) => {
      });
    },
    getBaseUrl (url) {
      if (url !== "") {
        if (url.substring(0, 1) === "/") {
          url = url.substring(1);
        }
        if (url.substring(url.length - 1) !== "/") {
          url = url + "/";
        }
      }
      return url;
    },
    fetchSuggestions (queryString, callback) {
      this.$http["post"](this.getApiList.queryUserInfoSimple, { searchStr: "", pageNum: 0, pageSize: 0 }).then((res) => {
        callback(res.data);
      });
    },
    importDialogOkCallback () {
      if (typeof this.$refs.orgInfoImport.submit === "function") {
        this.$refs.orgInfoImport.submit();
      } else {
        this.$refs.orgInfoImport.$refs.upload.$refs.upload.submit();
      }
    },
    orgInfoImportChange (file, fileList) {
      let isReady = false;
      for (let i = 0; i < fileList.length; i++) {
        const item = fileList[i];
        let isSplice = false;
        if (item.name.split(".").length) {
          const fileSuffix = item.name.split(".")[(item.name.split(".").length - 1)];
          const prohibitArr = ["txt", "xlsx", "xls"];
          if (prohibitArr.indexOf(fileSuffix.toLowerCase()) === -1) {
            this.$message.info(this.$t("org.wenjian_leix_bupipei"));
            fileList.splice(i, 1);
            isSplice = true;
          }
        } else {
          fileList.splice(i, 1);
          isSplice = true;
        }
        if (item.size >=  (30 * 1024 * 1024) && !isSplice) {
          this.$message.info(this.$t("org.chaoguo_wenjian_daxiao_xianzhi") + "(30M)");
          fileList.splice(i, 1);
        } else {
          if (item.status === "ready") {
            this.importDialogBtns[1].disabled = false;
            this.$refs.orgInfoImport.message = 0;
            isReady = true;
          }
        }
      }
      if (!isReady) {
        this.importDialogBtns[1].disabled = true;
      }
    },
    orgInfoImportBeforeUpload () {
      this.importDialogBtns[1].text = this.$t("org.daoruzhong");
      this.importDialogBtns[1].disabled = true;
      this.importDialogLoading = true;
    },
    orgInfoImportSuccess (param) {
      this.$message.info(param.msg);
      this.importDialogBtns[1].text = this.$t("org.daoru");
      this.importDialogBtns[1].disabled = false;
      this.importDialogLoading = false;
    },
    orgInfoImportError () {
      this.$message.error(this.$t("org.jigou_shuju_daoru_shibai"));
      this.importDialogBtns[1].text = this.$t("org.daoru");
      this.importDialogBtns[1].disabled = false;
      this.importDialogLoading = false;
    },
    cancleImportDialogOkCallback () {
      this.$refs.orgInfoImport.fileList = [];
      if (typeof this.$refs.orgInfoImport.clearFiles === "function") {
        this.$refs.orgInfoImport.clearFiles();
      } else {
        this.$refs.orgInfoImport.$refs.upload.$refs.upload.clearFiles();
      }
      this.$refs.orgInfoImport.message = 0;
      this.importDialogVisible = false;
      this.importDialogBtns[1].text = this.$t("org.daoru");
      this.importDialogBtns[1].disabled = false;
      this.importDialogLoading = false;
      this.queryOrgTree();
    },
    showImportDialog () {
      if (this.$app.appSettings.JWT_TOKEN_ENABLE) {
        if (getLocalStorage("token", false) !== null && getLocalStorage("token", false) !== "") {
          this.importHeaders ={
            Lang: getLocalStorage("language") || "zh-CN",
            Authorization: "Bearer " + (getLocalStorage("token") || "")
          };
        }
      } else {
        removeLocalStorage("token");
        this.importHeaders = { 
          Lang: getLocalStorage("language") || "zh-CN"
        };
      }
      this.importDialogVisible = true;

    },
    exportOrginfo () {
      this.$http["post"](this.getApiList.basicExport, {
        bexRequestParam: {
          "serviceName": "",
          "apiUrl": "/api/queryOrgInfoList",
          "param": {}
        },
        "data": [],
        "fileType": this.allExportType,
        "columnInfos": [{ "propertyName": "orgCode", "displayName": "机构编号" },
          { "propertyName": "orgStatus", "displayName": "机构状态" },
          { "propertyName": "orgType", "displayName": "机构类型" },
          { "propertyName": "parentOrg", "displayName": "上级机构" },
          { "propertyName": "orgName", "displayName": "机构名称" },
          { "propertyName": "orgFullName", "displayName": "机构全称" },
          { "propertyName": "address", "displayName": "地址" },
          { "propertyName": "zipCode", "displayName": "邮编" },
          { "propertyName": "tel", "displayName": "电话" },
          { "propertyName": "remark", "displayName": "备注" }
        ]
      }, { downloadFile: true }).then((res) => {
        if (res.response.status === 200) {
          this.$message.success(this.$t("org.jigou_shuju_daochu_chenggong"));
        }
      });
    },
    addOrgUser () {
      this.$refs.page1.dialogPage.showAddDialog((data) => {
        typeof this.$refs.page1.transAddData === "function" && this.$refs.page1.transAddData(data);
        this.$refs.page1.dialogProp.loading = true;
        // 添加判断
        // 人员信息查询
        this.$http["post"](this.getApiList.queryUserInfoSimple, { searchStr: data.userNo }).then((res) => {
          let flag = false;
          res.data.forEach(element => {
            if (element.userNo === data.userNo) {
              flag = true;
            }
          });
          // 人员存在
          if (flag) {
            this.$http[this.$refs.page1.addType](this.$refs.page1.addUrl, data).then((res) => {
              this.$refs.page1.dialogProp.loading = false;
              this.$message.success(this._locale("$t[kui.page.add.success]", { key: this.$refs.page1._title }));
              this.$refs.page1.dialogPage.hideDialog();
              this.$refs.page1.dialogPage.$refs.form.clearValidate();
              this.$refs.page1.dialogPage.$refs.form.clearFields();
              this.$refs.page1.formQueryPage();
            }).catch(() => {
              this.$refs.page1.dialogProp.loading = false;
            });
          } else {
            // 人员不存在
            this.$message.error(this.$t("org.renyuan_bucunzai"));
            this.$refs.page1.dialogProp.loading = false;
          }
        }).catch(() => {
          this.$refs.page1.dialogProp.loading = false;
        });
      }, (data) => {
        this.$refs.page1.dialogProp.loading = false;
        this.$refs.page1.dialogPage.hideDialog();
        this.$refs.page1.dialogPage.$refs.form.clearValidate();
        this.$refs.page1.dialogPage.$refs.form.clearFields();
      });
    },
    addSonOrg (data) {
      this.editFlag = false;
      this.showEditBtn = false;
      this.fieldTitle = `$t[org.ji_gou]【${data.orgName}】-$t[org.tianjia_zijigou]`;
      this.$refs.form.resetFields();
      this.$refs.form.enabledFields(
        ["orgCode", "orgStatus", "orgType", "orgName",
          "orgFullName", "address", "zipCode", "tel", "remark"]);
      this.model.parentOrg = data.orgCode;
    },
    saveOrgInfo () {
      const url = this.editFlag ? this.getApiList.updateOrgInfo : this.getApiList.addOrgInfo;
      if (!isEqual(this.model, this.curNode)) {
        this.$refs.form.valid(() => {
          this.$http.post(
            url,
            this.model
          ).then(res => {
            this.$message.success(this.$t("org.shuju_baocun_chenggong"));
            this.queryOrgTree(this.model.orgCode);
          });
        });
      } else {
        this.$message.warning(this.$t("org.shuju_meiyou_xiugai"));
      }
    },
    returnOrgInfo () {
      this.showOrgInfo(this.curNode);
    },
    goOrgEdit () {
      this.editFlag = true;
      this.showEditBtn = false;
      this.fieldTitle = `$t[org.ji_gou]【${this.curNode.orgName}】$t[org.xin_xi]-$t[org.xiu_gai]`;
      this.$refs.form.enabledFields(
        ["orgStatus", "orgType", "orgName",
          "orgFullName", "address", "zipCode", "tel", "remark"]);
    },
    queryOrgTree (orgCode) {
      this.filterVal = "";
      this.loading = true;
      return this.$http.post(
        this.getApiList.queryOrgTreeUrl,
        {}
      ).then(res => {
        this.loading = false;
        if (Array.isArray(res.data)) {
          const curOrgCode = orgCode || res.data[0].orgCode;
          this.data = res.data;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(curOrgCode);
            this.curNode = this.$refs.tree.getCurrentData();
            this.showOrgInfo(this.curNode);
          });
        }
      });
    },
    orgClick (data) {
      this.curNode = data;
      this.showOrgInfo(data);
    },
    showOrgInfo (data) {
      if (data.orgCode) {
        this.$refs.form.clearValidate();
        this.formLoading = true;
        this.$http.post(this.getApiList.queryOrgDetail,  { orgCode: data.orgCode }).then((res) => {
          const re = cloneDeep(res.data);
          this.model = Object.assign(cloneDeep(this.originalModel), re);
          this.formLoading = false;
          this.fieldTitle = `$t[org.ji_gou]【${data.orgName}】$t[org.xin_xi]`;
          this.$refs.form.disabledFields();
          this.showEditBtn = true;
        });
      }
    },
    showOrgUser () {
      this.visible = true;

      this.title = `$t[org.ji_gou]【${this.curNode.orgName}】$t[org.renyuan_xinxi]`;
      this.$nextTick(() => {
        if (this.$refs.page1.formEl) {
          this.$refs.page1.formEl.resetFields();
          this.$refs.page1.formQueryPage(1);
        }
      });
    },
    transQueryData (data) {
      data.orgCode = this.curNode.orgCode;
    },
    transAddData (data) {
      data.orgCode = this.curNode.orgCode;
      data.userNos = [{ userNo: data.userNo, action: "A" }];
    },
    transDelData (data) {
      data.orgCode = this.curNode.orgCode;
      data.userNos = [{ userNo: data.userNo, action: "D" }];
    },
    resize () {
      this.$nextTick(() => {
        this.treeHeight = calcEleFitHeight(this.$refs.tree.$el, "kui-aside");
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import"scss/mixin/layout-variables.scss";
.org-info-manager::v-deep {
  // height: calc(100vh - #{$topbar-height} - #{$tabnav-height}  - #{$content-margin} * 2) !important;
  .org-manager-tree .kui-tree-node {
    .el-button--text {
      color:#66686C;
    }
    > .node-content {
      .custom-tree-node .node-icon {
        color: #D9D9D9;
        &.kui-icon-office-building {
          color: #7FB3FF;
        }
      }
      &.is-current {
        .custom-tree-node .node-icon {
          &.kui-icon-office-building {
            color: #3261FF;
          }
        }
      }
    }
  }
  .kui-loading-relative {
    min-height: unset !important;
  }
  .kui-aside {
    padding: 0;
    .aside-header {
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      line-height: 48px;
      border-bottom: 1px solid #D4D7DE;
      h4 {
        display: inline-block;
        margin: 0;
        font-size: calc(var(--font-size-base) + 2px);
      }
    }
    .aside-content {
      padding: 16px 16px 16px 8px;
      .el-input__inner {
        height: 28px;
      }
      .el-input--mini .el-input__icon {
        line-height: 28px;
      }
    }
    .node-content.is-current::before{
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      right: 0;
      top: 12px;
      z-index:1;
      border-top: 6px solid transparent;
      border-right: 6px solid #ffffff;
      border-bottom: 6px solid transparent;
    }
    .node-content.is-current::after{
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      right: 0;
      top: 11px;
      border-top: 7px solid transparent;
      border-right: 7px solid #D4D7DE;
      border-bottom: 7px solid transparent;
    }
  }
  .kui-field {
    .view-btn {
      margin-right: 8px;
      font-size: 14px !important;
      color: #111;
      i {
        color: var(--color-primary);
        font-size: 14px;
      }
    }
  }
}
/deep/.kui-main {
  position: relative;
}
.upload-tips {
  position: absolute;
  top: 10px;
  right: 0;
  width: 310px;
  padding-left: 12px;
  line-height: 13px;
  font-size: 13px;
  color: #8e9095;
  word-break: break-word;
}
.download-template-btn {
  position: absolute;
  bottom: 30px;
  color: #111 !important;
  left: 30px;
  &:hover {
    color: $--color-primary !important;
  }
}
</style>
<style lang="scss">
@import"scss/mixin/layout-variables.scss";
  .fullscreen {
    .org-info-manager {
      height: calc(100vh - #{$content-margin} * 2) !important;
    }
  }
</style>
