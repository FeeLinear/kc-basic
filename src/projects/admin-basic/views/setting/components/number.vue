<!--
 * @Descripttion:
 * @Author: sueRimn
 * @Date: 2021-03-24 10:45:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-30 13:08:48
-->
<template>
  <div class="number-wrap">
    <span v-if="leftText" class="number-left">{{ leftText }}</span>
    <kui-number
      v-model="currentValue"
      :width="width"
      :min="Number(min)"
      :max="Number(max)"
      :step-strictly="true"
      controls-position="right"
    >
    </kui-number>
    <span class="number-right">{{ rightText }}</span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

@Component({
  name: "NumberWrap"
})
export default class NumberWrap extends Vue {
  @Prop({
    type: String, // 父组件传递给子组件的数据类型
    required: false, // 是否必填
    default: "" // 默认值， 如果传入的是 Object，则要 default: ()=>({}) 参数为函数
  })
  leftText;
  @Prop({
    type: String, // 父组件传递给子组件的数据类型
    required: false, // 是否必填
    default: "" // 默认值， 如果传入的是 Object，则要 default: ()=>({}) 参数为函数
  })
  rightText;
  @Prop()
  value?: any;
  @Prop({
    type: String
  })
  width;
  @Prop()
  min?: any;
  @Prop()
  max?: any;
  get currentValue() {
    return this.value;
  }

  set currentValue(newVal: any) {
    this.$emit("input", newVal);
  }
}
</script>
<style lang="scss" scoped>
.number-wrap {
  position: relative;
  vertical-align: middle;
  display: inline-flex;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  color: #333;
  .number-left {
    padding: 0 6px;
    border: 1px solid #dcdfe6;
    background-color: #f5f7fa;
    border-radius: 4px 0 0 4px;
    line-height: 30px;
  }
  .number-right {
    position: absolute;
    right: 42px;
    z-index: 10;
    max-width: 32px;
    overflow: hidden;
  }
  /deep/.number-left + .el-input-number .el-input__inner {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    text-align: left;
  }

  /deep/ .el-input-number.is-controls-right .el-input-number__increase {
    border-radius: 0 3px 0 0;
  }

  /deep/ .el-input-number.is-controls-right .el-input-number__decrease {
    border-radius: 0 0 3px 0;
  }
}
</style>
