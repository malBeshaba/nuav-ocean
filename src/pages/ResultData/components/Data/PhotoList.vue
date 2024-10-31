<template>
  <div class="photo-list">
    <el-tabs v-model="activeTab" class="demo-tabs">
      <el-tab-pane label="成果管理" name="manage">
        <PhotoManagement :plan-id="route.query.flightPlanId?.toString()"></PhotoManagement>
      </el-tab-pane>
<!--      <el-tab-pane label="缺陷识别" name="analysis">-->
<!--        <PhotoAnalysis :plan-id="route.query.flightPlanId"></PhotoAnalysis>-->
<!--      </el-tab-pane>-->

    </el-tabs>
    <el-button type="primary" class="export" @click="exportFrom"><el-icon><Memo /></el-icon>生成报表</el-button>
    <!-- <div class="list-header">
      采集图像
      <el-button type="primary" @click="batchProcess()">批量处理</el-button>
      <el-button type="primary" @click="algorithmProcess()" plain>批量算法</el-button>
      <el-button type="primary" @click="downloadProcess()" plain>批量下载</el-button>
      <el-button type="primary" @click="deleteProcess()" plain>批量删除</el-button>
    </div>
    <div v-if="fileList.length > 0" class="list-main" id="photo-list">
      <el-row class="list-item" :gutter="20">
        <el-col
          v-for="item in fileList"
          class="item"
          :key="item.file_id"
          :span="6"
        >
          <PhotoItem :fileInfo="item" @showImgViewer="showImgViewer"></PhotoItem>
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
    <el-image-viewer
      v-if="showViewer"
      :initial-index="initialImgeIndex"
      @switch="photoSwitch"
      @close="showViewer=false"
      :url-list="srcList" />-->
  </div>
</template>

<script setup lang="ts">
import { Memo } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMyStore } from "@/store"
// import { getFilesListByFlightPlanId } from "@/api/file";
// import { MediaFile } from "@/store/types/file";
// import loadingFailImg from "@/assets/Resource/loadingFailImg.png"
// import loadingImg from "@/assets/Resource/loadingImg.png"
import PhotoManagement from "@/pages/ResultData/components/Data/PhotoManagement.vue";
import PhotoAnalysis from "@/pages/ResultData/components/Data/PhotoAnalysis.vue";
import * as XLSX from 'xlsx';

const store = useMyStore()
const route = useRoute();
const router = useRouter();

