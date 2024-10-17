<template>
  <div class="photo-management">
    <div class="list-function">
      <div class="list-function__left">
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
      <div v-if="!isProcessing" class="list-function__right">
        <el-button type="primary" @click="batchProcess()" size="small"><el-icon><DocumentCopy /></el-icon>批量处理</el-button>
      </div>
      <div v-if="isProcessing" class="list-function__right">
        <el-checkbox v-model="isSelecteAll" :label="checkboxName" size="small" style="padding-right: 10px;"/>
        <el-button type="primary" @click="algorithmProcess()" plain size="small"><el-icon><MagicStick /></el-icon>批量算法</el-button>
        <el-button type="primary" @click="downloadProcess()" plain size="small"><el-icon><Download /></el-icon>批量下载</el-button>
        <el-button type="primary" @click="deleteProcess()" plain size="small"><el-icon><Delete /></el-icon>批量删除</el-button>
        <el-button type="primary" @click="cancelProcess()" size="small">取消</el-button>
      </div>
    </div>
    <div v-if="fileList.length > 0" class="list-main" id="photo-list">
      <el-row class="list-item" :gutter="20">
        <el-col
          v-for="item in fileList"
          class="item"
          :key="item.file_id"
          :span="6"
        >
          <PhotoItem :fileInfo="item" :isAllSelected="isSelecteAll" :isProcessing="isProcessing" :selectedPhotos="selectedPhotos" @selectPhoto="selectPhoto" @showImgViewer="showImgViewer"></PhotoItem>
        </el-col>
      </el-row>
    </div>
    <div v-else class="list-no-main">{{photoContent}}</div>
    <div class="list-footer">
      <el-pagination
        class="list-page"
        :current-page="currentPage"
        :page-size="currentSize"
        layout="prev, pager, next"
        :total="fileTotal"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 照片预览 -->
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
import { Search, DocumentCopy, Download, Delete, MagicStick } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { useMyStore } from "@/store"
import { getFilesListByFlightPlanId } from "@/api/file";
import { MediaFile } from "@/store/types/file";
import loadingFailImg from "@/assets/Resource/loadingFailImg.png"
import loadingImg from "@/assets/Resource/loadingImg.png"
import PhotoItem from "@/pages/ResultData/components/Data/PhotoListItem.vue";
import {bridgeDetectAlgorithm} from "@/api/aiAlgorithm";
const store = useMyStore()
const route = useRoute();
const router = useRouter();
const Props = defineProps<{
  planId: string
}>()
// 分页
const currentPage = ref(1)
const currentSize = ref(8)
const fileTotal = ref(0)
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getFileList()
  isSelecteAll.value = false
}

onMounted(() => {
  getFileList().then(() => {
    getPhotoContent()
  })
});

// 判断是否有照片
const photoContent = ref(' ')
const getPhotoContent = () => {
  if (fileList.value.length == 0) {
    photoContent.value = "无图像"
  }
}

//  获取照片文件列表
const fileList = ref([] as MediaFile[])
const srcList = ref([] as string[])
const getFileList = async () => {
  fileList.value = []
  srcList.value = []
  photoContent.value = ' '
  getFilesListByFlightPlanId(
    JSON.parse(localStorage.getItem('userInfo')).workspace_id,
    route.query.flightPlanId, {
    page: currentPage.value,
    page_size: currentSize.value,
    fileTypes: '1,2,3,7,9'
  }).then(res => {
    if(res.code === 0) {
      fileList.value = res.data.list
      fileTotal.value = res.data.pagination.total
      res.data.list.forEach((item) => {
        srcList.value.push(loadingImg)
      });
    }
  })
};

// 是否预先加载走马灯
const loadImage = () => {
  for (let i = 0; i < fileList.value.length; i++) {
    // console.log('loadImage1', fileList.value[i])
    if (fileList.value[i].row_url) {
      // console.log('loadImage1', fileList.value[i].row_url)
      loadImageAsync(fileList.value[i].row_url).then(res => {
        srcList.value[i] = res  //赋值新的 url
      }).catch(err => {
        srcList.value[i] = loadingFailImg
      })
    }
    else {
      srcList.value[i] = loadingFailImg
    }
  }
}
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
    if (fileList.value[index].row_url) {
      loadImageAsync(fileList.value[index].row_url).then(res => {
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

  const index = fileList.value.findIndex(item => item.file_id === id)
  initialImgeIndex.value = index
  if (srcList.value[index] === loadingImg) {
    if (fileList.value[index].row_url) {
      loadImageAsync(fileList.value[index].row_url).then(res => {
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

// 返回
const backToEquipmentDetail = () => {
  router.push({
    path: '/default/task/equipment/detail',
    query: {
      device_sn: route.query.device_sn
    },
  })
}

// watch(fileList.value, (newVal, oldVal) => {
//   console.log('fileList.value', newVal)
// })

// 数据处理
const isProcessing = ref(false as boolean)
const selectedPhotos = ref([] as string[])
const batchProcess = () => {
  selectedPhotos.value = []
  isSelecteAll.value = false
  isProcessing.value = true
}
const algorithmProcess = () => {
  console.log('算法处理：', {
    mediaFileIds: selectedPhotos.value,
    planId: Props.planId,
    algorithmId: '1631642305952845827'
  })
  bridgeDetectAlgorithm({
    mediaFileIds: selectedPhotos.value,
    planId: Props.planId,
    algorithmId: '1631642305952845827'
  }).then(res => {
    console.log('算法返回：',res)
  })
}
const downloadProcess = () => {
  console.log('下载处理')
}
const deleteProcess = () => {
  console.log('删除处理')
}
const cancelProcess = () => {
  isProcessing.value = false
}
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
// 全选照片的单选框
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

// 工具查看
const photoTime = ref('');
const photoName = ref('');
const searchPhoto = () => {
  console.log('搜索照片')
};
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
  justify-content: space-between;
  font-size: $SecondLevelTitleFontSize;
  font-family: $SecondLevelTitleFontFamily;
  font-weight: $SecondLevelTitleFontWeight;
  color: $SecondLevelTitleColor;
  padding-bottom: 0px;
}

.list-function__left .el-input {
  width: 200px;
  padding-right: 30px;
}

.list-function__right {
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

.item {
  height: 48%;
}

.list-footer {
  height: 42px;
}

// 分页
.list-page {
  justify-content: center;
  color: $TouchColor;
}

:deep(.el-pager li:hover)  {
  color: $SecondTouchColor;
}

:deep(.el-pager li.is-active)  {
  color: $TouchColor;
}

:deep(.el-pagination button:hover)  {
  color: $SecondTouchColor;
}

:deep(.el-pagination button.is-active)  {
  color: $TouchColor;
}

.el-icon {
  padding-right: 4px;
}
</style>
