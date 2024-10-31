<template>
  <div class="new-wayline-list">
    <div class="NewWayLinePanelTitle">新建航线</div>
    <hr class="solid-line">
    <div class="WayLineName">航线名称</div>
   <el-input v-model="wayLineName" placeholder="请输入航线名称" style="width: 320px; margin-left: 15px;margin-top: 10px;margin-bottom: 15px"/>
    <div v-for="(item, index) in globalParams" :key="index" class="ChooseLoadEquipment">
			<span style="margin-right:100px; margin-top: 20px ">{{item.optionName}}</span>
		  <span v-if="item.isInput">
			  <input class="InputWayLineName" type="text" :placeholder="item.optionName" v-model="item.optionValue" >
		  </span>
		  <span v-else>
			  <el-select v-model="item.optionValue" class="LoadEquipmentSelected" :placeholder="item.optionName">
					<el-option
							v-for="(item2, index2) in item.items"
							:key="index2"
							:label="item2.label"
							:value="item2.value"
							:disabled="item2.disabled">
					</el-option>
			  </el-select>
		  </span>
	  </div>
    <div class="NewWayLinePanelTwoBtn">
      <div class="NewWayLinePanelOkBtn" @click="updateWayLine">确定</div>
      <div class="NewWayLinePanelCancelBtn" @click="goBackToWayline">取消</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { globalParams } from './NewWayLineType'
import {
	deleteWaylineById,
	updateWayline,
	getWaylineById,
	getWaylineGlobalParamsById,
	updateWaylineGlobalParams,
	insertGenerateWaylineFile,
} from "@/api/wayline";
import {generatActionGroupId, insertWayLinePoint, insertWaypointACtion} from "@/api/wayLinePoint"
import { Wayline, WayLinePoint, WayLineGlobalParams } from "@/store/types/wayline";
import { useRoute, useRouter } from 'vue-router';
import { useMyStore} from '@/store'
import bus from "@/utils/bus";
import { WayLinePointUpload } from '@/store/types/wayline'
import { WayLineOriginAction } from "@/store/types/waylineAction"

const route = useRoute();
const router = useRouter();
const store = useMyStore();
const wayLineName = ref('');
const waypointIdlist: any[]=[]
let GroupIdCount=1
onMounted(() => {
  createWayline()
});
// 新增航线
let waylineInfo = ref({} as Wayline);
let WayLineGlobalParams = ref({} as WayLineGlobalParams);
let deviceId = ref('');
const createWayline = () => {
	let routeMess = {
		wayline_id: '',
		wayLineGlobalParamsId: '',
		device_sn: '',
	}
	setTimeout( () => {
		routeMess.wayline_id = String(route.query.wayline_id);
		routeMess.wayLineGlobalParamsId = String(route.query.wayLineGlobalParamsId);
		getWaylineById(routeMess.wayline_id).then( res => {
			if (res.code === 0) {
				waylineInfo.value = res.data
			}
		})
		getWaylineGlobalParamsById(routeMess.wayLineGlobalParamsId).then( res => {
			if (res.code === 0) {
				WayLineGlobalParams.value = res.data
			}
		})
		// console.log(route.query.device_sn)
	}, 1000)
	bus.emit('rightClickEvent', {
    flag: 'wayLinePointsDrawing',
    wayLineId: WayLineGlobalParams.value.globalParamsId
  })
};
// 路由返回
const goBackToWayline = () => {
  deleteWaylineById(String(waylineInfo.value.waylineId)).then(res => {
    // console.log(res)
	  router.push({
      path: '/default/task/create/add-wayline',
      query: {
        device_sn: route.query.device_sn
      },
    })
	  bus.emit('rightClickEvent', {
	    flag: 'emptyEvent',
	    wayLineId: 'emptyEvent'
	  })
  })
};

