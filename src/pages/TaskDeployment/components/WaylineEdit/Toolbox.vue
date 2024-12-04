<template>
  <div class="ToolboxPanel">
    <div class="ActionList" v-if="showactionlist">
      <div class="StartRecord" @click="HadlerAddAction('StartRecord')">
        <p>开始录像</p>
        <div class="imgBackground" ><img src="../../../../assets/TaskDeployment/Record.png"></div>
      </div>
      <div class="StopRecord" @click="HadlerAddAction('StopRecord')">
        <p>停止录像</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/Stop.png"></div>
      </div>
<!--      <div class="StartEqualIntervalTakePhoto" @click="HadlerAddAction('StartEqualIntervalTakePhoto')">-->
<!--        <p>开始等间隔拍照</p>-->
<!--        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/TakePhoto2.png"></div>-->
<!--      </div>-->
      <div class="StartEqualDistanceIntervalTakePhoto" @click="HadlerAddAction('StartEqualDistanceIntervalTakePhoto')">
        <p>开始等距离间隔拍照</p>
        <div class="imgBackground"><img  src="../../../../assets/TaskDeployment/TakePhoto21.png"></div>
      </div>
      <div class="StopEqualIntervalTakePhoto" @click="HadlerAddAction('StopEqualIntervalTakePhoto')">
        <p>停止间隔拍照</p>
        <div class="imgBackground"><img  src="../../../../assets/TaskDeployment/Stop1.png"></div>
      </div>
      <div class="Hover" @click="HadlerAddAction('Hover')">
        <p>悬停</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/Drone1.png"></div>
      </div>
      <div class="DroneYaw" @click="HadlerAddAction('DroneYaw')">
        <p>飞行器偏航角</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/Drone2.png"></div>
      </div>
      <div class="GimbalYaw" @click="HadlerAddAction('GimbalYaw')">
        <p>云台偏航角</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/GimbalPitch.png"></div>
      </div>
      <div class="GimbalPitch" @click="HadlerAddAction('GimbalPitch')">
        <p>云台俯仰角</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/GimebalYaw.png"></div>
      </div>
      <div class="TakePhoto" @click="HadlerAddAction('TakePhoto')">
        <p>拍照</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/TakePhoto2.png"></div>
      </div>
      <div class="Zoom" @click="HadlerAddAction('Zoom')">
        <p>变焦</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/Zoom.png"></div>
      </div>
      <div class="NewFolder" @click="HadlerAddAction('NewFolder')">
        <p>新建文件夹</p>
        <div class="imgBackground"><img src="../../../../assets/TaskDeployment/NewFolder.png"></div>
      </div>
    </div>
    <div class="ToolItem">
      <div class="NewWayPoint">
<!--        <p>新增航点</p>-->
<!--        <div class="imgBackground" @click="AddAWayPoint"><img src="../../../../assets/TaskDeployment/Drone1.png"></div>-->
      </div>
      <div class="DirectionalPhotography">
