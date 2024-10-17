<template>
	<div class="param_list">
		<div class="NewWayLinePanelTitle">
			单点环绕
		</div>
		<hr class="solid-line">
		<div class="ChooseLoadEquipment">
      <span>拍照尺寸</span>
			长：<el-input style="width: 60px" v-model="paramsList.photoPixelWidth" placeholder="Please input" />
			宽：<el-input style="width: 60px" v-model="paramsList.photoPixelHeight" placeholder="Please input" />
    </div>
		<div class="ChooseLoadEquipment">
      <span>焦距</span>
			<el-input style="width: 50px" v-model="paramsList.focalLength" placeholder="Please input" />
    </div>
		<div class="ChooseLoadEquipment">
      <span>传感器尺寸</span>
			<span>长</span><el-input style="width: 50px" v-model="paramsList.widthSensorSize" placeholder="Please input" />
			<span>宽</span><el-input style="width: 50px" v-model="paramsList.heightSensorSize" placeholder="Please input" />
    </div>
		<div class="ChooseLoadEquipment">
      <span>飞行高度</span>
			<el-input style="width: 50px" v-model="paramsList.flightAltitude" placeholder="Please input" />
    </div>
		<!-- <div>航带宽度{{ groundLength }}</div> -->
		<div class="ChooseLoadEquipment">
			<span>重叠度{{ overlap }}</span>
			<el-slider style="width: 150px" v-model="overlap" :step="sliderStep"/>
		</div>
        <div>
            <span>航带半径</span>
			<el-input style="width: 50px" v-model="paramsList.flightRadius" placeholder="Please input" />
        </div>
		<div class="ChooseLoadEquipment">
			<button v-if="!isDrawPolygon" @click="startDrawPolygon">开始选点</button>
			<button v-if="isDrawPolygon" @click="endDrawPolygon">结束选点</button>
		</div>
		<!-- <div>
			<button @click="computeWayLine">计算航线</button>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import {ref, watch, onMounted, onBeforeUnmount, defineEmits} from 'vue'
import * as Cesium from 'cesium'
import {
	computeWaypoint,
	AirBelt
} from '@/pages/TaskDeployment/components/WaylineEdit/WayLineByPoint/ComputeAirBelt'
import { center } from '@turf/turf'
import { useMyStore } from '@/store'
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
const store = useMyStore()


const paramsList = ref<{
	photoPixelWidth: number,
	photoPixelHeight: number,
	focalLength: number,
	widthSensorSize: number,
  heightSensorSize: number,
	flightAltitude: number,
    flightRadius:number
}>({
	photoPixelWidth: 4056,
	photoPixelHeight: 3040,
	focalLength: 4.5,
	widthSensorSize: 6.3,
	flightAltitude: 100,
  heightSensorSize: 15.6,
    flightRadius:20
})
// 重叠度参数
const overlap = ref(20)
// 滑块步长
let sliderStep = 0.1

// 航点间的圆心角，弧度制
let granularity:number = 0
let groundResolution = paramsList.value.flightAltitude  * paramsList.value.widthSensorSize / paramsList.value.focalLength
//中心点
const centerPoint:number[] = []
let centerPointEntity = null

let airBelt =null
let handler = null
// 地面投影长度
let groundLength = ref(Number(groundResolution.toFixed(2)))
// 最小外接矩形[maxLon, minLon, maxLat, minLat, lonNum, latNum]
let minRectangle = ref<number[]>([])

const globalTransitionalSpeed = ref(10)
const photoSpacing = ref(10)
watch(paramsList, (value) => {
    // computeWayLine()


}, {deep: true})

watch(overlap , (value) => {
    computeWayLine()

})

let isDrawPolygon = ref(false)
const startDrawPolygon = () => {
	console.log('开始画面')
    handler = new Cesium.ScreenSpaceEventHandler(window.cesiumViewer.scene.canvas);
      handler.setInputAction((movement) => {
        if (centerPointEntity != null){
        window.cesiumViewer.entities.remove(centerPointEntity)
        }
        centerPoint.pop()
        centerPoint.pop()
        let cartesian = window.cesiumViewer.camera.pickEllipsoid(movement.position);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
        let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
        centerPoint.push(Number(lng.toFixed(6)))
        centerPoint.push(Number(lat.toFixed(6)))
        // console.log(centerPoint);
        console.log("加中心点");
        centerPointEntity = window.cesiumViewer.entities.add({
          id:"wayLinePointCenter",
            position:Cesium.Cartesian3.fromDegrees(centerPoint[0], centerPoint[1]),
            point:new Cesium.PointGraphics({
                    pixelSize: 4,
                    color: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                  })
        })

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
	isDrawPolygon.value = true
}

const endDrawPolygon = () => {
	console.log('结束画面')
    if (handler==null){
        return
    }
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
	isDrawPolygon.value = false
    computeWayLine()
}

const computeWayLine = () => {
    if (centerPoint.length == 0){
        return
    }
    if (airBelt != null){
        airBelt.destroy()
        airBelt = null
    }
    granularity = computeWaypoint(paramsList.value.focalLength,paramsList.value.widthSensorSize/2,overlap.value/100)
    let option = {
      id:"wayLinePoint",
    mapViewer:window.cesiumViewer,
    granularity,
    center:{
      lat:centerPoint[0],
      lon:centerPoint[1],
      height:paramsList.value.flightAltitude
    },
    radius:paramsList.value.flightRadius
  }
  airBelt = new AirBelt(option)
  sendWayLine(airBelt.getPoints())
}

const emit = defineEmits(['sendWayLine'])
const sendWayLine = (wayLineData: number[]) => {
	emit('sendWayLine', { wayLineData: wayLineData, cameraType: paramsList.value, globalTransitionalSpeed: globalTransitionalSpeed.value, photoSpacing: photoSpacing.value })
}
onMounted(() => {
	store.commit('SET_NAVIGATION_TYPE', false)
})

</script>

<style scoped lang="scss">
.param_list {
  box-shadow: 8px 0px 4px 0px rgba(255, 120, 0, 1);
  background-color: rgba(10, 11, 14, 0.85);
  width: $RightWidth;
  height: calc(100% - 200px);
  /* 其他样式设置 */
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
  border-top: 1px solid #F9A100;
}

.ChooseLoadEquipment{
  width: 340px;
  height: 60px;
  color: rgba(235, 152, 1);
  margin-top: 2px;
  margin-left: 12px;
  margin-right: 19px;
}

.h_angle {
	display:flex;
  margin-top: -2px;
}
.htext {
	margin-top: 13px;
	margin-left: 4px
}
.control {
	display: flex;
  flex-direction: column;
  width: 250px;
  text-align: center;
  margin-left: 10px;
}
</style>
