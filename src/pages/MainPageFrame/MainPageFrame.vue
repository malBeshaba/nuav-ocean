<template>
    <div :style="frameStyle" class="main_page_frame">

      <div class="device">
        <div class="device_tab">
          <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="handleClick"
          >
            <el-tab-pane label="机巢" name="dock">
            </el-tab-pane>
            <el-tab-pane label="无人机" name="drone">
            </el-tab-pane>
          </el-tabs>
        </div>


        <div class="dock" v-if="activeName==='dock'">
          <dock-detail-block ></dock-detail-block>
        </div>
        <div class="drone" v-if="activeName==='drone'">
          <drone-detail-info ref="droneDetailInfo" @show-info-changed="handleShowInfoChanged" ></drone-detail-info>
        </div>

      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import DockDetail from "@/pages/MainPageFrame/dock/DockDetail.vue";
import DroneDetailInfo from "@/pages/MainPageFrame/drone/DroneDetailInfo.vue";
import DockDetailBlock from "@/pages/MainPageFrame/dock/DockDetailBlock.vue";
const isSmall = ref(true);


const frameStyle = computed(() => ({
  width: isSmall.value ? '300px' : '600px',
  height: '408px'
}));

const activeName = ref('dock')
const previousTab = ref<string | null>(null);
const droneDetailInfo = ref();

const handleClick = (tab: TabsPaneContext, event: Event) => {
  window.parent.postMessage({isSmall: true}, '*');
  isSmall.value = true;
  droneDetailInfo.value.closeAll();

};
//
// const handleClick = (tab: TabsPaneContext, event: Event) => {
//   // if (previousTab.value === tab.name) {
//   //   return;
//   }
//   previousTab.value = tab.name;
//   console.log(tab, event);
//   isSmall.value = true;
//   window.parent.postMessage({ isSmall: isSmall.value }, '*');
// }

const handleShowInfoChanged = (newVal: boolean) => {
  isSmall.value = !newVal;
  window.parent.postMessage({isSmall: isSmall.value}, '*');
};

</script>

<style scoped>
.main_page_frame {
  background: rgba(23, 55, 82, 0.8)
  /* Additional styles */
}

.device{
  width: 100%;
  height: 100%;
}
.dock{
}

.device_tab{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

}

</style>