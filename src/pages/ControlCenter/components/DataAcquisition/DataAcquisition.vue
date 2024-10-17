<template>
  <div class="data-acquisition">
    <list-head title="数据采集信息" style="width: 100%"></list-head>
    <div class="content">
      <div v-for="info in infos" :key="info">
        <data-ac-item :info="info" style="margin-left: 36px;"></data-ac-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListHead from "@/components/Head/ListHead.vue";
import DataAcItem from "@/pages/ControlCenter/components/DataAcquisition/DataAcItem.vue";
import PhotoAc from "@/assets/ControlCenter/photoAc.png"
import VideoAc from "@/assets/ControlCenter/videoData.png"
import GoalAc from "@/assets/ControlCenter/ac.png"
import {collectDataInfoStatistic} from "@/api/data-statistics/taskStatistic";
import {onMounted, reactive} from "vue";

onMounted(()=> {
  collectDataInfoStatistic().then(res => {
    infos[0].num = res.data.image_count
    infos[1].num = res.data.video_count
    infos[2].num = res.data.target_count
  })
})
const infos = reactive([{
  icon: PhotoAc,
  name: "图像采集",
  num: 0
},{
  icon: VideoAc,
  name: "视频数据",
  num: 0
},{
  icon: GoalAc,
  name: "识别目标",
  num: 0
}])
</script>

<style scoped lang="scss">
.data-acquisition {
  background-color: $ComponentBackground;
  width: 100%;
  height: 100%;
}
.content {
  display: flex;
  margin-top: 41px;
}

</style>
