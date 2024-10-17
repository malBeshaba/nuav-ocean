<template>
  <div class="task-block">
    <el-image class="left" :src="TaskInfoPoints"></el-image>
    <div class="statistics" style="margin-left: 16px;">
      <div class="number">
        <span class="num" style="font-size: 18px; font-weight: 400;">{{ Props.info.value }}</span>
        <span class="unit" style="font-size: 12px; font-weight: 400; color: #D7D0B2;">{{ Props.info.unit }}</span>
      </div>
      <div class="title" style="font-size: 14px; font-weight: 400; color: #D7D0B2;">{{ Props.info.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskInfoPoints from "@/assets/ControlCenter/task-info-points.png"
const Props = defineProps<{
  info: {
    value: number,
    unit: String,
    title: String
  }
}>()
</script>

<style scoped lang="scss">
.task-block {
  position: relative;
  display: flex;
}
</style>
