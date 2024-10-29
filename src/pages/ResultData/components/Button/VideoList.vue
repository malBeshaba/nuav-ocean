<template>
  <div class="video-list">
    <div class="list-header">
      AI检测视频
    </div>
    <div v-if="videoList.length > 0" class="list-main">
      <el-row class="list-item" :gutter="20">
        <el-col
          v-for="item in videoList"
          :key="item.videoId"
          :span="12"
        >
          <VideoListItem :videoInfo="item" :id="generateRandomID(9)"></VideoListItem>
        </el-col>
      </el-row>
    </div>
    <div v-else class="list-no-main">
      无图传视频文件！
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
import {getDronesVideo, getFilesListByFlightPlanId} from "@/api/file";
import { VedioFile } from "@/store/types/file";
import VideoListItem from '@/pages/ResultData/components/Button/VideoListItem.vue';
import loadingImg from "@/assets/Resource/loadingImg.png";
const route = useRoute();
const router = useRouter();

onMounted(() => {
  getVideoList()
});

// 分页
const currentPage = ref(1)
const currentSize = ref(2)
const videoTotal = ref(3)
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getVideoList()
}

//  获取录像文件列表
const videoList = ref([] as VedioFile[])
const getVideoList = async () => {
  videoList.value = []
  // getDronesVideo({
  //   pageNo: currentPage.value,
  //   pageSize: currentSize.value,
  //   flightPlanId: route.query.flightPlanId as string
  // }).then(res => {
  //   if(res.code === 0) {
  //     videoList.value = res.data.list
  //     videoTotal.value = res.data.pagination.total
  //   }
  // })
  getFilesListByFlightPlanId(
      JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
      route.query.flightPlanId as string, {
        page: currentPage.value, 
        page_size: currentSize.value,
        // fileTypes: '4,5,6,8,10'
        fileTypes: '12'
      }).then(res => {
    if(res.code === 0) {
      res.data.list.forEach((item: any)=>{
        let obj = {} as any
        obj['videoId'] = item.file_id
        obj['videoName'] = item.file_name
        obj['videoPlayUrl'] = item.row_url
        obj['videoCoverUrl'] = ""
        obj['createTime'] = item.create_time
        videoList.value.push(obj)
      })
      videoTotal.value = res.data.pagination.total
    }
  })

};

// 返回
const backToEquipmentDetail = () => {
  router.push({
    path: '/default/task/equipment/detail',
    query: {
      device_sn: route.query.device_sn
    },
  })
}

// 随机生成id
const generateRandomID = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.video-list{
  background: transparent;
  background-color: $ComponentBackground;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  bottom: 40px;
  margin-top: $NavigationHeight;
  height: calc(100% - $NavigationHeight - 40px);
  right: $RightWidth + 20px;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.list-header {
  border-bottom: 1px solid $TouchColor;
  background: $ComponentHeadBackground;
  color: $FirstLevelTitleColor;
  height: $ComponenHeadHeight;
  padding: 16px 12px;
  font-size: $FirstLevelTitleFontSize;
  display: flex;
  align-items: center;
}

.list-main {
  height: 300px;
  flex-grow: 1;
  padding: $ComponentGap;
}

.list-no-main {
  height: 300px;
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
</style>
