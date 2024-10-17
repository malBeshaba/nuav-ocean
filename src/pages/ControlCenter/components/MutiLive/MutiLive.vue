<template>
  <el-scrollbar class="multi-live">
    <list-head title="历史任务"></list-head>
      <div class="non-live" v-if="liveList.length==0">
          暂无历史任务记录
      </div>

    <div class="first" v-if="liveList.length!=0">
      <div v-for="live in liveList.slice(0, 4)" :key="live">
        <LiveBlockItem :info="live"></LiveBlockItem>
      </div>
    </div>
    <div class="other-live" v-for="live in liveList.slice(4)" :key="live" v-if="liveList.length!=0">
      <live-list-item :info="live"></live-list-item>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import WebrtcPlayer from "@/components/video/WebrtcPlayer.vue";
import LiveListItem from "@/pages/ControlCenter/components/MutiLive/LiveListItem.vue";
import ListHead from "@/components/Head/ListHead.vue";
import LiveBlockItem from "@/pages/ControlCenter/components/MutiLive/LiveBlockItem.vue";
import {onMounted, reactive} from "vue";
import {getFlightPlan} from "@/api/droneFlightPlan";
import {timestampToTime} from "@/utils/time/timestamp";
const liveList = reactive([])
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
onMounted(() => {
  getFlightPlan(JSON.parse(localStorage.getItem('userInfo')).workspace_id,
      {pageNo: 1, pageSize: 50, deviceSn: ''}
  ).then(res => {
    console.log('plan', res)
    res.data.list.forEach((item: any) => {
      return liveList.push({
        planName: item.planName,
        planStatus: item.planStatus,
        execution: timestampToTime(item.executeTime),
        model: item.deviceSn
      });
    })
  })
})
</script>

<style scoped lang="scss">
.non-live{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  //color: $ComponentText;
}
.multi-live {
  background-color: $ComponentBackground;
}
.first {
  margin-left: 24px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
</style>
