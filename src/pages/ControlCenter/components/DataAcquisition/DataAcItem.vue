<template>
  <div class="data-ac-item">
    <el-image class="icon" :src="Props.info.icon"></el-image>
    <div class="name">{{ Props.info.name }}</div>
    <div class="data-num">
      <span class="num" >{{ Props.info.num }}</span>
      <span class="unit">条</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const Props = defineProps<{
  info: {
    icon: string,
    name: string,
    num: number
  }
}>()
</script>

<style scoped>
.name {
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  margin-top: -16px;
}
.data-num {
  margin-top: 9px;
  text-align: center;
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