const updateWayLine = () => {
	if(wayLineName.value === '') {
		alert('请输入航线名称')
		return
	}
	updateWayline({
		waylineId: String(waylineInfo.value.waylineId),
		waylineName: wayLineName.value,
		waylineStatus: 1,
	}).then(res => {
		if (res.code === 0) {
			updateWaylineGlobalParams({
				globalParamsId: String(WayLineGlobalParams.value.globalParamsId),
				waylineId: waylineInfo.value.waylineId,
				flyToWaylineMode: String(globalParams.value[0].optionValue),
				finishAction: String(globalParams.value[1].optionValue),
				exitOnRCLost: String(globalParams.value[2].optionValue),
				globalWaypointTurnMode: String(globalParams.value[3].optionValue),
				globalUseStraightLine: Number(globalParams.value[4].optionValue),
				executeHeightMode: String(globalParams.value[5].optionValue),
				takeOffSecurityHeight: Number(globalParams.value[6].optionValue),
				globalTransitionalSpeed: Number(globalParams.value[7].optionValue),
				autoFlightSpeed: Number(globalParams.value[8].optionValue),
				globalHeight: Number(globalParams.value[9].optionValue),
				globalWaypointHeadingParam: {
					waypointHeadingMode: 'followWayline',
					waypointPoiPoint: '0.000000,0.000000,0.000000',
					waypointHeadingAngle: 0,
					waypointHeadingPathMode: 'clockwise',
				}
			}).then(res2 => {
				if (res2.code === 0) {
					const drawWayLine = store.state.wayLinePointsDrawing
					console.log('drawWayLine', drawWayLine)
					drawWayLine.forEach((item: WayLinePoint, index) => {
						const sendPoint = {
							globalParamsId: String(WayLineGlobalParams.value.globalParamsId),
							pointX: item.pointX,
							pointY: item.pointY,
							pIndex: index,
							executeHeight: item.pointZ,
							useStraightLine: 1,
							useGlobalSpeed: 1,
							useGlobalHeight:1,
							waypointSpeed: Number(globalParams.value[8].optionValue),
							useGlobalHeadingParam: 1,
							useGlobalTurnParam: 1,
							waypointTurnParam: {
								waypointTurnMode: 'toPointAndStopWithDiscontinuityCurvature',
								waypointTurnDampingDist: 0,
							}
						}
						insertWayLinePoint(sendPoint).then(res3=>{
              //将生成的航点id暂时存储起来
              waypointIdlist.push({index:res3.data.pIndex,placemarkId:res3.data.placemarkId})
            })
					})

          //需要使用航点的id申请航点动作组和航点动作
          //首先是航点动作组
          //插入航点动作和生成航点文件分别执行异步操作
          setTimeout(() => {
            if(waypointIdlist.length===0){
              console.log(10)
            }else {
              updateActionlistGroupId(waypointIdlist)
            }
          }, 3000)
					setTimeout(() => {
						insertGenerateWaylineFile(String(route.query.wayline_id), String(route.query.device_sn)).then(res => {
							if(res.code === 0) {
								ElMessage.success('已经生成航线文件，现在可以起飞了')
								router.push({
									path: '/default/task/create/add-wayline',
									query: {
										device_sn: route.query.device_sn
									},
								})
								bus.emit('rightClickEvent', {
							    flag: 'emptyEvent',
							    wayLineId: 'emptyEvent'
							  })
								ElMessage.success('创建航线成功！')
							}
						})
					}, 5000)
				} else {
					console.log('更新航线全局参数成功！')
				}
			})
		} else {
			console.log('更新航线失败！')
		}
	})
}
const updateActionlistGroupId = (array: any[]) =>{

  let temlist = store.state.beforeprocesswaylineaction
  //还需要两个变量来处理间隔拍照,-1指没有这种动作，不为一则是间隔动作的起点
  let processEqualDistanceInterval=-1
  let processEqualInterval=-1
  //下面是循环处理每一个航点的代码
  temlist.forEach((item: WayLineOriginAction) => {
    ///这里没写完
    //需要首先区分有没有间隔拍摄
    // @ts-ignore
    // Object.keys(item.param).forEach(key => {
    //   // @ts-ignore
    //   const value =item[key];
    //   if(value.name.ActionName==="StartEqualDistanceIntervalTakePhoto"){
    //     // @ts-ignore
    //     processEqualDistanceInterval=item.index
    //   }else if(value.name.ActionName==="StartEqualDistanceIntervalTakePhoto"){
    //     // @ts-ignore
    //     processEqualInterval=item.index
    //   }else if(value.name.ActionName==="StartEqualDistanceIntervalTakePhoto"){
    //     //在这里拼接起来
    //   }
    //   console.log(`Key: ${key}, Value: ${value}`);
    // });

    const ActionGroupBody = {
      // placemarkId:String(waypointIdlist['0']),
      placemarkId:waypointIdlist[item.index as number].placemarkId,
      actionGroupId:GroupIdCount,
      actionGroupStartIndex:item.index,
      actionGroupEndIndex:item.index,
      actionGroupMode:"sequence",
      actionTrigger:{
        actionTriggerType:"reachPoint"
      }
    } as WayLinePointUpload;
    GroupIdCount=GroupIdCount+1
    generatActionGroupId(ActionGroupBody).then(res4=>{
      //这里首先创建航点的动作的整体的body
      let pointid=0;
      //这里处理回调
      //将该点的其他所有航点的动作添加到表中
      Object.keys(item.param as any).forEach(key => {
        // @ts-ignore
        const value =item.param[key]
        if(value.ActionName==="StartEqualDistanceIntervalTakePhoto"||value.ActionName==="StartEqualIntervalTakePhoto"||value.ActionName==="takePhotoParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"takePhoto",
            takePhotoParam:{
              payloadPositionIndex:1,
              fileSuffix:"zoom,wide,ir,narrow_band",
              useGlobalPayloadLensIndex:1
            }
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }else if(value.ActionName==="rotateYawParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"rotateYaw",
            rotateYawParam:value.ActionParam
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }else if(value.ActionName==="gimbalRotateParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"gimbalRotate",
            gimbalRotateParam:value.ActionParam
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }else if(value.ActionName==="hoverParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"hover",
            hoverParam:value.ActionParam
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }else if(value.ActionName==="customDirNameParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"customDirName",
            customDirNameParam:value.ActionParam
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }else if(value.ActionName==="startRecordParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"startRecord",
            startRecordParam:value.ActionParam
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }else if(value.ActionName==="stopRecordParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"stopRecord",
            stopRecordParam:value.ActionParam
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }else if(value.ActionName==="zoomParam"){
          const pointActionBody={
            placemarkActionGroupId:res4.data.placemarkActionGroupId,
            actionId:pointid,
            actionActuatorFunc:"zoom",
            zoomParam:value.ActionParam
          }
          insertWaypointACtion(pointActionBody).then(res5=>{})
          pointid=pointid+1
        }
        // console.log(`Key: ${key}, Value: ${value}`);
      });
    })
    // 在这里执行对每个元素的操作
    // console.log(item.index);

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
.new-wayline-list {
  box-shadow: 8px 0px 4px 0px rgba(255, 120, 0, 1);
  background-color: rgba(10, 11, 14, 0.85);
  position: fixed;
  width: $LeftWidth;
  top: 0px;
  margin-top: $NavigationHeight;
  height: calc(100% - $NavigationHeight);
  left: $LeftWidth;
  /* display: flex;
  flex-direction: column; */
  overflow: scroll;
}
.NewWayLinePanelTitle {
  width: 68px;
  height: 16px;
  overflow-wrap: break-word;
  padding-top: 22px;
  color: rgba(235, 152, 1);
  font-size: 16px;
  font-family: MicrosoftYaHei;
  text-align: left;
  white-space: nowrap;
  line-height: 16px;
  margin-top: 12px;
  margin-left: 166px;
  margin-bottom: 15px;
}
.solid-line {
  border: none;
  border-top: 0.45px solid #8a590a;
}
.WayLineName{
  width: 60px;
  height: 15px;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: MicrosoftYaHei;
  text-align: left;
  white-space: nowrap;
  line-height: 14px;
  margin: 38px 0 0 18px;
}
.InputWayLineName{
  border: 1px solid rgba(235, 152, 1,0.3) ;
  width: 320px;
  height: 22px;
  margin-left: 12px;
  margin-right: 19px;
  margin-top: 12px;
  background:rgba(0,0,0,0.77);
  color: #888a90;
  padding: 5px;
  border-radius: 5px;

}
::placeholder {
  overflow-wrap: break-word;
  color: rgba(153, 155, 161, 1);
  font-size: 15px;
  text-align: left;
  white-space: nowrap;
  line-height: 15px;
  margin: 11px 0 0 14px;
}
.DrawWayLine{
  width: 60px;
  height: 15px;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  text-align: left;
  white-space: nowrap;
  line-height: 14px;
  margin: 38px 0 0 18px;
}
.BtnDrawWayLine{
  color: #5b5c60;
  width: 74px;
  height: 74px;
  background: rgba(0,0,0,0.77);
  border: 1px solid rgba(249,161,0,0.4);
  padding-left: 10px;
  text-align-all: center;
  line-height: 37px;
  margin-left: 12px;
  margin-top: 13px;
}
.isBtnDrawWayLine{
  border: 1px solid rgba(235, 152, 1);
  color: rgba(235, 152, 1);
}
.NewWayLinePanelTwoBtn{
  /*padding-top: 6px;*/
  color:white;
  display: flex;
  margin-top: 25px;
  margin-bottom: 25px;
}
.NewWayLinePanelOkBtn{
  display: inline-block;
  width: 79px;
  height: 32px;
  background: #000000;
  border: 1px solid rgba(249,161,0,0.4);
  border-radius: 4px;
  margin-left: 100px;
  text-align: center;
  line-height: 32px;
}
.NewWayLinePanelCancelBtn{
  display: inline-block;
  width: 79px;
  height: 32px;
  background: #000000;
  border: 1px solid rgba(249,161,0,0.4);
  border-radius: 4px;
  margin-left: 42px;
  text-align: center;
  line-height: 32px;
}
.ChooseLoadEquipment{
  width: 340px;
  height: 80px;
  color: rgba(235, 152, 1);
  margin-top: 2px;
  margin-left: 12px;
  margin-right: 19px;
}
.LoadEquipmentSelected{
  width: 220px;
  margin-top: 7px;
  margin-bottom: 10px;

}
.LoadEquipment{
  font-size: 15px;
  color: #595b5f;
}
</style>