<!--        <p>定向拍照</p>-->
<!--        <div class="imgBackground" @click="Clicktestinsert"><img src="../../../../assets/TaskDeployment/TakePhoto.png"></div>-->
      </div>
      <div class="MoreAction">
        <p>添加动作</p>
        <div class="imgBackground" @click="ClickShowaACtionList"><img src="../../../../assets/TaskDeployment/More.png"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {
  InitializationWaypointFrontPosition,
  InitializationWaypointLastPosition,
  WayPoint,
  WayPointaction,
  WayPointActionList,
  WayPointParam
} from "@/store/types/WayPoint";
import store from "@/store";
const showactionlist=ref(false)
const dianjicishu=ref(0)
const ClickShowaACtionList=()=>{
  showactionlist.value=!showactionlist.value
}
//这里处理新增航点动作的函数只负责将将动作加入到列表中
const HadlerAddAction=(name:string)=>{
  //在加入新的航点动作之前先取得最后一个航点动作的序号
  //同时检查改序号是否过大，比如大于655，或者设置的稍小一些100，如果超过这个值就不允许新增动作
  let actionid=store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.length
  if(actionid==undefined||actionid>100){
    console.log("不允许新建航点",store.state.EditingWayLine.FocusWayPoint)
  }
  let action={
    actionId:actionid
  }as WayPointaction
  switch (name) {
    case 'StartRecord':
      action.actionName=name
      action.actionActuatorFunc="startRecord"
        action.actionActuatorFuncParam={
          fileSuffix:store.state.EditingWayLine.WayLineInfo?.waylineName,
          payloadPositionIndex:1,
          useGlobalPayloadLensIndex:1
        }
      console.log(name)
      // 执行StartRecord的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'StopRecord':
      action.actionName=name
      action.actionActuatorFunc="stopRecord"
      action.actionActuatorFuncParam={
        fileSuffix:store.state.EditingWayLine.WayLineInfo?.waylineName,
        payloadPositionIndex:1
      }
      console.log(name)
      // 执行StopRecord的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'StartEqualIntervalTakePhoto':
      action.actionName=name
      action.actionActuatorFunc="takePhoto"
        action.actionActuatorFuncParam={
          actionTriggerType:"multipleTiming",
          actionTriggerParam:10
      }
     console.log(name)
      // 执行StartEqualIntervalTakePhoto的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'StartEqualDistanceIntervalTakePhoto':
      action.actionName=name
      action.actionActuatorFunc="takePhoto"
        action.actionActuatorFuncParam={
          actionTriggerType:"multipleDistance",
          actionTriggerParam:10
      }
      console.log(name)
      // 执行StartEqualDistanceIntervalTakePhoto的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'StopEqualIntervalTakePhoto':
      action.actionName=name
      action.actionActuatorFunc=""
        action.actionActuatorFuncParam={
      }
     console.log(name)
      // 执行StopEqualIntervalTakePhoto的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'Hover':
      action.actionName=name
      action.actionActuatorFunc="hover"
        action.actionActuatorFuncParam={
          hoverTime:0
      }
      console.log(name)
      // 执行Hover的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'DroneYaw':
      action.actionName=name
      action.actionActuatorFunc="rotateYaw"
        action.actionActuatorFuncParam={
          rotateYawAircraftHeading:40,
          rotateYawAircraftHeadingMode:"clockwise"
      }
      console.log(name)
      // 执行DroneYaw的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'GimbalYaw':
      action.actionName=name
      action.actionActuatorFunc="gimbalRotate"
        action.actionActuatorFuncParam={
          payloadPositionIndex:1,
          gimbalYawRotateEnable:1,
          gimbalYawRotateAngle:0,
          gimbalRotateTimeEnable:0
      }
      console.log(name)
      // 执行GimbalYaw的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'GimbalPitch':
      action.actionName=name
      action.actionActuatorFunc="gimbalRotate"
        action.actionActuatorFuncParam={
          payloadPositionIndex:1,
          gimbalPitchRotateEnable:1,
          gimbalPitchRotateAngle:0,
          gimbalRotateTimeEnable:0
      }
     console.log(name)
      // 执行GimbalPitch的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'TakePhoto':
      action.actionName=name
      action.actionActuatorFunc="takePhoto"
        action.actionActuatorFuncParam={
          fileSuffix:store.state.EditingWayLine.WayLineInfo?.waylineName,
          payloadPositionIndex:1,
          useGlobalPayloadLensIndex:1
      }
      console.log(name)
      // 执行TakePhoto的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'Zoom':
      action.actionName=name
      action.actionActuatorFunc="zoom"
        action.actionActuatorFuncParam={
          payloadPositionIndex:1,
          useGlobalPayloadLensIndex:500
      }
      console.log(name)
      // 执行Zoom的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    case 'NewFolder':
      action.actionName=name
      action.actionActuatorFunc="customDirName"
        action.actionActuatorFuncParam={
          payloadPositionIndex:1,
          directoryName:""
      }
      console.log(name)
      // 执行NewFolder的逻辑
      store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action?.push(action)
      break;
    default:
      console.log(name)
      // 处理其他选项的逻辑
      break;
  }
  //然后将焦点航点的信息更新到航点列表中
  store.commit("UPDATE_WAYPOINT_INFO")
}

const AddAWayPoint=()=>{
  //首先判断现在是否已经有航点，如果已有航点就先保存航点的信息
  console.log(store.state.EditingWayLine)
  if(store.state.EditingWayLine.FocusWayPoint!= null){
    if(JSON.stringify(store.state.EditingWayLine.FocusWayPoint) != "{}"){
      let temindex=store.state.EditingWayLine.FocusWayPoint.WayPointParam.index
      // @ts-ignore
      store.state.EditingWayLine.WayLineList[temindex]=store.state.EditingWayLine.FocusWayPoint
    }
  }
  if(dianjicishu.value!=0){
    InitializationWaypointLastPosition("113.02237722442432,23.148357135728464",80.0,10.0)
  }else {
    dianjicishu.value=1
    InitializationWaypointLastPosition("113.02247722442432,23.148357135728464",80.0,10.0)
  }
}
const Clicktestinsert=()=>{
  InitializationWaypointFrontPosition("113.02247722442432,23.149357135728464",80.0,10.0,0)
  console.log(store.state.EditingWayLine.WayLineList)
}

</script>

<style scoped>
.ToolboxPanel{
  position: absolute;
  top: 60px;
  right: 20px;
  height: 530px;
  width: 240px;

  display: flex; /* 使用flex布局 */
}

.ActionList{
  width: 57%; /* 左边div占宽度的50% */
  flex-direction: column;
  justify-content: space-between;
}
.ActionList p{
  width: 70px;
}
.ToolItem{
  right: 5px;
  width: 43%; /* 右边div占宽度的50% */
  position: absolute;
  display: flex;
  flex-direction: column;
}
.NewWayPoint{
  margin-top: 290px;
  flex-direction: column;
}
.DirectionalPhotography{

}
.imgBackground {
  margin-left: 4px;
  display: inline-block;
  vertical-align: middle;
  background: #3c3c3c;
  height: 32px;
  width: 32px;
  border-radius: 3px;
}
img{
  width: 24px;
  height: 24px;
  margin-top: 4px;
  margin-left: 4px;
}
p{
  font-size: 12px;
  color: white;
  margin-left: 10px;
  width: 50px;
  height: 20px;
  white-space: pre-wrap;
  font-weight: bold;
  display: inline-block;
  vertical-align: middle;
}
</style>
