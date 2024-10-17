<template>
  <div class="photo-management">
    <div class="list-function">
      拍摄时间：
      <el-date-picker
          style="padding-right: 30px;"
          v-model="photoTime"
          type="datetime"
          class="ChooseTime"
          placeholder="请选择时间">
      </el-date-picker>
      图像名称：
      <el-input v-model="photoName" placeholder="请输入关键字" />
      <el-button type="primary" @click="searchPhoto()" size="small"><el-icon><Search /></el-icon>搜索</el-button>
    </div>
    <div v-if="fileList.length > 0" class="list-main" id="photo-list">
      <el-row class="list-item" :gutter="20">
        <el-col
            v-for="item in fileList"
            class="item"
            :key="item.aiResultId"
            :span="6"
        >
          <PhotoAnalysisItem :fileInfo="item" :isAllSelected="isSelecteAll" :isProcessing="isProcessing" :selectedPhotos="selectedPhotos" @selectPhoto="selectPhoto" @showImgViewer="showImgViewer"></PhotoAnalysisItem>
        </el-col>
      </el-row>
    </div>
    <div v-else class="list-no-main">无图像</div>
<!--      <el-collapse v-model="activeName" @change="handleChange">-->
<!--        <el-collapse-item name="active0" >-->
<!--          <template #title>-->
<!--            <div class="collapse-title" >-->
<!--              <div class="orange-dot"></div>-->
<!--              <div class="collapse-title-left">故障帧</div>-->
<!--              <div class="collapse-title-main"> </div>-->
<!--              <div class="collapse-title-right">更多</div>-->
<!--            </div>-->
<!--          </template>-->
<!--          照片-->
<!--          &lt;!&ndash; <div v-if="droneInfo.length > 0">-->
<!--            <div v-for="item in droneInfo" :key="item.device_sn">-->
<!--              <DroneItem :droneInfo="item" @click="getDroneDetail(item.device_sn)"></DroneItem>-->
<!--            </div>-->
<!--          </div>&ndash;&gt;-->
<!--        </el-collapse-item>-->

<!--        <el-collapse-item name="active1" >-->
<!--          <template #title>-->
<!--            <div class="collapse-title">-->
<!--              <div class="orange-dot"></div>-->
<!--              <div class="collapse-title-left">压缩后</div>-->
<!--              <div class="collapse-title-main"> </div>-->
<!--              <div class="collapse-title-right">更多</div>-->
<!--            </div>-->
<!--          </template>-->
<!--          照片-->
<!--          &lt;!&ndash; <div v-for="item in dockInfo" :key="item.device_sn">-->
<!--            <DockItem :dockInfo="item" @click="getDockDetail(item.device_sn)"></DockItem>-->
<!--          </div> &ndash;&gt;-->
<!--        </el-collapse-item>-->

<!--      </el-collapse>-->
    <!-- <div v-else class="list-no-main">{{photoContent}}</div> -->
    <el-image-viewer
      v-if="showViewer"
      :initial-index="initialImgeIndex"
      @switch="photoSwitch"
      @close="showViewer=false"
      :url-list="srcList" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { useMyStore } from "@/store"
import { getFilesListByFlightPlanId } from "@/api/file";
import { MediaFile } from "@/store/types/file";
import loadingFailImg from "@/assets/Resource/loadingFailImg.png"
import loadingImg from "@/assets/Resource/loadingImg.png"
import {aiResultFile} from "@/store/types/file";
import {bridgeAiResult} from "@/api/aiAlgorithm";
import PhotoAnalysisItem from "@/pages/ResultData/components/Data/PhotoAnalysisItem.vue";
const store = useMyStore()
const route = useRoute();
const router = useRouter();
const fileList = ref([] as aiResultFile[])

const Props = defineProps<{
  planId: string
}>()
onMounted(() => {
  bridgeAiResult({
    pageNo: 1,
    pageSize: 40,
    planId: Props.planId
  }).then(res => {
    console.log('res', res)
    fileList.value = res.data.list
    res.data.list.forEach(() => {
      srcList.value.push(loadingImg)
    })
  })
});
const isSelecteAll = ref(false as boolean)
const checkboxName = computed(() => {
  switch (isSelecteAll.value) {
    case true:
      return '取消选择'
    case false:
      return '全选' // 已有计划
    default:
      return '全选'
  }
})
const isProcessing = ref(false as boolean)
const selectedPhotos = ref([] as string[])
const batchProcess = () => {
  selectedPhotos.value = []
  isSelecteAll.value = false
  isProcessing.value = true
}
// 工具查看
const photoTime = ref('');
const photoName = ref('');
const searchPhoto = () => {
  console.log('搜索照片')
};

