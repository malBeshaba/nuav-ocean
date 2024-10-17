<template>
  <div id="selectLayer" class="selectLayer">
    <el-select v-model="value" placeholder="Select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
        @click="selectLayer(item.value)"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import { switchTianDiTuMap } from "./SwitchMapServices";
import { clearMapLayers } from "./ClearMapLayers";
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies()
const value = ref("TianDiTu3DTerrain");
onMounted(() => {
  if (cookies.get('mapLayer'))
    value.value = cookies.get('mapLayer')
  setTimeout(() => {
    selectLayer(value.value)
  }, 4000)
})
const options = [
  {
    value: "TianDiTu3DTerrain",
    label: "天地图地形",
	  disabled: false,
  },
  {
    value: "TianDiTu2DShp",
    label: "天地图矢量",
	  disabled: false,
  },
  {
    value: "Gaode2DImage",
    label: "高德影像",
	  disabled: false,
  },
  {
    value: "GaoDe2DShp",
    label: "高德矢量",
	  disabled: false,
  },
];

function selectLayer(selectvalue: string) {
  // if (selectvalue == "TianDiTu2DShp") {
  //   return
  // }

  if(selectvalue =="TianDiTu3DTerrain"){
    clearMapLayers()
    // console.log(window.cesiumViewer.imageryLayers);
    return
  }
  switchTianDiTuMap(window.cesiumViewer, selectvalue);
  // console.log(window.cesiumViewer.imageryLayers);
}
const save_cache = () => {
  cookies.set('mapLayer', value.value)
}
watch(value, () => {
  save_cache()
})
</script>

<style scoped>
.selectLayer {
	width: 128px;
	height: 50px;
	line-height: 50px;
}
:deep(.el-input) {
  --el-input-bg-color: #333;
  --el-input-text-color: #ccc;
}
</style>
