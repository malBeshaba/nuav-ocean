<template>
	<span class="real_time_coordinate">
		{{ longitude }} , {{ latitude }}
	</span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as Cesium from 'cesium'

let longitude = ref(0)
let latitude = ref(0)
onMounted(() => {
  setTimeout(() => {
    getCoordinate(window.cesiumViewer)
	}, 1000)
	// getCoordinate(window.cesiumViewer)
})

function getCoordinate(mapViewer:Cesium.Viewer) {
	let canvas = mapViewer.scene.canvas
	let ellipsoid = mapViewer.scene.globe.ellipsoid
	let handler = new Cesium.ScreenSpaceEventHandler(canvas)
	handler.setInputAction((movement: any) => {
		let cartesian = mapViewer.camera.pickEllipsoid(movement.endPosition, ellipsoid)
		if(cartesian) {
			let cartographic = mapViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
			let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
			let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
			longitude.value = Number(lon)
			latitude.value = Number(lat)
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

</script>

<style scoped>
.real_time_coordinate {
	width: 280px;
  height: 30px;
	line-height: 30px;
	text-align: center;
}
</style>
