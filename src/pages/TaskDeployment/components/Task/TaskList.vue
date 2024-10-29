<template>
  <div class="task-list">
    <div class="list-header">
      <div class="title">任务列表</div>
      <div class="title-function">
        <el-button type="primary" size="small" @click="createTask()" style="color: white;"><el-icon><Plus /></el-icon>新建任务</el-button>
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
        <el-input v-model="input" placeholder="按任务名称搜索" :suffix-icon="Search" size="default"/>
      </div>
    </div>
    <div v-if="planInfo.length > 0" class="list-main">
      <el-row :gutter="2" style="width: 100%;">
        <el-col
          v-for="item in planInfo"
          :key="item.flightPlanId"
          :span="24"
        >
          <TaskItem 
            :planInfo="item" 
            @click="getTaskInformation(item.flightPlanId, item.planStatus, item.waylineId)"
            @refresh="getTaskInfo"
          ></TaskItem>
        </el-col>
      </el-row>
    </div>
    <!-- <div v-if="planInfo.length > 0" class="list-main">
      <div v-for="item in planInfo" :key="item.flightPlanId">
        <TaskItem :planInfo="item" @click="getTaskInformation(item.flightPlanId)"></TaskItem>
      </div>
    </div> -->
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
    <router-view name="task_detail"></router-view>
  </div>
  <task-list></task-list>
</template>

<script setup lang="ts">
import TaskItem from "@/components/Task/TaskItem.vue";
import { ref, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFlightPlan } from '@/api/droneFlightPlan';
import { TaskStatus } from '@/store/types/task';
import { Search, Plus, DArrowLeft, Back } from '@element-plus/icons-vue';
import { useMyStore } from '@/store';
import {DrawPolyline, RemoveEntitiesByBatch, RemoveEntitiesById} from '@/components/mapTools/BaseMapTools';
import {getWaylineById, getWaylineGlobalParamsByWaylineId} from '@/api/wayline';
import {getWayLinePointByGlobalParamsId} from '@/api/wayLinePoint';
import {WayLinePointUpload} from '@/store/types/wayline';
import {DrawWayLinePoint} from '@/components/mapTools/BaseMapToolsCreatePoint';
import * as Cesium from 'cesium';
import {NotFlyPolylineLabel} from '@/components/mapTools/mapMaterial/mapMaterialStyle';
import TaskList from '@/pages/ResultData/components/Task/TaskList.vue';

const store = useMyStore()

const route = useRoute();
const device_sn = ref();
const router = useRouter();

