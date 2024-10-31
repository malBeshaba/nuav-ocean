<template>
  <div class="video-replay">
    <div class="list-header">视频回放</div>
    <div v-show="videoList.length > 0" class="video" :id="id"></div>
    <!-- <div v-if="videoList.length > 0" class="list-main">
      <el-row class="list-item">
        <el-col
          v-for="item in videoList"
          :key="item.videoId"
          :span="24"
        >
          <FlvPlayer :videoInfo="item" />
        </el-col>
      </el-row>
    </div> -->
    <div v-show="videoList.length === 0" class="list-no-main">
      无录像文件！
    </div>
    <div class="list-footer">
      <el-pagination
        :current-page="currentPage"
        :page-size="currentSize"
        layout="prev, pager, next"
        :total="videoTotal"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDronesVideo } from "@/api/file";
import { VedioFile } from "@/store/types/file";
import FlvPlayer from "@/pages/ResultData/components/Button/VideoReplayItem.vue";
const route = useRoute();
const router = useRouter();

// 视频
const height = ref('100%')
const format = ref('mp4')
const videoPlayer = ref(null);
onMounted(() => {
  getVideoList()
});

// 分页
const currentPage = ref(1)
const currentSize = ref(1)
const videoTotal = ref(3)
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getVideoList()
}

//  获取录像文件列表
const videoList = ref([] as VedioFile[])
const id = ref('ReplayVideo')
const getVideoList = async () => {
  videoList.value = []
  getDronesVideo({
    pageNo: currentPage.value,
    pageSize: currentSize.value,
    flightPlanId: route.query.flightPlanId as string
  }).then(res => {
    // console.log('视频', res)
    if(res.code === 0) {
      videoList.value = res.data.list
      videoTotal.value = res.data.pagination.total

      if (videoList.value.length > 0) {
        height.value = `${document.querySelector(`#${id.value}`).clientWidth / 1.7777778}px`;
        format.value = videoList.value[0].videoPlayUrl.substring(videoList.value[0].videoPlayUrl.lastIndexOf('.') + 1);
        document.querySelector(`#${id.value}`).style.height = height.value;
        videoPlayer.value = new Aliplayer({
          id: id.value,
          source: videoList.value[0].videoPlayUrl,
          height: height.value,
          autoplay: false,
          preload: false,
          isLive: false,
          cover: videoList.value[0].videoCoverUrl,
          format: format.value
        }, function (player) {
          console.log("The player is created");
        });
      }

    }
  })
}
// 返回
const backToEquipmentDetail = () => {
  router.push({
    path: '/default/task/equipment/detail',
    query: {
      device_sn: route.query.device_sn
    },
  })
}

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.video-replay{
  background: transparent;
  background-color: rgba(10, 11, 14, 0.85);
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  height: 40%;
  bottom: 0px;
  width: $LeftWidth;
  right: 0px;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.list-header {
  border-top: 1px solid $TouchColor;
  background: $ComponentHeadBackground;
  color: $FirstLevelTitleColor;
  height: $ComponenHeadHeight;
  padding: 16px 12px;
  font-size: $FirstLevelTitleFontSize;
  display: flex;
  align-items: center;
}

.list-main {
  width: 100%;
  height: 100px;
  flex-grow: 1;
  padding: 10px;
}

.list-no-main {
  height: 100px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-item {
  width: 100%;
  height: 100%;
}

.list-footer {
  height: 42px;
  display: flex;
  justify-content: center;
}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}

.video {
  width: $LeftWidth;
  height: 100px;
  flex-grow: 1;
  padding: 10px;
}
</style>
