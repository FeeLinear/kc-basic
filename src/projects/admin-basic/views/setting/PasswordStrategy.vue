<!--
 * @Description: 密码规则页面
 * @Author:
 * @Date: 2020-7-16
 -->
<template>
  <kui-field
    class="pwd-wrap"
    is-block
    :style="{ height: $app.screen.contentHeight + 'px' }"
  >
    <div class="pwd-content">
      <kui-form
        ref="form"
        :model="form"
        :inline="false"
        size="small"
        label-width="140px"
        item-width="auto"
      >
        <!-- 默认密码 -->
        <kui-form-item
          :label="$t('setting.moren_mima')"
          prop="DEFAULT_PASSWORD"
          :rules="rules"
        >
          <kui-input
            v-model="form.DEFAULT_PASSWORD"
            :maxlength="32"
            width="554px"
            :show-password="true"
            :placeholder="$t('setting.shuru_mima') + $t('setting.moren_mima')"
          ></kui-input>
        </kui-form-item>
        <!-- 密码长度 -->
        <kui-form-item :label="$t('setting.mima_changdu')">
          <div class="length-content">
            <number-wrap
              v-model="form['PASSWORD_MIN_LENGTH']"
              :left-text="$t('setting.zuixiao_mima')"
              :right-text="$t('setting.mima_wei')"
              width="218px"
              :min="1"
              :max="form['PASSWORD_MAX_LENGTH']"
            ></number-wrap>
            <span>～</span>
            <number-wrap
              v-model="form['PASSWORD_MAX_LENGTH']"
              :left-text="$t('setting.zuida_mima')"
              :right-text="$t('setting.mima_wei')"
              width="218px"
              :min="
                checked.length > 0
                  ? checked.length
                  : form['PASSWORD_MIN_LENGTH']
              "
              :max="32"
            ></number-wrap>
          </div>
        </kui-form-item>
        <!-- 密码构成复选框 -->
        <kui-form-item :label="$t('setting.mima_guize')">
          <el-checkbox-group
            v-model="checked"
            :min="0"
            :max="form['PASSWORD_MAX_LENGTH']"
          >
            <div class="check-wrap">
              <el-checkbox
                v-for="(item, index) in checkItems1"
                :key="index"
                v-model="form[item.name]"
                :name="item.name"
                :label="item.label"
              >
                <span
                  v-if="item.name == 'SPECIAL_CHARACTER_NECESSARY'"
                  class="contain-tips"
                >
                  <span style="padding-right: 5px">{{ containContent }}</span>
                  <kui-tooltip
                    :content="
                      $t('setting.zifu_baokuo') + '~!@#$%^\*()_+|<>,.?/:;[]{}'
                    "
                  >
                    <i class="kui-icon-question"></i>
                  </kui-tooltip>
                </span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <div v-for="(item, index) in checkItems2" :key="index">
            <el-checkbox
              v-model="form[item.name]"
              :name="item.name"
              :label="item.label"
            >
              <span
                v-if="item.name == 'SPECIAL_CHARACTER_NECESSARY'"
                class="contain-tips"
              >
                <span style="padding-right: 5px">{{ containContent }}</span>
              </span>
            </el-checkbox>
          </div>
        </kui-form-item>
        <!-- 次数限制 -->
        <kui-form-item
          v-for="(item, index) in items"
          :key="index"
          :label="item.label"
        >
          <span v-if="item.tips" slot="label">
            {{ item.label }}
            <kui-tooltip :content="item.content">
              <i class="kui-icon-question"></i>
            </kui-tooltip>
          </span>
          <number-wrap
            v-model="form[item.prop]"
            :left-text="item.leftText"
            :right-text="item.rightText"
            :width="item.width"
            :min="item.min"
            :max="item.max"
          ></number-wrap>
        </kui-form-item>
      </kui-form>
    </div>
    <!-- 保存按钮 -->
    <div class="pwd-footer">
      <kui-button
        class="footer-cancel"
        :type="null"
        :auth="PERMISSIONS['PasswordStrategy:cancel']"
        @click="cancel"
      >
        {{ this.$t("setting.quxiao") }}
      </kui-button>
      <kui-button :auth="PERMISSIONS['PasswordStrategy:save']" @click="save">
        {{ this.$t("setting.baocun") }}
      </kui-button>
    </div>
  </kui-field>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { getApiList } from "./url.config";
import NumberWrap from "./components/number.vue";
import { PERMISSIONS } from "../../permissions";

