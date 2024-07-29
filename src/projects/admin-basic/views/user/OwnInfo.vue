<template>
    <kui-field is-block>
      <kui-form ref="form" :model="data" label-width="100">
        <kui-field title="$t[ownInfoChange.jiben_xinxi]" :closable="true" class="basic-info">
          <kui-form-item label="$t[ownInfoChange.tou_xiang]">
            <div class="avatar-wrap">
              <div class="avatar-content" @click="isEdit?'':isUploadAvatarVisible=true">
                <svg-icon v-if="!avatarBase64" name="avatar" class="avatar-icon" :style="`cursor: ${!isEdit ? 'pointer' : 'not-allowed'}`"></svg-icon>
                <img v-else :src="avatarBase64" alt="个人头像" class="avatar-icon" :style="`cursor: ${!isEdit ? 'pointer' : 'not-allowed'}`">
              </div>
              <div v-if="!isEdit" class="avatar-tips">点击修改头像</div>
            </div>
          </kui-form-item>
          <kui-form-item prop="userNo" label="$t[ownInfoChange.renyuan_bianhao]" required :rules="{ valid: 'numEn[1,8]' }">
            <kui-input prop="userNo" disabled placeholder="$t[kui.form.please.input]$t[ownInfoChange.renyuan_bianhao]"></kui-input>
          </kui-form-item>
          <kui-form-item prop="userStatus" label="$t[ownInfoChange.renyaun_zhuangtai]" required>
            <kui-select
              prop="userStatus"
              disabled
              dict="USER_STATUS"
              clearable
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.renyaun_zhuangtai]"
            ></kui-select>
          </kui-form-item>
          <kui-form-item prop="userName" label="$t[ownInfoChange.xing_ming]" required :rules="{ valid: 'chEnNum[1,32]' }">
            <kui-input
              :disabled="isEdit"
              prop="userName"
              required
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.xing_ming]"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="mobileTel" label="$t[ownInfoChange.shouji_haoma]" :rules="{ valid: 'phone' }">
            <kui-input
              prop="mobileTel"
              :disabled="isEdit"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.shouji_haoma]"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="email" label="$t[ownInfoChange.you_xiang]" :rules="[{ valid: 'email' }, { valid: 'length[1,32]' }]">
            <kui-input
              prop="email"
              :disabled="isEdit"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.you_xiang]"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="idType" label="$t[ownInfoChange.zhengjian_leixing]" required>
            <kui-select
              prop="idType"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.zhengjian_leixing]"
              dict="ID_TYPE"
              :disabled="isEdit"
              clearable
            ></kui-select>
          </kui-form-item>
          <kui-form-item prop="idCode" label="$t[ownInfoChange.zhengjian_haoma]" required :rules="{ valid: 'chEnNum[1,32]' }">
            <kui-input
              prop="idCode"
              :disabled="isEdit"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.zhengjian_haoma]"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="idBeginDate" label="$t[ownInfoChange.zhengjian_kaishi_riqi]">
            <kui-date
              prop="idBeginDate"
              :disabled="isEdit"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.zhengjian_kaishi_riqi]"
              :max="dateMax"
              @change="idBeginDateChange"
            ></kui-date>
          </kui-form-item>
          <kui-form-item prop="idExpDate" label="$t[ownInfoChange.zhengjian_jieshu_riqi]">
            <kui-date
              prop="idExpDate"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.zhengjian_jieshu_riqi]"
              :min="dateMin"
              :disabled="isEdit"
              @change="idExpDateChange"
            ></kui-date>
          </kui-form-item>
          <kui-form-item prop="idIssAgcy" label="$t[ownInfoChange.fazheng_jiguan]" :rules="{ valid: 'length[1,32]' }">
            <kui-input
              prop="idIssAgcy"
              :disabled="isEdit"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.fazheng_jiguan]"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="idAddress" label="$t[ownInfoChange.zhengjian_dizhi]" :rules="{ valid: 'length[0,64]' }">
            <kui-input
              prop="idAddress"
              :disabled="isEdit"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.zhengjian_dizhi]"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="address" label="$t[ownInfoChange.lianxi_dizhi]" :rules="{ valid: 'length[0,64]' }">
            <kui-input
              prop="address"
              :disabled="isEdit"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.lianxi_dizhi]"
            ></kui-input>
          </kui-form-item>
        </kui-field>
        <kui-field title="$t[ownInfoChange.qita_xinxi]" :closable="true" class="other-info">
          <kui-form-item prop="userCode" label="$t[ownInfoChange.renyuan_daima]" required :rules="{ valid: 'numEn[1,8]' }">
            <kui-input
              prop="userCode"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.renyuan_daima]"
              disabled
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="userType" label="$t[ownInfoChange.renyuan_leixing]" required :rules="{ valid: 'numEn[1,8]' }">
            <kui-select
              prop="userType"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.renyuan_leixing]"
              dict="USER_TYPE"
              clearable
              disabled
            ></kui-select>
          </kui-form-item>
          <kui-form-item prop="birthday" label="$t[ownInfoChange.chusheng_riqi]">
            <kui-date
              prop="birthday"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.chusheng_riqi]"
              :disabled="isEdit"
            ></kui-date>
          </kui-form-item>
          <kui-form-item prop="sex" label="$t[ownInfoChange.xing_bie]">
            <kui-select
              prop="sex"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.xing_bie]"
              dict="SEX"
              clearable
              :disabled="isEdit"
            ></kui-select>
          </kui-form-item>
          <kui-form-item prop="nationality" label="$t[ownInfoChange.min_zu]">
            <kui-select
              prop="nationality"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.min_zu]"
              dict="NATIONALITY"
              :disabled="isEdit"
              clearable
            ></kui-select>
          </kui-form-item>
          <kui-form-item prop="citizenship" label="$t[ownInfoChange.guo_ji]">
            <kui-select
              prop="citizenship"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.guo_ji]"
              dict="CITIZENSHIP"
              clearable
              :disabled="isEdit"
            ></kui-select>
          </kui-form-item>
          <kui-form-item prop="education" label="$t[ownInfoChange.xue_li]">
            <kui-select
              prop="education"
              placeholder="$t[kui.form.please.select]$t[ownInfoChange.xue_li]"
              dict="EDUCATION"
              :disabled="isEdit"
              clearable
            ></kui-select>
          </kui-form-item>
          <kui-form-item prop="nativePlace" label="$t[ownInfoChange.ji_guan]" :rules="{valid: 'length[1,32]'}">
            <kui-input
              prop="nativePlace"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.ji_guan]"
              :disabled="isEdit"
            ></kui-input>
          </kui-form-item>
          <br>
          <kui-form-item prop="zipCode" label="$t[ownInfoChange.youzheng_bianma]" :rules="{valid: 'num[6,6]'}">
            <kui-input
              prop="zipCode"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.youzheng_bianma]"
              :disabled="isEdit"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="remark" label="$t[ownInfoChange.beizhu_xinxi]" :rules="{valid: 'length[0,64]'}">
            <kui-textarea
              prop="remark"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.beizhu_xinxi]"
              :maxlength="64"
              :disabled="isEdit"
            ></kui-textarea>
          </kui-form-item>
        </kui-field>
        <kui-field title="$t[ownInfoChange.tuozhan_xinxi]" :closable="true" class="expand-info">
          <kui-form-item prop="jobNo" label="$t[ownInfoChange.gong_hao]" :rules="{valid: 'num[1,64]'}">
            <kui-input
              prop="jobNo"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.gong_hao]"
              :disabled="isEdit"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="officeTel" label="$t[ownInfoChange.bangong_dianhua]" :rules="{valid: 'length[1,64]'}">
            <kui-input
              prop="officeTel"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.bangong_dianhua]"
              :disabled="isEdit"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="QQ" label="$t[ownInfoChange.QQ]" :rules="{valid: 'num[1,64]'}">
            <kui-input
              prop="QQ"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.QQ]"
              :disabled="isEdit"
            ></kui-input>
          </kui-form-item>
          <kui-form-item prop="fax" label="$t[ownInfoChange.chuan_zhen]" :rules="{valid: 'length[1,64]'}">
            <kui-input
              prop="fax"
              placeholder="$t[kui.form.please.input]$t[ownInfoChange.chuan_zhen]"
              :disabled="isEdit"
            ></kui-input>
          </kui-form-item>
        </kui-field>
      </kui-form>
      <upload-avatar
        :visible.sync="isUploadAvatarVisible"
        biz-type="user-icon"
        :biz-key="data.userNo"
        :avatar-data="avatarBase64"
        @handle-avatar-change="handleAvatarChange"
      >
      </upload-avatar>
      <template #bottom>
      <div class="form-btns btns-right">
        <kui-button v-if="isEdit" text="$t[ownInfo.xinxi_bianji]" icon="kui-icon-edit" :disabled="isAdmin" @click="editInfo"></kui-button>
        <div v-if="!isEdit">
          <kui-button :type="null" text="$t[ownInfoChange.qu_xiao]" @click="getBack"></kui-button>
          <kui-button text="$t[ownInfoChange.bao_cun]" @click="submitForm"></kui-button>
        </div>
      </div>
    </template>
    </kui-field>
    
