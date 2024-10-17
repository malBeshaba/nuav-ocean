<template>
  <div class="data-list">
    <list-head title="成果数据" style="width: 100%;"></list-head>
    <div class="list-function">
      <!-- <div class="list-function-select">
          <el-select v-model="selectValue" placeholder="请选择设备" @change="selectChange" size="default" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div> -->
      <div class="list-function-input">
        <el-input v-model="input" placeholder="请输入搜索内容" :suffix-icon="Search" size="default"/>
      </div>
    </div>
    <div class="list-main">
      <el-tabs tab-position="left" style="height: 100%" class="demo-tabs" v-model="activeTab">
        <el-tab-pane name="flight_path">
<!--          <template #label><el-icon><Files /></el-icon></template>-->
	        <template #label>
		        <el-popover
					    placement="top-start"
					    title="飞行轨迹"
					    :width="200"
					    trigger="hover"
					    content="单击查看历史飞行轨迹"
					  >
			        <template #reference><i class="iconfont icon-qifeiweizhi"></i></template>
		        </el-popover>
	        </template>
<!--          <template #label>-->

<!--	          <i class="iconfont icon-qifeiweizhi"></i>-->
<!--          </template>-->
          <el-collapse v-model="activeName" @change="handleChange">
            <el-collapse-item name="drone" >
              <template #title>
                <div class="collapse-title" >
                  <div class="orange-dot"></div>
                  <div class="collapse-title-left">无人机</div>
                  <div class="collapse-title-main"> </div>
                  <div class="collapse-title-right">收起({{ droneTotal }})</div>
                </div>
              </template>
              <div v-if="droneInfo.length > 0">
                <div v-for="item in droneInfo" :key="item.device_sn">
                  <DroneItem :droneInfo="item" @click="getDroneDetail(item.device_sn)"></DroneItem>
                </div>
              </div>
              <div v-else>
                无数据！
              </div>
            </el-collapse-item>
            <el-collapse-item name="dock" >
              <template #title>
                <div class="collapse-title">
                  <div class="orange-dot"></div>
                  <div class="collapse-title-left">停机坪</div>
                  <div class="collapse-title-main"> </div>
                  <div class="collapse-title-right">收起({{ dockTotal }})</div>
                </div>
              </template>
              <div v-for="item in dockInfo" :key="item.device_sn">
                <DockItem :dockInfo="item" @click="getDockDetail(item.device_sn)"></DockItem>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane name="Oblique">
<!--          <template #label><el-icon><Link /></el-icon></template>-->
	        <template #label>
		        <el-popover
					    placement="top-start"
					    title="倾斜数据"
					    :width="200"
					    trigger="hover"
					    content="单击查看倾斜数据"
					  >
			        <template #reference><i class="iconfont icon--chanpinzhuanye"></i></template>
		        </el-popover>
	        </template>
          <ImportData v-if="isImportData" class="list-main-import" @closeImportData="closeImportData">
          </ImportData>
          <div v-else class="list-main-import">
            <el-button plain class="import-btn" @click="clickImportData">+ 导入数据</el-button>
            <div class="import-content" v-if="externalData.length > 0" >
              <div v-for="(item, index) in externalData" :key="index" @click="ItemClick(item)">
                <DataListItem :dataInfo="item" :class="{'selected': SelectedList[index].isSelected}"></DataListItem>
              </div>
            </div>
            <div class="import-content" v-else>
              暂无数据
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import DroneItem from "@/components/Equipment/DroneItem.vue";
import DockItem from "@/components/Equipment/DockItem.vue";
import ListHead from "@/components/Head/ListHead.vue";
import DataListItem from '@/pages/ResultData/components/Data/DataListItem.vue';
import ImportData from '@/pages/ResultData/components/Data/ImportData.vue';
import {onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBindingDevices } from '@/api/device'
import { getFlightPlan } from '@/api/droneFlightPlan'
import {getModelDataList, getResponseUrlData} from '@/api/modelData'
import { CesiumFlyTo, DrawPointByBillboard } from '@/components/mapTools/BaseMapTools'
import { Search, Files, Link } from '@element-plus/icons-vue'
import { useMyStore } from '@/store'
import dockImage from '@/assets/map/dock.png'
import {TilesetData} from "@/components/mapTools/class/Map3DtilesetClass";
import {CheckWayLine} from "@/pages/TaskDeployment/components/WayLine/WayLineListCheckWayLine";
import index from "@/pages/ResourceManagement/index.vue";
import {Checktileset} from "@/pages/ResultData/components/Data/DataListCheckDataList";
import bus from "@/utils/bus";
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies()
const store = useMyStore()

