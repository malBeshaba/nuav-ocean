<template>
    <div class="customPanel-container">
      <div class="panel">
        <!-- <span class="border">
          <img :src="require('@/images/LR-border.svg')" />
        </span>
        <span class="border">
          <img :src="require('@/images/LR-border.svg')" />
        </span>
        <span class="border">
          <img :src="require('@/images/LR-border.svg')" />
        </span>
        <span class="border">
          <img :src="require('@/images/LR-border.svg')" />
        </span> -->
        <div
          ref="panelinner"
          class="inner"
          :class="{ hasBottomLight: bottomLight }"
        >
          <svg :height="height" :width="width">
            <polygon
              :points="`0,0 ${
                width.value - 10
              },0 ${width.value},0 ${width.value},${height.value} 0,${height.value}`"
            />
          </svg>
        </div>
      </div>
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, watchEffect } from 'vue'

  // props
  const props = defineProps({
    bottomLight: {
      type: Boolean,
      default: false
    }
  })
  
  // data
  const width = ref(0)
  const height = ref(0)
  const panelinner = ref(null)
  
  // methods
  const getSize = () => {
    if (panelinner.value) {
      width.value = panelinner.value.offsetWidth
      height.value = panelinner.value.offsetHeight
    }
  }
  
  const resizePanel = () => {
    // Assuming you have the equivalent of `$erd.listenTo` in your Vue 3 project
    if (panelinner.value) {
      window.addEventListener('resize', getSize)
    }
  }
  
  // lifecycle hooks
  onMounted(() => {
    nextTick(() => {
      getSize()
    })
    resizePanel()
  })
  
  watchEffect(() => {
    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', getSize)
    }
  })
  </script>
  
  <style lang="scss" scoped>
  .customPanel-container {
    position: relative;
    width: 100%;
    height: 100%;
    //padding: 5px 10px 10px 10px;
    pointer-events: all;
    .panel {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: -1;
      padding: 5px 10px;
    }
    .border {
      position: absolute;
    }
    .border:nth-child(1) {
      top: 0;
      left: 0;
    }
    .border:nth-child(2) {
      top: 0;
      right: 0;
      transform: rotateY(180deg);
    }
    .border:nth-child(3) {
      left: 0;
      bottom: 0;
      transform: rotateX(180deg);
    }
    .border:nth-child(4) {
      right: 0;
      bottom: 0;
      transform: rotateX(180deg) rotateY(180deg);
    }
    .inner {
      position: relative;
      width: 100%;
      height: 100%;
      &.hasBottomLight::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('../../assets/images/light.svg') no-repeat center bottom;
        background-size: 75% auto;
      }
      polygon {
        fill: rgba(22, 44, 75, 0.8);
        stroke: #4aa9ff;
        stroke-width: 1;
      }
    }
  }
  </style>
  