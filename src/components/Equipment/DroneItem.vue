<template>
  <div class="drone_item" :class="[bgHightlight?'drone_item--active':'']"
       @mouseover="bgHightlight=true" @mouseleave="bgHightlight=false">
    <div class="item_left">
      <el-avatar shape="square" style="width: 57px; height: 29px; background-color: transparent;" :src="droneIMG"/>
    </div>
    <div class="item_right">
      <div class="header">
        <div class="header_title">{{ droneInfo?.nickname }}</div>
        <div class="header_right" :style="{color: EModeColor ?? '#fff'}">&#9679; {{ EModeCode }}</div>
        <!-- <span v-if="dockInfo.mode_code === 4" class="drone_have_plan">✔ 已有计划</span>
        <span v-else-if="dockInfo.mode_code === 0" class="drone_select_right" @click.stop="addPlan">+ 新建计划</span>
        <span v-else class="drone_select_right"> </span> -->
      </div>
      <div class="introduction">
        <span class="introduction_left">
          <span class="attr">型号</span> {{ droneInfo?.device_name }}
        </span>
        <span class="introduction_right">
          <span class="attr">负载</span> 摄像头
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import droneIMG from "@/assets/images/drone.png"
import {useMyStore} from "@/store"

const store = useMyStore()

const Props = defineProps<{
  droneInfo: {
    type: Object,
  },
}>()
onMounted(() => {
  // console.log("Props.droneInfo: ", Props.droneInfo)
});

// 点中效果
const isHeightlight = ref('')
const bgHightlight = ref(false)
const isGrey = ref(false)

// 无人机图片切换
const DronePicture = computed(() => {
  if (Props.droneInfo.device_name === 'Matrice 30T') {
    return pictureM30
  } else {
    return pictureM300
  }
})

// 监听无人机状态
watch(() => store.state.deviceState, (newData, oldData) => {
  if (newData.currentType === 2 && newData.deviceInfo[newData.currentSn]) {
    if (Props.droneInfo.device_sn === newData.currentSn) {
      Props.droneInfo.mode_code = newData.deviceInfo[Props.droneInfo.device_sn].mode_code
    }
  }
}, {deep: true, immediate: true})

const EModeColor = computed(() => {
  switch (Props.droneInfo.mode_code) {
    case 0:
      return '#FFF368'
    case 1:
      return '#66DDBC' // 已有计划
    case 2:
      return '#66DDBC'
    case 3:
      return '#66DDBC'
    case 4:
      return '#66DDBC'
    case 5:
      return '#66DDBC'
    case 6:
      return '#66DDBC'
    case 7:
      return '#66DDBC'
    case 8:
      return '#66DDBC'
    case 9:
      return '#66DDBC'
    case 10:
      return '#66DDBC'
    case 11:
      return '#66DDBC'
    case 12:
      return '#66DDBC'
    case 13:
      return '#fff' //禁用
    case 14:
      return '#EA5B51' //禁用
    default:
      return '#EA5B51'
  }
})
const EModeCode = computed(() => {
  switch (Props.droneInfo.mode_code) {
    case 0:
      return '待机'
    case 1:
      return '任务中' // 已有计划
    case 2:
      return '任务中'
    case 3:
      return '任务中'
    case 4:
      return '任务中'
    case 5:
      return '任务中'
    case 6:
      return '任务中'
    case 7:
      return '任务中'
    case 8:
      return '任务中'
    case 9:
      return '任务中'
    case 10:
      return '任务中'
    case 11:
      return '任务中'
    case 12:
      return '任务中'
    case 13:
      return '调试中' //禁用
    case 14:
      return '离线' //禁用
    default:
      return '离线'
  }
})
</script>


<style scoped>
.drone_item {
  background-color: #000;
  display: flex;
  align-items: center;
  padding: 14px 0px;
  margin-bottom: 3px;
  cursor: pointer;
  border: 1px solid transparent;
}

.drone_item--active {
  background-color: #212a33;
  border: 1px solid orange;
}

.grey {
  filter: grayscale(1);
  background-color: #333333 !important;
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
  padding-right: 10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header .header_title {
  color: #E1B46D;
  letter-spacing: 1.2px;
  font-size: 14px;
}

.header_right {
  cursor: pointer;
  font-size: 14px;
}

.introduction {
  font-size: 12px;
  color: #e3e9ef;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-right: 4.5rem;
}

.introduction .attr {
  color: #D7D0B2;
  margin-right: 5px;
}

.introduction_left {
}

.introduction_right {
}
</style>
