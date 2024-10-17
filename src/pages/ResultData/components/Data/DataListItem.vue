<template>
  <div class="data-item" :class="activeClass"
       @mouseover="bgHightlight=true" @mouseleave="bgHightlight=false">
    <div class="item_right">
      <div class="header">
        <div class="orange-dot"></div>
        <div class="header_title">{{ dataInfo?.dataName }}</div>
        <div class="header_right"> {{ dataType }}</div>
      </div>
      <div class="introduction">
        <span class="introduction_left">
          <span class="attr">创建时间</span>
          <span> {{ dataInfo?.createTime }}</span>
        </span>
      </div>
      <div class="introduction">
        <span class="introduction_right">
          <span class="attrtwo">简介</span>
          <span> {{ dataInfo?.dataDesc }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ModelData } from '@/store/types/modelData'
import bus from "@/utils/bus";
import droneIMG from "@/assets/images/drone.png"
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies()
const Props = defineProps<{
  dataInfo: ModelData,
}>()

onMounted(() => {
  // console.log("Props.dataInfo: ", Props.dataInfo)
  if (cookies.get('result_cache')) {
    const data = cookies.get('result_cache') as any
    bgHightlight.value = data['select_item'].dataId === Props.dataInfo.dataId;
  }
});

bus.on('clickResultModelItem', (val: any) => {
  console.log('clickResultModelItem', val)
  isActive.value = val === Props.dataInfo.dataId;
  bgHightlight.value = val === Props.dataInfo.dataId;
})

// 点中效果
const bgHightlight = ref(false)
const isActive = ref(false)
const activeClass = computed(() => {
  if (bgHightlight.value) {
    return 'data-item__active'
  }
  if (isActive.value) {
    return 'data-item__active'
  }
})

const dataType = computed(() => {
  switch (Props.dataInfo.dataType) {
    case 1:
      return '倾斜摄影' // 已有计划
    case 2:
      return '矢量数据'
    case 3:
      return '遥感影像'
    case 4:
      return '模型'
    case 5:
      return '其他数据'
    default:
      return '其他数据'
  }
})
</script>


<style scoped lang="scss">
.data-item {
  background-color: $ComponentBackground;
  display: flex;
  align-items: center;
  padding: 14px 16px 14px 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border: 1px solid transparent;
}

.data-item__active {
  background-color: $ComponentBackground;
  border: 1px solid $TouchColor;
}

.item_left {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item_right {
  flex: 8;
  display: flex;
  flex-direction: column;
  // padding-right: 15px;
}

.header {
  display: flex;
  align-items: center;
}

.header .header_title {
  color: $LightColor;
  letter-spacing: 1.2px;
  font-size: $SecondLevelTitleFontSize;
  font-weight: $SecondLevelTitleFontWeight;
  font-family: $SecondLevelTitleFontFamily;
}

.header_right {
  display: flex;
  margin-left: auto;
  cursor: pointer;
  padding: 2px;
  font-size: $AnnotateFontSize;
  font-weight: $AnnotateColor;
  color: $AnnotateColor;
  font-family: $AnnotateFontFamily;
  background: var(--el-color-primary-light-7);
  border-radius: 4px;
}

.introduction {
  font-size: $ContentFontSize;
  color: $ContentColor;
  font-family: $ContentFontFamily;
  font-weight: $ContentFontWeight;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-right: 3.5rem;
  padding-top: 8px;
}

.introduction .attr {
  color: $SecondTouchColor;
  padding-right: 20px;
}

.introduction .attrtwo{
  color: $SecondTouchColor;
  padding-right: 45px;
}

.introduction_left {
  padding-left: 5px;
}

.introduction_right {
  padding-left: 5px;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background: $TouchColor;
  margin-right: 4px;
}


</style>
