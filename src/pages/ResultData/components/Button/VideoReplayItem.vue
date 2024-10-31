<template>
  <div class="photo-card">
    <video
      class="video"
      :id="Props.videoInfo.videoId"
      controls
      muted
      style="width: 100%; height: 100%; object-fit: fill"
    ></video>
    <div class="info">
      <div>{{ Props.videoInfo.videoName }}</div>
      <div class="bottom">
        <time class="time">{{ Props.videoInfo.createTime }}</time>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { VedioFile } from "@/store/types/file";
import flvjs from 'flv.js';

const Props = defineProps<{
	videoInfo: VedioFile,
}>()

const flvPlayer = ref();
const createVideo = () => {
  if (flvjs.isSupported()) {
    var videoElement = document.getElementById(Props.videoInfo.videoId);
    flvPlayer.value = flvjs.createPlayer(
      {
        type: 'flv',
        url: Props.videoInfo.videoPlayUrl, //你的url地址
        isLive: true,
        hasAudio: false,
      }
    );
    flvPlayer.value.attachMediaElement(videoElement);
    flvPlayer.value.load();
    setTimeout(function () {
      flvPlayer.value.play();
    }, 300);
    //处理视频播放错误的语法
    flvPlayer.value.on('error', () => {
      // message.error(`视频加载失败，请稍候重试！`);
      return false;
    });
  }
};
onMounted(() => {
  createVideo()
});


</script>

<style scoped lang="scss">
.photo-card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.video {
  width: 100%;
}

.info {
  width: 100%;
  padding: 10px;
  font-size: $ContentFontSize;
  color: $ContentColor;
  font-family: $ContentFontFamily;
  font-weight: $ContentFontWeight;
}

.time {
  padding-top: 4px;
  color: $UsualColor;
}

.bottom {
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  min-height: auto;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 14px;
  font-size: $ContentFontSize;
  border: 1px solid rgba(10, 11, 14, 0.85);
  height: 28px;
  &:hover {
    background: $TouchColorBackground;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
  &:active {
    background: $TouchColorBackground;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
  &:focus {
    background: $TouchColorBackground;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
}
</style>
