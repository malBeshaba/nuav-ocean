<template>
  <div class="wayline-list">
    <div class="WayLineListTitle">
      <div class="ChooseWayLine">{{ ChooseWayLine }}</div>
      <!-- <div class="NewWayLineBtn" @click="newWayline()">＋新建航线</div> -->
      <el-button type="primary" size="small" @click="newWayline()" style="color: white; margin-left: 147px; margin-top: -3px;"><el-icon><Plus /></el-icon>新建航线</el-button>
      <img class="CloseWayLineListPanel" @click="closeAddWayline()"
           referrerpolicy="no-referrer"
           src="https://lanhu.oss-cn-beijing.aliyuncs.com/ps0b8ui68rncgyhgp968dphjsl93bde9me5600e6a-3554-45d5-82c7-022fee77d3c6">
    </div>
    <hr class="solid-line">
    <div class="SearchBox">
      <el-input placeholder="请输入搜索内容" :suffix-icon="Search" size="default"/>
    </div>
    <div class="WaylineList" @click="handleClick">
      <div class="WayLineListItem" 
        v-for="(item, index) in listItems" 
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
        <div class="EditIcon" @click.stop="editWayLine(item)">
          <div class="TheEditIcon"></div>
        </div>
        <div class="ExportIcon" @click.stop="exportWayLine(item)">
          <div class="TheSaveIcon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	getWaylineList,
	WaylineList,
	deleteWaylineById,
	getWaylineGlobalParamsByWaylineId,
  exportWaylineById
} from "@/api/wayline";
import { WayLineGlobalParams } from '@/store/types/wayline'
import { CheckWayLine } from './WayLineListCheckWayLine'
const route = useRoute();
const router = useRouter();
import { useMyStore } from "@/store"
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import { Search, Plus, DArrowLeft, Back } from '@element-plus/icons-vue'


const store = useMyStore();
const SelectedList=ref([] as any[]);
const ChooseWayLine = ref("选择航线");
const DeviceState = ref("在线");
let listItems = ref([] as WaylineList[]);
let globalParams = ref([] as WayLineGlobalParams[]);
const device_sn = ref();
const droneName = ref('');
const payloadName = ref('');

