<template>
  <kui-field class="date-manage-field" is-block>
    <kui-loading :visible="loading" style="top: 70px" />
    <template slot="title">
      <span class="field-title">{{ $t("datemanage.jiejiari_guanli") }}
      </span>
      <p class="title-tips">{{ $t("datemanage.title_tips") }}</p>
    </template>
    <template slot="title-right">
      <span>{{ $t("datemanage.xuanze_nianfen") }}</span>
      <kui-date
        v-model="year"
        popper-class="date-right"
        type="year"
        value-format="yyyy"
        format="yyyy"
        style="width: 100px;margin-left:8px"
      />
      <kui-button
        size="mini"
        style="margin-left: 8px;"
        :auth="PERMISSIONS['DateManage:init']"
        @click="initDays"
      >{{ $t("datemanage.chushihua_jiejiari") }}
      </kui-button>
    </template>
    <div>
      <div class="calendar-top">
        <div class="color-square-wrapper">
          <div class="color-square"></div>
        </div>
        <div class="label">{{ $t("datemanage.gongzuori") }}</div>
        <div class="color-square-wrapper" style="margin-left: 50px;">
          <div class="color-square" style="background: #F98D89"></div>
        </div>
        <div class="label">{{ $t("datemanage.feigongzuori") }}</div>
        <div class="color-square-wrapper" style="margin-left: 50px;">
          <div class="color-square" style="background: #F4F4F4"></div>
        </div>
        <div class="label">{{ $t("datemanage.daishezhi") }}</div>
      </div>
      <div class="calendar-content">
        <div
          v-for="item in 12"
          :key="'calendar-' + item"
          class="calendar-wrapper"
        >
          <kui-calendar
            :key="'calendar-' + item"
            class="date-manage-calendar"
            :value="year + '-' + item"
          >
            <template
              slot="dateCell"
              slot-scope="{date, data}"
            >
              <kui-popover
                placement="top"
                trigger="hover"
                popper-class="calendar-popover"
              >
                <ul slot="content" class="opts">
                  <li
                    v-if="weekends.includes(data.day.split('-').join('')) ||
                      ![...weekends, ...weekdays].includes(data.day.split('-').join(''))"
                    @click="sysCalendar(data.day.split('-').join(''), daySign.weekday)"
                  >{{ $t("datemanage.shewei_gongzuori") }}</li>
                  <li
                    v-if="weekdays.includes(data.day.split('-').join('')) ||
                      ![...weekends, ...weekdays].includes(data.day.split('-').join(''))"
                    @click="sysCalendar(data.day.split('-').join(''), daySign.weekend)"
                  >{{ $t("datemanage.shewei_feigongzuori") }}</li>
                  <li
                    v-if="[...weekends, ...weekdays].includes(data.day.split('-').join(''))"
                    @click="sysCalendar(data.day.split('-').join(''), '')"
                  >{{ $t("datemanage.chongzhi") }}</li>
                </ul>
                <span slot="reference">{{ data.day.split('-')[2] }}</span>
              </kui-popover>
              <div :class="['color-dot', weekdays.includes(data.day.split('-').join('')) ? 'weekday': '']"></div>
              <div :class="['color-dot', weekends.includes(data.day.split('-').join('')) ? 'weekend': '']"></div>
            </template>
          </kui-calendar>
        </div>
      </div>
    </div>
  </kui-field>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getApiList, ApiTypes } from "./url.config";
import { PERMISSIONS } from "../../permissions";


enum daySign {
  weekday = "0",
  weekend = "1"
}

enum dayColor {
  weekday = "#BACDFB",
  weekend = "#F98D89"
}

@Component({
  name: "DateManage"
})
export default class DateManage extends Vue{
  PERMISSIONS = Object.freeze(PERMISSIONS);
  year = new Date().getFullYear();
  loading = false;
  daySign = daySign;
  weekdays = []
  weekends = []
  get getApiList(): ApiTypes{
    return getApiList(this);
  }

  range(month){
    const { year } = this;
    const lastDay = new Date(year, month, 0);
    return [`${year}-${month}-1`, `${year}-${month}-${lastDay}`];
  }

  @Watch("year")
  yearChange(){
    this.calendarQuery();
  }

  async initDays(){
    const params = {
      "beginDate": this.year + "0101",
      "calendarType": "market",
      "endDate": this.year + "1231",
      "otherDaySet": {
      },
      "weekdaySign": daySign.weekday,
      "weekendSign": daySign.weekend
    };
    this.loading = true;
    await this.$http.post(this.getApiList.calendarInitializeVo, params);
    this.calendarQuery();
    this.loading = false;
  }


