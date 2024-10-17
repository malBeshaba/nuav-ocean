<template>
  <div class="video-container" @mousemove="showControls" @mouseleave="hideControls">
    <video ref="videoRef" :poster="posterUrl">
      <source :src="videoUrl" type="video/mp4" />
    </video>
    <div class="custom-controls" :class="{ 'show-controls': showControlsFlag }" ref="controls">
      <div class="control-bar">
        <div class="control">
          <div class="select-wrapper">
            <el-select
                v-model="selectedVideoType"
                placeholder="Video Type"
                @change="updateVideoSource"
                popper-class="transparent-select"
            >
              <el-option v-for="(option, index) in videoTypes" :key="index" :label="option.label" :value="option.value" />
            </el-select>
          </div>
          <div class="select-wrapper">
            <el-select
                v-model="selectedAlgorithm"
                placeholder="Algorithm"
                @change="updateVideoSource"
                popper-class="transparent-select"
            >
              <el-option v-for="(option, index) in algorithms" :key="index" :label="option.label" :value="option.value" />
            </el-select>
          </div>
        </div>
        <div class="full-screen" @click="toggleFullScreen">
          <el-icon ><FullScreen style="color: white"/></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const videoRef = ref<HTMLVideoElement | null>(null);
const posterUrl = '@/assets/logo.png';
const videoUrl = ref('');
const videoTypes = [
  { label: 'Default', value: 'default' },
  { label: 'Infrared', value: 'infrared' },
];
const selectedVideoType = ref('default');
const algorithms = [
  { label: 'YOLO', value: 'yolo' },
  { label: 'Infrared High Heat', value: 'infrared_high_heat' },
];
const selectedAlgorithm = ref('yolo');
const showControlsFlag = ref(false);

watch(videoUrl, (newValue: any) => {
  videoRef.value!.src = newValue;
  videoRef.value?.load();
  videoRef.value?.play();
});

const updateVideoSource = () => {
  let url = '';
  if (selectedVideoType.value === 'infrared') {
    if (selectedAlgorithm.value === 'yolo') {
      url = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
    } else if (selectedAlgorithm.value === 'infrared_high_heat') {
      url = 'https://example.com/infrared_high_heat.mp4';
    } else {
      url = 'https://example.com/infrared_default.mp4';
    }
  } else {
    if (selectedAlgorithm.value === 'yolo') {
      url = 'https://example.com/default_yolo.mp4';
    } else if (selectedAlgorithm.value === 'infrared_high_heat') {
      url = 'https://example.com/default_infrared_high_heat.mp4';
    } else {
      url = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
    }
  }
  videoUrl.value = url;
};

const toggleFullScreen = () => {
  const video = videoRef.value;
  if (video) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    // } else if (video.webkitRequestFullscreen) {
    //   video.webkitRequestFullscreen();
    // } else if (video.mozRequestFullScreen) {
    //   video.mozRequestFullScreen();
    }
  }
  document.addEventListener('fullscreenchange', handleFullscreenChange);
}
const handleFullscreenChange = () => {
  const video = videoRef.value;
  const fullscreenElement = document.fullscreenElement;
  const controls = document.getElementsByClassName('control-bar')[0]
  // 如果进入全屏状态
  if (fullscreenElement === video) {
    // 隐藏原始控制条
    video!.controls = false;
    // 显示自定义控制条
    // controls?.style.display = 'block';
  }
}
const showControls = () => {
  showControlsFlag.value = true;
};

const hideControls = () => {
  showControlsFlag.value = false;
};
</script>

<style scoped>
.video-container {
  position: relative;
}

.custom-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-controls.show-controls {
  opacity: 1;
}

.control-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.control {
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-wrapper {
  margin: 0 10px;
}
.full-screen {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  margin-right: 20px;
}
</style>
