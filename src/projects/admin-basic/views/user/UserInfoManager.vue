<template>
  <div>
    <kui-page
      ref="page"
      title="$t[user.renyuan_xinxi]"
      remote-pagi
      :query-url="getApiList.queryUserInfoAll"
      :auto-query="false"
      :form-prop="formProp"
      :table-prop="tableProp"
      :table-height="tableHeight"
      :auth="getPermissions"
      @export-selected="exportSelected"
      @export-before="exportBefore"
    >
      <template #userName="{ row }">
        <kui-button
          :key="row.userName"
          type="text"
          :data="row"
          @click="userNameClick"
        >
          {{ row.userName }}
        </kui-button>
      </template>
    </kui-page>
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
      <div style="position: relative">
        <kui-loading
          :visible="importDialogLoading"
          :text="importDialogText"
        ></kui-loading>
        <kui-upload-pro
          ref="userInfoImport"
          :action="importAction"
          :headers="importHeaders"
          :file-list="fileList"
          template-id="user-import"
          width="100%"
          :auto-upload="false"
          :is-reconnect="false"
          :on-success="userInfoImportSuccess"
          :on-error="userInfoImportError"
          :before-upload="userInfoImportBeforeUpload"
          :on-change="userInfoImportChange"
        >
          <div slot="trigger">
            <kui-button size="small" type="primary" icon="kui-icon-files" :stop-click="false">{{ this.$t("user.xuanze_wenjian") }}</kui-button>
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
        style="margin-left: 10px; text-align: start"
      >
        <div slot="content">
          <div style="padding-top: 10px">
            <div class="exportHeader">
              <div style="text-align: start; margin-bottom: 5px">
                {{ this.$t("user.xuanzhe_wenjian_geshi") }}
              </div>
              <kui-radio
                v-model="templateType"
                :opts="templateTypeOpts"
              ></kui-radio>
            </div>
            <div style="text-align: right; margin-top: 5px">
              <kui-button type="text" size="mini" @click="templateDownload">{{
                this.$t("user.que_ren")
              }}</kui-button>
              <kui-button
                size="mini"
                type="text"
                @click="templatePopoverVisible = false"
              >{{ this.$t("user.qu_xiao") }}</kui-button>
            </div>
          </div>
        </div>
        <kui-button
          slot="reference"
          class="download-template-btn"
          text="$t[user.xiazai_muban]"
          type="text"
        ></kui-button>
      </kui-popover>
    </kui-dialog>
    <!-- 人员信息详情-->
    <kui-dialog width="900" :visible.sync="detailVisible" :title="detailTitle">
      <kui-sform
        label-width="100"
        item-width="270"
        :model="detailModel"
        :items="detailItems"
        :field-arr="detailFieldArr"
      ></kui-sform>
    </kui-dialog>
    <!-- 设置角色 设置机构 菜单权限-->
    <kui-drawer
      ref="drawer"
      class="user-manager-drawer"
      :visible.sync="drawerVisible"
      :title="drawerTitle"
      :btns="drawerBtns"
      :size="drawerSize"
      btn-close-test-id="close-drawer"
    >
      <kui-transfer
        v-if="drawerType === '1'"
        v-model="userRoles"
        :titles="['$t[user.daixuan_juese]', '$t[user.yi_yongyou_juese]']"
        :opts="roleArr"
        filter-placeholder="$t[user.qing_shuru_sousuo_neirong]"
        height="100%"
        value-key="roleNo"
        label-key="roleName"
        :filter-method="filterMethod"
        test-id="transfer"
        :is-test="true"
      ></kui-transfer>
      <kui-tree
        v-if="drawerType === '2'"
        ref="orgTree"
        :loading="orgLoading"
        :data="orgData"
        :height="treeHeight"
        :label-width="300"
        value-key="orgCode"
        label-key="orgName"
        :expand="1"
        test-id="orgTree"
        :is-test="true"
      ></kui-tree>
      <kui-tree
        v-if="drawerType === '3'"
        ref="menuTree"
        :loading="menuLoading"
        :data="menuData"
        :height="treeHeight"
        :label-width="300"
        value-key="menuId"
        :label-key="['menuId', 'menuName']"
        multiple
        :cascade="false"
        :expand="1"
        test-id="menuTree"
        :is-test="true"
        @check="menuTreeCheck"
      ></kui-tree>
      <kui-form
        v-if="drawerType === '4'"
        ref="pwdForm"
        :model="pwdModel"
        :items="pwdItems"
        :is-test="true"
      ></kui-form>
      <kui-form
        v-if="drawerType === '5'"
        ref="allPwdForm"
        :model="allPwdModel"
        :items="allPwdItems"
        :is-test="true"
      ></kui-form>
    </kui-drawer>
    <!-- 人员信息 新增，修改 -->
    <user-info-dialog
      :visible.sync="userInfoDialogVisible"
      :mode="userInfoDialogMode"
      :current-user-no="currentUserNo"
      @refresh-table="handleRefreshTable"
    ></user-info-dialog>
  </div>
</template>

<script >
import { difference, map } from "lodash-es";
import { calcEleFitHeight } from "szkingdom.yf.koca-template/lib/utils/dom";
import { dateFormat } from "szkingdom.yf.koca-template/lib/utils/date";
import { getLocalStorage, removeLocalStorage } from "szkingdom.yf.koca-template/lib/utils/cache";
import { getApiList } from "./url.config";
import { encrypt_ECB } from "szkingdom.yf.koca-template/lib/utils/sm4";
import UserInfoDialog from "./components/UserInfoDialog";
import { PERMISSIONS } from "../../permissions";

