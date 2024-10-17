<template>
  <div class="wayline-list">
    <div class="WayLineListTitle">
      <div class="ChooseWayLine">{{ ChooseWayLine }}</div>
      <img class="CloseWayLineListPanel" @click="closeImportWayline()"
           referrerpolicy="no-referrer"
           src="https://lanhu.oss-cn-beijing.aliyuncs.com/ps0b8ui68rncgyhgp968dphjsl93bde9me5600e6a-3554-45d5-82c7-022fee77d3c6">
    </div>
    <hr class="solid-line">
    <div class="SearchBox">
      <input class="InputBox" type="text" placeholder="请输入航线名称">
      <img class="SearchIcon"
           referrerpolicy="no-referrer"
           src="https://lanhu.oss-cn-beijing.aliyuncs.com/psolv5o89x7hh14gxdngiqkvt8r76rk6so5f48becd-c29a-45c4-8f70-50f90ad28f3a"
      >
      <div class="import-btu">
        <el-button type="primary" @click="importWaylineToJx()" plain>导入</el-button>
      </div>

    </div>
    <div class="WaylineList" @click="handleClick">
      <div class="WayLineListItem" v-for="(item, index) in listItems" :key="index"
           :class="{ 'selected': SelectedList[index].isSelected }" @click="ItemClick(item)">
        <div class="WaylineInfo">
          <div class="InfoCellOne">
            <div class="orange-dot"></div>
            <div class="WayLineName">{{ item.waylineName }}</div>
          </div>
          <div class="InfoCellTwo">型号
            <div class="DeviceInfo">M300</div>
          </div>
          <div class="InfoCellTwo">负载
            <div class="DeviceInfo">H20T</div>
          </div>
          <div class="InfoCellTwo">距离
            <div class="DeviceInfo">756m</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted,onBeforeUnmount} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {
  getWaylineList,
  WaylineList,
  findWaylinePlacemarkById,
  importWayline
} from "@/api/wayline";
import * as Cesium from 'cesium'
import {CheckWayLine} from './WayLineListCheckWayLine'
import {useMyStore} from "@/store"
import {DrawPolyline, RemoveEntitiesByBatch} from "@/components/mapTools/BaseMapTools";
import {DrawWayLinePoint} from "@/components/mapTools/BaseMapToolsCreatePoint";

const route = useRoute();
const router = useRouter();
const store = useMyStore();
const SelectedList = ref([]);
const ChooseWayLine = ref("选择需要导入的航线");
let listItems = ref([] as WaylineList[]);
const device_sn = ref();
const siteId = ref();
const selectId = ref();

onMounted(() => {
  siteId.value = route.query.siteId;
  getWaylineList(1, 10).then(res => {
    listItems.value = res.data.list
    SelectedList.value = res.data.list.map((item: { waylineName: any; }) => ({
      waylineName: item.waylineName,
      isSelected: false
    }));
  });
});

onBeforeUnmount(() => {
  RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
})

function closeImportWayline() {
  router.push({
    path: '/default/task/jx-create/add-wayline',
    query: {
      siteId: siteId.value
    },
  })
}

function ItemClick(clickedItem: { waylineName: any; waylineFileId: string }) {
  SelectedList.value.forEach((item: { isSelected: any; waylineName: any }) => {
    item.isSelected = (item.waylineName === clickedItem.waylineName);
  });
  selectId.value = clickedItem.waylineFileId
  CheckWayLine(window.cesiumViewer, clickedItem.waylineFileId)
}

interface point {
  id: number,
  lng: number,
  lat: number,
  executeHeight: number
}

let waylineShape = {isShow: false, id: 'null', points: [] as point[]}

function CheckWayLine(mapViewer: Cesium.Viewer, wayLineID: string) {

  // 如果已经绘制，直接移除
  if (waylineShape.id === wayLineID) {
    if (waylineShape.isShow) {
      RemoveEntitiesByBatch(mapViewer, 'checkWayLine')
      waylineShape.isShow = false
      return
    }
  }

  // 如果没有绘制，请求数据
  const workspaceId: string = JSON.parse(localStorage.getItem('userInfo') as string).workspace_id || ''
  findWaylinePlacemarkById(workspaceId, wayLineID).then((res) => {
    if (res.code === 0) {
      // 移除之前绘制的航线
      RemoveEntitiesByBatch(mapViewer, 'checkWayLine')
      if (res.data.length !== 0) {
        waylineShape.id = wayLineID
        waylineShape.isShow = false
        waylineShape.points = []
        res.data.forEach((item: any) => {
          let point = {} as point
          point.id = item.index
          const pointsSplit = item.Point.coordinates.split(',')
          point.lng = Number(pointsSplit[0])
          point.lat = Number(pointsSplit[1])
          point.executeHeight = item.executeHeight
          waylineShape.points.push(point)
        })
        drawWayLine(mapViewer,)
      }
    }
  })
}

