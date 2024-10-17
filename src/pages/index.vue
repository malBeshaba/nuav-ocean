<template>
  <div id="page">
    <Navigation></Navigation>
    <cesium-map class="cesium_map"></cesium-map>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import {
  useConnectWebSocket,
  messageHandler,
} from "@/utils/websocket/use-connect-websocket";

// import {
//   jxUseConnectWebsocket,
//   jxMessageHandler,
// } from "@/utils/jx-websocket/jx-use-connect-websocket";

import { dockState } from '@/utils/deviceWatch/dockState'
import { deviceState } from '@/utils/deviceWatch/deviceState'
import Navigation from "@/components/Tabs/Navigation.vue";
import CesiumMap from "@/pages/Map/index.vue";
useConnectWebSocket(messageHandler);
// jxUseConnectWebsocket(jxMessageHandler);
dockState()
deviceState()
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
</style>