export default {
  name: "UserInfoManager",
  components: {
    UserInfoDialog
  },
  data() {
    return {
      PERMISSIONS: Object.freeze(PERMISSIONS),
      exportUrl: "admin/export",
      fileList: [],
      importAction: "/admin/import",
      importHeaders: {},
      importDialogVisible: false,
      importDialogTitle: "$t[user.daoru_renyuan_xinxi]",
      questionBtn: [
        {
          key: "question",
          text: "",
          type: "text",
          color: "#ccc",
          size: "medium",
          icon: "kui-icon-question"
        }
      ],
      tooltip1: this.$t("user.tooltip1"),
      templatePopoverVisible: false,
      templateType: "xlsx",
      templateTypeOpts: [
        {
          value: "xlsx",
          label: "xlsx"
        },
        {
          value: "txt",
          label: "txt"
        }
      ],
      userInfoDialogVisible: false,
      userInfoDialogMode: "",
      currentUserNo: "",
      formProp: {
        "is-test": true,
        "test-suffix": "form",
        labelWidth: 70,
        items: [
          {
            prop: "orgCode",
            label: "$t[user.jigou_daima]",
            rules: { valid: "num[1,8]" },
            labelWidth: 70,
            "is-test": true
          },
          {
            prop: "userNo",
            label: "$t[user.renyuan_bianhao]",
            rules: { valid: "numEn[1,32]" },
            labelWidth: 70
          },
          {
            prop: "userName",
            label: "$t[user.xing_ming]",
            rules: { valid: "chEnNum[1,32]" },
            labelWidth: 70
          },
          {
            mold: "select",
            prop: "userStatus",
            label: "$t[user.zhuang_tai]",
            dict: "USER_STATUS",
            clearable: true,
            labelWidth: 70
          }
        ]
      },
      tableProp: {
        "is-test": true,
        exportTable: true,
        exportProp: {
          text: "$t[user.daochu]",
          type: null,
          auth: PERMISSIONS["UserInfoMananger:export"]
        },
        tableProp: {
          rowKey: "userNo",
          exportUrl: "",
          // exportFileName: "userInfo",
          bexRequestParam: {
            serviceName: "",
            apiUrl: "/api/queryUserInfoList",
            param: {}
          }
        },
        btns: [
          {
            key: "add",
            text: "$t[user.renyuan_xinzeng]",
            icon: "kui-icon-plus",
            click: this.userInfoAdd,
            auth: PERMISSIONS["UserInfoMananger:add"],
            "is-test": true
          },
          {
            key: "pwdReset",
            text: "$t[user.mima_chongzhi]",
            icon: "kui-icon-refresh-left",
            click: this.resetPwd,
            type: null,
            "is-test": true,
            auth: PERMISSIONS["UserInfoMananger:pwdResetAll"]
          },
          {
            key: "import",
            text: "$t[user.daoru]",
            icon: "kui-icon-import",
            click: this.showImportDialog,
            type: null,
            auth: PERMISSIONS["UserInfoMananger:import"],
            "is-test": true
          }
        ],
        items: [
          {
            type: "select",
            reserveSelection: true
          },
          {
            prop: "userNo",
            label: "$t[user.renyuan_bianhao]",
            sortable: true,
            minWidth: 120
          },
          {
            prop: "userName",
            label: "$t[user.xing_ming]"
          },
          {
            prop: "userStatus",
            label: "$t[user.zhuang_tai]",
            dict: "USER_STATUS",
            badgeObj: {
              0: { status: "success", text: "正常" },
              1: { status: "warning", text: "冻结" },
              2: { status: "danger", text: "注销" },
              3: { status: "warning", text: "锁定" }
            }
          },
          {
            prop: "userRoles",
            label: "$t[user.jue_se]",
            minWidth: 150,
            opts: [],
            multiple: true,
            valueKey: "roleNo",
            labelKey: "roleName"
          },
          {
            prop: "orgCode",
            label: "$t[user.jigou_daima]",
            sortable: true,
            minWidth: 120
          },
          {
            prop: "orgName",
            label: "$t[user.jigou_mingcheng]",
            minWidth: 150
          },
          {
            prop: "mobileTel",
            label: "$t[user.shouji_haoma]",
            minWidth: 130
          },
          {
            prop: "email",
            label: "$t[user.you_xiang]",
            minWidth: 180
          },
          {
            prop: "idType",
            label: "$t[user.zhengjian_leixing]",
            dict: "ID_TYPE",
            minWidth: 120
          },
          {
            prop: "idCode",
            label: "$t[user.zhengjian_haoma]",
            minWidth: 190
          },
          {
            type: "button",
            fixed: "right",
            minWidth: 190,
            btnFilter: this.btnFilter,
            "is-test": true,
            btns: [
              {
                key: "update",
                text: "$t[user.bian_ji]",
                click: this.userInfoEdit,
                auth: PERMISSIONS["UserInfoMananger:update"]
              },
              {
                key: "role",
                text: "$t[user.shezhi_juese]",
                click: this.changeUserRole,
                auth: PERMISSIONS["UserInfoMananger:role"]
              },
              {
                key: "org",
                text: "$t[user.shezhi_jigou]",
                click: this.changeUserOrg,
                auth: PERMISSIONS["UserInfoMananger:org"]
              },
              {
                key: "pwdReset",
                text: "$t[user.mima_chongzhi]",
                click: this.changeUserPwd,
                auth: PERMISSIONS["UserInfoMananger:pwdReset"]
              },
              {
                key: "menuAuth",
                text: "$t[user.caidan_quanxian]",
                click: this.changeUserMenuAuth,
                auth: PERMISSIONS["UserInfoMananger:menuAuth"]
              },
              {
                key: "freeze",
                text: "$t[user.yonghu_dongjie]",
                click: this.userFreeze,
                auth: PERMISSIONS["UserInfoMananger:freeze"]
              },
              {
                key: "unfreeze",
                text: "$t[user.yonghu_jiedong]",
                click: this.userUnFreeze,
                auth: PERMISSIONS["UserInfoMananger:unfreeze"]
              },
              {
                key: "cancel",
                text: "$t[user.yonghu_zhuxiao]",
                click: this.userCancel,
                auth: PERMISSIONS["UserInfoMananger:cancel"]
              }
            ]
          }
        ]
      },
      detailVisible: false,
      detailTitle: "$t[user.renyuan_xiangqing]",
      detailModel: {},
      detailItems: [
        {
          prop: "userIcon",
          label: "$t[ownInfo.tou_xiang]",
          itemWidth: "100%",
          labelWidth: "100",
          valueWidth: "calc(100% - 100px)",
          styleItem: {
            marginBottom: "20px"
          },
          renderValue(h, val, item) {
            return !val
              ? h("svg-icon", {
                class: "avatar",
                attrs: {
                  name: "avatar"
                },
                style: {
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%"
                }
              })
              : h("img", {
                attrs: {
                  src: val
                },
                class: "avatar-img",
                style: {
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%"
                }
              });
          }
        },
        {
          prop: "userNo",
          label: "$t[user.renyuan_bianhao]"
        },
        {
          prop: "userName",
          label: "$t[user.xing_ming]"
        },
        {
          prop: "userStatus",
          label: "$t[user.zhuang_tai]",
          dict: "USER_STATUS"
        },
        {
          prop: "mobileTel",
          label: "$t[user.shouji_haoma]"
        },
        {
          prop: "email",
          label: "$t[user.you_xiang]"
        },
        {
          prop: "idType",
          label: "$t[user.zhengjian_leixing]",
          dict: "ID_TYPE"
        },
        {
          prop: "idCode",
          label: "$t[user.zhengjian_haoma]"
        },
        {
          prop: "idBeginDate",
          label: "$t[user.zhengjian_kaishi_riqi]",
          formatter: this.formatter
        },
        {
          prop: "idExpDate",
          label: "$t[user.zhengjian_jieshu_riqi]",
          formatter: this.formatter
        },
        {
          prop: "idAddress",
          label: "$t[user.zhengjian_dizhi]",
          colspan: 2,
          valueWidth: 440
        },
        {
          prop: "idIssAgcy",
          label: "$t[user.fazheng_jiguan]",
          colspan: 2,
          valueWidth: 440
        },
        {
          prop: "address",
          label: "$t[user.lianxi_dizhi]",
          colspan: 2,
          valueWidth: 440
        },
        {
          prop: "userCode",
          label: "$t[user.renyuan_daima]"
        },
        {
          prop: "userType",
          label: "$t[user.renyuan_leixing]",
          dict: "USER_TYPE"
        },
        {
          prop: "createDate",
          label: "$t[user.zhuce_riqi]",
          formatter: this.formatter
        },
        {
          prop: "cancelDate",
          label: "$t[user.zhuxiao_riqi]",
          formatter: this.formatter
        },
        {
          prop: "birthday",
          label: "$t[user.chusheng_riqi]",
          formatter: this.formatter
        },
        {
          prop: "sex",
          label: "$t[user.xing_bie]",
          dict: "SEX"
        },
        {
          prop: "nationality",
          label: "$t[user.min_zu]",
          dict: "NATIONALITY"
        },
        {
          prop: "citizenship",
          label: "$t[user.guo_ji]",
          dict: "CITIZENSHIP"
        },
        {
          prop: "education",
          label: "$t[user.xue_li]",
          dict: "EDUCATION"
        },
        {
          prop: "nativePlace",
          label: "$t[user.ji_guan]"
        },
        {
          prop: "zipCode",
          label: "$t[user.you_bian]"
        },
        {
          prop: "remark",
          label: "$t[user.beizhu_xinxi]",
          colspan: 2,
          valueWidth: 440
        },
        {
          prop: "jobNo",
          label: "$t[user.gong_hao]"
        },
        {
          prop: "officeTel",
          label: "$t[user.bangong_dianhua]"
        },
        {
          prop: "QQ",
          label: "$t[user.QQ]"
        },
        {
          prop: "fax",
          label: "$t[user.chuan_zhen]"
        }
      ],
      detailFieldArr: [
        {
          title: "$t[user.jiben_xinxi]",
          propArr: [
            "userNo",
            "userName",
            "userStatus",
            "idType",
            "idCode",
            "mobileTel",
            "email",
            "address",
            "idIssAgcy",
            "idAddress",
            "idBeginDate",
            "idExpDate"
          ]
        },
        {
          title: "$t[user.qita_xinxi]",
          propArr: [
            "userCode",
            "userType",
            "createDate",
            "cancelDate",
            "birthday",
            "sex",
            "nationality",
            "citizenship",
            "education",
            "nativePlace",
            "zipCode",
            "remark"
          ]
        },
        {
          title: "$t[user.tuozhan_xinxi]",
          propArr: ["jobNo", "officeTel", "QQ", "fax"]
        }
      ],
      // 设置角色，设置机构，设置菜单权限 抽屉变量
      drawerVisible: false,
      drawerTitle: "",
      drawerBtns: [
        {
          key: "cancel",
          text: "$t[user.qu_xiao]",
          type: null,
          click: this.cancelDrawer,
          "is-test": true,
          "test-id": "cancel-drawer"
        },
        {
          key: "ok",
          text: "$t[user.que_ren]",
          click: this.okDrawer,
          "is-test": true,
          "test-id": "ok-drawer"
        }
      ],
      drawerType: "1",
      drawerSize: "500px",
      treeHeight: 300,
      roleArr: [],
      userRoles: [],
      orgLoading: false,
      orgData: [],
      menuLoading: false,
      menuData: [],
      // 重置密码 变量
      pwdModel: {
        pwd: "",
        pwd2: ""
      },
      // 表格上方批量重置密码
      allPwdModel: {
        pwd: "",
        pwd2: "",
        type: "0"
      },
      pwdItems: [
        {
          prop: "pwd",
          label: "$t[user.xin_mima]",
          showPassword: true,
          required: true,
          itemWidth: 320,
          labelWidth: 80,
          rules: { valid: "length[0,16]" }
        },
        {
          prop: "pwd2",
          label: "$t[user.queren_mima]",
          showPassword: true,
          required: true,
          itemWidth: 320,
          labelWidth: 80,
          rules: { valid: "length[0,16]" }
        }
      ],
      allPwdItems: [
        {
          prop: "type",
          mold: "radio",
          label: "$t[user.chongzhi_leixing]",
          required: true,
          opts: [
            { value: "0", label: "$t[user.suo_you_yong_hu]" },
            { value: "1", label: "$t[user.yi_gou_xuan_yong_hu]" }
          ],
          itemWidth: 320,
          labelWidth: 80
        },
        {
          prop: "pwd",
          label: "$t[user.xin_mima]",
          showPassword: true,
          required: true,
          itemWidth: 320,
          labelWidth: 80,
          rules: { valid: "length[0,16]" }
        },
        {
          prop: "pwd2",
          label: "$t[user.queren_mima]",
          showPassword: true,
          required: true,
          itemWidth: 320,
          labelWidth: 80,
          rules: { valid: "length[0,16]" }
        }
      ],
      importDialogLoading: false,
      importDialogText: this.$t("user.daoruzhong") + "...",
      importDialogBtns: [
        {
          key: "cancle",
          text: "$t[user.qu_xiao]",
          type: null,
          click: this.cancleImportDialogOkCallback
        },
        {
          key: "cancle",
          text: "$t[user.daoru]",
          click: this.importDialogOkCallback
        }
      ]
    };
  },
  computed: {
    getApiList() {
      return getApiList(this);
    },
    tableHeight() {
      return this.$app.screen.CRUD_tableHeight;
    },
    getPermissions() {
      return {
        query: PERMISSIONS["UserInfoMananger:query"]
      };
    }
  },
  created() {
    const apiUrl = this.getBaseUrl(this.$app.apiUrl) || "";
    this.importAction = apiUrl + (this.$app.apiPrefix.USER_URL_PREFIX || "") + "import";

    this.exportUrl = this.getApiList.basicExport;
    this.tableProp.tableProp.exportUrl = this.exportUrl;
    this.detailFieldArr[0].propArr.unshift("userIcon");
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.page.tablePage.exportTypeList = [
        {
          value: "xlsx",
          label: "xlsx"
        },
        {
          value: "txt",
          label: "txt"
        }
      ];
      this.tableProp.loading = true;
      this.$http.post(this.getApiList.queryRoleInfoSimple, {}).then((res) => {
        this.tableProp.loading = false;
        this.roleArr = res.data;
        const index = this.tableProp.items.findIndex(function (item) {
          return item.prop === "userRoles";
        });
        this.tableProp.items[index].opts = res.data;
        this.$refs.page.formQueryPage(1);
      });
    });
  },
  methods: {
    templateDownload() {
      this.templatePopoverVisible = false;
      this.$http
        .post(
          this.getApiList.templateDownload,
          { displayName: "user_template." + this.templateType },
          { downloadFile: true }
        )
        .then((res) => {});
    },
    getBaseUrl(url) {
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
    menuTreeCheck(data, node) {
      this.$refs.menuTree.cascadeNodeChild(node);
      if (data.menuType === "2" && node.isChecked === false) {
        // this.$refs.menuTree.cascadeNodeParent(node.parent);
      } else if (data.menuType === "2" && node.isChecked === true) {
        this.$refs.menuTree.cascadeNodeParent(node.parent);
      } else {
        this.$refs.menuTree.cascadeNodeParent(node.parent);
      }
    },
    resetPwd() {
      const selectedUser = this.$refs.page.tableEl.getSelected();
      this.allPwdModel = {
        pwd: "",
        pwd2: "",
        type: selectedUser.length ? "1" : "0"
      };
      this.curRow = {};
      this.drawerTitle = `$t[user.renyuan_xinxi]-$t[user.piliang_mima_chongzhi]`;
      this.drawerVisible = true;
      this.drawerType = "5";
      this.drawerSize = "390px";
    },
    filterMethod(query, item) {
      return item.roleName.indexOf(query) > -1;
    },
    exportBefore(data) {
      const userStatusIndex = this.$refs.page.tableEl.headerCheckedList.findIndex(function (item) {
        return item.propertyName === "userStatus";
      });
      const userNameIndex = this.$refs.page.tableEl.headerCheckedList.findIndex(function (item) {
        return item.propertyName === "userName";
      });
      const userRolesIndex = this.$refs.page.tableEl.headerCheckedList.findIndex(function (item) {
        return item.propertyName === "userRoles";
      });
      if (getLocalStorage("language") === "en-US") {
        data.columnInfos[userStatusIndex] = {
          propertyName: "userStatus",
          displayName: "userStatus"
        };
        data.columnInfos[userNameIndex] = { propertyName: "userName", displayName: "userName" };
        data.columnInfos[userRolesIndex] = { propertyName: "userRoles", displayName: "userRoles" };
      } else {
        data.columnInfos[userStatusIndex] = { propertyName: "userStatus", displayName: "人员状态" };
      }
    },
    exportSelected(exportSelectedCol, headerCheckedList) {
      const arr = [];
      if (exportSelectedCol && this.$refs.page.tableEl) {
        const userStatusIndex = this.$refs.page.tableEl.headerCheckedList.findIndex(function (
          item
        ) {
          return item.propertyName === "userStatus";
        });
        if (getLocalStorage("language") === "en-US") {
          this.$refs.page.tableEl.headerCheckedList[userStatusIndex].displayName = "userStatus";
        } else {
          this.$refs.page.tableEl.headerCheckedList[userStatusIndex].displayName = "人员状态";
        }

        const userRolesIndex = this.$refs.page.tableEl.headerCheckedList.findIndex(function (item) {
          return item.propertyName === "userRoles";
        });
        const idTypeIndex = this.$refs.page.tableEl.headerCheckedList.findIndex(function (item) {
          return item.propertyName === "idType";
        });

        for (let i = 0; i < exportSelectedCol.length; i++) {
          const row = exportSelectedCol[i];
          const items = [];
          for (let k = 0; k < row.length; k++) {
            let item = row[k];
            if (item === "" || item === null) {
              item = "null";
            }
            // 状态转换
            if (userStatusIndex !== -1 && k === userStatusIndex && item !== "null") {
              const stateBadgeObj = this.tableProp.items.find(function (item) {
                return item.prop === "userStatus";
              }).badgeObj;
              item = stateBadgeObj[item].text;
            }
            // 角色转换
            if (userRolesIndex !== -1 && k === userRolesIndex && item !== "null") {
              const index = this.tableProp.items.findIndex(function (item) {
                return item.prop === "userRoles";
              });
              const userRolesOpts = this.tableProp.items[index].opts;
              const splitArr = item.split(",");
              if (splitArr.length) {
                item = "";
                for (let j = 0; j < splitArr.length; j++) {
                  const role = splitArr[j];
                  for (let h = 0; h < userRolesOpts.length; h++) {
                    const userRolesOpt = userRolesOpts[h];
                    if (role === userRolesOpt.roleNo) {
                      item += userRolesOpt.roleName;
                      item += ",";
                    }
                  }
                }
                if (item.length) {
                  item = item.substring(0, item.length - 1);
                } else {
                  item = "null";
                }
              }
            }
            // 证件类型
            if (idTypeIndex !== -1 && k === idTypeIndex) {
              if (item) {
                item = this.$dict.translate("ID_TYPE", item);
              }
            }

            items[k] = item;
          }
          arr[i] = items;
        }
        exportSelectedCol = arr;
        this.$refs.page.tableEl.exportSelectedCol = exportSelectedCol;
      }
    },
    showImportDialog() {
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
    importDialogOkCallback() {
      if (typeof this.$refs.userInfoImport.submit === "function") {
        this.$refs.userInfoImport.submit();
      } else {
        this.$refs.userInfoImport.$refs.upload.$refs.upload.submit();
      }
    },
    userInfoImportChange(file, fileList) {
      let isReady = false;
      for (let i = 0; i < fileList.length; i++) {
        const item = fileList[i];
        let isSplice = false;
        if (item.name.split(".").length) {
          const fileSuffix = item.name.split(".")[item.name.split(".").length - 1];
          const prohibitArr = ["txt", "xlsx", "xls"];
          if (prohibitArr.indexOf(fileSuffix.toLowerCase()) === -1) {
            this.$message.info(this.$t("user.wenjian_leix_bupipei"));
            fileList.splice(i, 1);
            isSplice = true;
          }
        } else {
          fileList.splice(i, 1);
          isSplice = true;
        }
        if (item.size >= 30 * 1024 * 1024 && !isSplice) {
          this.$message.info(this.$t("user.chaoguo_wenjian_daxiao_xianzhi") + "(30M)");
          fileList.splice(i, 1);
        } else {
          if (item.status === "ready") {
            this.importDialogBtns[1].disabled = false;
            this.$refs.userInfoImport.message = 0;
            isReady = true;
          }
        }
      }
      if (!isReady) {
        this.importDialogBtns[1].disabled = true;
      }
    },
    userInfoImportBeforeUpload() {
      this.importDialogBtns[1].text = this.$t("user.daoruzhong");
      this.importDialogBtns[1].disabled = true;
      this.importDialogLoading = true;
    },
    userInfoImportSuccess(param) {
      this.$message.info(param.msg);
      this.importDialogBtns[1].text = this.$t("user.daoru");
      this.importDialogBtns[1].disabled = false;
      this.importDialogLoading = false;
    },
    userInfoImportError() {
      this.$message.error(this.$t("user.renyuan_shuju_daoru_shibai"));
      this.importDialogBtns[1].text = this.$t("user.daoru");
      this.importDialogBtns[1].disabled = false;
      this.importDialogLoading = false;
    },
    cancleImportDialogOkCallback() {
      this.$refs.userInfoImport.fileList = [];
      if (typeof this.$refs.userInfoImport.clearFiles === "function") {
        this.$refs.userInfoImport.clearFiles();
      } else {
        this.$refs.userInfoImport.$refs.upload.$refs.upload.clearFiles();
      }
      this.$refs.userInfoImport.message = 0;
      this.importDialogVisible = false;
      this.importDialogBtns[1].text = this.$t("user.daoru");
      this.importDialogBtns[1].disabled = false;
      this.importDialogLoading = false;
      this.$refs.page.formQueryPage(1);
    },
    // 过滤行按钮
    btnFilter(row, btn) {
      let flag = true;
      if (row.userStatus === "2") {
        // 注销之后不能进行操作
        flag = false;
      } else if (btn.key === "freeze") {
        flag = row.userStatus === "0";
      } else if (btn.key === "unfreeze") {
        flag = row.userStatus === "1";
      } else if (btn.key === "cancel") {
        flag = row.userStatus !== "2";
      }
      return flag;
    },
    handleRefreshTable() {
      this.$refs.page.formQueryPage();
    },
    userInfoAdd() {
      this.userInfoDialogMode = "ADD";
      this.userInfoDialogVisible = true;
    },
    userInfoEdit(row) {
      this.currentUserNo = row.userNo;
      this.userInfoDialogMode = "UPDATE";
      this.userInfoDialogVisible = true;
    },
    userNameClick(row) {
      const { userNo, userName } = row;
      this.$http.post(this.getApiList.queryUserDetailBex, { userNo }).then(async (res) => {
        const userIcon = res.data.userIcon;
        this.detailModel = { ...res.data, userIcon: null };
        try {
          if (userIcon) {
            const data = await this.$http.post(
              this.getApiList.avatarDownload,
              { fileCode: userIcon },
              { config: { responseType: "blob" } }
            );
            const blob = data.response.data;
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = (e) => {
              this.$nextTick(() => {
                this.detailModel.userIcon = e.target.result;
              });
            };
          }
        } catch (err) {
          this.detailModel.userIcon = null;
          console.log("获取用户头像出错: ", err);
        }
        this.detailTitle = `$t[user.renyuan_xiangqing]-【${userNo}-${userName}】`;
        this.detailVisible = true;
      });
    },
    okDrawer() {
      const { userNo } = this.curRow;
      if (this.drawerType === "1") {
        // 设置角色
        const oldRoles = this.curRow.userRoles ? this.curRow.userRoles.split(",") : [];
        const dif1 = difference(oldRoles, this.userRoles);
        const dif2 = difference(this.userRoles, oldRoles);
        if (dif1.length === 0 && dif2.length === 0) {
          this.$message.warning(this.$t("user.juese_meiyou_xiugai"));
          return;
        }
        this.$http
          .post(this.getApiList.saveUserRole, {
            userNo,
            roleNos: this.userRoles
          })
          .then((res) => {
            this.$message.success(this.$t("user.juese_shezhi_chenggong"));
            this.drawerVisible = false;
            this.$refs.page.formQueryPage();
          });
      } else if (this.drawerType === "2") {
        // 设置机构
        const oldOrg = this.curRow.orgCode;
        const curOrg = this.$refs.orgTree.getCurrentData();
        if (!curOrg) {
          return;
        }
        const userOrg = curOrg.orgCode;
        if (oldOrg === userOrg) {
          this.$message.warning(this.$t("user.jigou_meiyou_xiugai"));
          return;
        }
        this.$http
          .post(this.getApiList.saveUserOrg, {
            userNo,
            orgCode: userOrg
          })
          .then((res) => {
            this.$message.success(this.$t("user.jigou_shezhi_chenggong"));
            this.drawerVisible = false;
            this.$refs.page.formQueryPage();
          });
      } else if (this.drawerType === "3") {
        // 设置菜单权限
        const menuIds = this.$refs.menuTree.getCheckedKeys(true);
        const rootIndex = menuIds.indexOf("root");
        if (rootIndex > -1) {
          menuIds.splice(rootIndex, 1);
        }
        const delMenu = difference(this.oldMenuIds, menuIds);
        const addMenu = difference(menuIds, this.oldMenuIds);
        if (delMenu.length === 0 && addMenu.length === 0) {
          this.$message.warning(this.$t("user.caidanquanxian_meiyou_xiugai"));
          return;
        }
        const menus = map(delMenu, (menuId) => {
          return { menuId: menuId, action: "D" };
        }).concat(
          map(addMenu, (menuId) => {
            return { menuId: menuId, action: "A" };
          })
        );
        this.$http
          .post(this.getApiList.saveUserMenuExec, {
            userNo,
            menus
          })
          .then((res) => {
            this.$message.success(this.$t("user.caidanquanxian_shezhi_chenggong"));
            this.drawerVisible = false;
          });
      } else if (this.drawerType === "4") {
        // 重置密码
        this.$refs.pwdForm.valid(() => {
          if (this.pwdModel.pwd !== this.pwdModel.pwd2) {
            this.$message.error(this.$t("user.mima_butong"));
          } else {
            this.$confirm(
              this.$t("user.queren_chongzhi_mima"),
              this.$t("user.tishi"), 
              {
                type: 'warning'
              }
            ).then(() => {
              this.$http.post(this.getApiList.userPwdReset, {
                userNo,
                pwd: encrypt_ECB(this.pwdModel.pwd)
              })
              .then((res) => {
                this.$message.success(this.$t("user.mima_chongzhi_chenggong"));
                this.drawerVisible = false;
              });
            }).catch(() => {
              this.drawerVisible = false;        
            });
          }
        });
      } else if (this.drawerType === "5") {
        // 批量重置密码
        this.$refs.allPwdForm.valid(async () => {
          if (this.allPwdModel.pwd !== this.allPwdModel.pwd2) {
            this.$message.error(this.$t("user.mima_butong"));
            return;
          }
          let userNoList = [];
          // 重置表格已勾选用户
          if (this.allPwdModel.type === "1") {
            userNoList = this.$refs.page.tableEl.getSelected().map((item) => item.userNo);
            if (!userNoList.length) {
              this.$message.error(this.$t("user.meiyou_gouxuan_yonghu"));
              return;
            }
          }
          this.$confirm(
            this.$t("user.queren_chongzhi_mima"),
            this.$t("user.tishi"), 
            {
              type: 'warning'
            }
          ).then(async () => {
            await this.$http.post(this.getApiList.batchPwdReset, {
              userNoArray: userNoList,
              plainPwd: encrypt_ECB(this.allPwdModel.pwd)
            });
            this.$message.success(this.$t("user.mima_chongzhi_chenggong"));
            this.drawerVisible = false;
          }).catch(() => {
            this.drawerVisible = false;        
          });
        });
      }
    },
    cancelDrawer() {
      this.drawerVisible = false;
    },
    // 设置角色
    changeUserRole(row) {
      this.curRow = row;
      const { userNo, userName } = row;
      // let drawerTitle = this.$t("user.renyuan_shezhijuese", { userNo: `${userNo}`, userName: `${userName}` });
      // this.drawerTitle = drawerTitle;
      this.drawerTitle = `$t[user.ren_yuan]【${userNo}-${userName}】-$t[user.shezhi_juese]`;
      this.drawerVisible = true;
      this.drawerType = "1";
      this.drawerSize = "auto";
      this.userRoles = row.userRoles ? row.userRoles.split(",") : [];
    },
    // 设置机构
    changeUserOrg(row) {
      this.curRow = row;
      const { userNo, userName, orgCode } = row;
      // let drawerTitle = this.$t("user.renyuan_shezhijigou", { userNo: `${userNo}`, userName: `${userName}` });
      // this.drawerTitle = drawerTitle;
      this.drawerTitle = `$t[user.ren_yuan]【${userNo}-${userName}】-$t[user.shezhi_jigou]`;
      this.drawerVisible = true;
      this.drawerType = "2";
      this.drawerSize = "380px";
      if (this.orgData.length > 0) {
        orgCode && this.$refs.orgTree.setCurrentKey(orgCode);
      } else {
        this.orgLoading = true;
        this.$http.post(this.getApiList.queryOrgTreeUrl, {}).then((res) => {
          this.orgLoading = false;
          if (Array.isArray(res.data)) {
            this.orgData = res.data;
            this.$nextTick(() => {
              this.treeHeight = calcEleFitHeight(this.$refs.orgTree.$el, "drawer-main");
              orgCode && this.$refs.orgTree.setCurrentKey(orgCode);
            });
          }
        });
      }
    },
    changeUserPwd(row) {
      this.pwdModel = {
        pwd: "",
        pwd2: ""
      };
      this.curRow = row;
      const { userNo, userName } = row;
      // let drawerTitle = this.$t("user.renyuan_mimachongzhi", { userNo: `${userNo}`, userName: `${userName}` });
      // this.drawerTitle = drawerTitle;
      this.drawerTitle = `$t[user.ren_yuan]【${userNo}-${userName}】-$t[user.mima_chongzhi]`;
      this.drawerVisible = true;
      this.drawerType = "4";
      this.drawerSize = "390px";
    },
    changeUserMenuAuth(row) {
      this.curRow = row;
      const { userNo, userName } = row;
      // let drawerTitle = this.$t("user.renyuan_shezhi_caidanquanxian", { userNo: `${userNo}`, userName: `${userName}` });
      // this.drawerTitle = drawerTitle;
      this.drawerTitle = `$t[user.ren_yuan]【${userNo}-${userName}】-$t[user.shezhi_caidanquanxian]`;
      this.drawerVisible = true;
      this.drawerType = "3";
      this.drawerSize = "380px";
      if (this.menuData.length > 0) {
        this.loadUserMenuAuth(userNo);
      } else {
        this.menuLoading = true;
        const queryMenu = this.$app.apiPrefix.PARAM_URL_PREFIX + this.$app.frameApiList.queryMenu;
        this.$http.post(queryMenu, {}).then((res) => {
          this.orgLoading = false;
          if (Array.isArray(res.data)) {
            const rootMenu = {
              loadType: "0",
              menuIcon: "kui-icon-menu",
              menuId: "root",
              menuName: "菜单权限",
              menuStatus: "",
              menuType: "0",
              menuUrl: "",
              parentMenu: "",
              prevMenu: "",
              remark: "",
              rightFlag: "",
              children: res.data
            };
            this.menuData = [rootMenu];
            this.$nextTick(() => {
              this.treeHeight = calcEleFitHeight(this.$refs.menuTree.$el, "drawer-main");
              this.loadUserMenuAuth(userNo);
            });
          }
        });
      }
    },
    // 查询人员的菜单权限
    loadUserMenuAuth(userNo) {
      this.menuLoading = true;
      this.$http
        .post(this.getApiList.queryUserMenuExec, {
          userNo
        })
        .then((res) => {
          this.menuLoading = false;
          this.oldMenuIds = this.getOldMenuIds(res.data);
          this.setCheckedKeys(this.oldMenuIds, true, true, true);
        });
    },
    getOldMenuIds(data) {
      const arr = map(data, "menuId");
      const re = [];
      const mapMenuData = function (menuData) {
        if (menuData.menuId) {
          if (arr.indexOf(menuData.menuId) !== -1) {
            re.push(menuData.menuId);
          }
        }
        if (menuData.children && menuData.children.length) {
          for (let i = 0; i < menuData.children.length; i++) {
            const item = menuData.children[i];
            mapMenuData(item);
          }
        }
      };
      mapMenuData(this.menuData[0]);
      return re;
    },
    setCheckedKeys(keys, isCcascade = true, isOnly = true, isChecked = true) {
      if (isOnly) {
        this.$refs.menuTree.clearChecked();
      }
      keys.forEach((key) => {
        this.setCheckedKey(key, isCcascade, isChecked);
      });
    },
    setCheckedKey(key, isCcascade = true, isChecked = true) {
      const node = this.$refs.menuTree.nodesMap[key];
      if (!node.isHalfChecked) {
        node.isChecked = isChecked;
        node.isHalfChecked = false;
      }
      isChecked && true && node.parent && this.$refs.menuTree.expandNode(node.parent);
      if (isCcascade) {
        node.parent && this.$refs.menuTree.cascadeNodeParent(node.parent);
      }
    },
    // 冻结
    userFreeze(row) {
      const { userNo, userName } = row;
      this.$confirm(
        this.$t("user.que_ren") + `【${userNo}-${userName}】` + this.$t("user.dong_jie") + "?",
        this.$t("user.yonghu_dongjie"),
        {
          type: "warning"
        }
      ).then((args) => {
        this.$http.post(this.getApiList.userFreezeUrl, { userNo }).then((res) => {
          row.userStatus = "1";
          this.$message.success(this.$t("user.dong_jie") + this.$t("user.cheng_gong") + "!");
          this.$refs.page.formQueryPage();
        });
      });
    },
    // 解冻
    userUnFreeze(row) {
      const { userNo, userName } = row;
      this.$confirm(
        this.$t("user.que_ren") + `【${userNo}-${userName}】` + this.$t("user.jie_dong") + "?",
        this.$t("user.yonghu_jiedong"),
        {
          type: "warning"
        }
      ).then((args) => {
        this.$http.post(this.getApiList.userUnfreezeUrl, { userNo }).then((res) => {
          row.userStatus = "0";
          this.$message.success(this.$t("user.jie_dong") + this.$t("user.cheng_gong") + "!");
          this.$refs.page.formQueryPage();
        });
      });
    },
    // 注销
    userCancel(row) {
      const { userNo, userName } = row;
      this.$confirm(
        this.$t("user.que_ren") + `【${userNo}-${userName}】` + this.$t("user.zhu_xiao") + "?",
        this.$t("user.yonghu_zhuxiao"),
        {
          type: "warning"
        }
      ).then((args) => {
        this.$http.post(this.getApiList.userCancelUrl, { userNo }).then((res) => {
          row.userStatus = "2";
          this.$message.success(this.$t("user.zhu_xiao") + this.$t("user.cheng_gong") + "!");
          this.$refs.page.formQueryPage();
        });
      });
    },
    formatter(val) {
      if (!val || val === undefined) {
        return "";
      }
      if ((val.indexOf("-") === -1 || val.indexOf("/") === -1) && val.length === 8) {
        val = val.substring(0, 4) + "/" + val.substring(4, 6) + "/" + val.substring(6);
      }
      const re = dateFormat(val, this.$t("ownInfo.dateFormat"));
      return re;
    }
  }
};
</script>
<style lang="scss">
.user-manager-drawer
  .kui-tree-node
  > .node-content
  .custom-tree-node
  .node-icon {
  color: #d9d9d9;
}
.user-manager-drawer .el-button.el-button--primary.el-transfer__button {
  padding: 10px;
}
.upload-tips.file {
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
