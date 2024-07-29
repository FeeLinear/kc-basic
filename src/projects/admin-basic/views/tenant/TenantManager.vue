<template>
  <div class="tenant-manager">
    <div class="search-box">
      <kui-input
        :width="600"
        v-model="filterTenantVal"
        placeholder="请输入租户名称、代码或描述"
        @keyup.enter.native="handleSearchTenant"
      >
        <kui-button class="search-btn" slot="append" @click="handleSearchTenant">搜索</kui-button>
      </kui-input>
    </div>
    <div class="tenant-list">
      <kui-row>
        <kui-col class="item" :span="8">
          <div class="new-tenant" @click="openAddTenantDialog">
            <kui-icon class="icon kui-icon-plus"></kui-icon>
            <span>新增租户</span>
          </div>
        </kui-col>
        <kui-col class="item" :span="8" v-for="(item, key) in filterTenantList" :key="`tenant_${key}}`">
          <div class="tenant-card">
            <div class="main-container">
              <div class="main-container-left">
                <div v-if="item.tenantLogo" class="logo-img">
                  <img :src="tenantLogoObj[item.tenantId]" alt="租户logo">
                </div>
                <div v-else class="logo txt" style="background: rgb(255, 191, 0);">
                  {{item.tenantName.slice(0, 1)}}
                </div>
              </div>
              <div class="main-container-right">
                <div class="title">{{item.tenantName}}</div>
                <div class="description">{{item.tenantDesc}}</div>
              </div>
            </div>
            <div class="footer">
              <div class="btns">
                <div class="btn" @click="goTenantConfig(item, tenantLogoObj[item.tenantId])">配置</div>
                <!-- <div class="btn">开发</div> -->
                <!-- <div class="btn" @click="deleteTenantClick(item)">删除</div> -->
              </div>
            </div>
          </div>
        </kui-col>
      </kui-row>
    </div>

    <!-- 新增租户弹窗 -->
    <kui-dialog
      :visible.sync="addDialogShow"
      :width="620"
    >
      <div slot="title">
        <span class="add-header">新增租户</span>
      </div>
      <div>
        <kui-form
          :model="addTableModel"
          ref="addTenantForm"
          :items="addTableItems"
          item-width="100%"
        >
        </kui-form>
        <div class="logo-text">租户logo</div>
        <kui-upload
          v-if="!tenantLogo || !tenantLogoBase64"
          :action="uploadAction"
          :headers="uploadHeader"
          drag
          :show-file-list="false"
          :on-success="uploadTenantLogoSuccess"
          :on-error="uploadTenantLogoError"
          :before-upload="onBeforeUpload"
        >
          <span class="kui-icon-upload"></span>
          <div class="upload-text" v-text="'点击上传'"></div>
        </kui-upload>
        <div v-else class="logo-big">
          <img
            :src="tenantLogoBase64"
            alt="租户logo"
          >
        </div>
      </div>
      <div slot="footer">
        <kui-button @click="cancleAddDialog">取消</kui-button>
        <kui-button @click="addTenantConfirm">确认</kui-button>
      </div>
    </kui-dialog>

    <!-- 删除租户弹窗 -->
    <!-- <kui-dialog
      :visible.sync="delDialogShow"
      :width="400"
    >
      <div slot="title">
        <span class="del-header">
          <i class="el-icon-warning"></i>
          <span>删除确认</span>
        </span>
      </div>
      <div>
        <div class="del-tip">
          {{`确认删除应用【${delTenantInfo.tenantName}】吗？该操作无法撤销，请填写确认信息再进行删除操作！`}}
        </div>
        <kui-form
          :model="delTableModel"
          ref="delTenantForm"
          :items="delTableItems"
        >
        </kui-form>
      </div>
      <div slot="footer">
        <kui-button @click="cancleDelDialog">取消</kui-button>
        <kui-button @click="delTenantConfirm">确认</kui-button>
      </div>
    </kui-dialog> -->
    <tenant-config
      :tenant-config-show="tenantConfigShow"
      :selected-tenant-id="selectedTenantId"
      :selected-tenant-name="selectedTenantName"
      :selected-tenant-logo="selectedTenantLogo"
      @close="closeTenantConfig"
    ></tenant-config>
  </div>
