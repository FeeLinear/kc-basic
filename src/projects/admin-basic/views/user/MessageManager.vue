<!--
 * @Description:
 * @Author: yuanyong
 * @Date: 2020-05-11 14:42:29
 * @LastEditors: yuanyong
 -->
<template>
  <div>
    <kui-page
      ref="page"
      title="$t[message.xiaoxin_zhongxin]"
      :table-height="tableHeight"
      :query-url="backLogUrl"
      :auto-query="false"
      remote-pagi
      :form-prop="formProp"
      :table-prop="tableProp"
      :style="{ minHeight: screen.contentHeight + 'px'}"
    >
      <template #completeTime="{row}">
        {{ row.completeTime && formatTime(row.completeTime) }}
      </template>
      <template #createTime="{row}">
        {{ row.createTime && formatTime(row.createTime) }}
      </template>
      <template #backlogTitle="{row}">
        <span style="color:#00ABEE;cursor:pointer" @click="handleMessage(row,row.backlogStatus,row.backlogUrl,row.backlogCode)">{{ row.backlogTitle }}</span>
      </template>

    </kui-page>
    <div v-if="showDetail" class="message-box" @click.self="closeDetail(messageDetail.backlogCode)">
      <div class="box-content">
        <div class="box-header">
          <span>{{ messageDetail.backlogTitle }}</span>
          <i class="kui-icon-close" @click="closeDetail(messageDetail.backlogCode,messageDetail.backlogStatus)"></i>
        </div>
        <kui-scrollbar rect-not-change>
          <div class="box-item">{{ messageDetail.backlogContent }}</div>
        </kui-scrollbar>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { app$ } from "szkingdom.yf.koca-template/lib/store";