@Component({
  name: "PwdStrategy",
  components: { NumberWrap },
})
export default class PwdStrategy extends Vue {
  PERMISSIONS = Object.freeze(PERMISSIONS);
  containContent = this.$t("setting.baohan_zifu");
  checked = [];
  form = {
    DEFAULT_PASSWORD: "",
    PASSWORD_LOCK_COUNT: 0,
    PASSWORD_LOCK_TIME: 0,
    PASSWORD_MAX_LENGTH: 0,
    PASSWORD_MIN_LENGTH: 0,
    PASSWORD_HISTORY_COUNT: 0,
    NUMBER_NECESSARY: false,
    LOWER_CASE_NECESSARY: false,
    UPPER_CASE_NECESSARY: false,
    SPECIAL_CHARACTER_NECESSARY: false,
    CONTINUOUS_LETTER_FORBID: false,
    ADJACENT_LETTERS_SAME_FORBID: false,
    CONTAIN_SAME_LETTER_FORBID: false,
  };
  rules = [
    {
      required: true,
      message: this.$t("setting.moren_mima"),
      trigger: "blur",
    },
  ];
  items = [
    {
      prop: "PASSWORD_LOCK_COUNT",
      width: "146px",
      min: 0,
      max: 1000,
      rightText: this.$t("setting.mima_ci"),
      tips: true,
      content: this.$t("setting.bu_suoding"),
      controlsPosition: "right",
      label: this.$t("setting.mima_suoding"),
    },
    {
      prop: "PASSWORD_LOCK_TIME",
      min: 0,
      max: 1000,
      rightText: this.$t("setting.mima_fenzhong"),
      width: "146px",
      tips: true,
      content: this.$t("setting.bu_yuesu"),
      controlsPosition: "right",
      label: this.$t("setting.suoding_shijian"),
    },
    {
      prop: "PASSWORD_HISTORY_COUNT",
      width: "146px",
      min: 0,
      max: 20,
      rightText: this.$t("setting.mima_ci"),
      tips: true,
      controlsPosition: "right",
      content: this.$t("setting.bu_xianzhi"),
      label: this.$t("setting.mima_congfu"),
    },
  ];
  checkItems1 = [
    {
      name: "NUMBER_NECESSARY",
      label: this.$t("setting.baohan_shuzi"),
    },
    {
      name: "LOWER_CASE_NECESSARY",
      label: this.$t("setting.baohan_xiaoxie"),
    },
    {
      name: "UPPER_CASE_NECESSARY",
      label: this.$t("setting.baohan_daxie"),
    },
    {
      name: "SPECIAL_CHARACTER_NECESSARY",
      label: this.$t("setting.baohan_zifu"),
    },
  ];
  checkItems2 = [
    {
      name: "CONTINUOUS_LETTER_FORBID",
      label: this.$t("setting.lianxu_zifu"),
    },
    {
      name: "ADJACENT_LETTERS_SAME_FORBID",
      label: this.$t("setting.xianglin_zifu"),
    },
    {
      name: "CONTAIN_SAME_LETTER_FORBID",
      label: this.$t("setting.xiangtong_zifu"),
    },
  ];
  get apiList() {
    return getApiList(this);
  }
  mounted() {
    this.getData();
  }
  async getData() {
    const { data } = await this.$http.post(
      this.apiList.getPwd,
      {},
      { waiting_tip: 1 }
    );
    const form = {};
    const check = [];
    // 组装form数据，复选框1为已勾选，0为取消勾选
    data.forEach((item) => {
      const find = [...this.checkItems1, ...this.checkItems2].find(
        (items) => items.name === item.parCode
      );
      if (find) {
        form[item.parCode] = Number(item.parVal) === 1;
      } else {
        form[item.parCode] = item.parVal;
      }
    });
    // 设置复选框群组
    this.checkItems1.forEach((item) => {
      if (form[item.name]) {
        check.push(item.label);
      }
    });
    this.checked = check;
    (this as any).form = form;
  }
  // 保存按钮
  save() {
    console.log(this.$router, "this.$router");

    (this.$refs.form as any).valid(
      async () => {
        const param = [];
        // 过滤复选框，已选为1，未选为0
        Object.keys(this.form).forEach((item) => {
          const find = this.checkItems2.find((items) => items.name === item);
          const find1 = this.checkItems1.find((items) => items.name === item);
          if (find && item === find.name) {
            param.push({
              parCode: item,
              parVal: this.form[item] ? 1 : 0,
            });
          } else if (find1 && item === find1.name) {
            param.push({
              parCode: item,
              parVal: this.checked.indexOf(find1.label) >= 0 ? 1 : 0,
            });
          } else {
            param.push({
              parCode: item,
              parVal: String(this.form[item]).replace(/\s/g, ""),
            });
          }
        });

        const { data } = await this.$http.post(
          this.apiList.updatePwd,
          { passwordParameters: param, dataId: "10100303" },
          {
            waiting_tip: 1,
            headers: {
              MenuId: this.$router.currentRoute.meta.menuId,
              ActionId: "U",
            },
          }
        );
        (this as any).$message({
          type: "success",
          message: this.$t("setting.baocun_chenggong"),
        });
      },
      () => {}
    );
  }
  // 取消按钮
  cancel() {
    this.getData();
    (this.$refs.form as any).clearValidate();
  }
}
</script>

<style lang="scss" scoped>
::v-deep .length-content .number-wrap .number-left {
  border: 1px solid #b6babe;
}
::v-deep .number-right {
  font-size: 12px;
}
.pwd-wrap {
  position: relative;
  min-height: 100%;
  background: #fff;
  .contain-tips {
    display: flex;
    align-items: center;
  }
  .check-wrap {
    width: 554px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  /deep/ .el-checkbox {
    margin-right: 0;
    .el-checkbox__label {
      padding-left: 5px;
    }
    &.is-checked {
      .el-checkbox__label {
        color: #111111;
      }
    }
    &.is-disabled {
      .el-checkbox__label {
        color: #606266;
      }
    }
  }
  .length-content {
    display: flex;
    justify-content: space-between;
    width: 554px;
  }
  .kui-icon-question {
    cursor: pointer;
    color: #8e9095;
    font-size: 14px;
  }
  .pwd-content {
    padding: 20px 24px;
    padding-bottom: 0;
    overflow: auto;
    margin-bottom: 82px;
  }
  .pwd-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 48px;
    padding: 8px 30px 8px 8px;
    width: 100%;
    text-align: right;
    box-shadow: 0px -4px 4px -1px rgba(0, 0, 0, 0.09);
    .kui-button.kui-button--easy {
      padding: 8px 15px;
      width: 64px;
    }
  }
}
</style>
