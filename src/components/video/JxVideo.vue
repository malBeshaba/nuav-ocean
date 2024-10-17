<template>
  <div class="photo-card">
    <video
        class="video"
        id="JxVideo"
        controls
        muted
        style="width: 100%; height: 100%; object-fit: fill"
    ></video>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch,onBeforeUnmount} from 'vue';
import flvjs from 'flv.js';
import {getHomepageSiteList} from "@/api/jiexiang/site";
const init = ref(false)

const Props = defineProps<{
  siteId: string,
  device: string, // uav 无人机 dock 机场
}>()

const flvPlayer = ref(null);

const createVideo = (source) => {
  // 如果已经初始化了
  if (init.value){
    // 销毁
    flvPlayer.value.destroy();
    init.value = false
  }
  if (flvjs.isSupported() && !init.value) {
    var videoElement = document.getElementById('JxVideo');
    flvPlayer.value = flvjs.createPlayer(
        {
          type: 'flv',
          url: source, //你的url地址
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
    init.value = true
  }

};
const getDroneLiveStream = async function () {
  getHomepageSiteList().then(res => {
    res.data.forEach((item: any) => {
      if (Props.siteId === item.id) {
        if (Props.device === 'uav') {
          createVideo(item.liveUavUrl)
        } else {
          createVideo(item.liveHangarUrl)
        }
      }
    })
  }).catch(err => {
        console.log(err)
      }
  )
}

onBeforeUnmount(() => {
  flvPlayer.value.destroy();
});

watch(() => Props.device, (newData, oldData) => {
  getDroneLiveStream()
}, {deep: true,})

onMounted(() => {
  getDroneLiveStream()
});


</script>

<style scoped lang="scss">
.photo-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #999;
  margin-top: 10px;
}

.video {
  width: 100%;
}

.info {
  width: 100%;
  padding: 10px;
  font-size: $ContentFontSize;
  font: $ContentFontFamily;
}

.time {
  padding-top: 4px;
  color: #999;
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
