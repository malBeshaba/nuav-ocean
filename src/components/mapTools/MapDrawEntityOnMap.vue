<template>
	<div class="draw_polygon">
		<el-select v-model="value" placeholder="Select">
			<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
				:disabled="item.disabled"
				@click="selectDrawType(item.value)"
			></el-option>
		</el-select>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as Cesium from 'cesium'
import {click_draw_polygon,cancel_draw_polygon} from './MapDrawEntityOnMapMethod'

const value = ref('draw_polygon')
const options = [
	{
		value: 'draw_polygon',
		label: '画面',
		disabled: false,
	},
	{
		value: 'draw_line',
		label: '画线',
		disabled: false,
	},
  {
    value:"cancel_draw",
    label: "取消绘制",
    disabled: false
  }
]

const selectDrawType = (value: string) => {
	// console.log(value)
  switch (value){
    case "draw_line":
      //draw_line function
      break;
    case "draw_polygon":
      // draw_polygon function
      click_draw_polygon()
      break;
    case"cancel_draw":
      console.log(cancel_draw_polygon());
  }
}
</script>

<style scoped>
.draw_polygon {
	width: 128px;
	height: 50px;
	line-height: 50px;
}
:deep(.el-input) {
  --el-input-bg-color: #333;
  --el-input-text-color: #ccc;
}
</style>