onMounted(() => {
  getDroneList();
  getDockList();
  getTaskInfo();
  getModelData();
});
const SelectedList=ref([]);
const activeTab = ref("flight_path")
// 获取无人机设备
const droneInfo = ref([] as any[]);
const droneTotal = ref('-');
const getDroneList = () => {
  droneInfo.value = []
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 0,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      droneTotal.value = res.data.pagination.total
      droneInfo.value = res.data.list
      // res.data.list.forEach((item: any) => {
      //   droneInfo.push(item)
      // })
    }
  })
};
// 获取机场
const dockInfo = ref([] as any[]);
const dockTotal = ref('-');
const getDockList = () => {
  dockInfo.value = []
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 3,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      dockTotal.value = res.data.pagination.total
      dockInfo.value = res.data.list
    }
  })
};
// 获取飞行任务
const taskTotal = ref('-');
const getTaskInfo = async () => {
  getFlightPlan(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, {
    pageNo: 1,
    pageSize: 50,
    deviceSn: ''
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      taskTotal.value = res.data.pagination.total
    }
  })
};
// 点击设备，路由跳转
const route = useRoute();
const router = useRouter();
const getDroneDetail = (device_sn: string) => {
  // console.log('route', route.path.split('/')[2])
  if (route.path.split('/')[2] == 'task') {
    goToTask(device_sn)
  } else if (route.path.split('/')[2] == 'resource') {
    router.push({
      path: '/default/resource/drone',
      query: {
        device_sn: device_sn
      }
    })
  } else if (route.path.split('/')[2] == 'result') {
    goToResult(device_sn)
  }
};
const getDockDetail = (device_sn: string) => {
	checkDrone(device_sn)
  if (route.path.split('/')[2] == 'task') {
    goToTask(device_sn)
  } else if (route.path.split('/')[2] == 'resource') {
    router.push({
      path: '/default/resource/dock',
      query: {
        device_sn: device_sn
      }
    })
  } else if (route.path.split('/')[2] == 'result') {
    goToResult(device_sn)
  }
};
const goToTask = (device_sn: string) => {
  router.push({
    path: '/default/task/task-list',
    query: {
      device_sn: device_sn
    }
  })
};
const goToResult = (device_sn: string) => {
  router.push({
    path: '/default/result/task-list',
    query: {
      device_sn: device_sn
    }
  })
};
// 筛选框
const options = reactive([
  {
    label: '无人机',
    value: 'drone',
  },{
    label: '停机坪',
    value: 'dock',
  }
  // ,{
  //   label: '地勤人员',
  //   value: 'user',
  // }
]);
const selectValue = ref('');
const selectChange = (val: string) => {
  activeName.value = [];
  activeName.value.push(val)
};
// 搜索框
const input = ref('');
// 折叠面板
const activeName = ref(['drone']);
const handleChange = (val: string[]) =>{
  // console.log('val', val);
};


const checkDrone = (device_sn: string) => {
	store?.commit('CHECK_DOCK_STATE', { device_sn: device_sn, isShow: true })
	store?.state?.checkDockState.forEach((item: any) => {
		if (item.sn == device_sn) {
			const dockPoint = window.cesiumViewer.entities.getById(String(device_sn) + 'dockCheck')
			if(dockPoint) {
				window.cesiumViewer.entities.remove(dockPoint)
				DrawPointByBillboard(window.cesiumViewer, String(device_sn) + 'dockCheck', [item.position.longitude,item.position.latitude, item.position.height], 0, dockImage)
			} else {
				DrawPointByBillboard(window.cesiumViewer, String(device_sn) + 'dockCheck', [item.position.longitude,item.position.latitude, item.position.height], 0, dockImage)
			}
		}
	})
}

// 获取外部数据
const externalData = ref([] as any[])

