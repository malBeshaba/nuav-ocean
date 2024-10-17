<template>
	<div class="param_list">
		<div class="NewWayLinePanelTitle">
			区域环绕
		</div>
		<hr class="solid-line">
		<div class="ChooseLoadEquipment">
      <span>拍照尺寸</span>
			长：<el-input style="width: 60px" v-model="paramsList.photoPixelWidth" placeholder="Please input" />
			宽：<el-input style="width: 60px" v-model="paramsList.photoPixelHeight" placeholder="Please input" />
    </div>
		<div class="ChooseLoadEquipment">
      <span>焦距：</span>
			<el-input style="width: 50px" v-model="paramsList.focalLength" placeholder="Please input" />
    </div>
		<div class="ChooseLoadEquipment">
      <span>传感器尺寸</span>
			<span>长：</span><el-input style="width: 50px" v-model="paramsList.widthSensorSize" placeholder="Please input" />
			<span>宽：</span><el-input style="width: 50px" v-model="paramsList.heightSensorSize" placeholder="Please input" />
    </div>
		<div class="ChooseLoadEquipment">
      <span>飞行高度：</span>
			<el-input style="width: 50px" v-model="paramsList.flightAltitude" placeholder="Please input" />
    </div>
		<div class="ChooseLoadEquipment">
			<span>全局速度：</span>
			<el-input style="width: 50px" v-model="globalTransitionalSpeed" placeholder="Please input" />
		</div>
		<div class="ChooseLoadEquipment">
			<span>拍照间距：</span><el-input style="width: 50px" v-model="photoSpacing" placeholder="Please input" />米
		</div>
		<div class="ChooseLoadEquipment">航带宽度{{ groundLength }}</div>
		<div class="ChooseLoadEquipment">
			<span>重叠度：{{ overlap }}</span>
			<el-slider style="width: 150px" v-model="overlap" :step="sliderStep"/>
		</div>
		<div class="ChooseLoadEquipment">
			<button v-if="!isDrawPolygon" @click="startDrawPolygon">开始画面</button>
			<button v-if="isDrawPolygon" @click="endDrawPolygon">结束画面</button>
		</div>
		<div class="ChooseLoadEquipment">
			<button @click="computeWayLine">计算航线</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, watch, onMounted, onBeforeUnmount, defineEmits} from 'vue'
import {cancel_draw_polygon, click_draw_polygon} from '@/components/mapTools/MapDrawEntityOnMapMethod'
import * as Cesium from 'cesium'
import {
	ComputeAirBelt,
	MinRectangle
} from '@/pages/TaskDeployment/components/WaylineEdit/WayLineByPolygon/ComputeAirBelt'
import {creatAirBelt} from '@/pages/TaskDeployment/components/WaylineEdit/WayLineByPolygon/computeWayLine'
import { PolylineArrowMaterialProperty } from 'cesium'
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import { useMyStore } from '@/store'
const store = useMyStore()

const paramsList = ref<{
	photoPixelWidth: number,
	photoPixelHeight: number,
	focalLength: number,
	widthSensorSize: number,
	heightSensorSize: number
	flightAltitude: number,
}>({
	photoPixelWidth: 6240,
	photoPixelHeight: 4168,
	focalLength: 25,
	widthSensorSize: 23.5,
	heightSensorSize: 15.6,
	flightAltitude: 100,
})
// 重叠度参数
const overlap = ref(20)
let groundResolution = paramsList.value.flightAltitude  * paramsList.value.widthSensorSize / paramsList.value.focalLength
// 地面投影长度
let groundLength = ref(Number(groundResolution.toFixed(2)))
// 最小外接矩形[maxLon, minLon, maxLat, minLat, lonNum, latNum]
let minRectangle = ref<number[]>([])
// 滑块步长
let sliderStep = 0.1

const globalTransitionalSpeed = ref(10)
const photoSpacing = ref(10)

watch(overlap,(value)=>{
	// computeWayLine()
})

watch(paramsList, (value) => {
	let newParam = value.flightAltitude * value.widthSensorSize / value.focalLength
	groundLength.value = Number(newParam.toFixed(2))
	console.log(groundLength.value)
}, {deep: true})

