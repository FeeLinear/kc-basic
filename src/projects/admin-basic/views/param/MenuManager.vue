<template>
  <kui-layout
    class="menu-manager"
    is-block
    aside-width="232"
    main-not-block
    :height="bodyHeight"
  >
    <div slot="aside">
      <kui-input
        v-model="filterVal"
        style="padding-left:8px"
        placeholder="$t[menuManager.shuru_guanjianzi_guolv]"
        suffix-icon="kui-icon-search"
        :is-test="true"
        width="208"
      ></kui-input>
      <kui-tree
        ref="tree"
        style="margin-top: 8px"
        :loading="loading"
        :data="data"
        :label-width="150"
        :height="treeHeight"
        :width="225"
        value-key="menuId"
        label-key="menuName"
        draggable
        :is-test="true"
        test-id="tree"
        @node-click="menuClick"
        @node-drop="menuDrop"
      >
        <template #btns="{ node }">
          <div style="display:flex">
            <kui-button
              v-if="node.data.menuUrl"
              :icon="
                isHomePage ? 'kui-icon-flag-fill' : 'kui-icon-flag'
              "
              :data="node.data"
              type="text"
              title="设置首页"
              style="padding-right:14px;"
              @click="setHomePage"
            />
            <kui-popover
              v-if="node.data.menuType === '0'"
              trigger="hover"
              popper-class="menu-btns-popper"
              placement="bottom"
            >
              <div slot="content">
                <div class="popover-item">
                  <kui-button
                    type="text"
                    text="$t[menuManager.tianjia_zi_caidan]"
                    :data="node.data"
                    test-id="addSubMenu"
                    :is-test="true"
                    @click="addSonMenu"
                  />
                </div>
                <div class="popover-item">
                  <kui-button
                    type="text"
                    text="$t[menuManager.tianjia_tongji_caidan]"
                    :data="node.data"
                    test-id="addMenu"
                    :is-test="true"
                    @click="addNextMenu"
                  />
                </div>
              </div>
              <div slot="reference">
                <kui-button
                  icon="kui-icon-plus"
                  type="text"
                  style="padding-right:14px;"
                />
              </div>
            </kui-popover>
          </div>
        </template>
      </kui-tree>
    </div>
      <kui-field height="100%" style="overflow: auto" is-block :title="fieldTitle">
        <kui-button
          slot="title-right"
          class="view-btn"
          type="text"
          icon="kui-icon-unlock"
          text="$t[menuManager.anniu_quanxian]"
          :disabled="curNode && (curNode.parentMenu == '' || curNode.menuType == '1')"
          @click="showBtnDrawer = true"
        />
        <div ref="formBox">
          <kui-form
            ref="form"
            :model="model"
            :items="items"
            :label-width="95"
            :col-num="2"
            :is-test="true"
          ></kui-form>
        </div>
        <template #bottom>
        <kui-button
          v-if="!showEditBtn"
          key="back"
          text="$t[menuManager.qu_xiao]"
          test-id="cancle"
          :is-test="true"
          @click="returnMenuInfo"
        />
        <kui-button
          v-if="showEditBtn"
          key="edit"
          icon="kui-icon-edit"
          text="$t[menuManager.xiu_gai]"
          test-id="edit"
          :is-test="true"
          @click="goMenuEdit"
        />
        <kui-button
          v-if="!showEditBtn"
          key="collection"
          text="$t[menuManager.bao_cun]"
          test-id="save"
          :is-test="true"
          @click="saveMenuInfo"
        />
      </template>
      </kui-field>
    <kui-drawer
      ref="drawer"
      size="640"
      :visible.sync="showBtnDrawer"
      title="$t[menuManager.anniu_quanxian]"
    >
      <kui-table :data="tableData" class="btn-table">
        <kui-table-column :label="$t('menuManager.quanxian_bianhao')" prop="menuId">
          <template slot-scope="{scope}">
            <span style="padding-left:20px;">{{ scope.row.menuId }}</span>
          </template>
        </kui-table-column>
        <kui-table-column :label="$t('menuManager.anniu_mingcheng')" prop="menuName">
          <template slot-scope="{scope}">
            <span v-if="!scope.row.isEdit" style="padding-left:20px;">{{ scope.row.menuName }}</span>
            <kui-input v-else v-model="scope.row.menuName" width="140" style="padding-left:10px;"></kui-input>
          </template>
        </kui-table-column>
        <kui-table-column :label="$t('menuManager.quanxian_code')" prop="permissionAlias">
          <template slot-scope="{scope}">
            <span v-if="!scope.row.isEdit" style="padding-left:20px;">{{ scope.row.permissionAlias }}</span>
            <kui-input v-else v-model="scope.row.permissionAlias" width="140" style="padding-left:10px;"></kui-input>
          </template>
        </kui-table-column>
        <kui-table-column width="92">
          <template slot-scope="{scope}">
            <div v-if="!scope.row.isEdit">
              <kui-button
                :class="[scope.row.menuStatus === '0' ? 'kui-icon-unlock' : 'kui-icon-lock']"
                type="text"
                :title="scope.row.menuStatus === '0'?$t('menuManager.qi_yong'):$t('menuManager.jin_yong')"
                @click="handleActive(scope.row)"
              ></kui-button>
              <kui-button class="kui-icon-edit" type="text" @click="handleEdit(scope.$index,scope.row)"></kui-button>
            </div>
            <div v-else>
              <kui-button type="text" @click="handleSave(scope.$index)">{{ $t("menuManager.bao_cun") }}</kui-button>
              <kui-button type="text" icon="kui-icon-close" @click="handleCancel(scope.$index,scope.row)"></kui-button>
            </div>
          </template>
        </kui-table-column>
      </kui-table>
      <div
        v-if="!addBtn"
        class="btn-footer"
        @click="addBtn = true;btnForm={permissionAlias:'',menuName:'',menuId:''}"
      ><i class="kui-icon-plus" />{{ $t("menuManager.tianjia_anniu_quanxian") }}</div>
      <div v-else class="btn-form">
        <kui-form :model="btnForm">
          <kui-form-item prop="menuId">
            <kui-input v-model="btnForm.menuId" width="130"></kui-input>
          </kui-form-item>
          <kui-form-item prop="menuName">
            <kui-input v-model="btnForm.menuName" width="130"></kui-input>
          </kui-form-item>
          <kui-form-item prop="permissionAlias">
            <kui-input v-model="btnForm.permissionAlias" width="130"></kui-input>
          </kui-form-item>
          <kui-form-item style="padding-left: 0">
            <kui-button type="text" @click="handleAdd">{{ $t("menuManager.ti_jiao") }}</kui-button>
            <kui-button class="kui-icon-close" type="text" width="28" @click="addBtn = false"></kui-button>
          </kui-form-item>
        </kui-form>
      </div>
    </kui-drawer>
  </kui-layout>
