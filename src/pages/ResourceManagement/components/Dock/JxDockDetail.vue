<template>
  <div class='dock'>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="机场详情" name="detail">
        <JxDockDetailBlock></JxDockDetailBlock>
      </el-tab-pane>
      <el-tab-pane label="机场操作" name="control">
        <JxDockDetailControl></JxDockDetailControl>
      </el-tab-pane>
    </el-tabs>
    <el-icon class="btn-backward" @click="backToResourceList()"><Close /></el-icon>
  </div>
</template>

<script setup lang="ts">
import JxDockDetailBlock from "@/pages/ResourceManagement/components/Dock/JxDockDetailBlock.vue";
import JxDockDetailControl from "@/pages/ResourceManagement/components/Dock/JxDockDetailControl.vue";
import { Close } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
import type { TabsPaneContext } from 'element-plus'

// 切换页
const activeName = ref('detail')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event)
}
const backToResourceList = () => {
  router.push('/default/resource')
}

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.dock {
  width: 100%;
  height: 100%;
  background: $ComponentBackground;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-top: $ComponentHeaderBorder;
}

// 分页
:deep(.el-tabs) {
  height: 100%;
}

:deep(.el-tabs__header) {
  margin-bottom: 0px;
}

:deep(.el-tabs__content) {
  height: 100%;
}

:deep(.el-tabs__nav) {
  width: 100%;
}

:deep(.el-tabs__item) {
  flex: 1;
  height: $ComponenHeadHeight;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  color: $FirstLevelTitleColor;
  font-family: $FirstLevelTitleFontFamily;
}

:deep(.el-tabs__item.is-active) {
  color: $TouchColor;
}

:deep(.el-tabs__item:hover) {
  color: $TouchColor;
}

:deep(.el-tabs__active-bar) {
  height: 1px;
  background-color: $TouchColor;
}

// 返回按钮
.btn-backward {
  position: absolute;
  right: 0px;
  vertical-align: middle;
  width: 2em;
  height: 2em;
  font-size: $IconSize;
  color: $IconColor;
  z-index: 3;
}

.btn-backward:hover {
  cursor: pointer;
  border: $IconBorder;
  color: $TouchColor;
}
</style>