</template>

<script >
import UploadAvatar from "./components/UploadAvatar";
import { assign, cloneDeep, pick} from "lodash-es";
import { getApiList } from "./url.config";
import {user$} from "szkingdom.yf.koca-template/lib/store";
export default {
  components: {
    UploadAvatar
  },
  data () {
    return {
      data: {
        "jobNo": null, "officeTel": null, "QQ": null,  "fax": null
      },
      dateMin: null,
      dateMax: null,
      isUploadAvatarVisible: false,
      avatarBase64: "",
      isEdit:true,
      isAdmin:false
    };
  },
  computed: {
    getApiList() {
      return getApiList(this);
    },
  },
  created () {
    this.queryData();
  },
  methods: {
    editInfo(){
      this.isEdit = false;
    },
    idBeginDateChange (val) {
      this.dateMin = val;
    },
    idExpDateChange (val) {
      this.dateMax = val;
    },
    // 查询人员信息
    queryData () {
      this.$http.post(this.getApiList.queryOwnUser).then(async (res) => {
        if (res.data) {
          if (res.data.userCode === "admin") {
            this.getBack();
            this.isAdmin = true;
          } else {
            this.getBack();
            this.isAdmin = false;
          }
          const userIcon = res.data.userIcon;
          this.data = assign(cloneDeep(this.data), res.data);
          this.data = this.setUserInfoExts(this.data, "userInfoExts");
          try {
            if (userIcon) {
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
            this.avatarBase64 = null;
            console.log("获取用户头像出错: ", err);
          }
        }
      });
    },
    // 设置人员额外信息格式
    setUserInfoExts (data, ext, fn) {
      const exts = ["jobNo", "officeTel", "QQ", "fax"];
      const re = {};
      re[ext.toString()] = {};
      for (const key in data) {
        re[key] = data[key];
      }
      exts.forEach(item => {
        if (data[item]) {
          re[ext][item] = data[item];
        } else {
          re[ext][item] = "";
        }
      });
      if (fn && typeof fn === "function") {
        fn(re);
      }
      return re;
    },
    // 头像修改
    handleAvatarChange(fileCode, avatarBase64) {
      this.avatarBase64 = avatarBase64;
      this.data.userIcon = fileCode;
    },
    // 返回之前页面
    getBack () {
      // this.$router.push(`/admin-basic/views/user/OwnInfo`);
      this.isEdit = true;
    },
    // 提交表单
    submitForm (data) {
      this.$refs.form.validate((flag) => {
        if (flag) {
          this.data.userInfoExts = pick(this.data, ["jobNo", "officeTel", "QQ", "fax"]);
          this.$http.post(this.getApiList.updateOwnUser, { ...this.data })
            .then(res => {
              user$.setAvatarBase64(this.avatarBase64);
              this.$message.success(this.$t("ownInfoChange.yonghu_xinxi_xiugai_chenggong") + "!");
              this.getBack();
            });
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
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
.form-btns.btns-right{
  margin-right: 10px;
}
::v-deep .el-input,.el-select{
  width: 100% !important;
}
::v-deep .kui-field > .field-body {
    padding: 16px 16px;
}
::v-deep .field-title::before {
  display: inline-block;
  content: "";
  width: 3px;
  height: 14px;
  line-height: 20px;
  background-color: $--color-primary;
  margin-right: 10px;
}
::v-deep .el-form-item{
  width: 50% !important;
  margin-right: 0px;
  .el-form-item__content{
    width: calc(100% - 140px);
  }
}
::v-deep .basic-info{
   .el-form-item{
    &:first-child{
      width: 100% !important;
      text-align: left !important;
    }
    &:nth-child(2n+1){
      text-align: right;
    }
    &:last-child{
      text-align: left;
    }
    &:nth-last-of-type(1){
      width: 100% !important;
      .el-form-item__content {
        width:calc(100% - 100px)
      }
    }
    &:nth-last-of-type(2){
      width: 100% !important;
      .el-form-item__content {
        width:calc(100% - 100px)
      }
    }
  }
}
::v-deep .other-info{
   .el-form-item{
    &:first-child{
      text-align: left !important;
    }
    &:nth-child(2n){
      text-align: right;
    }
    &:nth-last-of-type(2){
      text-align: left;
    }
    &:last-child{
      text-align: left;
    }
    &:nth-last-of-type(2){
      .el-form-item__content {
        width:calc(100% - 140px)
      }
    }
    &:nth-last-of-type(1){
      width: 100% !important;
      .el-form-item__content {
        width:calc(100% - 100px);
        .el-textarea{
          width: 100% !important;
        }
      }
    }
  }
}
::v-deep .expand-info{
   .el-form-item{
    &:nth-child(2n){
      text-align: right;
    }
  }
}
</style>
