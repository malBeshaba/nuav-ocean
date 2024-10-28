<template>
  <div id="test_map" class="test_map">
    <cesium-map></cesium-map>
    <button @click="remove3DTiles">remove</button>
    <button @click="drawPolyline">drawPolyline</button>
    <button @click="drawPoint">drawPoint</button>
    <button @click="drawPolygon">drawPolygon</button>
    <button @click="removePoint">removePoint</button>
    <button @click="removePolyline">removePolyline</button>
    <button @click="removePolygon">removePolygon</button>
    <button @click="zoomToCenter">zoomToCenter</button>
    <button @click="showDrone">drawDrone</button>
	  <button @click="drawWayLine">drawWayLine</button>
	  <button @click="cancelDrawWayLine">cancelDrawWayLine</button>
	  <button @click="videoFusion">videoFusion</button>
	  <button @click="newWayPoint">testPointClass</button>
	  <button @click="emitWayPoint">emitWayPoint</button>
	  <button @click="cancelEmitWayPoint">cancelEmitWayPoint</button>
	  <button @click="clearWayPoint">clearWayPoint</button>
<!--	  <video style="width: 400px;height: 400px" id="myVideo" muted="" autoplay="" loop="" crossorigin="" controls="">-->
<!--		  <source src="webrtc://218.192.100.219/live/1581F5FJD235H00DY88C">-->
<!--	  </video>-->
	  <WebrtcPlayer v-show="false" id="myVideo" videoSrc="webrtc://218.192.100.219/live/1581F5BMD2333001VNP4"></WebrtcPlayer>
  </div>
</template>

<script setup lang="ts">
import Vue, {ref, watch, reactive} from 'vue'
import CesiumMap from '@/pages/Map/index.vue'
import * as Cesium from 'cesium'
import bus from '@/utils/bus'
import {
	DrawPolyline,
	RemoveEntitiesById,
	DrawPoint,
	DrawPolygon,
	DrawPointByBillboard,
	DrawPointByGLB
} from './mapTools/BaseMapTools'
import { CalculateTheZoomLevelAndCenter } from './mapTools/SeniorMapTools'
import { remove3DTileSet } from './mapTools/Load3DTileset'
import { DrawWayLinePoint } from './mapTools/BaseMapToolsCreatePoint'
import { onMounted } from 'vue'
import droneFlyingIcon from '@/assets/images/directedDrone3.png'
// @ts-ignore
import droneModel from '@assets/models/airDrone.glb'
import { VideoFusion } from '@/components/mapTools/class/MapVideoFusionClass'
import { WayLinePoint } from '@/components/mapTools/class/MapWayLinePointClass'
import WebrtcPlayer from '@/components/video/WebrtcPlayer.vue'
import {computed} from 'vue'
import {FlyingGlowPolylineLabel, NotFlyPolylineLabel} from '@/components/mapTools/mapMaterial/mapMaterialStyle'

const point = {
  longitude: 113.0231382461631,
  latitude: 23.135108621871483,
  height: 1500
}
onMounted(() => {

})

function drawPolyline() {
  const pointsList1 = [113.02268791320124, 23.14792830114777, 70, 113.02378411859915, 23.147718130297726, 70, 113.02693912888391, 23.148573088404905, 70]
	const polylineLabel = new Cesium.PolylineDashMaterialProperty({
		color: Cesium.Color.fromCssColorString('#65DDBC'),
		dashLength: 0.0,
		dashPattern: 255.0,
	})
	window.cesiumViewer.entities.add({
    id: '111safdsfsfvf',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointsList1, Cesium.Ellipsoid.WGS84,),
      width: 10,
      material: FlyingGlowPolylineLabel,
    },
  })
  // DrawPolyline(window.cesiumViewer, 'polyline', pointsList1, FlyingGlowPolylineLabel)
}
function drawPoint() {
  const point = [113.02239643, 23.14795861, 50]
  const pointLabel = new Cesium.PointGraphics({
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  })
	//
	// let textLabel = new Cesium.LabelGraphics({
  //   text: '111',
  //   font: '20px Helvetica',
  //   fillColor: new Cesium.Color(40, 140, 240, 1),
  //   outlineWidth: 50,
	// 	outlineColor: new Cesium.Color(0, 0, 0, 1),
  //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  // })
	// window.cesiumViewer.entities.add({
	// 	position: Cesium.Cartesian3.fromDegrees(113.02268791320124, 23.14792830114777, 70),
	// 	label: textLabel,
	// 	id: 'textLabel',
	// })
	// DrawPoint(window.cesiumViewer, 'point', point, pointLabel)
	// const pointsList1 = [113.02268791320124, 23.14792830114777, 70, 113.02268791320124, 23.14792830114777, 0]
	// const polylineLabel = new Cesium.PolylineDashMaterialProperty({
	// 	color: Cesium.Color.fromCssColorString('#65DDBC'),
	// 	dashLength: 20.0,
	// 	dashPattern: 255.0,
	// })
  // DrawPolyline(window.cesiumViewer, 'polyline', pointsList1, polylineLabel)
	DrawWayLinePoint(window.cesiumViewer, 'wayLinePoint', 1, point)
}
function drawPolygon() {
  const pointsList = [113.02268791320124, 23.14792830114777, 70, 113.02378411859915, 23.147718130297726, 70, 113.02693912888391, 23.148573088404905, 70]
  DrawPolygon(window.cesiumViewer, 'polygon', pointsList)
}
function removePolyline() {
  RemoveEntitiesById(window.cesiumViewer, 'polyline')
}

