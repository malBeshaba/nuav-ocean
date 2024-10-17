<template>
	<div class="aerial_view" id="aerial_view">
<!--		<img class="move_aerial_map" :src="moveMapAerialImage" alt="" @click="mapMove" />-->
<!--		<hand-off-map-aerial class="hand_off_map_aerial"></hand-off-map-aerial>-->
	</div>
</template>

<script setup lang="ts">
import { onMounted, } from 'vue'
import { initAerialView } from '@/components/AerialViewTools/InitAerialViewMap'
import { switchTianDiTuMap } from "@/components/mapTools/SwitchMapServices";
import HandOffMapAerial from '@/components/AerialViewTools/HandOffMapAerial.vue'
import moveMapAerialImage from '@/assets/map/aerialviewmove.png'
import {CesiumFlyTo} from '@/components/mapTools/BaseMapTools'
import * as Cesium from 'cesium'
import {TilesetData} from '@/components/mapTools/class/Map3DtilesetClass'

onMounted(() => {
	initAerialView('aerial_view')
	switchTianDiTuMap(window.aerialView, "TianDiTu3DTerrain");
	const centerPosition = import.meta.env.VITE_MAP_CENTER_POSITION.split(',')
  // CesiumFlyTo(window.aerialView, {longitude: Number(centerPosition[0]), latitude: Number(centerPosition[1]), height: Number(centerPosition[2])});
	window.aerialView.camera.setView({
		destination: Cesium.Cartesian3.fromDegrees(Number(centerPosition[0]), Number(centerPosition[1]), Number(centerPosition[2])),

	})
  // get3DTiles()
})

function get3DTiles() {
	const tileSetURL = import.meta.env.VITE_SCNU_3DTILESET_URL
	const url = 'http://localhost/static/scnu3D2/tileset.json'
	let tileset = new TilesetData({
		id: 'scnu',
		tilesetUrl: tileSetURL,
		mapViewer: window.aerialView,
		show: true,
	})
	console.log('tileset', tileset)
}

const mapMove = () => {
	console.log('mapMove')
}
</script>

<style scoped lang="scss">
@import "//at.alicdn.com/t/c/font_3880304_vpf4pcfgb3l.css";
.aerial_view {
  position: relative;
	border: 2px solid $LightColor;
	border-radius: 5px;
}

.aerial_view .hand_off_map_aerial {
  position: absolute;
  width: 30px;
  height: 20px;
  left: 50px;
  top: 10px;
  z-index: 1;
}
.move_aerial_map {
	position: absolute;
  width: 30px;
  height: 20px;
  left: 10px;
  top: 10px;
  z-index: 1;
}
</style>
