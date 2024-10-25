<template>
  <div id="page">
    <Navigation></Navigation>
    <cesium-map class="cesium_map"></cesium-map>
    <router-view></router-view>
    <real-time-alert class="alert"></real-time-alert>
  </div>
</template>

<script setup lang="ts">
import RealTimeAlert from "@/components/Equipment/RealTimeAlert.vue";
import Navigation from "@/components/Tabs/Navigation.vue";
import CesiumMap from "@/pages/Map/index.vue";

</script>

<style scoped>
.cesium_map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.alert {
  position: absolute;
  left: 42%;
  top: 20%;
}
</style>
