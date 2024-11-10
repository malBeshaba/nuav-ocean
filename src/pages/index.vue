<template>
  <div id="page">
    <Navigation></Navigation>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import RealTimeAlert from "@/components/Equipment/RealTimeAlert.vue";
import Navigation from "@/components/Tabs/Navigation.vue";
import CesiumMap from "@/pages/Map/index.vue";

</script>

<style scoped>
#page {
  width: 100vw;
  height: 100vh;
  background: url('../assets/images/background.png') no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
}
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
