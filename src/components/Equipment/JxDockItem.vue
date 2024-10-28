<template>
  <div class="dock_item" :class="[bgHightlight?'dock_item--active':'']"
       @mouseover="bgHightlight=true" @mouseleave="bgHightlight=false">
    <div class="item_left">
      <el-avatar shape="square" style="width: 34px; height: 29px; background-color: transparent;" :src="dockIMG"/>
    </div>
    <div class="item_right">
      <div class="header">
        <div class="header_title">{{ dockInfo?.hangarName }}机库</div>
        <div class="header_right" :style="{color: EDockColor ?? '#fff'}">&#9679; {{ EDockModeCode }}</div>
      </div>
      <div class="introduction">
        <span class="introduction_left">
          <span class="attr">型号</span> {{ dockInfo?.uavName }}
        </span>
        <span class="introduction_right">
          <span class="attr">负载</span> 摄像头
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import dockIMG from "@/assets/images/dock2.png"
import {useMyStore} from "@/store"

const store = useMyStore()

const Props = defineProps<{
  dockInfo: {
    type: Object,
  },
}>()

onMounted(() => {

});

// 点中效果
const bgHightlight = ref(false)

const EDockColor = computed(() => {
  switch (Props.dockInfo.hangarState) {
    case '在线':
      return '#FFF368'
    default:
      return '#ffffff'
  }
})
const EDockModeCode = computed(() => {
  switch (Props.dockInfo.hangarState) {
    case '在线':
      return '待机'
    default:
      return '离线'
  }
})

</script>


<style scoped>
.dock_item {
  background-color: #000;
  display: flex;
  align-items: center;
  padding: 14px 0px;
  margin-bottom: 3px;
  cursor: pointer;
  border: 1px solid transparent;
}

.dock_item--active {
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
  padding-left: 20px;
}

.state_0 {
  margin-left: 10px;
  color: #3980e8;
  font-size: 8px;
  text-align: center;
  line-height: 16px;
  padding: 1px 5px 2px 5px;
  border: 1px solid #3980e8;
}

.state_1 {
  margin-left: 10px;
  color: #06c799;
  font-size: 8px;
  text-align: center;
  line-height: 16px;
  padding: 1px 5px 2px 5px;
  border: 1px solid #06c799;
}
</style>
