<template>
  <kui-dialog
    title="$t[user.xiugai_touxiang]"
    :visible="visible"
    width="402px"
    @close="handleCancel"
  >
    <div class="content-wrapper">
      <div class="left">
        <div class="upload-tips" v-text="$t('user.shangchuan_tishi')"></div>
        <kui-upload
          v-if="!avatarBase64 || !fileCode"
          action="#"
          drag
          :show-file-list="false"
          :http-request="uploadAvatar"
          :before-upload="onBeforeUpload"
        >
          <span class="kui-icon-upload"></span>
          <div class="upload-text" v-text="$t('user.dianji_shangchuan_touxiang')"></div>
        </kui-upload>
        <div v-else class="avatar-big">
          <img
            :src="avatarBase64"
            :alt="$t('user.tou_xiang')"
          >
          <div class="hole"></div>
        </div>
      </div>
      <div class="right">
        <img v-if="avatarBase64" :src="avatarBase64" :alt="$t('user.touxiang_yulan')">
        <svg-icon v-else name="avatar" class="avatar-icon"></svg-icon>
        <div class="preview-text" v-text="$t('user.yu_lan')"></div>
      </div>
    </div>
    <template #footer>
      <div class="footer-wrap">
        <div class="left-btn-wrap">
          <el-upload
            action="#"
            :disabled="!avatarBase64 || !fileCode"
            :show-file-list="false"
            :http-request="uploadAvatar"
            :before-upload="onBeforeUpload"
          >
            <el-button slot="trigger" type="text" :disabled="!avatarBase64 || !fileCode">{{ $t('user.chongxin_shangchuan') }}</el-button>
          </el-upload>
        </div>
        <div class="right-btn-wrap">
          <kui-button :type="null" text="$t[user.qu_xiao]" @click="handleCancel"></kui-button>
          <kui-button text="$t[user.que_ren]" @click="handleConfirm"></kui-button>
        </div>
      </div>
    </template>
  </kui-dialog>
</template>
<script>
import { getApiList } from "../url.config";
export default {
  name: "UploadAvatar",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    bizType: {
      type: String,
      default: ""
    },
    bizKey: {
      type: String,
      default: ""
    },
    avatarData: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      avatarBase64: "",
      fileCode: ""
    };
  },
  computed: {
    getApiList() {
      return getApiList(this);
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.avatarBase64 = this.avatarData;
        }
      },
      immediate: true
    }
  },
  methods: {
    // 关闭弹窗
    handleCloseDialog() {
      this.$emit("update:visible", false);
      this.avatarBase64 = "";
      this.fileCode = "";
    },

    // 取消
    handleCancel() {
      this.handleCloseDialog();
    },

    // 确定
    handleConfirm() {
      if (this.fileCode && this.avatarBase64) {
        this.$emit("handle-avatar-change", this.fileCode, this.avatarBase64);
        this.handleCloseDialog();
      } else {
        this.$message.error("请上传头像");
      }
    },

    // 上传头像
    uploadAvatar(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      formData.append("bizType", this.bizType);
      formData.append("bizKey", this.bizKey);
      this.$http.post(this.getApiList.uploadAvatar, formData)
        .then((res) => {
          this.onUploadSuccess(res);
        });
    },

    //上传成功回调
    onUploadSuccess(res) {
      this.fileCode = res.data.userIcon;
      this.$http.post(this.getApiList.avatarDownload, {fileCode: res.data.userIcon}, {config: {"responseType": "blob"}})
        .then((data) => {
          const blob = data.response.data;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (e) => {
            this.$nextTick(() => {
              this.avatarBase64 = e.target.result;
            });
          };
        });
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
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isLt3M && isAccept;
    }
  }
};
</script>
<style lang="scss">
.content-wrapper {
  display: flex;
  align-items: center;
  .upload-tips {
    margin-bottom: 16px;
    font-size: 12px;
    color: #8E9095;
  }
  .kui-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 192px;
      height: 192px;
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
  .avatar-big {
    width: 192px;
    height: 192px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
    .hole {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
    }
  }
  .right {
    margin-left: 45px;
    img,
    .avatar-icon {
      width: 60px !important;
      height: 60px !important;
      border-radius: 50%;
    }
    .preview-text {
      margin-top: 8px;
      font-size: 12px;
      text-align: center;
      color: #8E9095;
    }
  }
}
  .footer-wrap {
    display: flex;
    justify-content: space-between;
  }
</style>