function removePoint() {
  RemoveEntitiesById(window.cesiumViewer, 'point')
	RemoveEntitiesById(window.cesiumViewer, 'textLabel')
}
function removePolygon() {
  RemoveEntitiesById(window.cesiumViewer, 'polygon')
}

function remove3DTiles() {
  remove3DTileSet(window.cesiumViewer)
}

function zoomToCenter() {
  const pointsList1 = [113.02268791320124, 23.14792830114777, 70, 113.02378411859915, 23.147718130297726, 70, 113.02693912888391, 23.148573088404905, 70]
  const pointsList2 = [113.02268791320124, 23.14792830114777, 60, 113.02378411859915, 23.147718130297726, 60, 113.02697660936244, 23.147892184448903, 60, 113.02230973249557, 23.149469584764134, 60, 113.02182473708159, 23.151866153635922, 60]
  const pointsList3 = [113.02464551941127, 23.149426282824432, 40, 113.02320712203985, 23.148759829038756, 40, 113.02167194257473, 23.148153609386846, 40, 113.02302467064662, 23.14967800929555, 40]
  const pointsList4 = [113.02459152377467, 23.148505539032165, 50, 113.01939935897163, 23.150240013101147, 50]
  let points = []
  points.push(pointsList1)
  points.push(pointsList2)
  points.push(pointsList3)
  points.push(pointsList4)
  CalculateTheZoomLevelAndCenter(window.cesiumViewer, points)
}

function showDrone() {
  const point = [113.02268791320124, 23.14792830114777, 70]
  RemoveEntitiesById(window.cesiumViewer, 'drone')
  DrawPointByBillboard(window.cesiumViewer, 'drone', point, 270, droneFlyingIcon)
}

function drawWayLine() {
	bus.emit('rightClickEvent', {
		flag:'wayLinePointsDrawing',
		wayLineId: 'emptyId',
	})
}

function cancelDrawWayLine() {
	bus.emit('rightClickEvent', {
		flag:'emptyEvent',
		wayLineId: 'empty',
	})
}

function videoFusion() {
	const testPoint = [113.02237734754951, 23.151584202019162, 140]
	const testPoint2 = [113.02209373872853, 23.147927035993092, 140]
	DrawPointByGLB(window.cesiumViewer, 'test' + 'deviceFly', testPoint2, 40, droneModel)
	let videoElement = document.getElementById('myVideo')
	const list = [113.02268791320124, 23.14792830114777, 70, 113.02378411859915, 23.147718130297726, 70, 113.02693912888391, 23.148573088404905, 70]
	const vf = new VideoFusion({
		id: 'test',
		position: Cesium.Cartesian3.fromDegrees(testPoint2[0], testPoint2[1], testPoint2[2]),
		perspectiveFrustumType: {
			fov: 90,
			near: 1,
			far: 140,
			aspectRatioWidth: 100,
			aspectRatioHeight: 200,
		},
		droneModelUri: droneModel,
		hpr: [90, 180, 0],
		videoSource: videoElement,
		show: true,
	})
	// const videoDom = document.createEvent('<WebrtcPlayer videoSrc="webrtc://218.192.100.219/live/1581F5FJD235H00DY88C"></WebrtcPlayer>')

	// console.log('11', videoDom)
	let i = 0.0001
	setInterval(() => {
		i += 0.0001
		vf.update(Cesium.Cartesian3.fromDegrees(testPoint2[0], testPoint2[1] + i, testPoint2[2]), [90, 180, 0],{
			fov: 90,
			near: 1,
			far: 140,
			aspectRatioWidth: 100,
			aspectRatioHeight: 200,
		}, true)
	}, 100)
}

let testWayPoint: WayLinePoint
let testWayPoint2: WayLinePoint
const newWayPoint = () => {
	const testPoint = {
		longitude: 113.02237734754951,
		latitude: 23.151584202019162,
		height: 140}
	const testPoint2 = {
		longitude: 113.02278751,
		latitude: 23.14818363,
		height: 140}
	testWayPoint = new WayLinePoint({
		id: 'test',
		position: testPoint,
		textValue: '1',
		isEmit: false,
		mapViewer: window.cesiumViewer,
	})
	testWayPoint2 = new WayLinePoint({
		id: 'test2dsadgas',
		position: testPoint2,
		textValue: '2',
		isEmit: false,
		mapViewer: window.cesiumViewer,
	})
	console.log('testWayPoint', testWayPoint)
}

const emitWayPoint = () => {
	if (testWayPoint) {
		testWayPoint.moveActionEntity(true)
	}
	if(testWayPoint2) {
		testWayPoint2.moveActionEntity(true)
	}
}

const cancelEmitWayPoint = () => {
	if (testWayPoint) {
		testWayPoint.moveActionEntity(false)
	}
	if(testWayPoint2) {
		testWayPoint2.moveActionEntity(false)
	}
}

const clearWayPoint = () => {
	if (testWayPoint) {
		testWayPoint.clear()
	}
}

</script>

<style scoped>
.test_map {
  position: absolute;
  width: 1500px;
  height: 900px;
  border: 1px solid #000
}
</style>
