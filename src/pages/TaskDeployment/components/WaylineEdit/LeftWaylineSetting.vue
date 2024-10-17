<template>
  <div class="AAA">
    <LeftNavigationBar class="custom-left-nav"></LeftNavigationBar>
    <WayPointAction ref="testRef"></WayPointAction>
  </div>

<!--  <button @click="getSonHander">测试按钮</button>-->
<!--  <button @click="zuo">左</button>-->
<!--  <button @click="you">右</button>-->
  <!--//为了测试暂时写一个按钮-->
</template>

<script setup lang="ts">
import LeftNavigationBar from "@/pages/TaskDeployment/components/WaylineEdit/LeftNavigationBar.vue";
import WayPointAction from "./WayPointAction.vue";
import {ref} from "vue";
import store from "@/store";
const testRef=ref()
const getSonHander=()=>{
  console.log(store?.state?.EditingWayLine.WayLineList?.length)
  console.log("打印航线现在的内容",store.state.EditingWayLine)
}
const zuo=()=>{
  let zuoindex=store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index
  store.commit("SWITCH_FOCUS",zuoindex-1)
  console.log("切换之前为",zuoindex,"切换之后为",store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index)
}
const you=()=>{
  let youindex=store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index
  store.commit("SWITCH_FOCUS",youindex+1)
  console.log("切换之前为",youindex,"切换之后为",store.state.EditingWayLine.FocusWayPoint?.WayPointParam?.index)
}
</script>

<style scoped>
.AAA{
  height: 100%;
  position: fixed;
  bottom: 0;
  background: white;
}
.custom-left-nav{
  position: absolute;
  left: 0;
  top:0;
  height: 50%;
}
</style>
