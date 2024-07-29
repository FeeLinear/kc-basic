<template>
  <kui-field is-block>
    <kui-sform
      ref="form"
      :btns="btns"
      :items="items"
      :model="model"
      label-width="100"
      item-width="270"
      :field-arr="detailFieldArr"
    >
    </kui-sform>
  </kui-field>
</template>

<script>
import { dateFormat } from "szkingdom.yf.koca-template/lib/utils/date";
import { getLocalStorage } from "szkingdom.yf.koca-template/lib/utils/cache";
import { getApiList } from "./url.config";
export default {
  data () {
    return {
      uploadVisible: false,
      items: [
        {
          prop: "userIcon",
          label: "$t[ownInfo.tou_xiang]",
          itemWidth: "100%",
          labelWidth: "100",
          valueWidth: "calc(100% - 100px)",
          styleItem: {
            marginBottom: "20px"
          },
          renderValue(h,val,item){
            return !val
              ? h("svg-icon", {
                class: "avatar",
                attrs: {
                  name: "avatar",
                },
                style: {
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%"
                }
              })
              : h("img", {
                attrs: {
                  src: val
                },
                class: "avatar-img",
                style: {
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%"
                }
              });
          }
        },
        {
          prop: "userNo",
          label: "$t[ownInfo.renyuan_bianhao]",
        },
        {
          prop: "userStatus",
          label: "$t[ownInfo.renyaun_zhuangtai]",
          dict: "USER_STATUS"
        },
        {
          prop: "userCode",
          label: "$t[ownInfo.renyuan_daima]"
        },
        {
          prop: "userType",
          label: "$t[ownInfo.renyuan_leixing]",
          dict: "USER_TYPE",
        },
        {
          prop: "userName",
          label: "$t[ownInfo.xing_ming]"
        },
        {
          prop: "mobileTel",
          label: "$t[ownInfo.shouji_haoma]"
        },
        {
          prop: "email",
          label: "$t[ownInfo.you_xiang]"
        },
        {
          prop: "idType",
          label: "$t[ownInfo.zhengjian_leixing]",
          dict: "ID_TYPE",
        },
        {
          prop: "idCode",
          label: "$t[ownInfo.zhengjian_haoma]"
        },
        {
          prop: "idBeginDate",
          label: "$t[ownInfo.zhengjian_kaishi_riqi]",
          formatter: this.formatter
        },
        {
          prop: "idExpDate",
          label: "$t[ownInfo.zhengjian_jieshu_riqi]",
          formatter: this.formatter
        },
        {
          prop: "idIssAgcy",
          label: "$t[ownInfo.fazheng_jiguan]",
          colspan: 2,
          wrap: true
        },
        {
          prop: "idAddress",
          label: "$t[ownInfo.zhengjian_dizhi]",
          colspan: 2,
          wrap: true
        },
        {
          prop: "address",
          label: "$t[ownInfo.lianxi_dizhi]",
          colspan: 2,
          wrap: true
        },
        {
          prop: "birthday",
          label: "$t[ownInfo.chusheng_riqi]",
          formatter: this.formatter
        },
        {
          prop: "sex",
          label: "$t[ownInfo.xing_bie]",
          dict: "SEX",
        },
        {
          prop: "nationality",
          label: "$t[ownInfo.min_zu]",
          dict: "NATIONALITY"
        },
        {
          prop: "citizenship",
          label: "$t[ownInfo.guo_ji]",
          dict: "CITIZENSHIP"
        },
        {
          prop: "education",
          label: "$t[ownInfo.xue_li]",
          dict: "EDUCATION"
        },
        {
          prop: "nativePlace",
          label: "$t[ownInfo.ji_guan]"
        },
        {
          prop: "zipCode",
          label: "$t[ownInfo.youzheng_bianma]"
        },
        {
          prop: "remark",
          label: "$t[ownInfo.beizhu_xinxi]",
          colspan: 2,
          width: 450,
          wrap: true
        },
        {
          prop: "jobNo",
          label: "$t[ownInfo.gong_hao]",
        },
        {
          prop: "officeTel",
          label: "$t[ownInfo.bangong_dianhua]",
        },
        {
          prop: "QQ",
          label: "$t[ownInfo.QQ]",
        },
        {
          prop: "fax",
          label: "$t[ownInfo.chuan_zhen]",
        }
      ],
      btns: [
        {
          key: "edit",
          text: "$t[ownInfo.xinxi_bianji]",
          // click: this.ownInfoChange,
          "is-test": true,
          icon:"kui-icon-edit"
        },
        // {
        //   key: "modify",
        //   text: "$t[ownInfo.xiugai_mima]",
        //   click: this.ownPwdChange
        // }
      ],
      model: {},
      detailFieldArr: [
        {
          title: "$t[ownInfo.jiben_xinxi]",
          propArr: ["userNo", "userName", "userStatus", "idType", "idCode",
            "mobileTel", "email", "address", "idIssAgcy", "idAddress", "idBeginDate", "idExpDate"],
        },
        {
          title: "$t[ownInfo.qita_xinxi]",
          propArr: ["userCode", "userType", "createDate", "cancelDate", "birthday", "sex", "nationality",
            "citizenship", "education", "nativePlace", "zipCode", "remark"],
        },
        {
          title: "$t[ownInfo.tuozhan_xinxi]",
          propArr: ["jobNo", "officeTel", "QQ", "fax"],
        },
      ],
    };
  },
  computed: {
    getApiList() {
      return getApiList(this);
    }
  },
  created () {
    this.detailFieldArr[0].propArr.unshift("userIcon");
    this.queryData();
  },
  methods: {
    // 查询人员信息
    queryData () {
      this.$http.post(this.getApiList.queryOwnUserBex).then(async (res) => {
        if (res.data) {
          if (res.data.userNo === "admin") {
            this.$set(this.btns[0], "disabled", true);
          }
          const userIcon = res.data.userIcon;
          this.model = {...res.data, userIcon: null};
          try {
            if (userIcon) {
              const data = await this.$http.post(this.getApiList.avatarDownload, {fileCode: userIcon}, {config: {"responseType": "blob"}});
              const blob = data.response.data;
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = (e) => {
                this.$nextTick(() => {
                  this.model.userIcon = e.target.result;
                });
              };
            }
          } catch(err) {
            this.model.userIcon = null;
            console.log("获取用户头像出错: ", err);
          }
        }
      });
    },
    formatter (val) {
      if (!val || val === undefined) {
        return "";
      }
      if ((val.indexOf("-") === -1 || val.indexOf("/") === -1) && val.length === 8) {
        val = val.substring(0, 4) + "/" + val.substring(4, 6) + "/" + val.substring(6);
      }
      const re = dateFormat(val, this.$t("ownInfo.dateFormat"));
      return re;
    },
    ownInfoChange () {
      // eslint-disable-next-line no-undef
      delFragmentRouter([{
        menuId: "ownInfoChange",
        menuUrl: "/admin-basic/views/user/OwnInfoChange",
        loadType: "0"
      }]);
      const language = getLocalStorage("language");
      const menuName = (language === "en-US") ? "OwnInfoChange" : "人员信息修改";
      // eslint-disable-next-line no-undef
      addFragmentRouter([{
        menuId: "ownInfoChange",
        menuName: menuName,
        menuUrl: "/admin-basic/views/user/OwnInfoChange",
        loadType: "0"
      }]);
      this.$router.push({ name: "ownInfoChange", path: "/admin-basic/views/user/OwnInfoChange" });
    },
    ownPwdChange () {
      this.$router.push({ name: "ownInfoChange", path: "/admin-basic/views/user/OwnPwdChange" });
    }
  }
};
</script>
<style lang="scss">
.avatar-img {
  &[src=""], &:not([src]){
    display: none;
  }
}
</style>

