<template>
	<div class="wayLine_edit_by_point">
		<div class="top_section">
			<div class="ReturnIcon">
	      <img :src="returnIcon" @click="ShowConfirmPanel" alt="">
	    </div>
	    <div class="Save">
	      <img :src="saveIcon" @click="SaveToDataBase" alt="">
	    </div>
	    <div class="WayLineList">
	      <div class="waylineName">{{ wayline_name }}</div>
	      <img :src="droneIcon" alt="">
	      <div class="drone">{{ drone_type }}</div>
	      <img :src="taskIcon" alt="">
	      <div class="device">{{ camera_type }}</div>
	    </div>
	    <div class="HelpIcon">
	      <img :src="helpIcon" title="帮助"  alt="">
	    </div>
		</div>
    <params-list @sendWayLine="sendWayLine" class="param_list"></params-list>
	</div>
</template>

<script setup lang="ts">

import store from "@/store";
import {onMounted, reactive,ref, onBeforeUnmount} from "vue";
import { useRoute, useRouter } from 'vue-router';
import bus from '@/utils/bus'
import ParamsList from "@/pages/TaskDeployment/components/WaylineEdit/WayLineByPoint/paramsList.vue";
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import returnIcon from '@/assets/TaskDeployment/return.png'
import saveIcon from '@/assets/TaskDeployment/Save.png'
import droneIcon from '@/assets/TaskDeployment/Drone1.png'
import taskIcon from '@/assets/TaskDeployment/TakePhoto2.png'
import helpIcon from '@/assets/TaskDeployment/Help.png'
import {GeneratWaylinefile, insertWaypoint} from '@/api/wayLinePoint'
const route = useRoute();
const router = useRouter();

const wayline_name = ref()
const drone_type = ref()
const camera_type = ref()
const getWayLineData = ref()
const camera_type_list = ref()
// 全局航线速度
const globalTransitionalSpeed = ref(10)
// 拍照间距
const photoSpacing = ref(10)

onMounted(() => {
  wayline_name.value = route.query.name
  drone_type.value = route.query.drone_type
	camera_type.value = '五镜头'
})
onBeforeUnmount( () => {
	store.commit('SET_NAVIGATION_TYPE', true)
	// console.log("清除之前",window.cesiumViewer.entities);
	RemoveEntitiesByBatch(window.cesiumViewer, 'wayLinePoint')
	// console.log("清除之后",window.cesiumViewer.entities);
  bus.emit('rightClickEvent', {
    flag: 'emptyEvent',
    wayLineId: 'emptyEvent'
  })
})

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

