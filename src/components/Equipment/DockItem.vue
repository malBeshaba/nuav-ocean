<template>
  <div class="dock_item" :class="[bgHightlight?'dock_item--active':'']"
       @mouseover="bgHightlight=true" @mouseleave="bgHightlight=false">
    <div class="item_left">
      <el-avatar shape="square" style="width: 34px; height: 29px; background-color: transparent;" :src="dockIMG"/>
    </div>
    <div class="item_right">
      <div class="header">
        <div class="header_title">{{ dockInfo?.device_name }}</div>
        <div class="header_right" :style="{color: EDockColor ?? '#fff'}">&#9679; {{ EDockModeCode }}</div>
        <!-- <span v-if="dockInfo.mode_code === 4" class="drone_have_plan">✔ 已有计划</span>
        <span v-else-if="dockInfo.mode_code === 0" class="drone_select_right" @click.stop="addPlan">+ 新建计划</span>
        <span v-else class="drone_select_right"> </span> -->
      </div>
      <div class="introduction">
        <span class="introduction_left">
<!--          <span class="attr">型号</span> {{ dockInfo?.children.device_name }}-->
          <span class="attr">型号</span>{{hasKey(dockInfo, 'children') ? dockInfo.children.device_name : '无设备接入'}}
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
import dockIMG from "@/assets/images/dock2.png"
import {useMyStore} from "@/store"

// 判断某个对象中是否有某个属性
function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj
}

const store = useMyStore()

const Props = defineProps<{
  dockInfo: {
    type: Object,
  },
}>()

onMounted(() => {
  // console.log("droneInfo: ", store.state.deviceState)
});

// 点中效果
const isHeightlight = ref('')
const bgHightlight = ref(false)
const isGrey = ref(false)

// 监听机场状态
watch(() => store.state.deviceState, (newData, oldData) => {
  // console.log('drone', newData)
  // 3是机场
  if (newData.currentType === 3 && newData.dockInfo[newData.currentSn]) {
    if (Props.dockInfo.device_sn === newData.currentSn) {
      Props.dockInfo.mode_code = newData.dockInfo[Props.dockInfo.device_sn].basic_osd?.mode_code
    }
  }
}, {deep: true})

const EDockColor = computed(() => {
  switch (Props.dockInfo.mode_code) {
    case 0:
      return '#FFF368'
    case 1:
      return '#ffffff'
    case 2:
      return '#ffffff'
    case 3:
      return '#ffffff'
    case 4:
      return '#66DDBC'
    default:
      return '#EA5B51'
  }
})
const EDockModeCode = computed(() => {
  switch (Props.dockInfo.mode_code) {
    case 0:
      return '待机'
    case 1:
      return '调试中' // 禁用
    case 2:
      return '调试中' // 禁用
    case 3:
      return '调试中' //禁用
    case 4:
      return '任务中'
    default:
      return '离线'
  }
})

// const ChildStateName = computed(() => {
//   if (store.state.deviceState.deviceInfo[Props.dockInfo.child_device_sn]) {
//     return 1
//   } else {
//     return 0
//   }
// })

// const getTime = computed(() => {
//   return Props.dockInfo.createTime.toLocaleDateString().replace(/\//g, "-") + " " + Props.dockInfo.createTime.toTimeString().substr(0, 8)
// })

// const clickDockItem = () => {
//   console.log(store.state.selectSN)
//   if (store.state.selectSN === '') {
//     store.commit('setSelectSN', Props.dockInfo.device_sn)
//     store.commit('setSelectType', 'dock')
//     store.commit('setSelectDevice', {
//       dock: { name: Props.dockInfo.device_name, sn: Props.dockInfo.device_sn },
//       drone: { name: Props.dockInfo.children.device_name, sn: Props.dockInfo.children.device_sn }
//     })
//   } else if (store.state.selectSN !== Props.dockInfo.device_sn) {
//     store.commit('setSelectSN', Props.dockInfo.device_sn)
//     store.commit('setSelectType', 'dock')
//     store.commit('setSelectDevice', {
//       dock: { name: Props.dockInfo.device_name, sn: Props.dockInfo.device_sn },
//       drone: { name: Props.dockInfo.children.device_name, sn: Props.dockInfo.children.device_sn }
//     })
//   } else {
//     store.commit('setSelectSN', '')
//     store.commit('setSelectType', '')
//     store.commit('setSelectDevice', {
//       dock: null,
//       drone: null
//     })
//   }
// }

</script>


<style scoped lang="scss">
.dock_item {
  background-color: rgba(39, 73, 85, 0.5);
  display: flex;
  align-items: center;
  padding: 14px 0px;
  margin-bottom: 3px;
  cursor: pointer;
  border: 1px solid transparent;
}

.dock_item--active {
  background: linear-gradient(rgba(39, 73, 85, 0.5) 20%, rgba(34,153,211,0.6) 100%);
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
  padding-right: 10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header .header_title {
  color: $LightColor;
  font-size: $SecondLevelTitleFontSize;
  font-family: $SecondLevelTitleFontFamily;
  font-weight: $SecondLevelTitleFontSize;
  letter-spacing: 1.2px;
}

.header_right {
  cursor: pointer;
  font-size: $ContentFontSize;
  color: $ContentColor;
  font-family: $ContentFontFamily;
  font-weight: $ContentFontWeight;
}

.introduction {
  font-size: $ContentFontSize;
  color: $ContentColor;
  font-family: $ContentFontFamily;
  font-weight: $ContentFontWeight;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-right: 4.5rem;
}

.introduction .attr {
  color: white;
  font-size: $InforFontSize;
  font-family: $InforFontFamily;
  font-weight: $InforFontWeight;
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
