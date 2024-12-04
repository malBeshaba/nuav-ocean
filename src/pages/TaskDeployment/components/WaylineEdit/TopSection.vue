<template>
  <div class="NavigationArea">
    <div class="ReturnIcon">
      <img src="../../../../assets/TaskDeployment/return.png" @click="ShowConfirmPanel">
    </div>
    <div class="Save">
      <img src="../../../../assets/TaskDeployment/Save.png" @click="SaveToDataBase">
    </div>
    <div class="WayLineName">
      <div style="text-align: center; width: 100%">{{name}}</div>
<!--      <img src="../../../../assets/TaskDeployment/Drone1.png">-->
<!--      <div class="drone">{{drone}}</div>-->
<!--      <img src="../../../../assets/TaskDeployment/TakePhoto2.png">-->
<!--      <div class="device">{{device}}</div>-->
    </div>
    <div class="HelpIcon">
      <img src="../../../../assets/TaskDeployment/Help.png" title="帮助"  @click="PrintSheet">
    </div>
<!--    <button @click="test">测试按钮</button>-->
  </div>

</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';

import {onMounted, reactive, ref, watch} from 'vue'
import store from "@/store";
import {WayPoint, WayPointActionList} from "@/store/types/WayPoint";
import {GeneratWaylinefile, getWaylinePointByWaylineId, insertWaypoint, updateWaypoint} from "@/api/wayLinePoint";
import router from "@/router";
import { useRoute } from 'vue-router';
import ButtonList from "@/pages/ResultData/components/Button/ButtonList.vue";
import {getWaylineById} from "@/api/wayline";
import * as geolib from 'geolib';
const route = useRoute();
const name=ref()
const drone=ref()
const device=ref()
let droneType=ref("")
let payloadType=ref("")

// 定义接收的props类型
interface ChildProps {
    waylineId: string;
    waylineFileId: string;
}

const props = withDefaults(defineProps<ChildProps>(),{
  waylineId: '',
  waylineFileId: ''
});


watch(
    () => store.state.EditingWayLine.WayLineInfo?.waylineName,
    (newValue, oldValue) => {
      if(newValue!=null){
        // console.log("111111",newValue)
        name.value=newValue
      }
    },
    { deep: true }
)
watch(
    () => store.state.EditingWayLine.DroneName,
    (newValue, oldValue) => {
      if(newValue!=null){
        drone.value=newValue
      }
      console.log("当前的无人机名称",drone.value)
      if(drone.value==="Mavic 3 行业系列"){
        droneType.value = "77"
      }else{
        droneType.value = "67"
      }
      console.log("当前的无人机类型",droneType.value)
    },
    { deep: true }
)
watch(
    () => store.state.EditingWayLine.PayLoadName,
    (newValue, oldValue) => {
      if(newValue!=null){
        device.value=newValue
      }
      console.log("当前的设备名称",device.value)
      if(device.value==="M300相机") {
        payloadType.value = "53"
      }else{
        payloadType.value = "43"
      }
    },
    { deep: true }
)

var globalRTHHeight = 100
if(route.query.waylineId){
  getWaylinePointByWaylineId(route.query.waylineId).then((res) => {
    globalRTHHeight=res.data.templateContent.Folder.globalHeight
  })
}
watch(
    () => store.state.globalRTHHeight,
    (newValue, oldValue) => {
      globalRTHHeight = newValue
      console.log("当前的全局返航高度",globalRTHHeight)
    },
    { deep: true }
)
let executeHeight = 100
watch(
    () => store.state.executeHeight,
    (newValue, oldValue) => {
      executeHeight = newValue
      console.log("当前的飞行高度",executeHeight)
    },
    { deep: true }
)
if(route.query.waylineId){
  getWaylinePointByWaylineId(route.query.waylineId).then((res) => {
    executeHeight = res.data.templateContent.Folder.Placemark[0].executeHeight
  })
}
const lineDistance=ref(0)
const  test=()=>{
  // let TemWaylineId="9317984e-503b-4755-856a-b716e55e233b"
  // const coordinates: any[] =[]
  // //还需要读出航线文件，然后从航线文件中读出每一个航点的坐标
  // let PointPostion:any={}
  // getWaylineById(TemWaylineId).then(res => {
  //   if (res.code === 0) {
  //     let wayLineData = res.data.templateContent.Folder.placemark
  //     wayLineData.forEach((item: any) => {
  //       let tmpPosition=item.Point.coordinates.split(",")
  //       PointPostion.latitude = tmpPosition[0]
  //       PointPostion.longitude = tmpPosition[1]
  //       coordinates.push(PointPostion)
  //       PointPostion = {}
  //     })
  //   }
  //   console.log( coordinates)
  // })
  // setTimeout(()=>{
  //   const distances = [];
  //   for (let i = 1; i < coordinates.length; i++) {
  //     const startPoint = coordinates[i - 1];
  //     const endPoint = coordinates[i];
  //     const distance = geolib.getDistance(
  //         { latitude: startPoint.latitude, longitude: startPoint.longitude },
  //         { latitude: endPoint.latitude, longitude: endPoint.longitude }
  //     );
  //     distances.push(distance);
  //   }
  //   lineDistance.value = distances.reduce((total, currentDistance) => total + currentDistance, 0);
  //   console.log("当前航线的长度为",lineDistance.value)
  //   const speed = 10;
  //   const timeInSeconds = lineDistance.value / speed+24;
  //   const timeInMinutes = Math.floor(timeInSeconds / 60);
  //   const hours = Math.floor(timeInMinutes / 60);
  //   const minutes = timeInMinutes % 60;
  //   const seconds = Math.floor(timeInSeconds % 60);
  //   let time = `${hours}h${minutes}m${seconds}s`;
  //   console.log("任务所需时长为",time)
  // },100)
}

