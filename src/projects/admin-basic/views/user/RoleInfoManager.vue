<template>
  <kui-layout>
    <kui-page
      ref="rolePage"
      title="$t[role.juese_xinxi]"
      remote-pagi
      :table-height="tableHeight"
      :query-url="queryRoleInfo"
      :add-url="addRoleInfo"
      :upd-url="updateRoleInfo"
      :form-prop="formProp"
      :table-prop="tableProp"
      :dialog-prop="dialogProp"
      :auth="getPermissions"
    >
    </kui-page>
    <kui-drawer
      ref="drawer1"
      :visible.sync="userVisible"
      :title="userTitle"
      size="600"
      btn-close-test-id="user-info-close-drawer1"
    >
      <kui-page
        ref="page1"
        title="$t[role.juese_renyuan_xinxi]"
        :is-block="false"
        remote-pagi
        :query-url="queryRoleUserInfo"
        :del-url="saveRoleUserInfo"
        :add-url="saveRoleUserInfo"
        delete-key="userNo"
        :trans-query-data="transQueryData"
        :trans-add-data="transAddData"
        :trans-del-data="transDelData"
        :form-prop="formProp1"
        :table-prop="tableProp1"
        :dialog-prop="dialogProp1"
      ></kui-page>
    </kui-drawer>
    <kui-drawer
      ref="drawer"
      :visible.sync="drawerVisible"
      :title="drawerTitle"
      :btns="drawerBtns"
      size="380"
      btn-close-test-id="menu-tree-close-drawer"
    >
      <kui-tree
        ref="menuTree"
        :loading="menuLoading"
        :data="menuData"
        :height="treeHeight"
        :label-width="310"
        :expand="1"
        value-key="menuId"
        :label-key="['menuId','menuName']"
        multiple
        :is-test="true"
        test-id="menuTree"
        :cascade="false"
        @check="menuTreeCheck"
      ></kui-tree>
    </kui-drawer>
  </kui-layout>
</template>

