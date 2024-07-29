<template>
  <div>
    <kui-form
      :model="tenantModel"
      ref="tenantForm"
      :inline="false"
      :items="tenantItems"
      :item-width="685"
    >
    </kui-form>
    <div class="upload-logo">
      <div class="logo-text">租户logo</div>
      <div v-if="tenantLogo || tenantLogoBase64" class="logo-big">
        <img
          :src="tenantLogoBase64"
          alt="租户logo"
        >
      </div>
      <kui-upload
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
    </div>
    <kui-button @click="updateTanentBaseInfo">确认</kui-button>
  </div>
</template>

<script>
import { getApiList } from "../url.config.ts";
import { getLocalStorage, removeLocalStorage } from "szkingdom.yf.koca-template/lib/utils/cache";
export default {
  name: "BaseInfo",
  data() {
    return {
      tenantLogo: "",
      tenantLogoBase64: "",
      uploadAction: "",
      uploadHeader: "",
      tenantModel: {
        tenantId: "",
        tenantName: "",
        tenantDesc: "",
      },
      tenantItems: [
        {
          prop: "tenantId",
          label: "租户代码",
          required: true,
          "input-width": "100%",
          maxlength: 15,
          disabled: true
        },
        {
          prop: "tenantName",
          label: "租户名称",
          required: true,
          "input-width": "100%",
          maxlength: 30
        },
        {
          mold: "textarea",
          prop: "tenantDesc",
          label: "租户描述",
          required: true,
          maxlength: 100
        },
      ],
    }
  },
  computed: {
    getApiList() {
      return getApiList(this);
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

        this.uploadHeader ={
          Lang: getLocalStorage("language") || "zh-CN",
          Authorization: "Bearer " + (getLocalStorage("token") || "")
        };
      }
    } else {
      removeLocalStorage("token");
      this.uploadAction = apiUrl + this.getApiList.uploadTenantLogo;
      this.uploadHeader = { 
        Lang: getLocalStorage("language") || "zh-CN"
      };
    };
  },

  methods: {
    getTenantInfo() {
      this.$http["post"](this.getApiList.queryTenant, {}).then((res) => {
        if (res.response.status === 200) {
          const data = res.response.data.body;
          const {tenantId, tenantName, tenantDesc, tenantLogo} = data;
          this.tenantModel.tenantId = tenantId;
          this.tenantModel.tenantName = tenantName;
          this.tenantModel.tenantDesc = tenantDesc;
          this.tenantLogo = tenantLogo;
          if (this.tenantLogo) {
            this.downloadTenantLogo(this.tenantLogo);
          } else {
            this.tenantLogo = "";
            this.tenantLogoBase64 = "";
          }
        }
      });
    },
    updateTanentBaseInfo() {
      this.$refs["tenantForm"].valid(() => {
        const { tenantId, tenantName, tenantDesc} = this.tenantModel;
        const params = {
          tenantId,
          tenantName,
          tenantDesc,
          tenantLogo: this.tenantLogo
        };
        this.$http.post(this.getApiList.updateTenant, params)
          .then((res) => {
            if(res.response.status === 200) {
              this.$message.success('租户信息更新成功！');
            }
          });
      })
    },

    // 下载租户logo
    downloadTenantLogo(tenantLogo) {
      this.$http.post(this.getApiList.downloadTenantLogo, {fileCode: tenantLogo}, {config: {"responseType": "blob"}})
        .then((data) => {
          const blob = data.response.data;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (e) => {
            this.$nextTick(() => {
              this.tenantLogoBase64 = e.target.result;
            });
          };
        }).catch(() => {
          this.tenantLogoBase64 = ""
        });
    },

    // 上传成功回调
    uploadTenantLogoSuccess(res) {
      this.tenantLogo = res.body.tenantLogo;
      this.downloadTenantLogo(this.tenantLogo);
    },

    // 上传失败回调
    uploadTenantLogoError() {
      this.$message.error("上传失败！")
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

    // 上传之前的回调
    onBeforeUpload(file) {
      const acceptFileType = ["image/jpg", "image/jpeg", "image/png"];
      const isAccept = acceptFileType.includes(file.type);
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isAccept) {
        this.$message.error("图片只支持jpg、png格式");
      }
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3M!");
      }
      return isLt3M && isAccept;
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content{
  width: calc(100% - 85px);
}
.upload-logo{
  display: flex;
  .logo-text {
    width: 70px;
    margin: 30px 0 -20px 20px;
    font-size: 14px;
  }
  .logo-big {
    width: 148px;
    height: 148px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    margin-left: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.kui-upload {
  display: inline-block;
  margin-left: 20px;
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
</style>
