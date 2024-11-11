<template>
  <video
    ref="jswebrtc"
    controls
    disablePictureInPicture
    style="width: 100%;height: 100%;object-fit: fill;"
  >
  </video>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import {PlanePhotos} from "@/utils/location/Location_Node";
import { useMyStore } from '@/store';

const store = useMyStore()
const PP = new PlanePhotos()

const Props = defineProps({
  videoSrc: {
    type: String,
    default: '' // 设置默认值为空字符串，或者你可以设置为其他默认值
  }
})
const isFull = computed(()=>window.document.fullscreenEnabled)
onMounted(() => {
  watch(() => Props.videoSrc, (newData, oldData) => {
    if (newData) {
      console.log('播放视频路径：', newData)
      initVideo(newData)
      var videos = document.querySelectorAll('video');

      // 添加点击事件监听器到视频元素上
      videos.forEach(video => {
        video.addEventListener('click', function(event) {
          // 阻止默认行为，即阻止播放/暂停
          event.preventDefault();
          // 自定义效果
          // 这里可以放置你想实现的任何代码
          console.log('视频被点击了！但是不会触发播放/暂停。', Props.videoSrc, event);
          
        });
      })
    }
  }, { immediate: true })
});

onBeforeUnmount(() => {
  // 播放器存在清除播放器
  if (player) {
    player.destroy()
  }
});
let isFullScreen = false
function checkIsFullScreen() {
  return document.fullscreenElement !== null
}
document.addEventListener('fullscreenchange', () => {
  isFullScreen = checkIsFullScreen()
  console.log(isFullScreen)
})
// function clickPlayer(e:any) {
//   e.stopPropagation()
//   console.log(e.x, e.y)
// }
/**
 * 初始化播放器并播放
 * 两种调用方式
 *  一种通过 watch监听 props 传过来的 src 进行播放
 *  一种通过 引用组件上的 ref 直接调用 initVideo 如 this.$refs.webrtc.initVideo('src')
 * */

let player: any = null
let jswebrtc = ref(null)
const initVideo = (url: string) => {
  console.log('初始化播放器', url)
  // 播放器存在 清空重置
  if (player) {
    player.destroy()
    player = null
  }
  // let videoDom = document.getElementById('jswebrtc')		// 初始化播放器
  let videoDom = jswebrtc.value as any
  player = new JSWebrtc.Player(url, {
    video: videoDom,
    autoplay: true,
    onPlay: (obj: any) => {
      // 监听video元素状态，可播放时进行播放 。 某些情况下  autoplay 会失效
      // mdn https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/canplay_event
      // 菜鸟 https://www.runoob.com/tags/av-event-canplay.html
      videoDom.addEventListener('canplay', function () {
        videoDom.play()
      })
    }
  })
}
</script>

<style scoped>
video::-webkit-media-controls-current-time-display{
  display: none;
}
video::-webkit-media-controls-timeline {
  display: none;
}
video::-webkit-media-controls-mute-button {
  display: none;
}
video::-webkit-media-controls-timeline {
  display: none;
}

video::-webkit-media-controls-volume-control-container {
  display: none;
}
video::-webkit-media-controls-play-button {
  display: none;
}
</style>
