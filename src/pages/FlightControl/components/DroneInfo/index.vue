<template>
    <div class="droneInfo" style="display: flex; flex-direction: column;">
        <ListHead title="无人机信息"/>
        <div class="content">
            <DroneDetail/>
        </div>
    </div>
</template>

<script setup lang="ts">
import ListHead from '@/components/Head/ListHead.vue';
import DroneDetail from '@/pages/FlightControl/components/DroneInfo/DroneDetail.vue';

</script>

<style scoped lang="scss">
.droneInfo {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: $ComponentBackground;
}
</style>
  