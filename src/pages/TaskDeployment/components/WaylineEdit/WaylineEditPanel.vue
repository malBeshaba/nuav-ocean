<template>
  <div class="way_line_edit_panel">
    <cesium-map style="width: 100%; height: 100%; position:fixed" />
    <Topsection :waylineId="waylineId" :waylineFileId="waylineFileId"></Topsection>
    <LeftWaylineSetting ></LeftWaylineSetting>
    <toolbox></toolbox>
    <aerial-view-map class="aerial_view_map"></aerial-view-map>
  </div>
</template>

<script setup lang="ts">
import CesiumMap from '@/pages/Map/index.vue'
import Topsection from "./TopSection.vue";
import LeftWaylineSetting from "./LeftWaylineSetting.vue";
import Toolbox from "@/pages/TaskDeployment/components/WaylineEdit/Toolbox.vue";
import { useMyStore } from '@/store'
import { onMounted, reactive,ref, onBeforeUnmount } from "vue";
import {WayLineGlobalParams} from "@/store/types/wayline";
import {WayLineV2} from "@/store/types/WayLineV2";
import LeftNavigationBar from "@/pages/TaskDeployment/components/WaylineEdit/LeftNavigationBar.vue";
const centerDialogVisible=ref(true)
import AerialViewMap from "@/pages/Map/components/AerialView/InitAerialViewMap.vue";
import { useRoute, useRouter } from 'vue-router';
import bus from '@/utils/bus'
import {getWaylinePointByWaylineId} from "@/api/wayLinePoint"
import {InitializationWaypointByWaylineInfo} from '@/store/types/WayPoint.ts'
const route = useRoute();
const router = useRouter();
const store = useMyStore()
onMounted(() => {
  const name = route.query.name
  const dronetype = route.query.drone_type
  // centerDialogVisible.value=true
  store.state.EditingWayLine={} as WayLineV2
  // 在初始化航线的时候先初始化一个全局航线参数
  let temglobalpara={
    flyToWaylineMode:"safely",
    finishAction:"goHome",
	  autoFlightSpeed: 10,
    exitOnRCLost:"executeLostAction",
    executeRCLostAction:"goBack",
    takeOffSecurityHeight:100.0,
    globalTransitionalSpeed:5.0,
    globalRTHHeight:100.0,
	  globalHeight: 100,
    droneInfo:{
      droneEnumValue:67,
      droneSubEnumValue:1
    },
    payloadInfo:{
      payloadEnumValue:53,
      payloadSubEnumValue:0,
      payloadPositionIndex:0,
    }
  } as WayLineGlobalParams
  store.commit("UPDATE_WAYLINE_GLOBAL_INFO",temglobalpara)
  store.state.EditingWayLine.WayLineList=[]
  store.state.EditingWayLine.FocusWayPoint={}
  store.state.EditingWayLine.WayLineInfo={}
  store.state.EditingWayLine.WayLineInfo.waylineName=name
  store.state.EditingWayLine.DroneName=dronetype
  store.state.EditingWayLine.PayLoadName="M300相机"
  console.log("已经初始化了航线的信息")
	bus.emit('rightClickEvent', {
		flag: 'wayLinePointsDrawingV2',
		waylineId: 'wayLinePointsDrawingV2'
	})
    if (route.query.waylineId) {
      // 如果有航线id，说明是编辑航线
      //   console.log("-------------------------","编辑航线")
      getWaylinePointByWaylineId(route.query.waylineId as string).then((res) => {
        // console.log("获取到航线高度",res.data.templateContent.Folder.globalHeight)
        // console.log("获取到航线内容",res)
        temglobalpara.globalHeight=res.data.templateContent.Folder.globalHeight
        // console.log("初始化航线", temglobalpara)
        if (res.code === 0) {
          InitializationWaypointByWaylineInfo(res.data.templateContent.Folder.placemark)
        }
      })
    }

})

const waylineId = ref(route.query.waylineId as string);
const waylineFileId = ref(route.query.waylineFileId as string);
onBeforeUnmount( () => {
	store.commit('SET_NAVIGATION_TYPE', true)
	bus.emit('rightClickEvent', {
    flag: 'emptyEvent',
    wayLineId: 'emptyEvent'
  })
})
</script>

<style scoped>
.aerial_view_map {
  width: 350px;
  height: 250px;
  position: absolute;
  right: 280px;
  top: 80px;
  z-index: 2;
}
</style>
