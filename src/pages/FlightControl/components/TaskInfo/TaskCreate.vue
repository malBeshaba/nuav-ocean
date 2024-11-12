<template>
<div class="create-task">
  <list-head title="新建任务" />
	<div class="task">
		<div class="task-info">
			<div class="task-info-data">
				<span>
					任务名称：
				</span>
				<span>
					<el-input v-model="input_task_name" placeholder="请输入任务名称"></el-input>
				</span>
			</div>
			<div class="list-footer">
		    <el-button type="primary" size="small" color="#BF6C00" @click="createTask()" plain>确定</el-button>
		    <el-button type="primary" size="small" @click="closeCreateTask()" plain>取消</el-button>
		  </div>
		</div>
		<div class="task-wayline" @click="handleClick">
			<el-scrollbar height="240px">
	      <div class="WayLineListItem"
	        v-for="(item, index) in WaylineListItems"
	        :key="index"
	        :class="{ 'selected': SelectedList[index].isSelected }"
	        @click="ItemClick(item)"
	      >
	        <div class="WaylineInfo">
	          <div class="InfoCellOne" >
	            <div class="orange-dot"></div>
	            <div class="WayLineName">{{item.waylineName}}</div>
	          </div>
	          <div class="InfoCellTwo" >型号<div class="DeviceInfo">{{item.droneType}}</div></div>
	          <div class="InfoCellTwo" >负载<div class="DeviceInfo">{{item.payloadType}}</div></div>

	<!--          <div class="InfoCellTwo" >距离<div class="DeviceInfo">{{flylength+parseInt((Math.random()*400)-200)}}m</div></div>-->
	        </div>
	        <div class="DeleteIcon_T" @click.stop="deleteWayLine(item)">
	          <div class="TheDeleteIcon"></div>
	        </div>
	        <div class="ExportIcon" @click.stop="exportWayLine(item)">
	          <div class="TheSaveIcon"></div>
	        </div>
        </div>
			</el-scrollbar>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from 'vue';
import ListHead from '@/components/Head/ListHead.vue';
import {useRoute, useRouter} from 'vue-router'
import {
	deleteWaylineById,
	exportWaylineById,
	getWaylineGlobalParamsByWaylineId,
	getWaylineList,
	WaylineList
} from '@/api/wayline';
const route = useRoute();
import {useMyStore} from '@/store'
import {CheckWayLine} from '@/pages/TaskDeployment/components/WayLine/WayLineListCheckWayLine'
import {exectFlightTask, insertFlightTask, insertFlightTaskPrepare} from '@/api/droneFlightPlan'
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
const router = useRouter();
const store = useMyStore();

const input_task_name = ref('');
const device_sn = ref();

//
let isSave = true;
const WaylineListItems = ref([] as WaylineList[]);
const SelectedList=ref([] as any[]);
const WaylineList_pageNo = ref(1);
const WaylineList_pageSize = ref(10);
const WaylineList_totalPage = ref(0);

// create
const taskInfo = ref({} as MyObject);

// 表单
interface MyObject {
  planName: string;
  waylineId: string;
  deviceSn: string;
  waylineType: number;
  taskType: number;
  rthAltitude: number;
  outOfControl: number;
  planTaskType: number;
  executeTime: number;
}

onMounted(() => {
	device_sn.value = route.query.device_sn;
	getWayLineList('init');
});

onUnmounted(() => {
	closeWayline();
})

// 执行任务
const exectFlightTaskParams = reactive({
  planId: '',
  deviceType: 0,
})

// 获取设备信息
const deviceInfo = reactive({
  child_device_sn: undefined,
  device_sn: undefined,
  device_name: undefined,
  deviceType: undefined,
})

const createTask = () => {
	// router.go(-1);
	isSave = false;
	taskInfo.value.taskType = 4;
  taskInfo.value.rthAltitude = Number(taskInfo.value.rthAltitude);
	taskInfo.value.planName = input_task_name.value;
  taskInfo.value.deviceSn = route.query.device_sn as string;
	taskInfo.value.waylineId = String(store.state.selectWayline.waylineId);
	taskInfo.value.outOfControl = 0;
	taskInfo.value.planTaskType = 0;
	console.log('taskInfo1111', store.state.selectWayline)
  taskInfo.value.executeTime = getTimeStamp();
  console.log("taskInfo.value", taskInfo.value);
  store.commit('CHANGE_CACHE_STYLE', {isReady: true, isAllow:true});
  if(Number(taskInfo.value.taskType) === 4){
    ElMessage({
      message: "创建预设任务成功",
      type: 'success'
    });
    InsertTask()
    router.go(-1);
  }
};