</template>
<script>
import { getApiList } from "./url.config";
import { calcEleFitHeight } from "szkingdom.yf.koca-template/lib/utils/dom";
import { isEqual } from "szkingdom.yf.koca-template/lib/utils/utils";
import { each,cloneDeep } from "lodash-es";
export default {
  name: "MenuManager",
  data() {
    return {
      filterVal: "",
      treeHeight: 430,
      loading: false,
      data: [],
      fieldTitle: "$t[menuManager.caidan_xinxi]",
      model: {
        menuId: "",
        menuName: "",
        menuStatus: "0",
        menuType: "0",
        menuUrl: "",
        menuIcon: "",
        parentMenu: "-1",
        prevMenu: "",
        loadType: "0",
        remark: "",
      },
      items: [
        {
          prop: "menuId",
          label: "$t[menuManager.caidan_bianhao]",
          required: true,
          rules: { valid: "num[1,8]" },
        },
        {
          prop: "menuName",
          label: "$t[menuManager.caidan_mingcheng]",
          required: true,
          rules: { valid: "length[2,64]" },
        },
        {
          mold: "select",
          prop: "menuStatus",
          label: "$t[menuManager.caidan_zhuangtai]",
          required: true,
          dict: "MENU_STATUS",
        },
        {
          mold: "select",
          prop: "menuType",
          label: "$t[menuManager.caidan_leixing]",
          required: true,
          dict: "MENU_TYPE",
        },
        {
          prop: "menuUrl",
          label: "$t[menuManager.caidan_lianjie]",
          rules: { valid: "length[1,256]" },
          colspan: 2,
        },
        {
          mold: "icon-picker",
          prop: "menuIcon",
          label: "$t[menuManager.caidan_tubiao]",
          rules: { valid: "nch[1,30]" },
          icons: [
            "kui-icon-member",
            "kui-icon-excel",
            "kui-icon-videocall",
            "kui-icon-monitorpoint",
            "kui-icon-apply",
            "kui-icon-operation",
            "kui-icon-review",
            "kui-icon-data",
            "kui-icon-run",
            "kui-icon-attemper",
            "kui-icon-database",
            "kui-icon-tools-operation",
            "kui-icon-indicator",
            "kui-icon-fullview",
            "kui-icon-monitor",
            "kui-icon-alarm",
            "kui-icon-gateway",
            "kui-icon-access",
            "kui-icon-flow",
            "kui-icon-alarm-clock",
            "kui-icon-vision",
            "kui-icon-register",
            "kui-icon-tools",
            "kui-icon-batch",
            "kui-icon-glide",
            "kui-icon-menu",
            "kui-icon-routine",
            "kui-icon-files",
            "kui-icon-reports",
            "kui-icon-engine",
            "kui-icon-designer",
            "kui-icon-setting",
            "kui-icon-API",
            "kui-icon-code",
          ],
        },
        {
          mold: "select",
          prop: "loadType",
          label: "$t[menuManager.jiazai_leixing]",
          required: true,
          dict: "LOAD_TYPE",
        },
        {
          mold: "input",
          prop: "parentMenu",
          label: "$t[menuManager.fu_caidan]",
          disabled: true,
        },
        {
          mold: "input",
          prop: "prevMenu",
          label: "$t[menuManager.qianzhi_caidan]",
          disabled: true,
        },
        {
          mold: "textarea",
          prop: "remark",
          label: "$t[menuManager.beizhu_xinxi]",
          width: 445,
          colspan: 2,
          maxlength: 64,
          showWordLimit: true,
          rules: { valid: "length[1,64]" },
        },
      ],
      editFlag: false,
      curNode: null,
      showEditBtn: true,
      showBtnDrawer:false,
      btnData:[],
      addBtn:false,
      isActive:false,
      btnForm:{
        permissionAlias:"",
        menuName:"",
        menuId:""
      }
    };
  },
  computed: {
    getApiList() {
      return getApiList(this);
    },
    isHomePage() {
      return (
        this.$menus.homepageRoute &&
        this.$menus.homepageRoute.menuId === this.curNode.menuId
      );
    },
    bodyHeight(){
      return this.$app.screen.contentHeight;
    },
    tableData:{
      get(){
        return this.curNode ? this.btnData.filter(item=>item.parentMenu == this.curNode.menuId) : [];
      },
      set(val){

      }
    }
  },
  watch: {
    "filterVal"(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted: function () {
    this.$nextTick(() => {
      this.queryMenuTree();
      this.resize();
    });
    const that = this;
    window.addEventListener("resize", function () {
      that.resize();
    });
  },
  methods: {
    handleActive(row){
      row.menuStatus = row.menuStatus === "0" ? "1":"0";
      const {loadType,menuIcon,menuId,menuName,menuStatus,menuType,menuUrl,parentMenu,permissionAlias,prevMenu,remark}=row;
      const param = {loadType,menuIcon,menuId,menuName,menuStatus,menuType,menuUrl,parentMenu,permissionAlias,prevMenu,remark};
      this.$http.post(this.getApiList.updateMenuInfo,param).then(()=>{
        this.$http.post(this.getApiList.queryMenuTree, {}).then((res) => {
          if (Array.isArray(res.data)) {
            this.btnData = this.filterBtnData(cloneDeep(res.data));
          }
        });
      });
    },
    handleEdit(index,row){
      row.oldPermissionAlias = row.permissionAlias;
      row.oldMenuName = row.menuName;
      this.$set(this.tableData[index],"isEdit",true);
    },
    handleCancel(index,row){
      row.permissionAlias = row.oldPermissionAlias;
      row.menuName = row.oldMenuName;
      this.$set(this.tableData[index],"isEdit",false);
    },
    handleSave(index){
      this.$set(this.tableData[index],"isEdit",false);
      const {loadType,menuIcon,menuId,menuName,menuStatus,menuType,menuUrl,parentMenu,permissionAlias,prevMenu,remark}=this.tableData[index];
      const param = {loadType,menuIcon,menuId,menuName,menuStatus,menuType,menuUrl,parentMenu,permissionAlias,prevMenu,remark};
      this.$http.post(this.getApiList.updateMenuInfo,param).then(()=>{
        this.$http.post(this.getApiList.queryMenuTree, {}).then((res) => {
          if (Array.isArray(res.data)) {
            this.btnData = this.filterBtnData(cloneDeep(res.data));
          }
        });
      });
    },
    handleAdd(){
      const defaultForm = {
        loadType: "0",
        menuIcon: "",
        menuStatus: "0",
        menuType: "2",
        menuUrl: "",
        parentMenu: this.curNode.menuId,
        prevMenu: "",
        remark: ""
      };
      this.$http.post( this.getApiList.addMenuInfo,Object.assign({},defaultForm,this.btnForm)).then(()=>{
        this.addBtn = false;
        this.$http.post(this.getApiList.queryMenuTree, {}).then((res) => {
          if (Array.isArray(res.data)) {
            this.btnData = this.filterBtnData(cloneDeep(res.data));
          }
        });
      });
    },
    // 菜单拖拽
    menuDrop(node, endNode, position, event) {
      const data = {
        menuId: node.data.menuId,
        targetMenuId: endNode.data.menuId,
        position: position,
      };
      this.$http.post(this.getApiList.saveMenuDrag, data).then((res) => {
        this.queryMenuTree(data.menuId);
        this.$menus.initMenus();
      });
    },
    // 添加子菜单
    addSonMenu(data) {
      this.editFlag = false;
      this.showEditBtn = false;
      this.fieldTitle = `$t[menuManager.cai_dan]【${data.menuName}】-$t[menuManager.tianjia_zi_caidan]`;
      this.$refs.form.resetFields();
      this.$refs.form.enabledFields([
        "menuId",
        "menuName",
        "menuStatus",
        "menuType",
        "menuUrl",
        "menuIcon",
        "loadType",
        "remark",
      ]);
      this.model.parentMenu = data.menuId;
      this.model.prevMenu =
        Array.isArray(data.children) && data.children.length > 0
          ? data.children[data.children.length - 1].menuId
          : "";
    },
    // 添加同级菜单
    addNextMenu(data) {
      this.editFlag = false;
      this.showEditBtn = false;
      this.fieldTitle = `$t[menuManager.cai_dan]【${data.menuName}】-$t[menuManager.tianjia_tongji_caidan]`;
      this.$refs.form.resetFields();
      this.$refs.form.enabledFields([
        "menuId",
        "menuName",
        "menuStatus",
        "menuType",
        "menuUrl",
        "menuIcon",
        "loadType",
        "remark",
      ]);
      this.model.parentMenu = data.parentMenu;
      this.model.prevMenu = data.menuId;
    },
    // 将菜单设置为首页
    async setHomePage(data) {
      if (this.isHomePage) {
        await this.$menus.clearHomePage();
        this.$message.success("取消成功");
      } else {
        await this.$menus.setHomePage(data);
        this.$message.success("设置成功");
      }
    },
    // 保存菜单编辑信息
    saveMenuInfo() {
      const url = this.editFlag
        ? this.getApiList.updateMenuInfo
        : this.getApiList.addMenuInfo;
      if (!isEqual(this.model, this.curNode)) {
        this.$refs.form.valid(() => {
          this.$http.post(url, this.model).then((res) => {
            if (this.editFlag) {
              this.$message.success(
                this.$t("menuManager.caidan_bianji_chenggong")
              );
            } else {
              this.$message.success(
                this.$t("menuManager.caidan_tianjia_chenggong")
              );
            }
            this.queryMenuTree(this.model.menuId);
            this.$menus.initMenus();
          });
        });
      } else {
        this.$message.warning(this.$t("menuManager.shuju_meiyou_xiugai"));
      }
    },
    // 返回菜单信息界面
    returnMenuInfo() {
      this.showMenuInfo(this.curNode);
    },
    // 进入菜单信息编辑
    goMenuEdit() {
      this.editFlag = true;
      this.showEditBtn = false;
      this.fieldTitle = `$t[menuManager.cai_dan]【${this.curNode.menuName}】$t[menuManager.xin_xi]-$t[menuManager.xiu_gai]`;
      this.$refs.form.enabledFields([
        "menuName",
        "menuStatus",
        "menuType",
        "menuUrl",
        "menuIcon",
        "loadType",
        "remark",
      ]);
    },
    // 查询菜单信息，构造菜单树形结构
    queryMenuTree(menuId) {
      this.filterVal = "";
      this.loading = true;
      return this.$http.post(this.getApiList.queryMenuTree, {}).then((res) => {
        this.loading = false;
        if (Array.isArray(res.data)) {
          const curMenuId = menuId || res.data[0].menuId;
          this.data = this.filterTreeData(cloneDeep(res.data));
          this.btnData = this.filterBtnData(cloneDeep(res.data));
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(curMenuId);
            this.curNode = this.$refs.tree.getCurrentData();
            this.showMenuInfo(this.curNode);
          });
        }
      });
    },
    filterTreeData(data){
      return data.filter(element => {
        if(element.children.length > 0) element.children = this.filterTreeData(element.children);
        return element.menuType != "2";
      });
    },
    filterBtnData(data,arr=[]){
      data.forEach(item=>{
        if(item.children.length > 0) this.filterBtnData(item.children,arr);
        if(item.menuType == "2") arr.push(item);
      });
      return arr;
    },
    // 菜单树，点击事件，加载菜单信息
    menuClick(data) {
      this.curNode = data;
      this.addBtn = false;
      this.btnForm = { permissionAlias:"", menuName:"", menuId:""};
      this.showMenuInfo(data);
    },
    showMenuInfo(data) {
      this.showEditBtn = true;
      this.$refs.form.clearValidate();
      this.fieldTitle = `$t[menuManager.cai_dan]【${data.menuName}】$t[menuManager.xin_xi]`;
      each(this.model, (val, key) => {
        this.model[key] = data[key];
      });
      this.$refs.form.disabledFields();
    },
    resize() {
      // const screen = this.$app.screen;
      // this.bodyHeight = screen.contentHeight;
      // this.bodyHeight = calcEleFitHeight(this.$el, "frame-main");
      this.$nextTick(() => {
        this.treeHeight = calcEleFitHeight(this.$refs.tree.$el, "kui-aside");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "scss/mixin/layout-variables.scss";
.menu-manager {
  // height: calc(
  //   100vh - #{$topbar-height} - #{$tabnav-height} - #{$content-margin} * 2
  // ) !important;
  /deep/.kui-main {
    position: relative;
  }
  /deep/.kui-tree-node {
    .node-label {
      flex: 1;
    }
  }
}
::v-deep .el-table--border,::v-deep .el-table th,::v-deep .el-table td{
  border: none;
}
::v-deep .kui-table.el-table td .cell{
  padding-left: 0px;
}
::v-deep .btn-table{
  & .kui-table.el-table.el-table--mini.kui-table--easy .kui-button.kui-button--easy{
    width: 28px;
    .kui-icon-close{
      color:#66686C
    }
  }
}
::v-deep .view-btn {
  margin-right: 8px;
  font-size: 14px;
  color: #111 !important;
  & > i {
    color: var(--color-primary);
    font-size: 14px;
  }
}
.btn-footer{
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px dashed #B6BABE;
  border-radius: 4px;
  & > i{
    color: #66686C;
    padding-right: 2px
  }
}
.btn-form{
  .kui-form--easy.el-form--inline .el-form-item{
    margin: 8px 0px 8px 0px;
    padding: 0 23px 0 10px;
    .kui-button.kui-button--easy{
      padding: 4px 0px;
    }
  }
  .kui-icon-close{
    color:#66686C
  }
}
::v-deep .el-table::before,::v-deep .el-table::after {
  background-color: unset;
}
</style>
<style lang="scss">
@import "scss/mixin/layout-variables.scss";
.fullscreen {
  .menu-manager {
    height: calc(100vh - #{$content-margin} * 2) !important;
  }
}
.menu-manager {
  .el-button--text {
    color:#66686C;
  }
  .kui-aside{
    padding: 16px 16px 16px 8px !important;
    .el-form-item__content {
      width: 100%;
    }
    .el-form{
      text-align: center;
    }
    .node-content.is-current::before{
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      right: 0;
      top: 12px;
      z-index: 1;
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
}
.menu-btns-popper {
  width:130px;
  padding: 8px 0px!important ;
  margin-top: 5px !important;
  .popover-item{
    padding: 0px 30px 0 16px;
    line-height: 36px;
    &:hover{
      background-color: #f5f7fa;
      cursor: pointer;
    }
  }
  .el-button--text {
    color:black;
    &:hover{
      color: black !important;
    }
  }
}

</style>
