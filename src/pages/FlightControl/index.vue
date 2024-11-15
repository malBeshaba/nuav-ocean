<template>
    <div class="content">
      <DockInfo class="dock" @transferSn="getSnFromDockInfo" />
      <TaskInfo class="task" :docksn="dockSn" />
      <DroneInfo class="drone" />
	    <router-view name="info_list" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DockInfo from '@/pages/FlightControl/components/DockInfo/index.vue';
import TaskInfo from '@/pages/FlightControl/components/TaskInfo.vue';
import DroneInfo from '@/pages/FlightControl/components/DroneInfo/index.vue';
const router = useRouter();

const dockSn = ref();

const getSnFromDockInfo = (sn: string) => {
  dockSn.value = sn;
}

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.dock {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  height: calc(100% - $NavigationHeight - 20px);
  left: 20px;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
  z-index: 1;
}

.task {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  height: calc((100% - $NavigationHeight) / 3);
  right: 20px;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
}
.drone {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: calc((100% - $NavigationHeight - 20px) / 3 + 10px);
  height: calc((100% - $NavigationHeight - 20px) * 2 / 3 - 10px);
  right: 20px;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
}
</style>