const getModelData = async () => {
  externalData.value = []
  getModelDataList({
    pageNo: 1,
    pageSize: 100
  }).then(res => {
    if (res.code === 0) {
      externalData.value = res.data.list
      SelectedList.value = res.data.list.map((item: { dataName: any; }) => ({
        dataName: item.dataName,
        isSelected: false
      }));
    }
  })
};
// 导入数据
const isImportData = ref(false)
const clickImportData = () =>{
  isImportData.value = true
};
const closeImportData = () =>{
  isImportData.value = false
  getModelData()
};
const radio=ref(5)
let showdataId = ref('')
let select_data_item = {} as any;
function ItemClick(clickedItem: { dataName: any; dataId: string }) {
  select_data_item = clickedItem
  // console.log('????')
  // bus.emit('clickResultModelItem', clickedItem.dataId)
  const index = SelectedList.value.findIndex(item => item.dataName === clickedItem.dataName)
  if (index !== -1 && SelectedList.value[index].isSelected) {
    SelectedList.value[index].isSelected = !SelectedList.value[index].isSelected
  } else {
    SelectedList.value.forEach((item: { isSelected: any; dataName: any }) => {
      item.isSelected = (item.dataName === clickedItem.dataName);
    });
  }
  // SelectedList.value.forEach((item: { isSelected: any; dataName: any }) => {
  //   item.isSelected = (item.dataName === clickedItem.dataName);
  // });
  showdataId.value = clickedItem.dataId
  Checktileset(window.cesiumViewer, clickedItem, false)
}
function save_cache() {
  const cache = {
    'tab_name': activeTab.value,
    'select_item': select_data_item as any
  }
  cookies.set('result_cache', JSON.stringify(cache))
}
onMounted(() => {
  window.addEventListener('beforeunload', save_cache)
  if (cookies.get('result_cache')) {
    let data = cookies.get('result_cache') as any
    activeTab.value = data['tab_name']
    ItemClick(data['select_item'])
  }
})
onBeforeUnmount(() => {
  cookies.remove('result_cache')
})
</script>

<style scoped lang="scss">
@import "//at.alicdn.com/t/c/font_3880304_mpmfa86c26q.css";
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.data-list {
  height: 100%;
  width: 100%;
  background: $ComponentBackground;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

// 旧版本
// .list-title {
//   font-size: 16px;
//   font-family: Microsoft YaHei, sans-serif;
//   font-weight: 400;
//   color: #FFFFFF;
//   height: 17px;
//   border-left: 4px solid orange;
//   padding-left: 1rem;
// }

.list-function {
  display: flex;
  width: 100%;
  padding: $ComponentGap;
  padding-bottom: 0px;
}

// 选择框
.list-function .list-function-select {
  position: absolute;
  left: 15px;
  width: 166px;
  height: 36px;
  background: $TouchColorBackground;
  border: 1px solid $TouchColor;
  opacity: 0.8;
  /*padding: 0px;*/
  /*flex: 4;*/
  /*padding-right: 16px;*/
}

// 搜索框
.list-function .list-function-input {
  width: 100%;
  height: 36px;
}

.list-function :deep(.el-input__wrapper){
  box-shadow: none;
  background: $TouchColorBackground;
  border: 1px solid $TouchColorBackground;
  border-radius: 0px;
}

.list-main {
  padding: $ComponentGap;
  flex: 1;
  width: 100%;
  display: flex;
}

.collapse-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: $SecondLevelTitleFontSize;
  font-family: $SecondLevelTitleFontFamily;
  font-weight: $SecondLevelTitleFontWeight;
  color: $SecondLevelTitleColor;
}
.collapse-title-main{
  flex-grow: 1;
  border: 1px dashed $AnnotateColor;
  margin: 0 4px;
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

.selected {
  border: 1px solid $TouchColor;
}

// 标签页
.el-tabs {
  width: 100%;
}

:deep(.el-tabs__active-bar) {
  background: $TouchColor;
  height: 50px !important;
}

:deep(.el-tabs__item) {
  height: 50px;
  font-size: 24px;
  padding-left: 0px;
}

:deep(.el-tabs__item:hover) {
  color: $TouchColor;
}

:deep(.el-tabs__item.is-active) {
  color: $TouchColor;
}

.list-main-import {
  width: 100%;
  height: 100%;
  padding-left: 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.import-content {
  width: 100%;
  padding: $ComponentGap 0;
  // overflow: auto hidden;
  overflow-y: auto;
}

.import-btn {
  width: 30%;
  align-self: flex-end;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  font-weight: $ContentFontWeight;
}
.radio-group {
  display: flex;
  flex-wrap: nowrap;
}
</style>
