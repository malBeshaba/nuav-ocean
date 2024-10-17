<template>
	<div class="hand_off_map_aerial">
		<img class="hand_off_map_aerial_image" @click="handoffMapAerial" :src="handOffMapAerialImage" alt="" />
	</div>
</template>

<script setup lang="ts">

import handOffMapAerialImage from '@/assets/map/handOffMapAndAerial.png'

const handoffMapAerial = () => {
	// console.log('handoffMapAerial')
}

</script>

<style scoped>
.hand_off_map_aerial {
  cursor: pointer;
}

.hand_off_map_aerial .hand_off_map_aerial_image {
  width: 30px;
  height: 20px;
}
</style>
