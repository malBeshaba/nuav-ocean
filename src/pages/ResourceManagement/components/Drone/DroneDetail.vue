<template>
  <div>
    <!-- <div class="video">
      <WebrtcPlayer></WebrtcPlayer>
    </div> -->
    <DroneDetailInfo></DroneDetailInfo>
  </div>
</template>

<script setup lang="ts">
// import WebrtcPlayer from "@/components/video/WebrtcPlayer.vue";
import DroneDetailInfo from "@/pages/ResourceManagement/components/Drone/DroneDetailInfo.vue";
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute(); 
const device_sn = ref();
const router = useRouter();
onMounted(() => {
  device_sn.value = route.query.device_sn;
});


</script>

<style scoped>
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.video {
  position: fixed;
  right: 0px;
  top: 0px;
  padding-top: 137px;
  width: 20%;
  height: 20%;
}
</style>