</template>

<script>
import  TenantConfig from "./TenantConfig.vue";
import { getApiList } from "./url.config.ts";
import { getLocalStorage, removeLocalStorage } from "szkingdom.yf.koca-template/lib/utils/cache";
import { user$ } from "szkingdom.yf.koca-template/lib/store";
export default {
  name: "TenantManager",
  components: {
    TenantConfig
  },
  data() {
    var validateTenantId = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_]{0,}$/;
      if (!reg.test(value)){
        callback(new Error("租户代码不能含有中文或特殊字符"));
      } else {
        callback();
      }
    }
    return {
      filterTenantVal: "", // 搜索租户input值
      addDialogShow: false, // 增加租户弹窗显示/隐藏
      delDialogShow: false, // 删除租户弹窗显示/隐藏
      tenantConfigShow: false, // 租户配置弹窗显示/隐藏
      tenantLogo: "",
      tenantLogoBase64: "",
      tenantList: [], 
      filterTenantList: [], // 筛选后的租户列表
      tenantLogoObj: {},
      selectedTenantId: "",
      selectedTenantName: "",
      selectedTenantLogo: "",
      addTableModel: {
        tenantId: "",
        tenantName: "",
        tenantDesc: "",
      },
      addTableItems: [
        {
          prop: "tenantName",
          label: "租户名称",
          required: true,
          "input-width": "100%",
          maxlength: 30
        },
        {
          prop: "tenantId",
          label: "租户代码",
          required: true,
          "input-width": "100%",
          maxlength: 15,
          rules: [{ validator: validateTenantId, trigger: "blur" }],
        },
        {
          mold: "textarea",
          prop: "tenantDesc",
          label: "租户描述",
          required: true,
          maxlength: 100
        },
      ],
      uploadAction: "",
      uploadHeader: {},
      // delTenantInfo: {},
      // delTableModel: {
      //   tenantId: "",
      //   tenantName: ""
      // },
      // delTableItems: [
      //   {
      //     prop: "tenantName",
      //     label: "租户名称",
      //     required: true,
      //     // rules: { valid: "num[1,8]" },
      //   },
      //   {
      //     prop: "tenantId",
      //     label: "租户代码",
      //     required: true
      //   }
      // ],
    }
  },
  computed: {
    getApiList() {
      return getApiList(this);
    },
    tenantId() {
      return user$.tenantId;
    }
  },
  watch: {
    tenantId(val) {
      if(!val) {
        this.tenantConfigShow = false;
      } 
    }
  },
  mounted() {
    const apiUrl = this.getBaseUrl(this.$app.apiUrl) || "";
    if (this.$app.appSettings.JWT_TOKEN_ENABLE) {
      if (getLocalStorage("token", false) !== null && getLocalStorage("token", false) !== "") {
        this.uploadAction =
          apiUrl +
          this.getApiList.uploadTenantLogo +
          "?token=" +
          (getLocalStorage("token", false) || "");
      }
    } else {
      removeLocalStorage("token");
      this.uploadAction = apiUrl + this.getApiList.uploadTenantLogo;
    }
    this.getTenantList();
  },
  methods: {
    // 点击搜索
    handleSearchTenant() {
      const val = this.filterTenantVal;
      this.filterTenantList = this.tenantList.filter(item => {
        return item.tenantId.includes(val) || item.tenantName.includes(val) || item.tenantDesc.includes(val);
      })
    },
    // 获取租户列表
    getTenantList() {
      this.$http["post"](this.getApiList.queryTenantList, {}).then((res) => {
        if (res.response.status === 200) {
          const data = res.response.data.body;
          this.tenantList = data;
          this.filterTenantList = data;
          user$.setTenantList(data);
          // 下载每个租户logo
          data.forEach(item => {
            if(item.tenantLogo) {
              this.downloadTenantLogo(item);
            }
          })
        }
      });
    },
    // 点击新增租户按钮
    openAddTenantDialog() {
      if (this.$app.appSettings.JWT_TOKEN_ENABLE) {
        if (getLocalStorage("token", false) !== null && getLocalStorage("token", false) !== "") {
          this.uploadHeader ={
            Lang: getLocalStorage("language") || "zh-CN",
            Authorization: "Bearer " + (getLocalStorage("token") || "")
          };
        }
      } else {
        removeLocalStorage("token");
        this.uploadHeader = { 
          Lang: getLocalStorage("language") || "zh-CN"
        };
      }
      this.addDialogShow = true;
    },
    // 取消新增租户
    cancleAddDialog() {
      this.addDialogShow = false;
      this.addTableModel.tenantId = "";
      this.addTableModel.tenantName = "";
      this.addTableModel.tenantDesc = "";
      this.tenantLogo = "";
      this.tenantLogoBase64 = "";
      this.$refs["addTenantForm"].clearValidate();
    },
    // 确认新增租户
    addTenantConfirm() {
      this.$refs["addTenantForm"].valid(() => {
        const params = {
          ...this.addTableModel,
          tenantLogo: this.tenantLogo
        };
        this.$http.post(this.getApiList.addTenant, params)
          .then(res => {
            if(res.response.status === 200) {
              this.getTenantList();
              this.$message.success("租户创建成功！");
              this.cancleAddDialog();
            }
          });
      });
    },
    // 租户配置
    goTenantConfig(item, logo) {
      // 租户管理点击配置时改变租户id，但是路由不要回到主页，保持不变
      user$.setTenantId({
        id: item.tenantId,
        keepRoute: true
      });
      this.selectedTenantId = item.tenantId;
      this.selectedTenantName = item.tenantName;
      this.selectedTenantLogo = logo;
      this.tenantConfigShow = true;
    },

    closeTenantConfig() {
      this.tenantConfigShow = false;
    },

    //上传成功回调
    uploadTenantLogoSuccess(res) {
      this.tenantLogo = res.body.tenantLogo;
      this.$http.post(this.getApiList.downloadTenantLogo, {fileCode: res.body.tenantLogo}, {config: {"responseType": "blob"}})
        .then((data) => {
          const blob = data.response.data;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (e) => {
            this.$nextTick(() => {
              this.tenantLogoBase64 = e.target.result;
            });
          };
        });
    },

    // 下载租户logo
    downloadTenantLogo(item) {
      this.$http.post(this.getApiList.downloadTenantLogo, {fileCode: item.tenantLogo}, {config: {"responseType": "blob"}})
        .then((data) => {
          const blob = data.response.data;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (e) => {
            this.$nextTick(() => {
              this.$set(this.tenantLogoObj, item.tenantId, e.target.result);
            });
          };
        }).catch(() => {
          this.$set(this.tenantLogoObj, item.tenantId, "");
        });
    },

    // 上传失败回调
    uploadTenantLogoError() {
      this.$message.error("上传失败！")
    },

    // 上传之前的回调
    onBeforeUpload(file) {
      const acceptFileType = ["image/jpg", "image/jpeg", "image/png"];
      const isAccept = acceptFileType.includes(file.type);
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isAccept) {
        this.$message.error("图片只支持jpg、png格式");
      }
      if (!isLt3M) {
        this.$message.error("上传租户logo图片大小不能超过 3M!");
      }
      return isLt3M && isAccept;
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
    // 删除租户
    // deleteTenantClick(item) {
    //   this.delTenantInfo = item;
    //   this.delDialogShow = true;
    // },
    // // 确认删除租户
    // delTenantConfirm() {
    //   this.$refs["delTenantForm"].valid(() => {
    //     if(this.delTableModel.tenantId !== this.delTenantInfo.tenantId || 
    //       this.delTableModel.tenantName !== this.delTenantInfo.tenantName) {
    //       return this.$message.error('租户信息不匹配，删除失败！');
    //     }
    //     // 发送删除租户请求
    //     this.$http.post(this.getApiList.deleteTenant, { tenantId: this.delTenantInfo.tenantId })
    //       .then(res => {
    //         if(res.response.status === 200) {
    //           this.$message.success("租户删除成功！");
    //         } else {
    //           this.$message.error(res.response.failMeaasge);
    //         }
    //       });
    //   })
    // },
    // // 取消删除租户
    // cancleDelDialog() {
    //   this.delTableModel.tenantId = "";
    //   this.delTableModel.tenantName = "";
    //   this.$refs["delTenantForm"].clearValidate();
    //   this.delDialogShow = false;
    // },
  }
}
</script>

