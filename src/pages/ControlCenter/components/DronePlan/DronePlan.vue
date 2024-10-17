<template>
  <div class="drone_plan">
    <list-head title="任务计划" style="width: 100%"></list-head>
    <div class="plans">
      <div v-for="plan in plans" :key="plan">
        <DronePlanItem :plan="plan"></DronePlanItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DronePlanItem from "@/pages/ControlCenter/components/DronePlan/DronePlanItem.vue";
import {getFlightPlan} from "@/api/droneFlightPlan";
import {onMounted, reactive} from "vue";
import ListHead from "@/components/Head/ListHead.vue";
import {timestampToTime} from "@/utils/time/timestamp";

const plans = reactive([])
onMounted(() => {
  getFlightPlan(JSON.parse(localStorage.getItem('userInfo')).workspace_id,
  {pageNo: 1, pageSize: 50, deviceSn: ''}
  ).then(res => {
    console.log('plan', res)
    res.data.list.forEach((item: any) => {
      plans.push({planName: item.planName, planState: '执行中', execution: timestampToTime(item.executeTime), model: item.deviceSn, payload: ''})
    })
  })
})
</script>

<style scoped lang="scss">
.drone_plan {
  width: 100%;
  height: 100%;
  background-color: $ComponentBackground;
}
.plans {
  overflow: hidden auto;
  width: 95.5%;
  height: 100%;
}
.plans::-webkit-scrollbar {
  height: $ScrollbarHeight;
  width: $ScrollbarWidth;
  //width: 20;
}
.plans::-webkit-scrollbar-thumb {
  border-radius: $ScrollbarBorderRadius;
  -webkit-box-shadow: $ScrollbarBoxShadow;
  background: $ScrollbarColor;
}
.plans::-webkit-scrollbar-track {
  -webkit-box-shadow: $ScrollbarBoxShadow;
  border-radius: $ScrollbarBorderRadius;
  background: $ScrollbarBackgroundColor;
}
.plans::-webkit-scrollbar-button {
}

</style>
