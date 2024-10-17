<template>
  <div class="live-block-item" style="width: 160px; height: 90px;">
    <div class="plan-state">{{status_name(Props.info.planStatus)}}</div>
    <div class="footer">
      <span class="plan-title">{{Props.info.planName}}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultImage from '@/assets/images/photo.jpg'
const Props = defineProps<{
  info: any
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
.live-block-item {
  /*background-color: white;*/
  position: relative;
  margin-top: 9px;
  margin-left: 7px;
  background-image: url('@/assets/images/photo.jpg');
}
.plan-state {
  position: relative;
  padding-top: 26px;
  text-align: center;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 28px;
  background: #100800;
  opacity: 0.8;
}
.plan-title {
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #E1B46D;
  line-height: 28px;
  background-image: -webkit-linear-gradient(0deg, rgba(207, 178, 123, 1) 0%, rgba(215, 159, 80, 1) 100%);

  -webkit-text-fill-color:transparent;
  -webkit-background-clip: text;
}
</style>