onMounted(() => {
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
const planInfo = reactive([] as any[]);
const getTaskInfo = async () => {
  planInfo.splice(0, planInfo.length);
  getFlightPlan(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, {
    pageNo: currentPage.value,
    pageSize: currentSize.value,
    deviceSn: device_sn.value,
    planStatus: selectValue.value
  }).then(res => {
    console.log(res)
    if (res.code === 0) {
      total.value = res.data.pagination.total
      res.data.list.forEach((item: any) => {
        planInfo.push(item)
      })
    }
  })
};
// 监听路由
watch(() => route.query.device_sn, (newData, oldData) => {
  device_sn.value = newData;
  getTaskInfo()
}, { deep: true })
// 筛选框
enum planStatus {
  All = '1,2,5',
  Wait = '1',
  Carrying = '2',
  Fail = '5'
}
const options = reactive([
  {
    label: '全部',
    value: planStatus.All,
  },{
    label: '待执行',
    value: planStatus.Wait,
  },{
    label: '执行中',
    value: planStatus.Carrying,
  },{
    label: '执行失败',
    value: planStatus.Fail,
  }
]);
const selectValue = ref('1,2,5');
const selectChange = (val: string) => {
  getTaskInfo()
};
// 搜索框
const input = ref('')
// 返回
const backToEquipmentList = () => {
	store.commit('CHECK_DOCK_STATE', { device_sn: device_sn.value, isShow: false })
	router.push('/default/task')
}
// 新建任务
const createTask = () => {
  router.push({
    path: '/default/task/create',
    query: {
      device_sn: device_sn.value
    },
  })
}
// 任务详细信息
const getTaskInformation = (flightPlanId: string, planStatus: number, wayLineId: string) => {
  if (planStatus === 2 || planStatus === 1) {
    router.push({
      path: '/default/task/task-list/detail',
      query: {
        flightPlanId: flightPlanId,
        device_sn: device_sn.value
      },
    })
	  checkWayLine(wayLineId)
  } else {
    ElMessage.error('无任务信息')
  }
};

// 查看当前任务航线
const polylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#65DDBC'),
  dashLength: 30.0,
  dashPattern: 255.0,
})
const checkWayLine = (wayLineId: string) => {
	RemoveEntitiesByBatch(window.cesiumViewer, 'TaskingWayLine')
	let wayLinePointData: WayLinePointUpload[] = []
	// 当前距地面高度
	let RelativeHeight: number = 0
	// 航线数组
	let wayLinePointArr: number[] = []
	// 判断当前任务是否为机场任务
	let WayLineDeviceSn = ''
	Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
		if (key === device_sn.value) {
			console.log('check', store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
			WayLineDeviceSn = String(store.state.deviceState.dockInfo[key].basic_osd.sub_device.device_sn)
		}
	})
	if (WayLineDeviceSn === '') {
		WayLineDeviceSn = String(device_sn.value)
	}
	getWaylineGlobalParamsByWaylineId(wayLineId).then(res => {
		if (res.code === 0) {
			if(res.data === '') {
				Object.keys(store.state.deviceState.deviceInfo).forEach((key: string) => {
					if (key === WayLineDeviceSn) {
						RelativeHeight = Number(store.state.deviceState.deviceInfo[key].height) - Number(store.state.deviceState.deviceInfo[key].elevation)
					}
				})
				getWaylineById(wayLineId).then((res2) => {
          if(res.code === 0) {
	          const wayLineDataV2 = res2.data.templateContent
	          const wayLinePointDataV2 = wayLineDataV2.Folder.placemark
	          wayLinePointDataV2.sort((a: any, b: any) => {
		          return a.index - b.index
	          })
	          wayLinePointDataV2.forEach((item: any, index: number) => {
		          const tmpPoint = item.Point.coordinates.split(',')
					    wayLinePointArr.push(Number(tmpPoint[0]))
					    wayLinePointArr.push(Number(tmpPoint[1]))
					    wayLinePointArr.push(Number(item.executeHeight + RelativeHeight))
					    const point = [Number(tmpPoint[0]), Number(tmpPoint[1]), Number(item.executeHeight + RelativeHeight)]
		          DrawWayLinePoint(window.cesiumViewer, 'TaskingWayLinePoint', index + 1, point)
	          })
	          DrawPolyline(window.cesiumViewer, 'TaskingWayLine', wayLinePointArr, NotFlyPolylineLabel)
	          console.log('res2', wayLinePointDataV2)
          } else {
            ElMessage.error('网络错误，请稍后重试')
          }
        })
			} else {
				getWayLinePointByGlobalParamsId(res.data.globalParamsId).then(wayLineData => {
					if (wayLineData.code === 0) {
						wayLinePointData = wayLineData.data
						wayLinePointData.sort((a, b) => {
							return a.pIndex - b.pIndex
						})
						Object.keys(store.state.deviceState.deviceInfo).forEach((key: string) => {
							if (key === WayLineDeviceSn) {
								RelativeHeight = Number(store.state.deviceState.deviceInfo[key].height) - Number(store.state.deviceState.deviceInfo[key].elevation)
							}
						})
						wayLinePointData.forEach((item: WayLinePointUpload, index: number) => {
							wayLinePointArr.push(item.pointX)
							wayLinePointArr.push(item.pointY)
							wayLinePointArr.push(item.executeHeight + RelativeHeight)
							const point = [item.pointX, item.pointY, item.executeHeight + RelativeHeight]
							DrawWayLinePoint(window.cesiumViewer, 'TaskingWayLinePoint', index + 1, point)
						})
						DrawPolyline(window.cesiumViewer, 'TaskingWayLine', wayLinePointArr, NotFlyPolylineLabel)
					} else {
						ElMessage.error('查询不到当前航线航点，请检查航线文件是否正确')
					}
				})
			}
		} else {
			ElMessage.error('查询不到当前航线全局参数，请检查航线文件是否正确')
		}
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

.task-list {
  width: 100%;
  height: 100%;
  background-color: $ComponentBackground;
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
  border-bottom: $ComponentHeaderBorder;
  background: $ComponentHeadBackground;
  color: $FirstLevelTitleColor;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
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
</style>
