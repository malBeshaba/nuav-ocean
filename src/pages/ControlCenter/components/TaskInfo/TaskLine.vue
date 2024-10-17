<template>
  <div class="task-line">
    <el-image class="left" :src="Props.info.icon"></el-image>
    <span class="title" style="font-size: 14px;font-weight: 400;">{{Props.info.title}}</span>
    <span class="distance" > {{Props.info.distance}} m</span>
    <div class="line" style="width: 271px; height: 1px; background: #7D5100; opacity: 0.55;"></div>
  </div>
</template>

<script setup lang="ts">
const Props = defineProps<{
  info: {
    icon: string,
    title: string,
    distance: string
  }
}>()
</script>

<style scoped>
.task-line {
  position: relative;
  width: 100%;
  height: 44px;
  padding-top: 30px;
  /*padding-bottom: ;*/
}
.left {
  position: absolute;
  left: 39px;
}
.title {
  position: absolute;
  left: 95px;
  line-height: 44px;
}
.line {
  position: absolute;
  left: 96px;
  bottom: 3px;
}
.distance {
  position: absolute;
  right: 70px;
  line-height: 44px;
  font-size: 18px;
  font-weight: bold;
  color: #E1B46D;
  /*-webkit-text-fill-color: transparent;*/
  /*background: linear-gradient(0deg, rgba(3,0,0,0.29) 0%, rgba(255,255,255,0.29) 100%);*/
  background-image: -webkit-linear-gradient(0deg, rgba(207, 178, 123, 1) 0%, rgba(215, 159, 80, 1) 100%);

  -webkit-text-fill-color:transparent;
  -webkit-background-clip: text;

}
</style>
