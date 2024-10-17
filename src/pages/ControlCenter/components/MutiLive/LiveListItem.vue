<template>
  <div class="live-list-item">
    <div class="head" style="display: flex">
      <div class="orange-point" style="background-color: #F9A100; width: 4px; height: 4px;"></div>
      <div class="plan-title"> {{Props.info.planName}}</div>
      <el-image :src="DefaultImage" style="width: 18px; height: 18px; margin-left: 13px; margin-top: 6px;"></el-image>
      <div class="line"></div>
      <div class="plan-state">{{status_name(Props.info.planStatus)}}</div>
    </div>
    <div class="content" style="display: flex">
      <el-image style="width: 110px; height: 66px; margin-left: 30px; margin-top: 10px; margin-bottom: 10px;" :src="TTImage" fit="fill" />
      <div class="text" style="margin-left: 12px; font-size: 12px;">
        <div class="model" style="margin-top: 18px;">
          <span style="color: #F9A100;">设备型号</span>
          <span style="margin-left: 14px; color: #04B3F4">{{ Props.info.model }}</span>
        </div>
        <div class="time" style="margin-top: 14px;">
          <span style="color: #F9A100;">任务时间</span>
          <span style="margin-left: 14px;">{{ Props.info.execution }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultImage from '@/assets/ControlCenter/shipin.png'
import TTImage from '@/assets/images/photo.jpg'
const Props = defineProps<{
  info: {
    url: {
      type: string,
      default: '@/assets/images/photo.jpg'
    },
    model: string,
    execution: string,
    planName: string,
    planStatus: string
  }
}>()
const status_name = (status_id: string) => {
  switch (parseInt(status_id)) {
    case 1:
      return '待执行'
    case 2:
      return '执行中'
    case 3:
      return '已完成'
    case 4:
      return '已取消'
    case 5:
      return '执行失败'
  }
}
</script>

<style scoped>
.live-list-item {
  position: relative;

}
.head {
  height: 28px;
}
.orange-point {
  margin-left: 30px;
  margin-top: 12px;
}
.plan-title {
  line-height: 28px;
  font-size: 14px;
  font-weight: 400;
  margin-left: 7px;
}
.plan-state {
  line-height: 28px;
  font-size: 14px;
  font-weight: 400;
}
/*.plan-title {*/
/*  width: 54px;*/
/*  height: 14px;*/
/*  font-size: 14px;*/
/*  font-family: Microsoft YaHei;*/
/*  font-weight: 400;*/
/*  color: #FFFFFF;*/
/*  line-height: 48px;*/
/*}*/
</style>