let FlightPolygon: number[]
let isDrawPolygon = ref(false)
const startDrawPolygon = () => {
	console.log('开始画面')
	click_draw_polygon()
	isDrawPolygon.value = true
}



const endDrawPolygon = () => {
	console.log('结束画面')
	isDrawPolygon.value = false
	FlightPolygon = cancel_draw_polygon()
	//@ts-ignore
	// 最小外接矩形值
	minRectangle.value = MinRectangle(FlightPolygon)
}

watch(overlap, (value) => {
	computeWayLine()
}, {deep: true})

const computeWayLine = () => {
	let polygonPoints:any = []
  FlightPolygon.forEach((item:any)=>{
		polygonPoints.push(item[0])
		polygonPoints.push(item[1])
  })
	RemoveEntitiesByBatch(window.cesiumViewer, 'wayLinePolygon')

	window.cesiumViewer.entities.add({
    id:"wayLinePolygonLand",
    polygon: {
      hierarchy: new Cesium.CallbackProperty( () => {
				return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polygonPoints))
      }, false),
      // extrudedHeight: 0,  // 多边体的高度（多边形拉伸高度）
      // height: 10,  // 多边形离地高度
      material: Cesium.Color.YELLOW.withAlpha(0.5),
      outline:true,
      outlineColor: Cesium.Color.GREEN,
      outlineWidth: 2
    },
  });

  window.cesiumViewer.entities.add({
    id:"wayLinePolygonAir",
    polygon: {
      hierarchy: new Cesium.CallbackProperty( () => {
				return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polygonPoints))
      }, false),
      height: paramsList.value.flightAltitude,  // 多边形离地高度
      material: Cesium.Color.RED.withAlpha(0.5),
      outline:true,
      outlineColor: Cesium.Color.GREEN,
      outlineWidth: 2
    },
  });

	let polygonCoords: any[] = []
	// 面坐标Cartesian3转Cartesian2并写入
	FlightPolygon.forEach((item: any) => {
		let tmp = [item[0], item[1]]
		polygonCoords.push(tmp)
	})

	polygonCoords.push(polygonCoords[0])
	// 暂时没用
	// ComputeAirBelt(minRectangle.value, groundLength.value)
	// 生成点
	let WayLineList = creatAirBelt(polygonCoords, groundLength.value)
	let num = 0
	let positionList: number[] = []
	WayLineList.forEach((item: any, index: number) => {
		item.forEach((item2: any) => {
			// console.log('item', item2)
			window.cesiumViewer.entities.add({
				id: 'wayLinePolygonPointTmp' + num++,
				position: Cesium.Cartesian3.fromDegrees(Number(item2[0]), Number(item2[1]), Number(paramsList.value.flightAltitude)),
				point: {
					pixelSize: 5,
					color: Cesium.Color.RED,
					outlineColor: Cesium.Color.WHITE,
					outlineWidth: 2,
				},
			})
			positionList.push(item2[0])
			positionList.push(item2[1])
			positionList.push(Number(paramsList.value.flightAltitude))

		})
	})
  let positionListlength=3*num
  let i=0
  while(i<(positionListlength-1)){
    let str1=positionList[i+1]
    let str2=positionList[i+4]
    let str3=positionList[i+7]
    if(Math.abs(str2-str1)>Math.abs(str3-str1)){
      let temp1=positionList[i+3]
      let temp2=positionList[i+4]
      positionList[i+3]=positionList[i+6]
      positionList[i+4]=positionList[i+7]
      positionList[i+6]=temp1
      positionList[i+7]=temp2
    }
    i=i+6
    if(i>positionListlength-6){
      break
    }
  }
  // console.log('--------------------------------------新顺序')
  // console.log('positionList',positionList)
	sendWayLine(positionList)
  let k=0
	for (let i = 0; i < positionList.length - 3; i += 3) {
		window.cesiumViewer.entities.add({
      id: 'wayLinePolygonLine' + k,
      polyline: {
	      positions: Cesium.Cartesian3.fromDegreesArrayHeights([positionList[i], positionList[i + 1], positionList[i + 2], positionList[i + 3], positionList[i + 4], positionList[i + 5]]),
          width: 10,
          material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
	      },
    });
		k += 3
	}
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
  border-top: 0.45px solid #8a590a;
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
