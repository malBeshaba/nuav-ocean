<template>
  <div class="plan-item">
    <div class="title_head" style="display: flex; height: 48px;">
      <div class="point"></div>
      <div class="plan-title">{{Props.plan.planName}}</div>
      <div class="line"></div>
      <div class="plan-state">{{Props.plan.planState}}</div>
    </div>
    <div class="plan-time" style="margin-left: 48px;">
      <span class="title" >执行时间</span>
      <span class="execution-time" style="font-size: 12px; font-weight: 400; color: #04B3F4; margin-left: 15px">{{Props.plan.execution}}</span>
    </div>
    <div class="equipment" style="margin-left: 48px;">
      <span class="title">型号</span>
      <span class="model" >{{Props.plan.model}}</span>
    </div>
    <div class="payload" style="margin-left: 48px;">
      <span class="title">负载</span>
      <span class="model">{{Props.plan.payload}}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const Props = defineProps<{
  plan: {
    planName: String,
    planState: String,
    execution: String,
    model: String,
    payload: String
  }
}>()
</script>

<style scoped lang="scss">
.point {
  width: 4px;
  height: 4px;
  background-color: #F9A100;
  margin-left: 31px;
  margin-top: 21px;
}
.plan-title {
  width: 200px;
  height: 14px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 48px;
  margin-left: 13px;
}
.title {
  font-size: 12px;
  font-weight: 400;
  color: rgb(244, 158, 0);
}
.model {
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
  margin-left: 40px;
}
.plan-state {
  font-size: 12px;
  font-weight: 400;
  margin-top: 17px;
}
</style>
