<template>
	<div class="north_arrow">
		<img id="north_arrow_image" class="north_arrow_image" :src="northArrowImage" @click="MapBackToTheMiddle" alt="" />
	</div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import northArrowImage from '@/assets/map/MapNorthArrow.png'
import {useMyStore} from '@/store'
import * as Cesium from 'cesium'
import CesiumNavigation from 'cesium-navigation-es6'

const store = useMyStore()

watch(() => store.state.mapState.mapCameraAttribute.cameraHeading,
	(value) => {
	let northArrow = 360 - Cesium.Math.toDegrees(value)
	let element = document.getElementById('north_arrow_image')!
	element.style.transform = `rotate(${northArrow}deg)`
})

const MapBackToTheMiddle = () => {
	// const cameraPosition = window.cesiumViewer.camera.position
	const pitch = window.cesiumViewer.camera.pitch
	const roll = window.cesiumViewer.camera.roll
	// const cameraDirection = window.cesiumViewer.scene.camera.direction
	const screenCenter = new Cesium.Cartesian2(window.cesiumViewer.canvas.clientWidth / 2, window.cesiumViewer.canvas.clientHeight / 2)
  const centerPosition = window.cesiumViewer.scene.globe.pick(window.cesiumViewer.camera.getPickRay(screenCenter), window.cesiumViewer.scene)
  let cartographic = Cesium.Cartographic.fromCartesian(centerPosition)
	console.log('111', cartographic.height)
	window.cesiumViewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude) - 0.02, 1500),
		orientation: {
			heading: Cesium.Math.toRadians(0),
			pitch: pitch,
			roll: roll
		}
	})
	let element = document.getElementById('north_arrow_image')!
	element.style.transform = `rotate(0 deg)`
}

</script>

<style scoped>
.north_arrow {
		width: 40px;
		height: 40px;
}
.north_arrow_image {
		width: 100%;
		height: 100%;
}
</style>
