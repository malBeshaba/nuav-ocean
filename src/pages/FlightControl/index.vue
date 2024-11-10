<template>
    <div class="content">
        <DockInfo class="dock" />
        <TaskInfo class="task" />
        <DroneInfo class="drone" />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DockInfo from '@/pages/FlightControl/components/DockInfo.vue';
import TaskInfo from '@/pages/FlightControl/components/TaskInfo.vue';
import DroneInfo from '@/pages/FlightControl/components/DroneInfo.vue';

const router = useRouter();

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
  height: calc(100% - $NavigationHeight - 40px);
  left: 20px;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
  z-index: 2;
}
.task {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  height: calc((100% - $NavigationHeight - 40px) / 3 - 10px);
  right: 20px;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
  z-index: 2;
}
.drone {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: calc((100% - $NavigationHeight - 40px) / 3 + 10px);
  height: calc((100% - $NavigationHeight - 40px) * 2 / 3 - 10px);
  right: 20px;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
  z-index: 2;
}
</style>
  