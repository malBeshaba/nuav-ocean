<template>
	<div>
		<video style="width: 400px;height: 400px" id="myVideo" muted="" autoplay="" loop="" crossorigin="" controls="">
		  <source src="http://218.192.100.219:8080/live/livestream3/output.mp4" type="video/mp4">
	  </video>
	</div>
</template>

<script setup lang="ts">

import { VideoFusion } from '@/components/mapTools/class/MapVideoFusionClass'
import Cesium from 'cesium'

let videoElement = document.getElementById('myVideo')
const vf = new VideoFusion({
	id: 'test',
	position: Cesium.Cartesian3.fromDegrees(113.02369791320124, 23.14792830114777, 120),
	perspectiveFrustumType: {
		fov: 90,
		near: 1,
		far: 120,
		aspectRatioWidth: 400,
		aspectRatioHeight: 500,
	},
	hpr: [90, 180, 0],
	videoSource: videoElement,
})

</script>

<style scoped>

</style>