function drawWayLine(mapViewer: Cesium.Viewer) {
  let pointArr = [] as number[]
  waylineShape.points.forEach((item: point, index) => {
    pointArr.push(item.lng)
    pointArr.push(item.lat)
    pointArr.push(item.executeHeight + 39)
    const point = [item.lng, item.lat, item.executeHeight + 39]
    DrawWayLinePoint(mapViewer, 'checkWayLinePoint', index + 1, point)
  })
  const polylineLabel = new Cesium.PolylineDashMaterialProperty({
    color: Cesium.Color.fromCssColorString('#65DDBC'),
    dashLength: 30.0,
    dashPattern: 255.0,
  })
  DrawPolyline(mapViewer, 'checkWayLine', pointArr, polylineLabel)
  waylineShape.isShow = true
}

// 选中航线
let isShow = false
const handleClick = (event: { target: { closest: (arg0: string) => any; }; }) => {
  const listItem = event.target.closest('.WayLineListItem')
  if (listItem) {
    const index = [...listItem.parentNode.children].indexOf(listItem)
    listItem.classList.toggle('isWayLineItem')
    // @ts-ignore
    store.state.selectWayline = listItems.value[index]
  }
}

function importWaylineToJx() {
  importWayline({
    requestUrl: '',
    token: String(localStorage.getItem('Authorization')),
    siteId: siteId.value,
    waylineFileId: selectId.value
  }).then(res=>{
    if(res.code === 0) {
      ElMessage.success(res.data)
      router.push({
        path: '/default/task/jx-create/add-wayline',
        query: {
          siteId: siteId.value
        },
      })
    }
  })
}

</script>

<style scoped lang="scss">
//这里是去除边框滚动条的地方，别删了好吧
::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.wayline-list {
  border-left: 1px solid #F9A100;;
  box-shadow: 8px 0px 4px 0px rgba(255, 120, 0, 1);
  background-color: rgba(10, 11, 14, 0.85);
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.WayLineListTitle {
  display: flex;
  width: 360px;
  height: 16px;
  padding-top: 6px;
  font-size: 16px;
  text-align: left;
  line-height: 16px;
  margin-top: 22px;
  margin-left: 16px;
  margin-bottom: 15px;
}

.ChooseWayLine {
  margin-left: 10px;
  width: 150px;
  height: 17px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
}

.NewWayLineBtn {
  justify-content: center;
  align-items: center;
  margin-left: 147px;
  display: flex;
  width: 85px;
  height: 20px;
  background: #f9a100;
  border-radius: 4px;
}

.CloseWayLineListPanel {
  height: 15px;
  padding-left: 30px;
  width: 15px;
  margin-left: auto;
}

.solid-line {
  border: none;
  border-top: 1px solid #F9A100;
}

.SearchBox {
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 1);
  border-radius: 4px;
  width: 95%;
  height: 32px;
  margin: 15px 0 0 5px;
}

.InputBox {
  width: 90%;
  border-radius: 4px;
  padding-left: 10px;
  background: black;
  color: white;
  border: 0;

}

.SearchIcon {
  width: 5%;
  height: 16px;
  margin-top: 9px;
  margin-right: 8px;
}

.import-btu {
  font-size: 12px;
  height: 100%;
  color: #f9a100;
}

.WaylineList {
  margin-top: 10px;
}

.WayLineListItem {
  display: flex;
  margin-bottom: 10px;
  opacity: 0.7;
  margin-left: 10px;
  align-items: center;
  width: 95%;
  height: 125px;
  border-radius: 4px;
  cursor: pointer;
  background: black;
}

.WaylineInfo {
  height: 100%;
  width: 93%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.TheDeleteIcon {
  background-image: url("../../../../assets/TaskDeployment/DeleteIcon.png");
  width: 12px;
  height: 12px;
  background-size: cover;
}

.DeleteIcon {
  width: 7%;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background: #996300;
}

.orange-dot {
  width: 5px;
  height: 5px;
  background: #f9a100;
  border-radius: 50%;
  margin-left: 12px;
}

.WayLineName {
  margin-left: 9px;
}

.InfoCellOne {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
  height: 25%;
  width: 100%;

}

.InfoCellTwo {
  display: flex;
  margin-left: 13px;
  margin-top: 4px;
  font-size: 12px;
  height: 18%;
  width: 100%;
  color: #f9a100;
}

.DeviceInfo {
  color: white;
  margin-left: 38px;
}

.WayLineListItem.selected {
  border: 1px dashed #f9a100; /* 设置加粗虚线边框样式 */
}

</style>
