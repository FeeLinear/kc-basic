<template>
    <kui-field is-block>
      <kui-form
        ref="form3"
        :model="data"
        :items="items"
        :inline="true"
        label-width="110"
        :is-test="true"
      >
      </kui-form>
      <template #bottom>
      <kui-button text="$t[ownPwdChange.bao_cun]" @click="submitForm"></kui-button>
    </template>
    </kui-field>
    
</template>

<script >
import { encrypt_ECB } from "szkingdom.yf.koca-template/lib/utils/sm4";
import { getApiList } from "./url.config";
import { app$ } from "szkingdom.yf.koca-template/lib/store";
export default {
  components: {
  },
  data () {
    return {
      data: {
        oldPwd: "",
        newPwd: "",
        newPwd2: ""
      },
      items: [
        {
          mold: "input",
          prop: "oldPwd",
          label: "$t[ownPwdChange.jiu_mima]",
          showPassword: true,
          required: true,
          rules: { valid: "length[0,16]" },
        },
        {
          mold: "input",
          prop: "newPwd",
          label: "$t[ownPwdChange.xin_mima]",
          showPassword: true,
          required: true,
          rules: { valid: "length[0,16]" },
        },
        {
          mold: "input",
          prop: "newPwd2",
          label: "$t[ownPwdChange.queren_xin_mima]",
          showPassword: true,
          required: true,
          rules: { valid: "length[0,16]" },
        }
      ],
      // btns: [
      //   // {
      //   //   key: "clear",
      //   //   text: "$t[ownPwdChange.fan_hui]",
      //   //   type: null,
      //   //   click: this.goBack
      //   // },
      //   {
      //     key: "submit",
      //     text: "$t[ownPwdChange.bao_cun]",
      //     click: this.submitForm,
      //     "is-test": true
      //   }
      // ]
    };
  },
  computed: {
    getApiList() {
      return getApiList(this);
    },
    screen() {
      return app$.screen || {};
    },
  },
  created () {
  },
  methods: {
    // 返回相关页面
    goBack () {
      this.$router.push(`/ownInfo`);
    },
    // 提交人员密码
    submitForm () {
      this.$refs.form3.validate(() => {
        if (this.data.newPwd === this.data.oldPwd) {
          this.$message.error(this.$t("ownPwdChange.xinjiu_bu_xiangtong"));
        } else if (this.data.newPwd !== this.data.newPwd2) {
          this.$message.error(this.$t("ownPwdChange.liangci_bu_xaingtong"));
        } else {
          const data = {
            oldPwd: encrypt_ECB(this.data.oldPwd),
            newPwd: encrypt_ECB(this.data.newPwd)
          };
          this.$http
            .post(this.getApiList.updateOwnPwd, data)
            .then(res => {
              if (res.code === "0") {
                this.$message.success(this.$t("ownPwdChange.mima_xiugai_chenggong"));
              } else {
                this.$message.error(res.response.msg);
              }
            });
        }
      });
    },
  }
};
</script>
<style scoped lang="scss">
::v-deep .field-body{
  padding-top: 40px !important;
}
::v-deep .el-form-item{
  width: 100% !important;
  .el-form-item__content{
    width: 394px;
  }
  .el-input{
    width: 100% !important;
  }
}
</style>
