<template>
  <div class="online-wrap">
    <kui-field is-block>
      <kui-form-page
        :model="queryModel"
        :items="queryItems"
        :auth="getPermissions"
        @query="queryCallback"
      ></kui-form-page>
    </kui-field>
    <kui-field is-block>
      <kui-table-page
        ref="tablePage"
        :loading="loading"
        :items="tableItems"
        :btns="btns"
        :table-height="tableHeight"
        @query-page="queryPage"
        @select="selectRow"
        @size-change="sizeChange"
        @current-hange="sizeChange"
      >
      </kui-table-page>
    </kui-field>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { getApiUserList } from "./url.config";
import { dateFormat } from "szkingdom.yf.koca-template/lib/utils/date.js";
import { PERMISSIONS } from "../../permissions";

@Component({
  name: "OnlineUser"
})
export default class OnlineUser extends Vue {
  PERMISSIONS = Object.freeze(PERMISSIONS);
  loading = false;
  pageSize = 10;
  total = 0;
  totalData = [];
  selectData = [];
  queryModel = {
    userNo: "",
    userName: ""
  };
  queryItems = [
    {
      mold: "input",
      prop: "userNo",
      labelWidth: 70,
      label: this.$t("onlineUser.renyuan_bianhao"),
      maxlength: 64
    },
    {
      mold: "input",
      prop: "userName",
      labelWidth: 70,
      label: this.$t("onlineUser.renyuan_mingcheng"),
      maxlength: 64
    }
  ];
  tableItems = [
    { type: "select" },
    {
      prop: "userNo",
      label: this.$t("onlineUser.renyuan_bianhao")
    },
    {
      prop: "userName",
      label: this.$t("onlineUser.renyuan_mingcheng")
    },
    {
      prop: "orgCode",
      label: this.$t("onlineUser.jigou_daima")
    },
    {
      prop: "orgName",
      label: this.$t("onlineUser.jigou_mingcheng")
    },
    {
      prop: "loginTime",
      label: this.$t("onlineUser.denglu_shijian"),
      width: "210px",
      formatter: this.formatterDatetime
    },
    {
      type: "button",
      width: "120px",
      btns: [
        {
          text: this.$t("onlineUser.qiangzhi_xiaxian"),
          click: this.editTable,
          auth: PERMISSIONS["OnlineUser:offline-force"],
        }
      ]
    }
  ];
  get tableHeight(){
    return this.$app.screen.contentHeight-200 ;
  }

  get apiList() {
    return getApiUserList(this);
  }
  get btns() {
    return [
      {
        text: this.$t("onlineUser.piliang_xiaxian"),
        disabled: !this.selectData.length,
        icon: "kui-icon-delete",
        click: this.batchTable,
        auth: PERMISSIONS["OnlineUser:offline"],
        type:null
      },
      {
        text: `${this.$t("onlineUser.gong")}${this.total}${this.$t("onlineUser.wei")}${this.$t("onlineUser.zaixian_yonghu")}`,
        type: "text",
        color:"#111111"
      }
    ];
  }
  getPermissions(){
    return {
      query: PERMISSIONS["OnlineUser:query"]
    };
  }
  mounted() {
    this.getData();
  }
  // 获取表格数据
  async getData(num = 1, size = 10) {
    this.loading = true;
    const { data, total } = await this.$http
      .post(this.apiList.getUser, {
        pageNum: num,
        pageSize: size,
        ...this.queryModel
      })
      .catch(() => {
        this.loading = false;
      });
    this.total = total;
    this.totalData = data;
    this.selectData = [];
    (this.$refs.tablePage as any).loadData(data, total, num, size);
    this.loading = false;
  }
  // 查询按钮，前端分页
  queryCallback() {
    const {userNo, userName} = this.queryModel;
    const number = userNo.trim();
    const name = userName.trim();
    const filter = this.totalData.filter(item => {
      if ( number && !name) {
        return item.userNo.includes(number);
      } else if (!number && name) {
        return item.userName.includes(name);
      } else if (number && name) {
        return item.userNo.includes(number) && item.userName.includes(name);
      }
    });
    if (number || name) {
      this.total = filter.length;
      (this.$refs.tablePage as any).loadData(filter, filter.length, 1, this.pageSize);
    } else {
      this.getData(1, this.pageSize);
    }
    this.selectData = [];
  }
  // 批量下线按钮
  batchTable() {
    const data = (this.$refs.tablePage as any).tableEl.getSelected();
    const tips = [];
    const userNos = [];

    data.forEach(item => {
      tips.push(item.userNo);
      userNos.push(item.userNo);
    });
    if (!tips.length) {
      (this as any).$message({
        type: "warning",
        message: this.$t("onlineUser.xiaxian_yonghu")
      });
      return;
    }
    this.confirm(tips, userNos);
  }
  // 强制下线按钮
  editTable(row) {
    this.confirm([row.userNo], [row.userNo]);
  }
  confirm(tips, userNos) {
    const title: any = this.$t("onlineUser.piliang_xiaxian");
    const cancelText: any = this.$t("onlineUser.quexiao");
    const confirmText: any = this.$t("onlineUser.queding");
    this.$confirm(
      `${this.$t("onlineUser.shifou_xiaxian")}[${tips.join("、")}]?`,
      title,
      {
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        type: "warning"
      }
    ).then(() => {
      this.save(this.apiList.updateUser, { userNos }, "");
    })
      .catch(() => {});
  }
  // 保存数据
  async save(url, param, message) {
    const { data } = await this.$http.post(url, param);
    this.getData(1, this.pageSize);
    this.$message({
      type: "success",
      message: message || this.$t("onlineUser.xiaxian_chenggong")
    });
  }
  // 分页查询
  queryPage(num, size) {
    /* this.pageSize = size;
    this.getData(num, size); */
  }
  selectRow() {
    this.$nextTick(() => {
      this.selectData = (this.$refs.tablePage as any).tableEl.getSelected();
    });
  }
  sizeChange(num, size) {
    this.pageSize = size;
    this.selectData = [];
  }
  // 日期时间格式化
  formatterDatetime(val) {
    if (!val || val === undefined) {
      return "";
    }
    if (
      (val.indexOf("-") === -1 || val.indexOf("/") === -1) &&
      val.length === 15
    ) {
      val =
        val.substring(0, 4) +
        "/" +
        val.substring(4, 6) +
        "/" +
        val.substring(6, 11) +
        ":" +
        val.substring(11, 13) +
        ":" +
        val.substring(13, 15);
    }
    const re = dateFormat(val, this.$t("onlineUser.riqi_geshi"));
    return re;
  }
}
</script>