@Component({
  name: "MessageManager"
})
export default class MessageManage extends Vue {
  showDetail = false
  messageDetail = null
  detailHeight = 0
  formProp = {
    btns: [
      {
        key: "query",
        text: "$t[message.chaxun]",
        click: this.queryPage
      },
    ],
    model: {
      backlogStatus: "",
      // userNo: this.userInfo.userNo,
      backlogTitle: "",
      creator: "",
      queryDate: [],
      beginDate: "",
      endDate: ""
    },
    items: [
      {
        mold: "select",
        prop: "backlogStatus",
        label: "$t[message.daiban_zhuantai]",
        options: [{ value: "", label: "$t[message.quanbu]" }, { value: "0", label: "$t[message.weiwancheng]" }, { value: "1", label: "$t[message.yiwancheng]" }],
      }, {
        mold: "input",
        prop: "creator",
        label: "$t[message.faqiren]",
        maxlength: 64
      }, {
        mold: "input",
        prop: "backlogTitle",
        label: "$t[message.daiban_biaoti]",
        maxlength: 128
      }, {
        mold: "date",
        prop: "queryDate",
        label: "$t[message.faqi_shijian]",
        type: "datetimerange",
        valueFormat: "yyyyMMdd HHmmss",
        itemWidth: 390,
        width: 300,
        format: "yyyy-MM-dd HH:mm:ss"
      }
    ]
  }
  tableProp = {
    items: [
      // {
      //   prop: "backlogLevel",
      //   label: "待办级别",
      //   opts: [{ value: "0", label: "低" }, { value: "1", label: "一般" }, { value: "2", label: "紧急" }],
      // },
      {
        type: "index",
        width: 60,
        index: this.renderIndex
      },
      {
        prop: "createTime",
        label: "$t[message.faqi_shijian]",
        width: 180,
      },
      {
        prop: "completeTime",
        label: "$t[message.wancheng_shijian]",
        width: 180,
      },
      {
        prop: "backlogTitle",
        label: "$t[message.daiban_biaoti]",
      },
      {
        prop: "backlogStatus",
        label: "$t[message.daiban_zhuantai]",
        minWidth: 100,
        badgeObj: {
          0: { status: "warning", text: "未完成" },
          1: { status: "success", text: "已完成" },
        },
      },
      {
        prop: "creator",
        label: "$t[message.faqiren]",
      }
    ]
  }
  get tableHeight(){
    return this.$app.screen.CRUD_tableHeight;
  }
  get backLogUrl () {
    return this.$app.apiPrefix.BACKLOG_URL_PREFIX + "api/backlog-page";
  }
  get updateUrl () {
    return this.$app.apiPrefix.BACKLOG_URL_PREFIX + "api/update-backlog-status";
  }
  get userInfo () {
    return this.$user.detail;
  }
  get screen() {
    return app$.screen || {};
  }
  renderIndex (index) {
    return ((this.$refs.page as any).tablePage.pageNum - 1) * 10 + index + 1;
  }
  formatTime (time) {
    const dateList = time.split(" ");
    const year = dateList[0].substr(0, 4);
    const moths = dateList[0].substr(4, 2);
    const date = dateList[0].substr(6, 2);
    const hh = dateList[1].substr(0, 2);
    const mm = dateList[1].substr(2, 2);
    const ss = dateList[1].substr(4, 2);
    return year + "-" + moths + "-" + date + " " + hh + ":" + mm + ":" + ss;
  }
  handleMessage (row, backlogStatus, url, backlogCode) {
    if (url) {
      this.openUrl(backlogStatus, url, backlogCode);
    } else {
      this.showDetail = true;
      this.messageDetail = row;
    }
  }
  closeDetail (backlogCode, backlogStatus) {
    this.showDetail = !this.showDetail;
    if (backlogStatus === "1") return;
    this.$http.post(this.updateUrl, { backlogCode: backlogCode }).then(()=>{
      (this.$refs.page as any).formQueryPage();
    }
    );
  }
  queryPage () {
    if (this.formProp.model.queryDate && this.formProp.model.queryDate.length) {
      this.formProp.model.beginDate = this.formProp.model.queryDate[0];
      this.formProp.model.endDate = this.formProp.model.queryDate[1];
    }
    (this.$refs.page as any).formQueryPage(1);
  }
  openUrl (backlogStatus, url, backlogCode) {
    const routePath = url.includes(".vue") ? url.split(".vue")[0] : url;
    const urlSearch = !url.endsWith(".vue") ? url.split(".vue")[1] : {};
    const routeParams = { backlogCode: backlogCode };
    if (typeof urlSearch === "string") {
      const paramsList = urlSearch && urlSearch.substr(1).split("&");
      paramsList.forEach(item => {
        routeParams[item.split("=")[0]] = item.split("=")[1];
      });
    }
    this.$router.push({ path: routePath, query: routeParams });
    if (backlogStatus === "1") return;
    this.$http.post(this.updateUrl, { backlogCode: backlogCode }).then(()=>{
      (this.$refs.page as any).formQueryPage(1);
    });
  }
  mounted () {
    this.$nextTick(() => {
      if (this.formProp.model.queryDate && this.formProp.model.queryDate.length) {
        this.formProp.model.beginDate = this.formProp.model.queryDate[0];
        this.formProp.model.endDate = this.formProp.model.queryDate[1];
      }
      (this.$refs.page as any).formQueryPage(1);
    });
  }
}
</script>
<style lang="scss" scoped>
.message-box{
  position: fixed;
  z-index: 3000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.3);
  cursor: default;
  .box-content{
    z-index: 3001;
    background: white;
    border-radius: 5px;
    min-width: 500px;
    width: 50%;
    padding: 20px;
    margin:15vh auto;
    min-height: 305px;
    max-height: 60vh;
    .box-header{
      display: flex;
      justify-content: space-between;
      span{
        display: inline-block;
        font-weight: 700;
        width: calc(100% - 40px);
        font-size: 16px;
      }
      i{
        cursor: pointer;
      }
    }
    .box-item{
      padding-top:10px;
      padding-right: 10px;
      font-size: 13px;
      color: #303133;
    }
  }
}
</style>