onMounted(() => {
  device_sn.value = route.query.device_sn;
  getWaylineList(1, 10).then(res => {
    console.log("res", res.data.list);
    listItems.value = res.data.list;
    console.log("listItems123345", listItems.value);
    listItems.value = listItems.value.map((item: any) => {
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
    console.log("listItems", listItems.value);

    SelectedList.value = res.data.list.map((item: any) => {
      const droneType = item.templateContent && item.templateContent.missionConfig.droneInfo.droneEnumValue === 67 ? "M30系列" : "Mavic 3 行业系列";
      const payloadType = item.templateContent && item.templateContent.missionConfig.payloadInfo.payloadEnumValue === 53 ? "M300相机" : "H20";

      return {
        waylineName: item.waylineName,
        droneType: droneType,
        payloadType: payloadType,
        isSelected: false
      };
    });
    console.log("SelectedList", SelectedList.value);
  });
});
let showWaylineId = ref('')
function ItemClick(clickedItem: { waylineName: any; waylineId: string }) {
  SelectedList.value.forEach((item: { isSelected: any; waylineName: any }) => {
    item.isSelected = (item.waylineName === clickedItem.waylineName);
  });
	showWaylineId.value = clickedItem.waylineId
	CheckWayLine(window.cesiumViewer, clickedItem.waylineId, false)
}
// 选中航线
let isShow = false
const handleClick = (event: any) => {
  const listItem = event.target.closest('.WayLineListItem')
  if (listItem) {
    const index = [...listItem.parentNode.children].indexOf(listItem)
    listItem.classList.toggle('isWayLineItem')
	  // @ts-ignore
    store.state.selectWayline = listItems.value[index]
  }
}

const deleteWayLine = (item: any) => {
	deleteWaylineById(item.waylineId).then(res => {
		if (res.code === 0) {
			getWaylineGlobalParamsByWaylineId(item.waylineId).then(res2 => {
				if (res2.code === 0) {
					ElMessage.success('删除航线成功')
					getWaylineList(1, 10).then(res => {
						listItems.value = res.data.list
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

const editWayLine = (item: any) => {
  console.log('item', item)
    router.push({
        path: '/default/edit-waypoint-v2',
        query: {
            // 航线的名称
            name: item.waylineName,
            // 负载和飞行器
            drone_type: item.droneType,
            device_sn: device_sn.value,
            waylineId: item.waylineId,
            waylineFileId: item.waylineFileId
        }
    })
}

// 跳转新建航线
const newWayline = () => {
	// router.push({
  //   path: '/default/task/create/new-wayline',
	// 	query: {
	// 		device_sn: device_sn.value,
	// 	}
  // })
	router.push({
    path: '/default/task/create/new-wayline-1',
		query: {
			device_sn: device_sn.value,
		}
  })
	// insertWayline({
	// 	waylineName: String(Date.now())
	// }).then(res => {
	// 	if(res.code === 0) {
	// 		console.log(res.data.waylineId)
	// 		insertWaylineGlobalParams({
	// 			waylineId: res.data.waylineId,
	// 	    flyToWaylineMode: 'safely',
	// 	    finishAction: 'goHome',
	// 	    exitOnRCLost: 'goContinue',
	// 	    takeOffSecurityHeight: 60,
	// 	    globalTransitionalSpeed: 5,
	// 	    autoFlightSpeed: 10,
	// 	    globalWaypointTurnMode: 'toPointAndStopWithDiscontinuityCurvature',
	// 	    globalUseStraightLine: 0,
	// 	    executeHeightMode: 'relativeToStartPoint',
	// 		}).then( res2 => {
	// 			if (res2.code === 0) {
	// 				router.push({
	// 		      path: '/default/task/create/new-wayline-1',
	// 					query: {
	// 						device_sn: device_sn.value,
	// 				    wayline_id: res.data.waylineId,
	// 				    wayLineGlobalParamsId: res2.data.globalParamsId,
	// 					}
	// 			  })
	// 			} else {
	// 				ElMessage.error('新增航线全局参数失败！请检查网络设置')
	// 			}
	// 		})
	// 	}
	// })
};

// 返回
const closeAddWayline = () => {
	RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
	CheckWayLine(window.cesiumViewer, showWaylineId.value, true)
  router.push({
    path: '/default/task/create',
    query: {
      device_sn: device_sn.value
    },
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
</script>

<style scoped lang="scss">
//这里是去除边框滚动条的地方，别删了好吧
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;height: 0;
}
.wayline-list{
  border-left: 1px solid $LightColor;;
  box-shadow: 8px 0px 4px 0px $LightColor;
  background-color: $ComponentBackground;
  width: 100%;
  height: calc(100% - 40px);
  overflow: scroll;
  margin-left: 21px;
}

.WayLineListTitle{
  display: flex;
  width: 360px;
  height: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 16px;
  text-align: left;
  line-height: 16px;
  margin-top: 16px;
  margin-left: 16px;
  margin-bottom: 15px;
}
.ChooseWayLine{
  margin-left: 10px;
  width: 70px;
  height: 17px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
}
.NewWayLineBtn{
  justify-content: center;
  align-items: center;
  margin-left: 147px;
  display: flex;
  width: 85px;
  height: 20px;
  background: $LightColor;
  border-radius: 4px;
}
.NewWayLineBtn:hover{
  cursor: pointer;
}

.CloseWayLineListPanel{
  height: 15px;
  padding-left: 30px;
  width: 15px;
}
.solid-line {
  border: none;
  border-top: 1px solid $LightColor;
}
.SearchBox{
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 1);
  border-radius: 4px;
  width: 97%;
  height: 32px;
  margin: 15px 0 0 5px;
}
.InputBox{
  width: 90%;
  border-radius: 4px;
  padding-left: 10px;
  background: black;
  color: white;
  border: 0;

}
.SearchIcon{
  width: 5%;
  height: 16px;
  margin-top: 9px;
  margin-right: 8px;
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
  height: 125px;
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

.DeleteIcon_T{
  right: 10px;
  width: 25px;
  height: 125px;
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
.DeviceInfo{
  color: white;
  margin-left: 38px;
}
.WayLineListItem.selected {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;
}
</style>
