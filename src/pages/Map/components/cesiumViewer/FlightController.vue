<template>
	<div class="flight_controller">
		<div class="controller">
      <img src="@/assets/map/pic1.png" class="pic1" alt="">
        <div class="topmost">
          <span @mousedown="controllerClick('left_ward')" class="controller_item leftWard" >
				  Q
			  </span>
          <span @mousedown="controllerClick('front')" class="controller_item">
				  W
			  </span>
          <span @mousedown="controllerClick('right_ward')" class="controller_item">
				  E
			  </span>
        </div>
        <div class="below">
          <span @mousedown="controllerClick('left')" class="controller_item">
          A
        </span >
          <span @mousedown="controllerClick('back')" class="controller_item">
          S
        </span>
          <span @mousedown="controllerClick('right')" class="controller_item">
          D
        </span>
        </div>
      <img src="@/assets/map/pic2.png" class="pic2" alt="">
		</div>
		<div class="yam">
			<div class="dialImageDiv">
				<img id="dialImage" class="dialImage" src="@/assets/map/MapFlightControllerDial.svg" alt="">
			</div>
		</div>
		<div class="controller_height">
<!--			<span class="controller_item">-->
<!--				left-->
<!--			</span>-->

      <img src="@/assets/map/front.png" class="pic1" alt="">
			<div class="topmost-right">
        <div @mousedown="controllerClick('up')" class="controller_item">
          c
        </div>
      </div>
<!--			<span class="controller_item">-->
<!--				right-->
<!--			</span>-->
      <div class="below-right">
        <div @mousedown="controllerClick('down')"  class="controller_item">
          z
        </div>
      </div>
      <img src="@/assets/map/back.png" class="pic2" alt="">
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { useMyStore } from '@/store'
import { DrawFlightControllerGLB,DrawFlightControllerFRU } from '@/components/mapTools/FlightControllerDrawElement'
import * as Cesium from 'cesium'
import ImageDial from '@/assets/map/MapFlightControllerDial.svg'
import ImageDroneController from '@/assets/images/directedDrone.png'
import { CreateFrustum } from "@/components/mapTools/FlightControllerDrawFrustum";

const store = useMyStore()

let flightControllerID = 'flightController'
let droneRotation = ref(360)

let createFrustum:any=null;

watch( () => store?.state?.wayLinePointsDrawingActive, (newVal) => {
  // 当航点切换时，进行鹰眼图的setView,只更新相机的位置
  window.aerialView.camera.setView({
    destination:Cesium.Cartesian3.fromDegrees(newVal.pointX, newVal.pointY, newVal.pointZ),
  })

  if(createFrustum!=null){
    createFrustum.clear();
    createFrustum =null;
  }
	flightControllerID = 'wayLineDrawingFlightController'
	DrawFlightControllerGLB(window.cesiumViewer, flightControllerID, [newVal.pointX, newVal.pointY, newVal.pointZ], droneRotation.value, ImageDroneController)
  createFrustum = DrawFlightControllerFRU(window.cesiumViewer, droneRotation.value,createFrustum)
})

watch( () => store?.state?.wayLinePointsDrawing, (newVal) => {
	if(newVal?.length > 0 && newVal[0].addManner === 'remove') {
		if(createFrustum!=null){
	    createFrustum.clear();
	    createFrustum =null;
    }
	}
}, { deep: true, immediate: true })

function controllerClick(val:string) {
  if(createFrustum != null){
      createFrustum.clear();
      createFrustum =null;
  }
	switch (val) {
		case 'left_ward':
			droneRotation.value = (droneRotation.value - 10) % 360
			let elementLeft = document.getElementById('dialImage')!
			elementLeft.style.transform = `rotate(${droneRotation.value}deg)`
			DrawFlightControllerGLB(window.cesiumViewer, flightControllerID, [store.state.wayLinePointsDrawingActive.pointX, store.state.wayLinePointsDrawingActive.pointY, store.state.wayLinePointsDrawingActive.pointZ], 360 - droneRotation.value, ImageDroneController)
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
			break;
    case 'front':
      window.aerialView.camera.moveUp(1);
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
      break;
    case "left":
      window.aerialView.camera.moveLeft(1);
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
      break;
    case "back":
      window.aerialView.camera.moveDown(1);
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
      break;
    case "right":
      window.aerialView.camera.moveRight(1);
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
      break;
		case 'up':
      window.aerialView.camera.moveBackward(1);
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
      break;
      // droneRotation.value = (droneRotation.value) % 360
      // let elementUp = document.getElementById('dialImage')!
      // elementUp.style.transform = `rotate(${droneRotation.value}deg)`
      // DrawFlightControllerGLB(window.cesiumViewer, flightControllerID, [store.state.wayLinePointsDrawingActive.pointX, store.state.wayLinePointsDrawingActive.pointY, store.state.wayLinePointsDrawingActive.pointZ+10], 360 - droneRotation.value, ImageDroneController)
		case 'right_ward':
			droneRotation.value = (droneRotation.value + 10) % 360
			let elementRight = document.getElementById('dialImage')!
			elementRight.style.transform = `rotate(${droneRotation.value}deg)`
			DrawFlightControllerGLB(window.cesiumViewer, flightControllerID, [store.state.wayLinePointsDrawingActive.pointX, store.state.wayLinePointsDrawingActive.pointY, store.state.wayLinePointsDrawingActive.pointZ], 360 - droneRotation.value, ImageDroneController)
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
			break;
    case 'down':
      window.aerialView.camera.moveForward(1);
      createFrustum = DrawFlightControllerFRU(window.cesiumViewer, 360 - droneRotation.value,createFrustum)
      break;
		default:
			break;

	}
}



