<template>
	<div class="map_go_home">
		<el-popover
			placement="top"
			width="200"
			trigger="hover"
			content="回到初始位置">
			<template #reference>
				<img :src="goHomeIcon" class="go_home_icon" @click="goHomeMap" alt="" />
			</template>
		</el-popover>

	</div>
</template>

<script setup lang="ts">
import goHomeIcon from '@/assets/map/gohome.png'
import * as Cesium from 'cesium'
import {CesiumFlyTo} from '@/components/mapTools/BaseMapTools'

const goHomeMap = () => {
	const centerPosition = import.meta.env.VITE_MAP_CENTER_POSITION.split(',')
	CesiumFlyTo(window.cesiumViewer, {longitude: Number(centerPosition[0]), latitude: Number(centerPosition[1]), height: Number(centerPosition[2])});
}
</script>

<style scoped>
.map_go_home {
	width: 30px;
	height: 30px;
	line-height: 30px;
	text-align: center;
	cursor: pointer;
}
.go_home_icon {
	width: 30px;
	height: 30px;
}
</style>
