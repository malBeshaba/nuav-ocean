<template>
<div class="VideoPlayback">
<!--  <webrtc-player video-src="DJI_20230418094229_0001_W.MP4"></webrtc-player>-->
  <webrtc-player-test class="PlayBack"></webrtc-player-test>
  <div class="LittltMap"></div>
</div>
</template>

<script>
import WebrtcPlayer from "../../components/video/WebrtcPlayer.vue";
import WebrtcPlayerTest from "../../components/video/WebrtcPlayerTest.vue";
export default {
  name: "index.vue",
  components: {WebrtcPlayerTest, WebrtcPlayer}
}
</script>

<style scoped>
.PlayBack{
  width: 100%;
  height: 930px;
  background: red;
}
.LittltMap{
  position: absolute;
  /* 设置元素距离顶部的偏移量 */
  top: 670px;
  /* 设置元素距离左侧的偏移量 */
  left: 1500px;
  width: 348px;
  height: 260px;
  background: #2b85e4;
  z-index: 10;
}
</style>