<template>
  <div @contextmenu.prevent="choseRightMenu($event)" class="cesium_map" id="cesium_map">
    <right-click-options v-show="rightClickValue.showRightClick" :rightClickValue="rightClickValue"></right-click-options>
    <real-time-coordinate-display v-show="showMapTool" class="map_real_time_coordinate_display"></real-time-coordinate-display>
	  <flight-controller v-show="isEdit" class="flight_controller"></flight-controller>
	  <add-way-point-action-panel v-show="isEdit" class="add_way_point_action_panel"></add-way-point-action-panel>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import { initMap } from "@/components/mapTools/InitMap";
import { onMounted } from "vue";
import bus from '@/utils/bus'
import {
	CesiumFlyTo,
} from "@/components/mapTools/BaseMapTools";
import { watchCameraAttribute } from "@/components/mapTools/SeniorMapTools";
import { switchTianDiTuMap} from "@/components/mapTools/SwitchMapServices";
import { actionEntity, movePoint } from './components/cesiumViewer/MapMouseEvent'
import RightClickOptions from "@/components/mapTools/MapRightClickOptions.vue";
import RealTimeCoordinateDisplay from "@/components/mapTools/MapRealTimeCoordinateDisplay.vue";
import FlightController from '@/pages/Map/components/cesiumViewer/FlightController.vue'
import AddWayPointActionPanel from '@/pages/TaskDeployment/components/WayPoint/AddWayPointActionPanel.vue'
import { TilesetData } from '@/components/mapTools/class/Map3DtilesetClass'
import * as Cesium from 'cesium'
import {useMyStore} from '@/store'
import CesiumNavigation from 'cesium-navigation-es6'
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies()
const store = useMyStore()

onMounted(() => {
  window.addEventListener('beforeunload', save_cache)
  window.addEventListener('unload', save_cache)
  // 初始化地图
  initMap("cesium_map");
  // 设置中心点

  const centerPosition = import.meta.env.VITE_MAP_CENTER_POSITION.split(',')
  if (cookies.get('mapState')) {
    const mapState = cookies.get('mapState') as any
    console.log('mapState',mapState)
    let cartesian33 = new Cesium.Cartesian3(mapState.x, mapState.y, mapState.z)
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian33)
    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
    let height = cartographic.height
    CesiumFlyTo(window.cesiumViewer, {
      longitude: Number(longitude),
      latitude: Number(latitude),
      height: Number(height)
    }, Cesium.Math.toRadians(-90));
		(window as any).cesiumViewer.scene.screenSpaceCameraController.enableTilt = false
  } else {
    CesiumFlyTo(window.cesiumViewer, {
			longitude: Number(centerPosition[0]),
	    latitude: Number(centerPosition[1]),
	    height: Number(centerPosition[2])},
	    Cesium.Math.toRadians(-90));
		(window as any).cesiumViewer.scene.screenSpaceCameraController.enableTilt = false
  }
	//
	const NorthOptions = <any> {
		defaultResetView: Cesium.Cartographic.fromDegrees(Number(centerPosition[0]), Number(centerPosition[1]), Number(centerPosition[2])),
		enableZoomControls: false,
	}
	new CesiumNavigation(window.cesiumViewer, NorthOptions)
  // 选择地图底图
  switchTianDiTuMap(window.cesiumViewer, "TianDiTu3DTerrain");
  // 监听相机参数变化
  watchCameraAttribute(window.cesiumViewer, "cesiumViewer");
  // 加载3D倾斜摄影
  // get3DTiles();

	// 监听地图元素点击事件
	actionEntity(window.cesiumViewer)
	movePoint(window.cesiumViewer)
  // DrawDock(window.cesiumViewer);
});
const save_cache = () => {
  const mapState = store.state.mapState.mapCameraAttribute
  cookies.set('mapState', JSON.stringify({
    x: mapState.cameraPosition.x,
    y: mapState.cameraPosition.y,
    z: mapState.cameraPosition.z,
    cameraHeading: mapState.cameraHeading,
    cameraRoll: mapState.cameraRoll,
    cameraPitch: mapState.cameraPitch
  }))
}
function get3DTiles() {
	const tileSetURL = import.meta.env.VITE_SCNU_3DTILESET_URL
	const url = 'http://localhost/static/scnu3D2/tileset.json'
	let tileset = new TilesetData({
		id: 'scnu',
		tilesetUrl: tileSetURL,
		mapViewer: window.cesiumViewer,
		show: true,
	})
	console.log('tileset', tileset)
}

