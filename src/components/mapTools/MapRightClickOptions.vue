<template>
	<ul :style="{left: props.rightClickValue.left + 'px', top: props.rightClickValue.top + 'px'}" class="contextmenu">
		<li v-show="isFirstPoint" @click="RightClickEventOptions('addFirstPoint')">添加首飞点</li>
		<li v-show="!isFirstPoint && isInsertPoint" @click="RightClickEventOptions('beforeRightClick')">在此点前添加航点</li>
	  <li v-show="!isFirstPoint && isInsertPoint" @click="RightClickEventOptions('afterRightClick')">在此点后添加航点</li>
	  <li v-show="!isFirstPoint" @click="RightClickEventOptions('pushRightClick')">在末尾添加航点</li>
	</ul>
</template>

<script setup lang="ts">
import { watch, ref, } from 'vue'
import { useMyStore } from '@/store'
import { SceneCoordinateToWgs84 } from '@/components/mapTools/SeniorMapTools'
import { WayLinePointsDrawing } from './MapRightClickOptionsWayLinePointsDrawing'
import * as Cesium from 'cesium'
import {InitializationWaypointFrontPosition, InitializationWaypointLastPosition} from '@/store/types/WayPoint'
const store = useMyStore()

//
const props = defineProps<{
	rightClickValue: {
    left: number,
		top: number,
		wayLineId: string,
		showRightClick: boolean,
		checkVersion: string,
	}
}>()
watch(props.rightClickValue, (val) => {
	if (val) {
    // console.log('val', val)
	}
})

// 判断是否为首个点
const isFirstPoint = ref(true)
// V1
watch( () => store?.state?.wayLinePointsDrawing, (newVal, oldVal) => {
	if (newVal.length <= 0) {
		isFirstPoint.value = true
	} else if(newVal[0].addManner === 'remove') {
		isFirstPoint.value = true
	} else {
		isFirstPoint.value = false
		const polyLineID = props.rightClickValue.wayLineId
		WayLinePointsDrawing(window.cesiumViewer, newVal, polyLineID)
	}
}, { deep: true })
// V2
watch(() => store?.state?.EditingWayLine.WayLineList, (newVal) => {
	// console.log('newVal', newVal)
	isFirstPoint.value = !(newVal === undefined || newVal.length > 0);
}, { deep: true })

function addPoint(type: string) {

	const point = SceneCoordinateToWgs84(window.cesiumViewer, props.rightClickValue.left, props.rightClickValue.top, 100)
	const sendPoint = {
		addManner: type,
		pointX: point[0],
		pointY: point[1],
		pointZ: point[2],
	}
	store.commit('SET_WAY_LINE_POINT_DRAWING', sendPoint)
}


// 判断是否有点击的点
const isInsertPoint = ref(false)
watch( () => store?.state?.wayLinePointsDrawingActive, (newVal) => {
	isInsertPoint.value = !!newVal.pointId
}, { deep: true })
// V2
watch(
  () => store?.state?.EditingWayLine.FocusWayPoint, (newValue, oldValue) => {
		isInsertPoint.value = !!newValue
  },
  { deep: true }
)


//
function RightClickEventOptions(val: string) {
	if (props.rightClickValue.checkVersion === 'wayLinePointsDrawing') {
		switch (val) {
			case 'addFirstPoint':
				addPoint('first')
				break;
			case 'beforeRightClick':
				addPoint('before')
				break;
			case 'afterRightClick':
				addPoint('after')
				break;
			case 'pushRightClick':
				addPoint('end')
				break;
			default:
				break;
		}
	} else if (props.rightClickValue.checkVersion === 'wayLinePointsDrawingV2') {
		const point = SceneCoordinateToWgs84(window.cesiumViewer, props.rightClickValue.left, props.rightClickValue.top, 100)
		const wayPointSpeed = store.state.EditingWayLine.GlobalWaylineparame?.autoFlightSpeed
		const num = store?.state?.EditingWayLine.FocusWayPoint?.WayPointParam?.index
		const executeHeight = store.state.EditingWayLine.GlobalWaylineparame?.globalHeight
		switch (val) {
			case 'addFirstPoint':
				console.log("point",1) // 首个点
				InitializationWaypointLastPosition(String([point[0], point[1]]), Number(executeHeight), Number(wayPointSpeed))
				break;
			case 'beforeRightClick':
				console.log("point",2) // 依次
				InitializationWaypointFrontPosition(String([point[0], point[1]]), Number(executeHeight), Number(wayPointSpeed), Number(num))
				break;
			case 'afterRightClick':
				console.log("point",3)
				// @ts-ignore
				if(num === store.state.EditingWayLine.WayLineList.length - 1) {
					InitializationWaypointLastPosition(String([point[0], point[1]]), Number(executeHeight), Number(wayPointSpeed))
				} else {
					InitializationWaypointFrontPosition(String([point[0], point[1]]), Number(executeHeight), Number(wayPointSpeed), Number(num) + 1)
				}
				break;
			case 'pushRightClick':
				console.log("point",4) // 末尾
				InitializationWaypointLastPosition(String([point[0], point[1]]), Number(executeHeight), Number(wayPointSpeed))
				break;
		}
	}
}
</script>

<style scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.contextmenu li:hover {
  background: #eee;
}
</style>
