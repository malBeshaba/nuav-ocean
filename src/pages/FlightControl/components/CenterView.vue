<template>
  <div class="center" id="center-view">
    <div class="video" v-if="isShowVideo">
      <ListHead title="无人机视频" />
      <!-- <VideoFrame
        class="video_frame"
        :isFull="isFull"
        @toFullScreen="toFull_sc"
        :videoSource="{aisource: '', norsource: droneOutLiveStream, sn: droneDeviceSn}"
        ref="dronevideo_full"
      /> -->
      <el-icon class="btn-backward" @click="handleOnClose"><Close /></el-icon>
    </div>
	<div class="map" id="centerMap">
	  <cesium-map style="width: 100%; height: 100%; border-radius: 8px;" />
	</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ListHead from "@/components/Head/ListHead.vue";
import VideoFrame from '@/pages/ResourceManagement/components/Dock/VideoFrame.vue';
import CesiumMap from '@/pages/Map/index.vue'
import { useMyStore } from "@/store";
import { Close } from '@element-plus/icons-vue'
import { getLiveAddress, startLivestream, getLivestatus } from "@/api/live"

const store = useMyStore()

const isShowVideo = computed(() => {
    return store.state.showVideoOrMap === 'Video';
})

const droneDeviceSn = computed(() => {
    return store.state.iframeDroneSn;
})
// import Video
const isFull = ref(false)
const toFull_sc = (isF: boolean) => {
    isFull.value = isF
}

const handleOnClose = () => {
    store.commit('SET_SHOW_VIDEO_OR_MAP', 'Map')
    const map = document.getElementById('centerMap') as HTMLElement;
    const mapRect = map.getBoundingClientRect();
    const video = document.getElementById('drone-v') as HTMLElement;
    map.style.position = 'relative'
    map.style.top = '0px'
    map.style.left = '0px'
    map.style.width = '100%'
    map.style.height = '100%'
    video.style.top = `${mapRect.top}px`;
    video.style.left = `${mapRect.left}px`;
    video.style.width = `${mapRect.width}px`;
    video.style.height = `${250}px`;
}

const droneOutLiveStream = ref('')


const getDroneLiveStream = async (timestamp: string) => {
    let rtmpUrl = await getLiveAddress()
    let liveUrl = rtmpUrl.data + timestamp
    let videoID = timestamp + '/53-0-0/normal-0'
    let urlType = '1'
    let videoQ = '2'
    getLivestatus(timestamp).then(res => {
        if (res.data.webRtcStream) {
            droneOutLiveStream.value = res.data.webRtcStream
            store.commit('SET_LIVE_STREAM', { sn: timestamp, vid: videoID })
        } else {
            startLivestream({
                url: liveUrl,
                video_id: videoID,
                url_type: urlType,
                video_quality: videoQ
            }).then(res => {
                if (res.data.url) {
                    droneOutLiveStream.value = res.data.webRtcStream
                    store.commit('SET_LIVE_STREAM', { sn: timestamp, vid: videoID })
                }
            })
        }
    })
}

watch(() => droneDeviceSn.value, (newData) => {
    if (newData && isShowVideo) {
        getDroneLiveStream(newData)
    }
})
</script>

<style scoped lang="scss">
.center {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: $ComponentBackground;
    display: flex;
    justify-content: center;
    align-items: center;
}
.video {
    position: relative;
    width: 100%;
    height: 100%;
}
.map {
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid $SecondTouchColor;
    border-radius: 8px;
    box-sizing: border-box;
}
.btn-backward {
    position: absolute;
    top: 10px;
    right: 10px;
}
.video_frame {
    margin-top: 10px;
}
</style>