const rightClickValue = reactive({
  left: 0,
  top: 0,
  showRightClick: false,
	wayLineId : 'empty',
	checkVersion: '',
});

let isEdit = ref(false)
let isEditV2 = ref(false)
// 添加右键事件
let isRightClick = ref('emptyEvent')
bus.on('rightClickEvent', (val: any) => {
	isRightClick.value = val.flag
	rightClickValue.wayLineId = val.wayLineId
	if (val.flag === 'wayLinePointsDrawing') {
		isEdit.value = true
	}	else if (val.flag === 'emptyEvent') {
		isEdit.value = false
		store.commit('CLEAR_WAY_LINE_POINT_DRAWING', 'clear')
	} else if (val.flag === 'wayLinePointsDrawingV2') {
		isEditV2.value = true
	}

})

const sendRightValue = (e: any) => {
	let x = e.layerX;
  let y = e.layerY;
	rightClickValue.checkVersion = isRightClick.value
  rightClickValue.left = x;
  rightClickValue.top = y;
  rightClickValue.showRightClick = true;
}
function choseRightMenu(e: any) {
	switch (isRightClick.value) {
		case 'emptyEvent':
		break
		case 'wayLinePointsDrawing':
			sendRightValue(e)
		break
		case 'wayLinePointsDrawingV2':
			sendRightValue(e)
		break
	}
}
watch(rightClickValue, (value) => {
  if (value.showRightClick) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});


function closeMenu() {
  rightClickValue.showRightClick = false;
}

// 监听地图工具栏显示
const showMapTool = ref(true)
watch(store?.state?.mapToolShow, (value) => {
  const classDom = document.getElementsByClassName('compass')[0];
  const distanceLegendDom = document.getElementsByClassName('distance-legend')[0];

  if (classDom) {
    classDom.style.display = value.type ? 'block' : 'none';
  }

  if (distanceLegendDom) {
    distanceLegendDom.style.display = value.type ? 'block' : 'none';
  }
}, { deep: true, immediate: true });

</script>

<style scoped>

.cesium_map {
	position: relative;
	overflow: hidden;
}

.cesium_map .switch_two_three_dimensional {
  position: absolute;
  bottom: 5px;
  right: 30px;
  z-index: 1;
}

.cesium_map .map_real_time_coordinate_display {
  position: absolute;
  bottom: 2px;
  right: 100px;
  z-index: 1;
}
.cesium_map .go_home {
	position: absolute;
	bottom: 2px;
	right: 80px;
	z-index: 1;
}

.cesium_map .map_north_arrow {
  position: absolute;
  bottom: 50px;
  right: 30px;
  z-index: 1;
}

.cesium_map .select_layer {
  position: absolute;
  bottom: 150px;
  right: 25px;
  z-index: 1;
}

.cesium_map .map_show_nofly_zone{
  position: absolute;
	bottom: 250px;
	right: 110px;
	z-index: 1;
}

.cesium_map .range_layer {
  position: absolute;
  bottom: 150px;
  right: 25px;
  z-index: 1;
}

.cesium_map .flight_controller {
  position: absolute;
  bottom: 20px;
  right: 500px;
  z-index: 1;
}

.cesium_map .add_way_point_action_panel {
  position: absolute;
  bottom: 120px;
  right: 100px;
  z-index: 1;
}

.cesium_map .draw_entity_on_map {
  position: absolute;
  bottom: 180px;
  right: 25px;
  z-index: 1;
}

.cesium_map .show_and_hide3d_tileset {
	position: absolute;
	bottom: 320px;
	right: 25px;
	z-index: 1;
	height: 20px;
}

:deep(.compass) {
	position: absolute;
	top: 86%;
	right: 25px;
	width: 100px;
	height: 100px;
}

:deep(.distance-legend) {
	bottom: 4px;
  right: 350px;
}

</style>