// 折叠面板
const activeName = ref(['active0']);
const handleChange = (val: string[]) =>{
  // console.log('val', val);
};


const selectPhoto = (val) => {
  const index = selectedPhotos.value.indexOf(val.file_id)
  if (val.state) {
    if (index === -1) {
      selectedPhotos.value.push(val.file_id)
    }
  } else {
    if (index !== -1) {
      selectedPhotos.value.splice(index, 1)
    }
  }
  // console.log('selectedPhotos', selectedPhotos.value)
};
const srcList = ref([] as string[])
const loadImageAsync = (url: string) => {
  return new Promise(function(resolve, reject) {
    const image = new Image();
    image.src = url;
    image.onload = function() {
      resolve(url);  // 返回 url 地址
    };
    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };
  });
}

// 查看照片
const showViewer = ref(false)
const initialImgeIndex = ref(0)
const photoSwitch = (val) => {
  const loading = ElLoading.service({
    lock: false,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  const index = val
  if (srcList.value[index] === loadingImg) {
    if (fileList.value[index].fileManagementDTO.previewPath) {
      loadImageAsync(fileList.value[index].fileManagementDTO.previewPath).then(res => {
        srcList.value[index] = res  //赋值新的 url
      }).catch(err => {
        srcList.value[index] = loadingFailImg
      }).then(() => {
        loading.close()
      })
    }
    else {
      srcList.value[index] = loadingFailImg
      loading.close()
    }
  } else {
    loading.close()
  }

  showViewer.value = true
}
const showImgViewer = (id: any) => {
  const loading = ElLoading.service({
    lock: false,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  console.log('fileList.value', fileList.value)
  const index = fileList.value.findIndex(item => item.aiResultId === id)
  initialImgeIndex.value = index
  if (srcList.value[index] === loadingImg) {
    if (fileList.value[index].fileManagementDTO.previewPath) {
      loadImageAsync(fileList.value[index].fileManagementDTO.previewPath).then(res => {
        srcList.value[index] = res  //赋值新的 url
      }).catch(err => {
        srcList.value[index] = loadingFailImg
      }).then(() => {
        loading.close()
      })
    }
    else {
      srcList.value[index] = loadingFailImg
      loading.close()
    }
  } else {
    loading.close()
  }

  showViewer.value = true
}
</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.photo-management{
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-function {
  width: 100%;
  padding: 20px 65px;
  display: flex;
  align-items: center;
  font-size: $SecondLevelTitleFontSize;
  font-family: $SecondLevelTitleFontFamily;
  font-weight: $SecondLevelTitleFontWeight;
  color: $SecondLevelTitleColor;
  padding-bottom: 0px;
}

.list-function .el-input {
  width: 200px;
  padding-right: 30px;
}

.list-main {
  height: 300px;
  flex-grow: 1;
  padding: $ComponentGap 65px;
  overflow-y: auto;
}

.list-item {
  width: 100%;
  height: 100%;
}

.item {
  height: 48%;
}

.list-no-main {
  height: 300px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 折叠面板
.collapse-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: $SecondLevelTitleFontSize;
  font-family: $SecondLevelTitleFontFamily;
  font-weight: $SecondLevelTitleFontWeight;
  color: $SecondLevelTitleColor;
  /*border: 1px solid #F9A100;*/
  /*background-color: #0A0B0E;*/
}
.collapse-title-main{
  flex-grow: 1;
  border: 1px dashed $UsualColor;
  margin: 0 12px;
}

.el-collapse.el-collapse-item__header is-active focusing {
  background-color: $ComponentBackground;
  border-bottom: none;
}

.el-collapse {
  --el-collapse-border-color: none;
  --el-collapse-content-bg-color: $ComponentBackground;
  border-top: none;
  border-bottom: none;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background: $TouchColor;
  margin-right: 6px;
}
.list-main {
  height: 300px;
  flex-grow: 1;
  padding: $ComponentGap;
}
.list-main::-webkit-scrollbar {
  height: $ScrollbarHeight;
  width: $ScrollbarWidth;
  /* width: 20; */
}

.list-main::-webkit-scrollbar-thumb {
  border-radius: $ScrollbarBorderRadius;
  -webkit-box-shadow: $ScrollbarBoxShadow;
  background: $ScrollbarColor;
}

.list-main::-webkit-scrollbar-track {
  -webkit-box-shadow: $ScrollbarBoxShadow;
  border-radius: $ScrollbarBorderRadius;
  background: $ScrollbarBackgroundColor;
}
</style>