  async calendarQuery(){
    const params = {
      "beginDate": this.year + "0101",
      "calendarSign": "",
      "calendarType": "market",
      "endDate": this.year + "1231"
    };
    const { data } = await this.$http.post( this.getApiList.calendarQuery, params);
    this.weekdays = data.calendarData.filter( m => m.calendarSign === daySign.weekday).map( m => m.calendarDate);
    this.weekends = data.calendarData.filter( m => m.calendarSign === daySign.weekend).map( m => m.calendarDate);
  }

  async sysCalendar(calendarDate, calendarSign){
    const params =[
      {
        "calendarDate": calendarDate,
        "calendarSign": calendarSign,
        "calendarType": "market",
        "remark": ""
      }
    ];
    await this.$http.post( this.getApiList.sysCalendar, params);
    this.calendarQuery();
    this.$message({
      type: "success",
      message: (this.$t("datemanage.xiugai_chenggong") as string)
    });
  }

  mounted(){
    this.loading = true;
    this.calendarQuery();
    this.loading = false;
  }


}
</script>
<style lang="scss">
.date-right{
  .el-year-table td{
    &.current:not(.disabled){
      .cell{
        color: #fff !important;
        font-weight: 500;
        background: #3261FF;
      }
    }
    .cell{
      width: 54px;
      height: 22px;
      line-height:22px;
      border-radius: 11px;
      &:hover{
        background: #3261FF17;
        color: #111111ff;
      }
    }
  }
}
.calendar-popover.kui-popover.el-popover{
  padding: 5px 0px;
}
</style>
<style lang="scss" scoped>
  .date-manage-field ::v-deep{
    overflow: scroll;
    .el-input--mini .el-input__inner{
      height: 28px;
      line-height: 28px;
    }
    > .field-header{
      height: unset !important;
      .field-title-wrap{
        line-height: 16px !important;
        margin-top: 18px;
      }
      .field-title-right{
        margin: auto 0;
      }
    }
  }
  .title-tips{
    font-size: 10px;
    color: #C3C2CF;
    line-height: 10px;
    margin-bottom: 16px;
    margin-top: 8px;
  }
  .calendar-wrapper{
    width: 268px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
    display: inline-block;
    margin-bottom: 20px;
  }
  .date-manage-calendar ::v-deep{
    .el-calendar__button-group{
      display: none;
    }
    .el-calendar-table td{
      border: none;
      &.is-selected{
        background-color: transparent !important;
      }
      &.is-today{
        width: 32px;
        height: 32px;
        border-radius:50%;
        color: #fff;
        background: $--color-primary;
      }
    }
    .el-calendar-table .el-calendar-day{
      height: 32px;
      width: 32px;
      padding: 0;
      text-align: center;
      line-height: 32px;
      border-radius: 50%;
      &:hover{
        background-color: #3261FF17;
      }
    }
    .el-calendar-table:not(.is-range) td.prev, .el-calendar-table:not(.is-range) td.next{
      visibility: hidden;
    }
    .el-calendar__header{
      background: #8E9AB1;
      border-radius: 5px 5px 0px 0px ;
    }
    .el-calendar-table th{
      color: #8E9095 !important;
    }
    .el-calendar__title{
      color: #fff;
    }
    .el-calendar__body{
      padding: 12px 20px;
      color: #333;
      font-weight: 400;
      border: none;
      border-top: none;
      border-radius: 0px 0px 5px 5px;
    }
  }
  .opts{
    line-height: 30px;
    >li{
      cursor: pointer;
      padding: 0 30px 0 16px;
      height: 36px;
      line-height: 36px;
      &:hover{
        background:#F5F7FA
      }
    }
  }
  .calendar-top{
    height: 32px;
    display: flex;
    text-align: center;
    justify-content: center;
    .label{
      color: #66686C;
      height: 20px;
      line-height: 20px;
    }
  }
  .calendar-content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20px;
  }
  .color-dot{
    border-radius: 50%;
    height: 4px;
    width: 4px;
    display: none;
    margin-left: 14px;
    margin-top: -6px;
    &.weekday{
      background: #BACDFB;
      display: block;
    }
    &.weekend{
      background: #F98D89;
      display: block;
    }
  }
  .color-square-wrapper{
    width: 20px;
    height: 20px;
    margin-right: 2px;
    padding: 5px;
    border-radius: 4px;

    .color-square{
      width: 100%;
      height: 100%;
      background: #BACDFB;
      line-height: 14px;
    }
  }

</style>