const  PrintSheet=()=>{
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


const SaveToDataBase=()=>{
  //这个函数负责将vuex中的数据存储到数据库当中
  //需要进行的主要有几个步骤：
  //1.创建要传输的对象，然后将业务数据存储进去
  //2.针对waylinesContent和templateContent，先将共有的missionConfig,等传输进去
  //3.将航点的信息及其航点动作传输进去
  //4.将写好的对象传输到数据库中，然后直接生成航线文件
  //判断航点的数量
  if(JSON.stringify(store.state.EditingWayLine.FocusWayPoint) == "{}"){
    return;
  }
  store.commit("UPDATE_WAYPOINT_INFO")
  if(store.state.EditingWayLine.WayLineList?.length==0){
    return
  }
  console.log("当前航点高度",globalRTHHeight)
    //将焦点的数据写回航点的列表中
  let waylinefile={
    waylineName:store.state.EditingWayLine.WayLineInfo?.waylineName,
    waylineType:0,
    waylineStatus:1,
    templateContent:{
      missionConfig: {
        flyToWaylineMode: "safely",
        finishAction: "goHome",
        exitOnRCLost: "executeLostAction",
        executeRCLostAction: "goBack",
        takeOffSecurityHeight: globalRTHHeight,
        globalTransitionalSpeed: 5.0,
        globalRTHHeight: globalRTHHeight,
        droneInfo: {
          droneEnumValue: droneType.value,
          droneSubEnumValue: 1
        },
        payloadInfo: {
          payloadEnumValue: payloadType.value,
          payloadSubEnumValue: 0,
          payloadPositionIndex: 0
        }
      },
      Folder: {
        templateId:0,
        templateType: "waypoint",
        waylineCoordinateSysParam: {
          coordinateMode: "WGS84",
          heightMode: "relativeToStartPoint",
        },
        autoFlightSpeed: 15,
        globalHeight: executeHeight,
        gimbalPitchMode: "usePointSetting",
        globalWaypointHeadingParam: {
          waypointHeadingMode: "followWayline",
          waypointPoiPoint: "0.000000,0.000000,0.000000",
          waypointHeadingAngle: 0,
          waypointHeadingPathMode: "clockwise",
        },
        globalWaypointTurnMode: "toPointAndStopWithDiscontinuityCurvature",
        globalUseStraightLine: 0,
        Placemark:[]as any,
      }
    },
    waylinesContent:{
      missionConfig:{
        flyToWaylineMode: "safely",
        finishAction: "goHome",
        exitOnRCLost: "executeLostAction",
        executeRCLostAction: "goBack",
        takeOffSecurityHeight: globalRTHHeight,
        globalTransitionalSpeed: 5.0,
        globalRTHHeight: globalRTHHeight,
        droneInfo: {
          droneEnumValue: 67,
          droneSubEnumValue: 1
        },
        payloadInfo: {
          payloadEnumValue: 53,
          payloadSubEnumValue: 0,
          payloadPositionIndex: 0
        }
      },
      Folder: {
        templateId:0,
        executeHeightMode:"relativeToStartPoint",
        autoFlightSpeed:15,
        waylineId:0,
        globalWaypointHeadingParam: {
          waypointHeadingMode: "followWayline",
          waypointPoiPoint: "0.000000,0.000000,0.000000",
          waypointHeadingAngle: 0,
          waypointHeadingPathMode: "clockwise",
        },
        Placemark:[]as any,
      }
    },
  }
  //下面使用循环来将航点的值写入对象中
  if(store.state.EditingWayLine.WayLineList){
    for (let i = 0; i < store.state.EditingWayLine.WayLineList.length; i++) {
      let item = store.state.EditingWayLine.WayLineList[i];
      // 在这里对 item 进行操作
      if (item !== undefined) {
        //如果航点没有动作就不必传入航点动作组
        if(item.WayPointActionList?.action?.length==0){
          let newObj = Object.assign({},item.WayPointParam);
          waylinefile.templateContent.Folder.Placemark.push(newObj)
          waylinefile.templateContent.Folder.Placemark.forEach((point: { executeHeight: number; }) => {
            // console.log("templateContent遍历所有点",point);
            point.executeHeight=executeHeight
          });
          waylinefile.waylinesContent.Folder.Placemark.push(newObj)
          waylinefile.waylinesContent.Folder.Placemark.forEach((point: { executeHeight: number; }) => {
            point.executeHeight=executeHeight
            // console.log("waylinesContent遍历所有点",point);
          });
        }else {
          let actionobj={
            actionGroup:[]as any
          }
          actionobj.actionGroup.push(item.WayPointActionList)
          let newObj = Object.assign({},item.WayPointParam,actionobj);
          // console.log("NewObj,",newObj)
          newObj.executeHeight=executeHeight
          waylinefile.templateContent.Folder.Placemark.push(newObj)
          waylinefile.waylinesContent.Folder.Placemark.push(newObj)
          // console.log("zheshi,",newObj)
        }

      }
    }
  }

  // 如果是编辑航线
  if (props.waylineId) {
      waylinefile.waylineId = props.waylineId
      waylinefile.waylineFileId = props.waylineFileId
      console.log('更新航线', waylinefile)
    waylinefile.templateContent.Folder.Placemark.forEach((point: { executeHeight: number; }) => {
      console.log("templateContent遍历所有点-编辑航线",point);
      point.executeHeight=executeHeight
    });
    waylinefile.waylinesContent.Folder.Placemark.forEach((point: { executeHeight: number; }) => {
      console.log("waylinesContent遍历所有点-编辑航线",point);
      point.executeHeight=executeHeight
    });
      updateWaypoint(waylinefile).then(res=>{
          if (res.message == 'success') {
              ElMessage.success('更新航线成功')
              router.go(-2)

              // console.log('更新航线', res)
              // GeneratWaylinefile(props.waylineId).then(res2=>{
              //   console.log("更新航线",res2)
              //   if(res2.message=='success'){
              //     ElMessage.success('更新航线成功')
              //     router.go(-2)
              //   }
              //   else {
              //     ElMessage.error('更新航线失败请检查后重试')
              //   }
              // })
          } else {
              ElMessage.error('更新航线失败请检查后重试')
          }
      })

      return;
    // waylinefile.waylineId = props.waylineId
  }
  //处理之后，将数据发往数据库，并作部分处理
  insertWaypoint(waylinefile).then(res=>{
    console.log('存储', res)
    GeneratWaylinefile(res.data.waylineId).then(res2=>{
      console.log(res2)
      if(res2.message=='success'){
        ElMessage.success('新建航线成功')
        router.go(-2)
      }
      else {
        ElMessage.error('新建航线失败请检查后重试')
      }
    })
  })
  //处理完之后返回

}
const ShowConfirmPanel=()=>{
  const message = '点击返回之后的您的修改将不会保存，如果想要保存修改内容，请点击保存按钮';
  const result = confirm(`${message}\n\n点击“确定”则退出，点击“取消”则继续编辑。`);
  if (result) {
    // 用户点击了“确定”
    console.log('用户点击了“确定”');
    router.go(-2)
  } else {
    // 用户点击了“取消”
    console.log('用户点击了“取消”');
  }
}
</script>

<style scoped lang="scss">
.NavigationArea{
  width: 100%;
  height: 60px;
  /*background: #232323;   background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
  border: 1px solid $TouchColor;*/
	background: -webkit-linear-gradient(top, rgba(39, 73, 85, 1) 0%, rgba(39, 73, 85,0.6) 60%, rgba(39, 73, 85, 0) 99%);
  position: absolute;
  top:0;
}
.ReturnIcon{
  position: absolute;
  left: 18px;
  top:13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Save{
  position: absolute;
  left: 50px;
  top:11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ReturnIcon img{
  height: 18px;
  width: 18px;
}
.Save img{
  height: 22px;
  width: 22px;
}
.WayLineName{
  position: absolute;
  left: 800px;
  top:5px;
  width: 300px;
  height: 35px;
  color: white;
  background: $ComponentBackground;
  display: flex;
  align-items: center;
  border-radius: 3px;
}
.HelpIcon{
  position: absolute;
  right: 50px;
  top:11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.HelpIcon img{
  height: 28px;
  width: 28px;
}
.WayLineName img{
  margin-right: 4px;
  width: 16px;
  height: 16px;
}
.waylinename {
  text-align: center;
  font-size: 14px;
  width: 130px;
}
.drone{
  font-size: 14px;
  margin-right: 10px;
}
.device{
  font-size: 14px;
}
button{
  position: absolute;
  right: 140px;
  height: 25px;
  width: 90px;
  margin-top: 15px;
}
</style>