interface InsertTaskParams {
  planName: string;
  waylineId: string;
  deviceSn: string;
  waylineType: number;
  taskType: number;
  rthAltitude: number;
  outOfControl: number;
  planTaskType: number;
  planStatus: number;
  executeTime: number;
}
const preparetaskInfo = ref({} as InsertTaskParams)
function InsertTask() {
  isSave = false
  taskInfo.value.rthAltitude = Number(taskInfo.value.rthAltitude)
  taskInfo.value.deviceSn = route.query.device_sn as string
  taskInfo.value.executeTime = getTimeStamp()
  console.log("taskInfo.value", taskInfo.value)
  preparetaskInfo.value.planName = taskInfo.value.planName
  preparetaskInfo.value.waylineId = taskInfo.value.waylineId
  preparetaskInfo.value.deviceSn = taskInfo.value.deviceSn
  //preparetaskInfo.value.waylineType = taskInfo.value.waylineType
  preparetaskInfo.value.taskType = taskInfo.value.taskType
  preparetaskInfo.value.rthAltitude = taskInfo.value.rthAltitude
  preparetaskInfo.value.outOfControl = taskInfo.value.outOfControl
  preparetaskInfo.value.planTaskType = taskInfo.value.planTaskType
  preparetaskInfo.value.planStatus = 1
  preparetaskInfo.value.executeTime = taskInfo.value.executeTime
  console.log("preparetaskInfo.value", preparetaskInfo.value)
  store.commit('CHANGE_CACHE_STYLE', {isReady: true, isAllow:true})
  insertFlightTaskPrepare(preparetaskInfo.value)
};

// 生成时间戳
const getTimeStamp = () => {
  return Date.now()
};

const closeCreateTask = () => {
	router.go(-1);
}

const handleClick = (event: any) => {
  const listItem = event.target.closest('.WayLineListItem')
  if (listItem) {
    const index = [...listItem.parentNode.children].indexOf(listItem)
    listItem.classList.toggle('isWayLineItem')
	  // @ts-ignore
    store.state.selectWayline = WaylineListItems.value[index]
  }
}

let showWaylineId = ref('')
function ItemClick(clickedItem: { waylineName: any; waylineId: string }) {
  SelectedList.value.forEach((item: { isSelected: any; waylineName: any }) => {
    item.isSelected = (item.waylineName === clickedItem.waylineName);
  });
	showWaylineId.value = clickedItem.waylineId;
	CheckWayLine(window.cesiumViewer, clickedItem.waylineId, false)
}

const deleteWayLine = (item: any) => {
	deleteWaylineById(item.waylineId).then(res => {
		if (res.code === 0) {
			getWaylineGlobalParamsByWaylineId(item.waylineId).then(res2 => {
				if (res2.code === 0) {
					ElMessage.success('删除航线成功')
					getWaylineList(1, 10).then(res => {
						WaylineListItems.value = res.data.list
						SelectedList.value = res.data.list.map((item: { waylineName: any; }) => ({
							waylineName: item.waylineName,
							isSelected: false
						}));
					});
				} else {
					console.log('请检查网络设置')
				}
			})
		} else {
			ElMessage.error('删除航线失败，请检查网络设置')
		}
	})
};

const loading = ref(false)
function downloadFile (data: Blob, fileName: string) {
  const lable = document.createElement('a')
  lable.href = window.URL.createObjectURL(data)
  lable.download = fileName
  lable.click()
  URL.revokeObjectURL(lable.href)
}
const exportWayLine = (item: any) => {
  const workspaceId: string = JSON.parse(localStorage.getItem('userInfo') as string).workspace_id || ''

  exportWaylineById(workspaceId, item.waylineFileId).then((res) => {
    if (!res) {
      return
    }
    const data = new Blob([res], { type: 'application/zip' })
    downloadFile(data, item.waylineName + '.kmz')
  }).finally(() => {
    loading.value = false
  })
}

const loadWayLineAdd = () => {
	console.log('loadWayLineAdd', WaylineList_pageNo.value)
	WaylineList_pageNo.value += 1;
	getWayLineList();
}

const closeWayline = () => {
	RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
	CheckWayLine(window.cesiumViewer, showWaylineId.value, true)
};