const sendWayLine = (data: any) => {
	getWayLineData.value = []
	// console.log('组件传来的data', data)
	for(let i = 0; i < data.wayLineData.length; i+= 3 ) {
		getWayLineData.value.push([data.wayLineData[i], data.wayLineData[i+1], data.wayLineData[i+2]])
		// console.log('data111', [data.wayLineData[i], data.wayLineData[i+1], data.wayLineData[i+2]])
	}
	// console.log('遍历接受后的data', getWayLineData.value)
	camera_type_list.value = data.cameraType
	globalTransitionalSpeed.value = data.globalTransitionalSpeed
	photoSpacing.value = data.photoSpacing
}
const SaveToDataBase=()=>{
	console.log('data', getWayLineData.value)
	const photographyWayLine = {
		waylineName: wayline_name.value,
		waylineType: 0,
    waylineStatus: 1,
		templateContent: {
			missionConfig: {
				flyToWaylineMode: 'safely',
				finishAction: 'goHome',
				exitOnRCLost: 'executeLostAction',
				executeRCLostAction: 'goBack',
				takeOffSecurityHeight: getWayLineData.value[0][2],
				globalRTHHeight: getWayLineData.value[0][2],
				globalTransitionalSpeed: globalTransitionalSpeed.value,
				droneInfo: {
					droneEnumValue: 67,
					droneSubEnumValue: 1
				},
				payloadInfo: {
					payloadEnumValue: 65535,
					payloadSubEnumValue: 0,
					payloadPositionIndex: 0,
					customPayloadName: camera_type.value,
					focalLength: camera_type_list.value.focalLength,
					sensorH: camera_type_list.value.heightSensorSize,
					sensorW: camera_type_list.value.widthSensorSize,
					imageH: camera_type_list.value.photoPixelHeight,
					imageW: camera_type_list.value.photoPixelWidth,
				}
			},
			Folder: {
				templateId: 0,
				templateType: 'waypoint',
				waylineCoordinateSysParam: {
          coordinateMode: "WGS84",
          heightMode: "relativeToStartPoint",
        },
				globalHeight: getWayLineData.value[0][2],
				autoFlightSpeed: globalTransitionalSpeed.value,
				globalWaypointHeadingParam: {
          waypointHeadingMode: "followWayline",
          waypointPoiPoint: "0.000000,0.000000,0.000000",
          waypointHeadingAngle: 0,
          waypointHeadingPathMode: "clockwise",
        },
				globalWaypointTurnMode: 'toPointAndStopWithDiscontinuityCurvature',
				globalUseStraightLine: 0,
				Placemark: [] as any,
			}
		},
		waylinesContent: {
			missionConfig: {
				flyToWaylineMode: 'safely',
				finishAction: 'goHome',
				exitOnRCLost: 'executeLostAction',
				executeRCLostAction: 'goBack',
				takeOffSecurityHeight: getWayLineData.value[0][2],
				globalRTHHeight: getWayLineData.value[0][2],
				globalTransitionalSpeed: globalTransitionalSpeed.value,
				droneInfo: {
					droneEnumValue: 67,
					droneSubEnumValue: 1
				},
				payloadInfo: {
					payloadEnumValue: 65535,
					payloadSubEnumValue: 0,
					payloadPositionIndex: 0,
					customPayloadName: camera_type.value,
					focalLength: camera_type_list.value.focalLength,
					sensorH: camera_type_list.value.heightSensorSize,
					sensorW: camera_type_list.value.widthSensorSize,
					imageH: camera_type_list.value.photoPixelHeight,
					imageW: camera_type_list.value.photoPixelWidth,
				}
			},
			Folder: {
				templateId: 0,
				waylineId:0,
				executeHeightMode: 'relativeToStartPoint',
				autoFlightSpeed: globalTransitionalSpeed.value,
				globalWaypointHeadingParam: {
          waypointHeadingMode: "followWayline",
          waypointPoiPoint: "0.000000,0.000000,0.000000",
          waypointHeadingAngle: 0,
          waypointHeadingPathMode: "clockwise",
        },
				Placemark: [] as any,
			}
		}
	}
	getWayLineData.value.forEach((item: any, index: number) => {
		if(index === 0) {
			const PlacemarkIndex = {
				Point: {
					coordinates: String([item[0], item[1]]),
				},
				index: index,
				executeHeight: item[2],
				waypointSpeed: globalTransitionalSpeed.value,
				waypointHeadingParam: {
					waypointHeadingMode: 'followWayline',
					waypointHeadingAngle: -179.99,
					waypointPoiPoint: '0.000000,0.000000,0.000000',
					waypointHeadingAngleEnable: 1,
					waypointHeadingPathMode: 'followBadArc',
					waypointHeadingPoiIndex: 0,
				},
				// waypointTurnParam: {
				// 	waypointTurnMode: 'toPointAndStopWithDiscontinuityCurvature',
				// 	waypointTurnDampingDist: 0,
				// },
				useGlobalHeight: 1,
				useGlobalSpeed: 1,
				useGlobalHeadingParam: 1,
				useGlobalTurnParam: 1,
				useStraightLine: 1,
				actionGroup: [{
					actionGroupId: 0,
					actionGroupStartIndex: 0,
					actionGroupEndIndex: 0,
					actionGroupMode: 'sequence',
					actionTrigger: {
						actionTriggerType: 'reachPoint',
					},
					action: [{
						actionId: 0,
						actionActuatorFunc: 'gimbalRotate',
						actionActuatorFuncParam: {
							gimbalHeadingYawBase: 'aircraft',
							gimbalRotateMode: 'absoluteAngle',
							gimbalPitchRotateEnable: 1,
							gimbalPitchRotateAngle: -90,
							gimbalRollRotateEnable: 0,
							gimbalRollRotateAngle: 0,
							gimbalYawRotateEnable: 0,
							gimbalYawRotateAngle: 0,
							gimbalRotateTimeEnable: 0,
							gimbalRotateTime: 10,
							payloadPositionIndex: 0,
						}
					}, {
						actionId: 1,
						actionActuatorFunc: 'takePhoto',
						actionActuatorFuncParam: {
							payloadPositionIndex: 0,
							useGlobalPayloadLensIndex: 0,
						}
					}]
				}],
				waypointGimbalHeadingParam: {
					waypointGimbalPitchAngle: 0,
					waypointGimbalYawAngle: 0,
				}
			}
			photographyWayLine.templateContent.Folder.Placemark.push(PlacemarkIndex)
			photographyWayLine.waylinesContent.Folder.Placemark.push(PlacemarkIndex)
		} else {
			const PlacemarkIndex = {
				Point: {
					coordinates: String([item[0], item[1]]),
				},
				index: index,
				executeHeight: item[2],
				waypointSpeed: globalTransitionalSpeed.value,
				waypointHeadingParam: {
					waypointHeadingMode: 'followWayline',
					waypointHeadingAngle: 0,
					waypointPoiPoint: '0.000000,0.000000,0.000000',
					waypointHeadingAngleEnable: 1,
					waypointHeadingPathMode: 'followBadArc',
					waypointHeadingPoiIndex: 0,
				},
				// waypointTurnParam: {
				// 	waypointTurnMode: 'coordinateTurn',
				// 	waypointTurnDampingDist: 10,
				// },
				useGlobalHeight: 1,
				useGlobalSpeed: 1,
				useGlobalHeadingParam: 1,
				useGlobalTurnParam: 1,
				useStraightLine: 1,
				waypointGimbalHeadingParam: {
					waypointGimbalPitchAngle: 0,
					waypointGimbalYawAngle: 0,
				}
			}
			photographyWayLine.templateContent.Folder.Placemark.push(PlacemarkIndex)
			photographyWayLine.waylinesContent.Folder.Placemark.push(PlacemarkIndex)
		}
	})
	console.log('savedata', photographyWayLine)
	insertWaypoint(photographyWayLine).then(res=>{
    console.log(res)
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
}

</script>

<style scoped>

.wayLine_edit_by_point {
	position: relative;
}

.top_section {
  width: 100%;
  height: 100px;
  background: #232323;
	background: -webkit-linear-gradient(top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 99%);
  position: absolute;
  top:0;
}

.ReturnIcon {
	cursor: pointer;
  position: absolute;
  left: 18px;
  top:13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.Save {
	cursor: pointer;
  position: absolute;
  left: 50px;
  top:11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ReturnIcon img {
  height: 18px;
  width: 18px;
}

.Save img {
  height: 22px;
  width: 22px;
}

.WayLineList {
  position: absolute;
  left: 800px;
  top:5px;
  width: 340px;
  height: 35px;
  background: #3c3c3c;
  display: flex;
  align-items: center;
  border-radius: 3px;
}

.HelpIcon {
	cursor: pointer;
  position: absolute;
  right: 50px;
  top:11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.HelpIcon img {
  height: 28px;
  width: 28px;
}

.WayLineList img {
  margin-right: 4px;
  width: 16px;
  height: 16px;
}

.waylineName {
  text-align: center;
  font-size: 14px;
  width: 130px;
}

.drone {
  font-size: 14px;
  margin-right: 10px;
}

.device {
  font-size: 14px;
}

button {
  position: absolute;
  right: 140px;
  height: 25px;
  width: 90px;
  margin-top: 15px;
}

.param_list {
  position: absolute;
  width: 400px;
  height: 800px;
  z-index: 1;
	left: 10px;
	top: 100px;
}
</style>
