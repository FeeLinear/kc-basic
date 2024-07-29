<template>
  <kui-dialog
    class="tenant-config-dialog"
    title="租户配置"
    :visible.sync="tenantConfigShow"
    top="12px"
    height="1000"
    :partial-dialog="true"
    :fullscreen="true"
    container-selector=".tenant-manager"
    :show-footer="false"
    @close="close"
  >
    <div class="tenant-config">
      <div class="tenant-config-header">
        <div v-if="selectedTenantLogo" class="logo-img">
          <img :src="selectedTenantLogo" alt="租户logo">
        </div>
        <div v-else class="logo txt" style="background: rgb(255, 191, 0);">
          {{selectedTenantName.slice(0, 1)}}
        </div>
        <span class="title">{{selectedTenantName}}</span>
      </div>

      <kui-tabs v-model="activeName" :panes="panes" @tab-click="tabClick">
        <div slot="baseInfo">
          <base-info ref="baseInfo"></base-info>
        </div>
        <div slot="roleManage">
          <role-info-manage ref="roleManage"></role-info-manage>
        </div>
        <div slot="userManage">
          <user-manage ref="userManage"></user-manage>
        </div>
      </kui-tabs>
    </div>
  </kui-dialog>
</template>

<script>
import BaseInfo from "./components/BaseInfo.vue"
import RoleInfoManage from "../user/RoleInfoManager.vue"
import UserManage from "./components/UserManage.vue"

export default {
  name: "TenantConfig",
  components: {
    BaseInfo,
    RoleInfoManage,
    UserManage
  },
  props: {
    tenantConfigShow: {
      type: Boolean,
      default: false
    },
    selectedTenantId: {
      type: String,
      default: ""
    },
    selectedTenantName: {
      type: String,
      default: ""
    },
    selectedTenantLogo: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      activeName: 'baseInfo',
      dialogHeight: "",
      currentTenantId: "",
      panes: [
        {
          name: "baseInfo",
          label: "基本信息",
        },
        {
          name: "roleManage",
          label: "角色管理",
        },
        {
          name: "userManage",
          label: "用户管理",
        }
      ]
    }
  },
  watch: {
    tenantConfigShow(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs["baseInfo"].getTenantInfo();
          this.currentTenantId = this.selectedTenantId;
        })
      }
    }
  },
  mounted() {
    this.setDialogHeight();
  },
  methods: {
    setDialogHeight() {
      this.$nextTick(() => {
        const frameContentDom = document.getElementsByClassName("kframe-layout-content")[0];
        const h = window.getComputedStyle(frameContentDom).height;
        this.dialogHeight = h.slice(0, h.length - 2);
        const dialogDom = document.getElementsByClassName("el-dialog kui-dialog hide-footer")[0];
        dialogDom.style.height = this.dialogHeight + "px";
      })
    },
    tabClick(tab) {
      const type = tab.name;
      if (type === "userManage") {
        this.$refs["userManage"].queryTanentUser();
      }
      if (type === "roleManage") {
        this.$refs["roleManage"].$refs["rolePage"].formQueryPage();
      }
    },
    close() {
      this.$emit("close");
      this.activeName = "baseInfo";
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant-config-dialog {
  border: 1px solid rgba(255, 255, 255, .8);
  z-index: 0 !important;
  .tenant-config{
    background: #fff;
    padding: 50px 10px 0 10px;
    &-header {
      display: flex;
      width: calc(100% - 60px);
      height: 56px;
      position: absolute;
      top: 50px;
      left: 30px;
      bottom: 0;
      margin-top: 10px;
      padding: 8px 12px;
      background: rgba(0, 0, 0, .1);
      .logo-img{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .txt {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        color: #fff;
      }
      .logo {
        width: 40px;
        height: 40px;
        border-radius: 20px
      }
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        margin: 0 20px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>