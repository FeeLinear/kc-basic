<template>
  <kui-dialog
    :title="_title"
    :visible="visible"
    width="920"
    @close="handleCloseDialog"
  >
    <kui-form ref="form" :model="data" label-width="100" item-width="330">
      <kui-field title="$t[user.jiben_xinxi]" :closable="true">
        <kui-form-item label="$t[user.tou_xiang]">
          <div class="avatar-wrap">
            <div class="avatar-content" @click="isUploadAvatarVisible=true">
              <svg-icon v-if="!avatarBase64" name="avatar" class="avatar-icon"></svg-icon>
              <img v-else :src="avatarBase64" alt="个人头像" class="avatar-icon">
            </div>
            <div class="avatar-tips" v-text="$t('user.dianji_xiugai_touxiang')"></div>
          </div>
        </kui-form-item>
        <kui-form-item prop="userNo" label="$t[user.renyuan_bianhao]" required :rules="{ valid: 'numEn[1,32]' }">
          <kui-input prop="userNo" :disabled="isUpdate" placeholder="$t[kui.form.please.input]$t[user.renyuan_bianhao]"></kui-input>
        </kui-form-item>
        <kui-form-item prop="userName" label="$t[user.xing_ming]" required :rules="{ valid: 'chEnNum[1,32]' }">
          <kui-input
            prop="userName"
            required
            placeholder="$t[kui.form.please.input]$t[user.xing_ming]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="mobileTel" label="$t[user.shouji_haoma]" :rules="{ valid: 'phone' }">
          <kui-input
            prop="mobileTel"
            placeholder="$t[kui.form.please.input]$t[user.shouji_haoma]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="email" label="$t[user.you_xiang]" :rules="[{ valid: 'email' }, { valid: 'length[1,32]' }]">
          <kui-input
            prop="email"
            placeholder="$t[kui.form.please.input]$t[user.you_xiang]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="idType" label="$t[user.zhengjian_leixing]" required>
          <kui-select
            prop="idType"
            placeholder="$t[kui.form.please.select]$t[user.zhengjian_leixing]"
            dict="ID_TYPE"
            clearable
          ></kui-select>
        </kui-form-item>
        <kui-form-item prop="idCode" label="$t[user.zhengjian_haoma]" required :rules="{ valid: 'chEnNum[1,32]' }">
          <kui-input
            prop="idCode"
            placeholder="$t[kui.form.please.input]$t[user.zhengjian_haoma]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="idBeginDate" label="$t[user.zhengjian_kaishi_riqi]">
          <kui-date
            prop="idBeginDate"
            placeholder="$t[kui.form.please.select]$t[user.zhengjian_kaishi_riqi]"
            :max="dateMax"
            @change="idBeginDateChange"
          ></kui-date>
        </kui-form-item>
        <kui-form-item prop="idExpDate" label="$t[user.zhengjian_jieshu_riqi]">
          <kui-date
            prop="idExpDate"
            placeholder="$t[kui.form.please.select]$t[user.zhengjian_jieshu_riqi]"
            :min="dateMin"
            @change="idExpDateChange"
          ></kui-date>
        </kui-form-item>
        <br>
        <kui-form-item prop="idIssAgcy" label="$t[user.fazheng_jiguan]" :colspan="2" :rules="{ valid: 'length[1,32]' }">
          <kui-input
            prop="idIssAgcy"
            placeholder="$t[kui.form.please.input]$t[user.fazheng_jiguan]"
          ></kui-input>
        </kui-form-item>
        <br>
        <kui-form-item prop="idAddress" label="$t[user.zhengjian_dizhi]" :colspan="2" :rules="{ valid: 'length[0,64]' }">
          <kui-input
            prop="idAddress"
            placeholder="$t[kui.form.please.input]$t[user.zhengjian_dizhi]"
          ></kui-input>
        </kui-form-item>
        <br>
        <kui-form-item prop="address" label="$t[user.lianxi_dizhi]" :colspan="2" :rules="{ valid: 'length[0,64]' }">
          <kui-input
            prop="address"
            placeholder="$t[kui.form.please.input]$t[user.lianxi_dizhi]"
          ></kui-input>
        </kui-form-item>
      </kui-field>
      <kui-field title="$t[user.qita_xinxi]" :closable="true">
        <kui-form-item prop="userCode" label="$t[user.renyuan_daima]" required :rules="{ valid: 'numEn[1,8]' }">
          <kui-input
            prop="userCode"
            placeholder="$t[kui.form.please.input]$t[user.renyuan_daima]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="userType" label="$t[user.renyuan_leixing]" required :rules="{ valid: 'numEn[1,8]' }">
          <kui-select
            prop="userType"
            placeholder="$t[kui.form.please.select]$t[user.renyuan_leixing]"
            dict="USER_TYPE"
            clearable
          ></kui-select>
        </kui-form-item>
        <kui-form-item prop="birthday" label="$t[user.chusheng_riqi]">
          <kui-date
            prop="birthday"
            placeholder="$t[kui.form.please.select]$t[user.chusheng_riqi]"
          ></kui-date>
        </kui-form-item>
        <kui-form-item prop="sex" label="$t[user.xing_bie]">
          <kui-select
            prop="sex"
            placeholder="$t[kui.form.please.select]$t[user.xing_bie]"
            dict="SEX"
            clearable
          ></kui-select>
        </kui-form-item>
        <kui-form-item prop="nationality" label="$t[user.min_zu]">
          <kui-select
            prop="nationality"
            placeholder="$t[kui.form.please.select]$t[user.min_zu]"
            dict="NATIONALITY"
            clearable
          ></kui-select>
        </kui-form-item>
        <kui-form-item prop="citizenship" label="$t[user.guo_ji]">
          <kui-select
            prop="citizenship"
            placeholder="$t[kui.form.please.select]$t[user.guo_ji]"
            dict="CITIZENSHIP"
            clearable
          ></kui-select>
        </kui-form-item>
        <kui-form-item prop="education" label="$t[user.xue_li]">
          <kui-select
            prop="education"
            placeholder="$t[kui.form.please.select]$t[user.xue_li]"
            dict="EDUCATION"
            clearable
          ></kui-select>
        </kui-form-item>
        <kui-form-item prop="nativePlace" label="$t[user.ji_guan]" :rules="{valid: 'length[1,32]'}">
          <kui-input
            prop="nativePlace"
            placeholder="$t[kui.form.please.input]$t[user.ji_guan]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="zipCode" label="$t[user.you_bian]" :rules="{valid: 'num[6,6]'}">
          <kui-input
            prop="zipCode"
            placeholder="$t[kui.form.please.input]$t[user.you_bian]"
          ></kui-input>
        </kui-form-item>
        <br>
        <kui-form-item prop="remark" label="$t[user.beizhu_xinxi]" :colspan="2" :rules="{valid: 'length[0,64]'}">
          <kui-textarea
            prop="remark"
            placeholder="$t[kui.form.please.input]$t[user.beizhu_xinxi]"
            style="width: 450px;"
            :maxlength="64"
          ></kui-textarea>
        </kui-form-item>
      </kui-field>
      <kui-field title="$t[user.tuozhan_xinxi]" :closable="true">
        <kui-form-item prop="jobNo" label="$t[user.gong_hao]" :rules="{valid: 'num[1,64]'}">
          <kui-input
            prop="jobNo"
            placeholder="$t[kui.form.please.input]$t[user.gong_hao]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="officeTel" label="$t[user.bangong_dianhua]" :rules="{valid: 'length[1,64]'}">
          <kui-input
            prop="officeTel"
            placeholder="$t[kui.form.please.input]$t[user.bangong_dianhua]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="QQ" label="$t[user.QQ]" :rules="{valid: 'num[1,64]'}">
          <kui-input
            prop="QQ"
            placeholder="$t[kui.form.please.input]$t[user.QQ]"
          ></kui-input>
        </kui-form-item>
        <kui-form-item prop="fax" label="$t[user.chuan_zhen]" :rules="{valid: 'length[1,64]'}">
          <kui-input
            prop="fax"
            placeholder="$t[kui.form.please.input]$t[user.chuan_zhen]"
          ></kui-input>
        </kui-form-item>
      </kui-field>
      <kui-loading :visible="loading"></kui-loading>
    </kui-form>
    <upload-avatar
      :visible.sync="isUploadAvatarVisible"
      biz-type="user-icon"
      :biz-key="data.userNo"
      :avatar-data="avatarBase64"
      @handle-avatar-change="handleAvatarChange"
    >
    </upload-avatar>
    <template slot="footer">
      <kui-button :type="null" text="$t[user.qu_xiao]" @click="handleCloseDialog"></kui-button>
      <kui-button text="$t[user.que_ren]" @click="submitForm"></kui-button>
    </template>
  </kui-dialog>