const  exportFrom=()=>{
  const data = [
    ['Name', 'Age'],
    ['John', 30],
    ['Jane', 25]
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  const arrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const downloadUrl = URL.createObjectURL(blob);
  const fileName = 'report.xlsx';

  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
// 分页
// const currentPage = ref(1)
// const currentSize = ref(8)
// const fileTotal = ref(0)
// const handleCurrentChange = (val: number) => {
//   currentPage.value = val
//   getFileList()
// }

onMounted(() => {
  // getFileList().then(() => {
  //   getPhotoContent()
  // })
  // console.log()
});

// 判断是否有照片
// const photoContent = ref(' ')
// const getPhotoContent = () => {
//   if (fileList.value.length == 0) {
//     photoContent.value = "无图像"
//   }
// }

//  获取照片文件列表
// const fileList = ref([] as MediaFile[])
// const srcList = ref([] as string[])
// const getFileList = async () => {
//   fileList.value = []
//   srcList.value = []
//   photoContent.value = ' '
//   getFilesListByFlightPlanId(
//     JSON.parse(localStorage.getItem('userInfo')).workspace_id,
//     route.query.flightPlanId, {
//     page: currentPage.value,
//     page_size: currentSize.value,
//     fileTypes: '1,2,3,7'
//   }).then(res => {
//     console.log(res)
//     if(res.code === 0) {
//       fileList.value = res.data.list
//       fileTotal.value = res.data.pagination.total
//       res.data.list.forEach((item) => {
//         srcList.value.push(loadingImg)
//       });
//     }
//   })
// };

// 是否预先加载走马灯
// const loadImage = () => {
//   for (let i = 0; i < fileList.value.length; i++) {
//     console.log('loadImage1', fileList.value[i])
//     if (fileList.value[i].row_url) {
//       console.log('loadImage1', fileList.value[i].row_url)
//       loadImageAsync(fileList.value[i].row_url).then(res => {
//         srcList.value[i] = res  //赋值新的 url
//       }).catch(err => {
//         srcList.value[i] = loadingFailImg
//       })
//     }
//     else {
//       srcList.value[i] = loadingFailImg
//     }
//   }
// }
// const loadImageAsync = (url: string) => {
//   return new Promise(function(resolve, reject) {
//     const image = new Image();
//     image.src = url;
//     image.onload = function() {
//       resolve(url);  // 返回 url 地址
//     };
//     image.onerror = function() {
//       reject(new Error('Could not load image at ' + url));
//     };
//   });
// }

// 查看照片
// const showViewer = ref(false)
// const initialImgeIndex = ref(0)
// const photoSwitch = (val) => {
//   const loading = ElLoading.service({
//     lock: false,
//     text: 'Loading',
//     background: 'rgba(0, 0, 0, 0.5)',
//   })

//   const index = val
//   if (srcList.value[index] === loadingImg) {
//     if (fileList.value[index].row_url) {
//       loadImageAsync(fileList.value[index].row_url).then(res => {
//         srcList.value[index] = res  //赋值新的 url
//       }).catch(err => {
//         srcList.value[index] = loadingFailImg
//       }).then(() => {
//         loading.close()
//       })
//     }
//     else {
//       srcList.value[index] = loadingFailImg
//       loading.close()
//     }
//   } else {
//     loading.close()
//   }

//   showViewer.value = true
// }
// const showImgViewer = (id: any) => {
//   const loading = ElLoading.service({
//     lock: false,
//     text: 'Loading',
//     background: 'rgba(0, 0, 0, 0.5)',
//   })

//   const index = fileList.value.findIndex(item => item.file_id === id)
//   initialImgeIndex.value = index
//   if (srcList.value[index] === loadingImg) {
//     if (fileList.value[index].row_url) {
//       loadImageAsync(fileList.value[index].row_url).then(res => {
//         srcList.value[index] = res  //赋值新的 url
//       }).catch(err => {
//         srcList.value[index] = loadingFailImg
//       }).then(() => {
//         loading.close()
//       })
//     }
//     else {
//       srcList.value[index] = loadingFailImg
//       loading.close()
//     }
//   } else {
//     loading.close()
//   }

//   showViewer.value = true
// }

// 返回
// const backToEquipmentDetail = () => {
//   router.push({
//     path: '/default/task/equipment/detail',
//     query: {
//       device_sn: route.query.device_sn
//     },
//   })
// }

// 处理页面切换
const activeTab = ref('manage')

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.photo-list{
  background: transparent;
  background-color: $ComponentBackground;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0px;
  margin-top: $NavigationHeight;
  height: calc(100% - $NavigationHeight);
  left: $LeftWidth;
  right: 0px;
  // display: flex;
  // flex-direction: column;
  z-index: 2;
}

.list-header {
  border-top: $ComponentHeaderBorder;
  background: $ComponentHeadBackground;
  color: $FirstLevelTitleColor;
  height: $ComponenHeadHeight;
  padding: 16px 12px;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
  font-weight: $FirstLevelTitleFontWeight;
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

// 标签页
.el-tabs {
  width: 100%;
  height: 100%;
  // border-top: $ComponentHeaderBorder;
}

.el-tabs--card {
  height: calc(100vh - $NavigationHeight - $ComponenHeadHeight);
  /* overflow-y: auto; */
}
.el-tab-pane {
  height: calc(100vh - $NavigationHeight - $ComponenHeadHeight);
  overflow-y: auto;
}
.export {
  position: fixed;
  right: 150px;
  top: $NavigationHeight + 13px;
}

:deep(.el-tabs__header) {
  background-color: $ComponentHeadBackground;
  margin-bottom: 0px;
}

:deep(.el-tabs__active-bar) {
  background: $TouchColor;
}

:deep(.el-tabs__item) {
  height: $ComponenHeadHeight;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
  font-weight: $FirstLevelTitleFontWeight;
  padding-left: 65px;
}

:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding-left: 65px;
}

:deep(.el-tabs__item:hover) {
  color: $TouchColor;
}

:deep(.el-tabs__item.is-active) {
  color: $TouchColor;
}
</style>