<style lang="scss" scoped>
.tenant-manager {
  padding: 40px 30px;
  background: #fff;
  .search-box{
    width: 600px;
    margin: 0 auto 40px;
    .search-btn {
      padding: 0 10px;
      cursor: pointer;
    }
  }
  .tenant-list {
    & .item {
      padding: 10px;
    }
    .new-tenant {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 280px;
      height: 185px;
      background: #fff;
      box-shadow: 0 0 3px 2px #d9d9d9;
      font-size: 14px;
      color: #88898a;
      cursor: pointer;
      .icon {
        margin-right: 10px;
      }
    }
    .tenant-card {
      min-width: 280px;
      height: 185px;
      background: #fff;
      box-shadow: 0 0 3px 2px #d9d9d9;
      .main-container{
        height: 140px;
        border-bottom: 1px solid #d9d9d9;
        position: relative;
        padding: 30px;
        &-left {
          width: 80px;
          position: absolute;
          top: 30px;
          left: 30px;
          bottom: 0;
          .logo-img{
            width: 60px;
            height: 60px;
            position: relative;
            border-radius: 30px;
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
            font-size: 38px;
            color: #fff;
          }
          .logo {
            width: 60px;
            height: 60px;
            border-radius: 30px
          }
        }
        &-right {
          margin-left: 80px;
          padding-right: 20px;
          .title {
            font-size: 18px;
            margin-bottom: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .description {
            font-size: 14px;
            line-height: 18px;
            color: #88898a;
            overflow: hidden;
            text-overflow: ellipsis;
            // 文字展示到第三行展示不下才显示省略号
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
      .footer {
        height: 45px;
        padding: 10px 30px;
        .btns {
          display: flex;
          justify-content: center;
          align-items: center;
          .btn {
            flex: 1;
            text-align: center;
            cursor: pointer;
          }
          .btn:not(:last-child) {
            border-right: 1px solid #d9d9d9;
          }
        }
      }
    }
  }
}
// ::v-deep .el-dialog__body{
//   padding-top: 0;
// }
::v-deep .el-form-item__content{
  width: calc(100% - 85px);
}
.logo-big {
  width: 148px;
  height: 148px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 85px;
  img {
    width: 100%;
    height: 100%;
  }
}
.add-header {
  font-weight: 700;
}
.logo-text {
  margin: 30px 0 -20px 20px;
  font-size: 14px;
}
.kui-upload {
  display: inline-block;
  width: 100%;
  padding-left: 85px;
  ::v-deep .el-upload-dragger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 148px;
    height: 148px;
    .kui-icon-upload {
      font-size: 28px;
      color: #3261FF;
    }
    .upload-text {
      margin-top: 8px;
      font-size: 14px;
      color: #111;
    }
  }
}
.del-header{
  font-weight: 700;
  font-size: 16px;
  &>i{
    color: #ffa84c;
    padding-right: 8px;
  }
}
.del-tip{
  line-height: 28px;
  padding-left: 8px;
  margin-bottom: 20px;
  color: #ffa84c;
  background: #fff6ed;
  border-radius: 4px
}
</style>