</template>

<script>
import UploadAvatar from "./UploadAvatar";
import {assign, pick} from "lodash-es";
import {getApiList} from "../url.config";

export default {
  name: "UserInfoDialog",
  components: {
    UploadAvatar
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    currentUserNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      data: {
        userStatus: "0",
        userType: "0",
        idType: "00",
        userNo: "",
        userName: "",
        idCode: "",
        idAddress: "",
        idIssAgcy: "",
        idBeginDate: "",
        idExpDate: "",
        mobileTel: "",
        email: "",
        address: "",
        userCode: "",
        birthday: "",
        sex: "",
        nationality: "",
        citizenship: "",
        education: "",
        nativePlace: "",
        zipCode: "",
        remark: "",
        jobNo: "",
        officeTel: "",
        QQ: "",
        fax: "",
      },
      dateMin: null,
      dateMax: null,
      isUploadAvatarVisible: false,
      avatarBase64: "",
      loading: false,
    };
  },
  computed: {
    _title() {
      switch (this.mode) {
      case "ADD":
        return "$t[user.renyuan_xinxi]" + "-$t[kui.form.add]";
      case "UPDATE":
        return "$t[user.renyuan_xinxi]" + "-$t[kui.form.update]";
      default:
        return "";
      }
    },
    getApiList() {
      return getApiList(this);
    },
    isUpdate() {
      return this.mode === "UPDATE";
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.avatarBase64 = "";
        if (this.$refs.form) {
          this.$refs.form.resetFields();
          this.$refs.form.clearValidate();
        }
        if(val && this.mode === "UPDATE") {
          this.queryData();
        }
      },
      immediate: true
    }
  },
  methods: {
    queryData() {
      this.loading = true;
      this.$http.post(this.getApiList.queryUserDetail, { userNo: this.currentUserNo }).then(async (res) => {
        if (res.data) {
          const userIcon = res.data.userIcon;
          this.data = assign(res.data);
          this.data.userInfoExts = pick(res.data, ["jobNo", "officeTel", "QQ", "fax"]);
          try {
            if (userIcon) {
              this.loading = true;
              const data = await this.$http.post(this.getApiList.avatarDownload, {fileCode: userIcon}, {config: {"responseType": "blob"}});
              const blob = data.response.data;
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = (e) => {
                this.$nextTick(() => {
                  this.avatarBase64 = e.target.result;
                });
              };
            }
          } catch(err) {
            this.avatarBase64 = "";
            console.log("获取用户头像出错: ", err);
          } finally {
            this.loading = false;
          }
        }

      }).catch(() => {
        this.loading = false;
      });
    },
    handleCloseDialog() {
      this.$refs.form.resetFields();
      this.$emit("update:visible", false);
    },
    idBeginDateChange (val) {
      this.dateMin = val;
    },
    idExpDateChange (val) {
      this.dateMax = val;
    },
    // 头像修改
    handleAvatarChange(fileCode, avatarBase64) {
      this.avatarBase64 = avatarBase64;
      this.data.userIcon = fileCode;
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((flag) => {
        if (flag) {
          this.data.userInfoExts = pick(this.data, ["jobNo", "officeTel", "QQ", "fax"]);
          this.dialogLoading = true;
          const api = this.isUpdate ? this.getApiList.updateUserInfo : this.getApiList.addUserInfo;
          this.$http.post(api, this.data).then((res) => {
            this.dialogLoading = false;
            this.$message.success(this.isUpdate ? this.$t("user.renyuan_xiugai_chenggong") : this.$t("user.renyuan_xinzeng_chenggong"));
            this.$emit("update:visible", false);
            this.$emit("refresh-table");
          }).catch(() => {
            this.dialogLoading = false;
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar-content {
    .avatar-icon {
      width: 100px !important;
      height: 100px !important;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .avatar-tips {
    margin-left: 20px;
    font-size: 12px;
    color: #8E9095;
  }
}
</style>