<script>
import { map, difference } from "lodash-es";
import { calcEleFitHeight } from "szkingdom.yf.koca-template/lib/utils/dom";
import { getApiList } from "./url.config";
import { PERMISSIONS } from "../../permissions";
import { user$ } from "szkingdom.yf.koca-template/lib/store";
export default {
  name: "RoleInfoManager",
  data () {
    return {
      PERMISSIONS : Object.freeze(PERMISSIONS),
      updateRoleInfo: "",
      queryRoleInfo: "",
      addRoleInfo: "",
      queryRoleUserInfo: "",
      saveRoleUserInfo: "",
      formProp: {
        "is-test": true,
        "test-suffix": "form",
        labelWidth: 70,
        items: [
          {
            prop: "roleNo",
            label: "$t[role.juese_bianhao]",
            rules: { valid: "num[1,8]" },
            labelWidth: 70
          },
          {
            prop: "roleName",
            label: "$t[role.juese_mingcheng]",
            rules: [{ valid: "chEnNum[1,32]" }],
            labelWidth: 70
          },
        ],
      },
      tableProp: {
        "is-test": true,
        items: [
          {
            prop: "roleNo",
            label: "$t[role.juese_bianhao]",
            sortable: true,
            required: true,
            editFlag: "1",
            minWidth: 120,
            labelWidth: 108,
            // itemWidth: "280px",
            rules: { valid: "num[1,8]" },
          },
          {
            prop: "roleName",
            label: "$t[role.juese_mingcheng]",
            required: true,
            minWidth: 120,
            // itemWidth: "280px",
            labelWidth: 108,
            rules: [{ valid: "chEnNum[1,32]" }],
          },
          {
            mold: "select",
            prop: "roleType",
            label: "$t[role.juese_leixing]",
            required: true,
            minWidth: 120,
            // itemWidth: "280px",
            labelWidth: 108,
            dict: "ROLE_TYPE",
          },
          {
            mold: "select",
            prop: "roleStatus",
            label: "$t[role.juese_zhuangtai]",
            required: true,
            sortable: true,
            minWidth: 120,
            // itemWidth: "280px",
            labelWidth: 108,
            dict: "ROLE_STATUS",
          },
          {
            prop: "remark",
            label: "$t[role.beizhu_xinxi]",
            minWidth: 200,
            mold: "textarea",
            colspan: 2,
            // itemWidth: "280px",
            labelWidth: 108,
            maxlength: 64,
            showWordLimit: true,
            rules: { valid: "length[1,64]" },
          },
          {
            type: "button",
            minWidth: 200,
            btns: [
              {
                key: "menuAuth",
                text: "$t[role.caidan_quanxian]",
                click: this.showRoleAuth,
                auth: user$.tenantId ? "" : PERMISSIONS["RoleInfoManager:menuAuth"]
              },
              {
                key: "roleUser",
                text: "$t[role.juese_renyuan]",
                click: this.showRoleUser,
                auth: user$.tenantId ? "" : PERMISSIONS["RoleInfoManager:roleUser"]
              },
            ],
          }
        ],
      },
      dialogProp: {
        "is-test": true,
        "btn-close-test-id": "close-dialog",
        width: 750,
        addDefault: {
          roleType: "1",
          roleStatus: "0",
        },
      },
      dialogProp1: {
        "is-test": true,
        items: [
          {
            mold: "tree-select",
            prop: "userNo",
            label: "$t[role.renyuan_bianhao]",
            placeholder: this._locale("$t[role.renyuan_bianhao_placeholder]"),
            required: true,
            multiple: true,
            showCheckbox: true,
            collapseTags: true,
            filterable: true,
            data: []
          },
        ],

      },
      curRow: null,
      userVisible: false,
      userTitle: "$t[role.juese_renyuan]",
      formProp1: {
        "is-test": true,
        "test-suffix": "form",
        items: [
          {
            prop: "userNo",
            label: "$t[role.renyuan_bianhao]",
            rules: { valid: "length[1,8]" },
          },
        ]
      },
      tableProp1: {
        "is-test": true,
        showPagi: false,
        showSmallPagi: false,
        btns: [
          {
            key: "add",
            text: "$t[kui.form.add]",
            icon: "kui-icon-plus",
            click: this.addPage1
          }
        ],
        items: [
          {
            prop: "roleNo",
            label: "$t[role.juese_bianhao]",
            editFlag: "4",
          },
          {
            mold: "auto",
            prop: "userNo",
            label: "$t[role.renyuan_bianhao]",
            itemWidth: "100%",
            inputWidth: "400",
            minWidth: 120,
            sortable: true,
            required: true,
            placeholder: "$t[role.renyuan_bianhao_placeholder]",
            // queryUrl: ApiList.queryUserInfoSimple,
            // queryKey: "searchStr",
            valueKey: "userNo",
            labelKey: ["userNo", "userName"],
            fetchSuggestions: this.fetchSuggestions,
            rules: { required: true, trigger: ["blur", "change"] }
          },
          {
            prop: "userName",
            label: "$t[role.renyuan_xingming]",
            editFlag: "4",
          },
        ]
      },
      drawerVisible: false,
      drawerTitle: "",
      drawerBtns: [
        {
          key: "cancel",
          text: "$t[role.qu_xiao]",
          type: null,
          click: this.cancelDrawer,
          "is-test": true,
          "test-id": "cancel-drawer"
        },
        {
          key: "ok",
          text: "$t[role.que_ren]",
          click: this.okDrawer,
          "is-test": true,
          "test-id": "ok-drawer"
        },
      ],
      treeHeight: 300,
      menuLoading: false,
      menuData: [],
    };
  },
  computed: {
    tableHeight(){
      return this.$app.screen.CRUD_tableHeight;
    },
    getApiList() {
      return getApiList(this);
    },
    tenantId() {
      return user$.tenantId;
    },
    getPermissions(){
      return {
        query: this.tenantId ? "" : PERMISSIONS["RoleInfoManager:query"],
        add: this.tenantId ? "" : PERMISSIONS["RoleInfoManager:add"],
        update: this.tenantId ? "" : PERMISSIONS["RoleInfoManager:update"]
      };
    }
  },
  created (){
    this.updateRoleInfo =  this.getApiList.updateRoleInfo;
    this.queryRoleInfo = this.getApiList.queryRoleInfo;
    this.addRoleInfo = this.getApiList.addRoleInfo;
    this.queryRoleUserInfo = this.getApiList.queryRoleUserInfo;
    this.saveRoleUserInfo = this.getApiList.saveRoleUserInfo;
  },
  methods: {
    menuTreeCheck (data, node) {
      this.$refs.menuTree.cascadeNodeChild(node);
      if ((data.menuType === "2") && (node.isChecked === false)) {
        // this.$refs.menuTree.cascadeNodeParent(node.parent);
      } else if ((data.menuType === "2") && (node.isChecked === true)) {
        this.$refs.menuTree.cascadeNodeParent(node.parent);
      } else {
        this.$refs.menuTree.cascadeNodeParent(node.parent);
      }
    },
    fetchSuggestions (queryString, callback) {
      this.$http["post"](this.getApiList.queryUserInfoSimple, { searchStr: "", pageNum: 0, pageSize: 0, operExtAttr: this.curRow?.roleNo }).then((res) => {
        callback(res.data);
      });
    },
    // 获取选择人员编号列表
    getSelectRoleList () {
      this.$http["post"](this.getApiList.queryUserInfoSimple, { searchStr: "", pageNum: 0, pageSize: 0, operExtAttr: this.curRow?.roleNo }).then((res) => {
        const selectItem = this.dialogProp1.items.find(item => item.label === "$t[role.renyuan_bianhao]");
        const selectList = [];
        // 数据转成树状结构
        res.data.forEach(item => {
          const hasSelectItem = selectList.find(i => i.value === item.orgCode);
          if (hasSelectItem) {
            hasSelectItem.children.push({
              value: item.userNo,
              label: item.userName,
              ...item
            });
          } else {
            selectList.push({
              value: item.orgCode,
              label: item.orgName,
              children: [{
                value: item.userNo,
                label: item.userName,
                ...item
              }]
            });
          }
        });
        selectItem.data = selectList;
      });
    },
    addPage1 () {
      this.getSelectRoleList();
      this.$refs.page1.dialogPage.showAddDialog((data) => {
        typeof this.$refs.page1.transAddData === "function" && this.$refs.page1.transAddData(data);
        this.$refs.page1.dialogProp.loading = true;
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
      }, (data) => {
        this.$refs.page1.dialogProp.loading = false;
        this.$refs.page1.dialogPage.hideDialog();
        this.$refs.page1.dialogPage.$refs.form.clearValidate();
        this.$refs.page1.dialogPage.$refs.form.clearFields();
      });
    },
    showRoleUser (row) {
      this.curRow = row;
      this.userVisible = true;
      this.userTitle = `$t[role.jue_se]【${this.curRow.roleName}】$t[role.renyuan_xinxi]`;
      this.$nextTick(() => {
        if (this.$refs.page1 && this.$refs.page1.formEl) {
          this.$refs.page1.formEl.resetFields();
          this.$refs.page1.formQueryPage(1);
        }
      });
    },
    transQueryData (data) {
      data.roleNo = this.curRow.roleNo;
    },
    transAddData (data) {
      data.roleNo = this.curRow.roleNo;
      data.userNos = data.userNo.map(val => {
        return { userNo: val, action: "A" };
      });
    },
    transDelData (data) {
      data.roleNo = this.curRow.roleNo;
      data.userNos = [{ userNo: data.userNo, action: "D" }];
    },
    showRoleAuth (row) {
      this.curRow = row;
      const { roleNo, roleName } = row;
      this.drawerTitle = `$t[role.jue_se]【${roleNo}-${roleName}】-$t[role.shezhi_caidan_quanxian]`;
      this.drawerVisible = true;
      if (this.menuData.length > 0 && !user$.tenantId) {
        this.loadRoleMenuAuth(roleNo);
      } else {
        this.menuLoading = true;
        const queryMenu = user$.tenantId
          ? this.getApiList.queryTenantMenuGrant
          : this.$app.apiPrefix.PARAM_URL_PREFIX + this.$app.frameApiList.queryMenu;
        this.$http.post(
          queryMenu,
          {}
        ).then(res => {
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
              this.treeHeight = calcEleFitHeight(this.$refs.menuTree.$el, "kui-drawer");
              this.loadRoleMenuAuth(roleNo);
            });
          }
        });
      }
    },
    loadRoleMenuAuth (roleNo) {
      this.menuLoading = true;
      this.$http.post(this.getApiList.queryRoleMenuExec, {
        roleNo
      }).then(res => {
        this.menuLoading = false;
        this.oldMenuIds = this.getOldMenuIds(res.data);
        this.setCheckedKeys(this.oldMenuIds);
      });
    },
    getOldMenuIds (data) {
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
    setCheckedKeys (keys, isCcascade = true, isOnly = true, isChecked = true) {
      if (isOnly) {
        this.$refs.menuTree.clearChecked();
      }
      keys.forEach(key => {
        this.setCheckedKey(key, isCcascade, isChecked);
      });
    },
    setCheckedKey (key, isCcascade = true, isChecked = true) {
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
    okDrawer () {
      const { roleNo } = this.curRow;
      const menuIds = this.$refs.menuTree.getCheckedKeys(true);
      const rootIndex = menuIds.indexOf("root");
      if (rootIndex > -1) {
        menuIds.splice(rootIndex, 1);
      }
      const delMenu = difference(this.oldMenuIds, menuIds);
      const addMenu = difference(menuIds, this.oldMenuIds);
      if (delMenu.length === 0 && addMenu.length === 0) {
        this.$message.warning(this.$t("role.caidanquanxian_meiyou_xiugai"));
        return;
      }
      const menus = map(delMenu, menuId => {
        return { menuId: menuId, action: "D" };
      }).concat(map(addMenu, menuId => {
        return { menuId: menuId, action: "A" };
      }));
      this.$http.post(this.getApiList.saveRoleMenuExec, {
        roleNo,
        menus,
      }).then(res => {
        this.$message.success(this.$t("role.caidanquanxian_set_success"));
        this.drawerVisible = false;
      });
    },
    cancelDrawer () {
      this.drawerVisible = false;
    },
  }
};
</script>
