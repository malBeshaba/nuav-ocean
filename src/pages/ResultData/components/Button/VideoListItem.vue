<template>
  <div class="photo-card">
    <div class="video" :id="Props.id"></div>
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

const Props = defineProps<{
	videoInfo: VedioFile,
  id : string
}>()

const height = ref('100%')
const format = ref('mp4')

const videoPlayer = ref(null);
onMounted(() => {
  height.value = `${document.querySelector(`#${Props.id}`).clientWidth / 1.7777778}px`;
  format.value = Props.videoInfo.videoPlayUrl.substring(Props.videoInfo.videoPlayUrl.lastIndexOf('.') + 1);
  document.querySelector(`#${Props.id}`).style.height = height.value;

  videoPlayer.value = new Aliplayer({
    id: Props.id,
    source: Props.videoInfo.videoPlayUrl,
    height: height.value,
    autoplay: false,
    preload: false,
    isLive: false,
    cover: Props.videoInfo.videoCoverUrl,
    format: format.value
  }, function (player) {
    console.log("The player is created");
  });

});


</script>

<style scoped lang="scss">
.photo-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: $UsualBorder;
}

.video {
  width: 100%;
  height: 100px;
}

.info {
  width: 100%;
  padding: 10px;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  font-weight: $ContentFontWeight;
  color: $ContentColor;
}

.time {
  padding-top: 4px;
  font-size: $InforFontSize;
  font-family: $InforFontFamily;
  font-weight: $InforFontWeight;
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