const getWayLineList = async (type = '') => {
	getWaylineList(WaylineList_pageNo.value, WaylineList_pageSize.value).then(res => {
    console.log("res", res);
		WaylineList_totalPage.value = res.data.pagination.total;
		if(type === 'init') {
			WaylineListItems.value = res.data.list
		} else {
			WaylineListItems.value.push(...res.data.list)
		}
    WaylineListItems.value = res.data.list;
    console.log("listItems123345", WaylineListItems.value);
    WaylineListItems.value = WaylineListItems.value.map((item: any) => {
      // 增加 templateContent 不为空的判断
      if (item.templateContent) {
        if (item.templateContent.missionConfig.droneInfo.droneEnumValue === 67) {
          item.droneType = "M30系列";
        } else {
          item.droneType = "Mavic 3 行业系列";
        }
        if (item.templateContent.missionConfig.payloadInfo.payloadEnumValue === 53) {
          item.payloadType = "M300相机";
        } else {
          item.payloadType = "H20";
        }
      } else {
        // 如果 templateContent 为空，可以设置默认值或处理逻辑
        item.droneType = "未知类型";
        item.payloadType = "未知载荷";
      }
      return item;
    });
		SelectedList.value =  WaylineListItems.value.map((item: any) => {
      const droneType = item.templateContent && item.templateContent.missionConfig.droneInfo.droneEnumValue === 67 ? "M30系列" : "Mavic 3 行业系列";
      const payloadType = item.templateContent && item.templateContent.missionConfig.payloadInfo.payloadEnumValue === 53 ? "M300相机" : "H20";

      return {
        waylineName: item.waylineName,
        droneType: droneType,
        payloadType: payloadType,
        isSelected: false
      };
    });
    console.log("listItems", WaylineListItems.value);
  });
}

</script>

<style scoped lang="scss">
.create-task {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  height: calc(100% - $NavigationHeight - 400px);
  left: 450px;
  width: $LeftWidth;
	background-color: #1c2127;
  margin-top: $NavigationHeight;
  z-index: 2;
}

.task {
	display: flex;
	width: 100%;
	height: calc(100% - 50px);
	top: 20px;
	flex-direction: column;
}

.task-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
  align-items: center;
}

.task-info-data {
	flex: 4;
	display: flex;
	flex-direction: row;
	width: 85%;
	justify-content: center;
  align-items: center;
}

.list-footer {
  width: 85%;
  height: 56px;
  display: flex;
	flex-direction: row;
	flex: 1;
  align-items: center;
  justify-content: center;
}

.task-wayline {
	flex: 3;
}

.WaylineList{
  margin-top: 10px;
}

.WayLineListItem{
  display: flex;
  margin-bottom: 10px;
  opacity: 0.7;
  margin-left: 10px;
  align-items: center;
  width: 95%;
  height: 80px;
  border-radius: 4px;
	cursor: pointer;
  background: rgba(39, 73, 85, 0.5);
  //border: 1px solid $TouchColor;
}

.WaylineInfo{
  //height: 100%;
  width: 93%;
  display: flex;
  flex-direction: column;
}

.InfoCellOne{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
  height: 25%;
  width: 100%;

}

.orange-dot {
  width: 5px;
  height: 5px;
  background: $LightColor;
  border-radius: 50%;
  margin-left: 12px;
}

.WayLineName{
  margin-left: 9px;
}

.InfoCellOne{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
  height: 25%;
  width: 100%;

}
.InfoCellTwo{
  display: flex;
  margin-left: 13px;
  margin-top: 4px;
  font-size: 12px;
  height: 18%;
  width: 100%;
  color: $LightColor;
}

.DeleteIcon_T{
  right: 10px;
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background: $TouchColor;
}
.EditIcon{
  right: 10px;
  width: 25px;
  height: 125px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background: rgba(17, 165, 219, 0.3);
}
.ExportIcon{
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background: rgb(34, 66, 42);
}
.TheDeleteIcon{
  background-image: url("../../../../assets/TaskDeployment/DeleteIcon.png");
  width: 25px;
  height: 25px;
  background-size: cover;
}
.TheEditIcon{
  background-image: url("../../../../assets/TaskDeployment/EditIcon.png");
  width: 20px;
  height: 20px;
  background-size: cover;
}
.TheSaveIcon {
  background-image: url("../../../../assets/TaskDeployment/Save.png");
  width: 25px;
  height: 25px;
  background-size: cover;
}

.DeviceInfo{
  color: white;
  margin-left: 38px;
}
.WayLineListItem.selected {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}
</style>
