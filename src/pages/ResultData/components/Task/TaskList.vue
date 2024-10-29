<!--suppress TypeScriptValidateTypes -->
<template>
  <div class="task-list" id="rtl">
    <div class="list-header">
      <div class="title">任务列表</div>
      <div class="title-function">
        <el-icon class="button-backward" :size="16" @click="backToEquipmentList()"><Back /></el-icon>
      </div>
    </div>
    <div class="list-function">
      <div class="list-function-select">
        <el-select v-model="selectValue" placeholder="任务状态" @change="selectChange" size="default" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="list-function-input">
        <el-input v-model="input" placeholder="按任务名称搜索" :suffix-icon="Search" size="default" />
      </div>
    </div>
    <div v-if="planInfo.length > 0" class="list-main">
      <div v-for="item in planInfo" :key="item.flightPlanId" class="list-main-item">
        <TaskItem @refresh="getTaskInfo" :planInfo="item" @click="getTaskInformation(String(item.flightPlanId), item.waylineId)"></TaskItem>
      </div>
	    <button-list v-if="ResultDataButtonValue.isShow" :ResultDataButtonValue="ResultDataButtonValue"></button-list>
    </div>
    <div v-else class="list-no-main">
      无任务！
    </div>
    <div class="list-footer">
      <el-pagination
        :current-page="currentPage"
        :page-size="currentSize"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <router-view name="result_detail"></router-view>
  </div>
</template>

<script setup lang="ts">
import TaskItem from "@/components/Task/TaskItem.vue";
import ButtonList from '@/pages/ResultData/components/Button/ButtonList.vue'
import {ref, onMounted, reactive, watch, onBeforeUnmount} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFlightPlan } from '@/api/droneFlightPlan'
import {
	getFlyTrajectoriesByPlanId,
	getWaylineById,
	getWaylineGlobalParamsByWaylineId,
	Placemark,
	WaylineList
} from '@/api/wayline'
import { Search, Back } from '@element-plus/icons-vue'
import { getWayLinePointByGlobalParamsId } from '@/api/wayLinePoint'
import { RemoveEntitiesByBatch, RemoveEntitiesById } from '@/components/mapTools/BaseMapTools'
import { insertFlightTaskParams } from '@/api/droneFlightPlan'
import { CalculateTheZoomLevelAndCenter } from '@/components/mapTools/SeniorMapTools'
import * as Cesium from 'cesium'
import { useMyStore } from '@/store'
import { TaskListCheckWayLine } from '@/pages/ResultData/components/Task/TaskListCheckWayLine'
import bus from "@/utils/bus";
import {useCookies} from "vue3-cookies";
import {WayLinePointUpload} from '@/store/types/wayline'
import { cos } from "mathjs";
const {cookies} = useCookies()
const store = useMyStore()
const route = useRoute();
const device_sn = ref();
const router = useRouter();