</script>

<style scoped>
.flight_controller {
  width: 453px;
  height: 190px;
  text-align: center;
  display: block;
  border: 1px solid #8a590a;
}

.flight_controller .controller {
  width: 110px;
  height: 190px;
  float: left;
}

.flight_controller .controller .pic1 {
  z-index: 1;
  position: relative;
  top: 0px;
  width: 100%;
}

.flight_controller .controller .pic2 {
  z-index: 1;
  position: relative;
  bottom: -20px;
  right: 7px;
  width: 110%;
}

.flight_controller .controller .below {
  position: relative;
  top: 43px;
  background-color: rgba(8, 17, 14, 0.8);
  width: 110px;
  height: 60px;
  float: bottom;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-clip: padding-box;
}

.flight_controller .controller .below .controller_item {
  width: 30px;
  height: 22px;
  margin: 5px;
  cursor: pointer;
  background-color: rgba(60, 60, 60, 0.8);
  position: relative;
  bottom: 8px;
}

.flight_controller .controller .topmost {
  position: relative;
  top: -26px;
  background-color: rgba(8, 17, 14, 0.8);
  width: 110px;
  height: 60px;
  float: top;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-clip: padding-box;
}

.flight_controller .controller .topmost .controller_item {
  width: 35px;
  height: 35px;
  margin: 5px;
  cursor: pointer;
  background-color: rgba(60, 60, 60, 0.8);
  position: relative;
  top: 8px;
}

.flight_controller .yam {
  width: 230px;
  height: 190px;
  line-height: 190px;
  float: left;
  border: 1px solid #3980e8;
}

.flight_controller .yam .dialImageDiv {
  border: 2px solid #2b85e4;
  width: 150px;
  height: 150px;
  display: inline-block;
  vertical-align: middle;
  border-radius: 50%;
  box-shadow: 0 0 5px #2b85e4;
  overflow: hidden;
  position: relative;
}

.flight_controller .yam .dialImage {
  width: 150px;
  height: 150px;
}

.flight_controller .yam .dialImageDiv::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 97px;
  height: 97px;
  z-index: -1;
  border: rgba(0, 0, 0, 0.5) 27px solid;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.flight_controller .controller_height {
  width: 110px;
  height: 190px;
  float: right;
}

.flight_controller .controller_height .pic1 {
  z-index: 1;
  position: relative;
  top: 0px;
  width: 40%;
}

.flight_controller .controller_height .pic2 {
  z-index: 1;
  position: relative;
  bottom: -22px;
  width: 50%;
}

.flight_controller .controller_height .topmost-right {
  position: relative;
  top: -25px;
  background-color: rgba(8, 17, 14, 0.8);
  width: 50px;
  height: 60px;
  float: top;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-align: center;
  border-radius: 7px;
  background-clip: padding-box;
}

.flight_controller .controller_height .topmost-right .controller_item {
  width: 30px;
  height: 22px;
  margin: 5px;
  cursor: pointer;
  background-color: rgba(60, 60, 60, 0.8);
  position: relative;
  top: 8px;
  font-size: 20px;
  line-height: 19px;
}

.flight_controller .controller_height .below-right {
  position: relative;
  bottom: -44px;
  background-color: rgba(8, 17, 14, 0.8);
  width: 50px;
  height: 60px;
  float: top;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-align: center;
  border-radius: 7px;
  background-clip: padding-box;
}

.flight_controller .controller_height .below-right .controller_item {
  width: 30px;
  height: 22px;
  margin: 5px;
  cursor: pointer;
  background-color: rgba(60, 60, 60, 0.8);
  position: relative;
  bottom: 8px;
  font-size: 20px;
  line-height: 19px;
}
</style>
