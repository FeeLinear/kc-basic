<template>
  <div>
    <kui-table-page
      ref="userManage"
      :loading="loading"
      :btns="btns"
      :items="items"
      :pagi-prop="{pageSize: 10, pageSizes: [10, 20, 50, 100]}"
      @size-change="tenantUserListChange"
      @current-page-change="tenantUserListChange"
    >
    </kui-table-page>

    <!-- 新增用户弹窗 -->
    <kui-dialog
      :visible.sync="addUserDialogShow"
      :width="800"
    >
      <div slot="title">
        <span class="add-header">
          <span>新增用户</span>
        </span>
      </div>
      <div>
        <kui-page
          ref="addUser"
          :auto-query="false"
          :form-prop="formProp"
          :table-prop="tableProp"
          @size-change="sizeOrPageChange"
          @current-page-change="sizeOrPageChange"
          @select="tableSelect"
        >
        </kui-page>
      </div>
      <div slot="footer">
        <kui-button @click="cancleAddUser">取消</kui-button>
        <kui-button @click="addUserConfirm">确认</kui-button>
      </div>
    </kui-dialog>

    <!-- 移除用户弹窗 -->
    <kui-dialog
      :visible.sync="delUserDialogShow"
      :width="400"
    >
      <div slot="title">
        <span class="del-header">
          <i class="el-icon-warning"></i>
          <span>移除用户</span>
        </span>
      </div>
      <div>
        <div class="del-tip">
          {{`确认要移除用户【${currentDelUserInfo.userName}】？`}}
        </div>
      </div>
      <div slot="footer">
        <kui-button @click="delUserDialogShow = false">取消</kui-button>
        <kui-button @click="delUserConfirm">确认</kui-button>
      </div>
    </kui-dialog>
  </div>
</template>

<script>
import { getApiList } from "../url.config.ts";
export default {
  name: "UserManage",
  data() {
    return {
      loading: false,
      delUserDialogShow: false,
      addUserDialogShow: false,
      currentDelUserInfo: {}, // 正在被删除的用户信息
      selectedUserArr: [], // 新增用户时被选中的用户
      formProp: {
        btns: [
          {
            key: "query",
            text: "查询",
            click: this.handleClickQueryUser
          },
        ],
        items: [
          {
            mold: "input",
            prop: "orgCode",
            label: "机构代码",
          },
          {
            mold: "input",
            prop: "userNo",
            label: "人员编号",
          },
          {
            mold: "input",
            prop: "userName",
            label: "姓名",
          }
        ]
      },
      tableProp: {
        items: [
          {
            type: "select"
          },
          {
            prop: "userNo",
            label: "人员编号",
          },
          {
            prop: "userName",
            label: "姓名",
          },
          {
            prop: "email",
            label: "邮箱",
          },
          {
            prop: "orgCode",
            label: "机构代码",
          },
          {
            prop: "orgName",
            label: "机构名称",
          }
        ],
      },

      btns: [
        {
          text: "新增",
          click: this.openAddUserDialog
        },
      ],
      items: [
        {
          prop: "userNo",
          label: "人员编号",
        },
        {
          prop: "userName",
          label: "姓名",
        },
        {
          prop: "email",
          label: "邮箱",
        },
        {
          prop: "userRoles",
          label: "角色",
          opts: [],
          multiple: true,
          valueKey: "roleNo",
          labelKey: "roleName"
        },
        {
          type: "button",
          width: 120,
          btns: [
            {
              text: "移除",
              click: this.openDeleteUserDialog
            }
          ],
        }
      ],
    }
  },
  computed: {
    getApiList() {
      return getApiList(this);
    }
  },
  mounted() {
    this.queryRoles();
  },
  methods: {
    handleClickQueryUser() {
      this.queryUser();
    },
    // 查询租户下对应的用户，请求头默认添加tanentId
    async queryTanentUser(pageNum = 1, pageSize = 10) {
      this.loading = true;
      const { data, total } = await this.$http.post(this.getApiList.queryTenantUser, {
        pageSize,
        pageNum
      }).catch(() => {
        this.loading = false
      });
      this.$refs["userManage"].loadData(data, total, pageNum, pageSize);
      this.loading = false;
    },

    // 查询非租户下的用户
    async queryUser(pageNum = 1, pageSize = 10) {
      this.$nextTick(async () => {
        const addUserRef = this.$refs["addUser"];
        const { orgCode, userNo, userName } = addUserRef.formProp.model;
        const params = {
          orgCode,
          userNo,
          userName,
          pageSize,
          pageNum
        };
        const { data, total } = await this.$http.post(this.getApiList.queryUser, params).catch(() => {});
        addUserRef.tablePage.loadData(data, total, pageNum, pageSize);
      });
    },

    // 查询角色
    queryRoles() {
      this.$http.post(this.getApiList.queryRoleInfoSimple, {}).then((res) => {
        const index = this.items.findIndex(function (item) {
          return item.prop === "userRoles";
        });
        this.items[index].opts = res.data;
      });
    },

    openAddUserDialog() {
      this.addUserDialogShow = true;
      this.queryUser();
    },
    cancleAddUser() {
      this.addUserDialogShow = false;
      this.$refs["addUser"].formProp.model.orgCode = "";
      this.$refs["addUser"].formProp.model.userNo = "";
      this.$refs["addUser"].formProp.model.userName = "";
    },
    addUserConfirm() {
      const userNos = this.selectedUserArr.map(item => item.userNo);
      if(!userNos.length) {
        return this.$message.warning("请选择用户！");
      }
      this.$http.post(this.getApiList.addTenantUser, { userNos })
        .then(() => {
          this.$message.success("用户添加成功！");
          this.cancleAddUser();
          this.queryTanentUser();
        })
    },

    openDeleteUserDialog(data) {
      this.currentDelUserInfo = data
      this.delUserDialogShow = true
    },
    delUserConfirm() {
      this.$http.post(this.getApiList.deleteTenantUser, {
        userNo: this.currentDelUserInfo.userNo
      }).then(() => {
        this.delUserDialogShow = false;
        this.$message.success("移除成功！");
        this.queryTanentUser();
      }).catch(() => {
        this.delUserDialogShow = false;
        this.$message.error("移除失败！");
      })
    },

    // 多选表格
    tableSelect () {
      this.$nextTick(() => {
        const tableEl = this.$refs["addUser"].tableEl;
        this.selectedUserArr = tableEl.getSelected();
      });
    },
    // 租户下用户列表切换pageNum或pageSize
    tenantUserListChange(page, size){
      this.queryTanentUser(page, size);
    },
    // 新增租户用户列表切换pageNum或pageSize
    sizeOrPageChange(page, size) {
      this.queryUser(page, size);
    }
  }
}
</script>

<style lang="scss" scoped>
.add-header {
  font-weight: 700;
  font-size: 16px;
}
.del-header{
  font-weight: 700;
  font-size: 16px;
  &>i{
    color: #ffa84c;
    padding-right: 8px;
  }
}
</style>