onMounted(() => {
  // window.addEventListener('beforeunload', save_cache)
  // if (cookies.get('result_task')) {
  //   const data = cookies.get('result_task') as any
  //   setTimeout(() => getTaskInformation(data.fpi, data.wli), 4000)
  // }
  if (route.path.includes('result')) {
    
    loadTaskInfo(route.query?.fpi as string, route.query?.wli as string)
  }
  device_sn.value = route.query.device_sn;
  getTaskInfo()
});
// 分页
const currentPage = ref(1)
const currentSize = ref(5)
const total = ref(20)
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getTaskInfo()
}
// 获取飞行计划
const planInfo = reactive<insertFlightTaskParams[]>([]);
const getTaskInfo = async () => {
  planInfo.splice(0, planInfo.length);
  getFlightPlan(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, {
    pageNo: currentPage.value,
    pageSize: currentSize.value,
    deviceSn: device_sn.value,
    planStatus: selectValue.value
  }).then(res => {
    if (res.code === 0) {
      total.value = res.data.pagination.total
      res.data.list.forEach((item: insertFlightTaskParams) => {
	        planInfo.push(item);
      })
    }
  })
};
// 监听路由
// watch(() => route.query.device_sn, (newData, oldData) => {
//   device_sn.value = newData;
//   getTaskInfo()
// }, { deep: true })
// 筛选框
enum planStatus {
  All = '3,5',
  Success = '3',
  Fail = '5'
}
const options = reactive([
  {
    label: '全部',
    value: planStatus.All,
  },{
    label: '已完成',
    value: planStatus.Success,
  },{
    label: '执行失败',
    value: planStatus.Fail,
  }
]);
const selectValue = ref('3,5');
const selectChange = (val: string) => {
  getTaskInfo()
};
// 搜索框
const input = ref('')
// 返回
const backToEquipmentList = () => {
  // console.log(ResultDataButtonValue.isShow)
	store.commit('CHECK_DOCK_STATE', { device_sn: device_sn.value, isShow: false })
	RemoveEntitiesById(window.cesiumViewer, String(device_sn.value) + 'dockCheck')
	RemoveEntitiesByBatch(window.cesiumViewer, 'ResultData')
	ResultDataButtonValue.isShow = false
  if (route.path.includes('/default/task/task-list')) {
    router.push('/default/task')
  } else {
    router.push('/default/task/task-list?device_sn=' + device_sn.value)
  }
}

// 判断飞行成果数据按钮是否显示
const ResultDataButtonValue = reactive({
	flightPlanId: '',
	isShow: false,
	device_sn: '',
})
const showResultDataButton = (flightPlanId: string) => {
  if(ResultDataButtonValue.flightPlanId === flightPlanId) {
		ResultDataButtonValue.isShow = !ResultDataButtonValue.isShow;
    ResultDataButtonValue.device_sn = device_sn.value
	} else {
		ResultDataButtonValue.flightPlanId = flightPlanId
    ResultDataButtonValue.isShow = true
    ResultDataButtonValue.device_sn = device_sn.value
  }
}
let select_task_info = {} as any

