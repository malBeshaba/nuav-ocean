<template>
<!--  <div id="cesiumContainer"></div>-->
<!--  <div style="position: absolute; top: 200px; right: 100px; z-index: 99">-->
<!--    <el-button class="edit" @click="measurePolyLine">测量距离</el-button>-->
<!--    <el-button class="edit" @click="measurePolygon">测量面积</el-button>-->
<!--    <el-button class="edit" @click="measureHeight">测量高度</el-button>-->
<!--    <el-button class="edit" @click="destory">结束测量</el-button>-->
<!--  </div>-->
  <div id="rangeLayer" class="rangeLayer">
    <el-select v-model="value" placeholder="rangeSelect" placement = "top-start">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
          @click="selectMeasure(item.id)"
      />
    </el-select>
  </div>
</template>


<script setup lang="ts">
import * as Cesium from "cesium";
import {onMounted, reactive, ref} from "vue";
import {
  measureDistance,
  measureLength,
  measureArea,
  measureH,
  deleteAll,
  measureSquare
} from "@/components/mapTools/MeasureMap";

import {RemoveAllEntities} from "@/components/mapTools/BaseMapTools";

const value = ref("measurePolyLine");
const options = [
  {
    value: "measurePolyLine",
    label: "空间测距",
    id:1,
    disabled: false,
  },
  {
    value: "measureLength",
    label: "平面测距",
    id:2,
    disabled: false,
  },
  {
    value: "measurePolygon",
    label: "空间测面",
    id:3,
    disabled: false,
  },
  {
    value: "measureSquare",
    label: "平面测面",
    id:4,
    disabled: false,
  },
  {
    value: "measureHeight",
    label: "测量高度",
    id:5,
    disabled: false,
  },
  {
    value: "destory",
    label: "清除测量",
    id:6,
    disabled: false,
  },
  {
    value: "removeAll",
    label: "清除实体",
    id:7,
    disabled: false,
  },
];

function selectMeasure(ID: any){
  if(ID===1){
    measureDistance(window.cesiumViewer)
  }
  else if(ID===2){
    measureLength(window.cesiumViewer)
  }
  else if(ID===3){
    measureArea(window.cesiumViewer)
  }
  else if(ID===4){
    measureSquare(window.cesiumViewer)
  }else if(ID===5){
    measureH(window.cesiumViewer)
  }else if(ID===6){
    deleteAll(window.cesiumViewer)
  }
  else if(ID===7){
    RemoveAllEntities(window.cesiumViewer)
  }
}
// function measurePolyLine(){
//   measureDistance(window.cesiumViewer)
// }
//
// function measurePolygon() {
//   measureArea(window.cesiumViewer)
// }
//
// function measureHeight() {
//   measureH(window.cesiumViewer)
// }
// function destory(){
//   deleteAll(window.cesiumViewer)
// }

</script>



<style scoped>
#cesiumContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.edit {
  background-color: rgba(51, 51, 51);
}
.rangeLayer {
  width: 128px;
  height: 100px;
  line-height: 50px;
}
:deep(.el-input) {
  --el-input-bg-color: #333;
  --el-input-text-color: #ccc;
}
</style>
