<template>
  <div class="SwitchTwoThreeDimensional">
    <el-switch v-model="switchDimensional" @change="switch2D3D(switchDimensional)" inline-prompt active-text="3D" active-value="3D" inactive-text="2D" inactive-value="2D" />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import * as Cesium from 'cesium'
import {CesiumFlyTo} from '@/components/mapTools/BaseMapTools'
import {useMyStore} from "@/store";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies()
const store = useMyStore()
const switchDimensional = ref('2D')
const point3D = {
  longitude: 113.0231382461631,
  latitude: 23.135108621871483,
  height: 1500
}
const point2D = {
  longitude: 113.02278858950362,
  latitude: 23.147962919948775,
  height: 1500
}
function switch2D3D(value:string) {
	const screenCenter = new Cesium.Cartesian2(window.cesiumViewer.canvas.clientWidth / 2, window.cesiumViewer.canvas.clientHeight / 2)
  const mapState = store.state.mapState.mapCameraAttribute
  let cartesian33 = new Cesium.Cartesian3(mapState.cameraPosition.x, mapState.cameraPosition.y, mapState.cameraPosition.z)
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian33)
  let longitude = Cesium.Math.toDegrees(cartographic.longitude)
  let latitude = Cesium.Math.toDegrees(cartographic.latitude)
  let height = cartographic.height
  // let cartographic = Cesium.Cartographic.fromCartesian(centerPosition)
  if (value === '3D') {
    CesiumFlyTo(window.cesiumViewer, {longitude: longitude, latitude: latitude, height: height})
    window.cesiumViewer.scene.screenSpaceCameraController.enableTilt = true
  } else {
    CesiumFlyTo(window.cesiumViewer, {longitude: longitude, latitude: latitude, height: height}, Cesium.Math.toRadians(-90))
    window.cesiumViewer.scene.screenSpaceCameraController.enableTilt = false
  }
}
const save_cache = (val: string) => {
  cookies.set('23D', val)
}
watch(() => switchDimensional.value, (val) => {
  save_cache(val)
})
onMounted(() => {
  if (cookies.get('23D')) {
    switchDimensional.value = cookies.get('23D')
    switch2D3D(switchDimensional.value)
  }
})
</script>

<style scoped lang="scss">
.SwitchTwoThreeDimensional {
  width: 40px;
  height: 30px;
  line-height: 30px;
}
</style>