const loadTaskInfo = (flightPlanId: string, waylineId: string) => {
  console.log('in')
  select_task_info = {fpi: flightPlanId, wli: waylineId}
  bus.emit('clickResultTaskItem', flightPlanId)
  if (waylineId) {
	  showResultDataButton(flightPlanId)
	  getWaylineById(waylineId).then(res => {
      if (res.code === 0 && res.data !== '') {
	      getWaylineGlobalParamsByWaylineId(res.data.waylineId).then(res2 => {
		      if (res2.data === '') {
			      const dataV2 = res.data.templateContent
			      const placemark = dataV2.Folder.placemark.sort((a: Placemark, b: Placemark) => a.index - b.index)
						let wayLineDataV2 = [] as WayLinePointUpload[]
			      placemark.forEach( (item: any, index: number) => {
							const tmpPoint = item.Point.coordinates.split(',')
							const tmpPlacemark = {
								pointX: Number(tmpPoint[0]),
								pointY: Number(tmpPoint[1]),
								executeHeight: Number(item.executeHeight),
								pIndex: index,
							}
							//@ts-ignore
							wayLineDataV2.push(tmpPlacemark)
			      })
		      } else {
			      getWayLinePointByGlobalParamsId(res2.data.globalParamsId).then(res3 => {
			      })
		      }
	      })
      }else{
        // 清除绘制的轨迹
        RemoveEntitiesByBatch(window.cesiumViewer, 'ResultData')
        ElMessage.error("该任务航线不存在")
      }
    })
}
}
const getTaskInformation = (flightPlanId: string, waylineId: string) => {

  // 跳转
  router.push({
    path: '/default/result/task-list',
    query: {
      flightPlanId: flightPlanId,
      device_sn: device_sn.value,
      fpi: flightPlanId,
      wli: waylineId
    },
  })

  select_task_info = {fpi: flightPlanId, wli: waylineId}
  bus.emit('clickResultTaskItem', flightPlanId)
  if (waylineId) {
	  // TrackPath(window.cesiumViewer, flyTrajectoriesArr,flightPlanId)
	  // DrawPolyline(window.cesiumViewer, String(flightPlanId + 'ResultData2'), flyTrajectoriesArr, polylineLabel)
    // getFlyTrajectoriesByPlanId(flightPlanId).then(res => {
		// 	console.log('res', res)
	  //   if(res.code === 0) {
		// 		if(res.data.length === 0) {
		// 			// 没有飞行轨迹
		// 			alert('此任务暂不支持航线回溯，请检查航线文件或点击其他任务')
		// 		} else {
		// 			console.log('res', res.data)
		// 		}
	  //   }
		// })
	  showResultDataButton(flightPlanId)
	  getWaylineById(waylineId).then(res => {
      if (res.code === 0 && res.data !== '') {
	      getWaylineGlobalParamsByWaylineId(res.data.waylineId).then(res2 => {
		      if (res2.data === '') {
			      const dataV2 = res.data.templateContent
			      const placemark = dataV2.Folder.placemark.sort((a: Placemark, b: Placemark) => a.index - b.index)
						let wayLineDataV2 = [] as WayLinePointUpload[]
			      placemark.forEach( (item: any, index: number) => {
							const tmpPoint = item.Point.coordinates.split(',')
							const tmpPlacemark = {
								pointX: Number(tmpPoint[0]),
								pointY: Number(tmpPoint[1]),
								executeHeight: Number(item.executeHeight),
								pIndex: index,
							}
							//@ts-ignore
							wayLineDataV2.push(tmpPlacemark)
			      })
			      TaskListCheckWayLine(wayLineDataV2, flightPlanId)
		      } else {
			      getWayLinePointByGlobalParamsId(res2.data.globalParamsId).then(res3 => {
				      TaskListCheckWayLine(res3.data, flightPlanId)
			      })
		      }
	      })
      }else{
        // 清除绘制的轨迹
        RemoveEntitiesByBatch(window.cesiumViewer, 'ResultData')
        ElMessage.error("该任务航线不存在")
      }
    })
  }
};
function save_cache() {
  cookies.set('result_task', select_task_info)
}
onBeforeUnmount(() => {
  cookies.remove('result_task')
})
</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

#rtl {
  position: fixed;
  right: 20px;
  width: $LeftWidth;
  height: calc(100% - $NavigationHeight - 40px);
  background-color: $ComponentBackground;
  color: $ContentColor;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header
{
  width: 100%;
  height: $ComponenHeadHeight;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  border-bottom: 1px solid $TouchColor;
  background: $ComponentHeadBackground;
  color: $FirstLevelTitleColor;
  font-size: $FirstLevelTitleFontSize;
}

.title{
  font-size: $FirstLevelTitleFontSize;
}

.title-function {
  display: flex;
  align-items: center;
  gap: 9px;
}

.title-function .button-backward {
  vertical-align: middle;
  width: 2em;
  height: 2em;
  font-size: 18px;
}

.title-function .button-backward:hover {
  cursor: pointer;
  background: #333;
  border: 1px dashed #ccc;
}

.list-function {
  width: 100%;
  padding: $ComponentGap;
  display: flex;
  gap: 10px;
}

.list-function .list-function-input {
  flex: 6;
  color: $TouchColor;
  background: $TouchColorBackground;
  border: 1px solid $TouchColorBackground;
  height: 36px;
}

.list-function .list-function-select {
  background: $TouchColorBackground;
  border: 1px solid $TouchColorBackground;
  flex: 4;
}

:deep(.el-input__wrapper){
  // box-shadow: none;
  font-size: $AnnotateFontSize;
  color: $TouchColor;
}

.list-main {
  height: 300px;
  flex-grow: 1;
  padding: 0 9px 9px 9px;
  font-family: $ContentFontFamily;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.list-main-item {
  width: 100%;
}

.list-no-main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: $ContentFontFamily;
  font-size: $ContentFontSize;
}

.list-footer {
  height: 42px;
  display: flex;
  justify-content: center;
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
