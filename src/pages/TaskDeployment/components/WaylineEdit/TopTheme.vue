<script setup lang="ts">

</script>

<template>
  <div class="box">
    <span class="line">
      新建航线1
    </span>
    <div class="line">
      <img src="@/assets/map/top/top1.png" alt="">&nbsp;
      <span>M30系列</span>&nbsp;
      <img src="@/assets/map/top/top2.png" alt="">&nbsp;
      <span>M30相机</span>
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 300px;
  background-color: #3c3c3c;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 0 10px;
  height: 40px;
  border-radius: 5px;
  margin-top: 5px;
}
.line{
  display: flex;
  align-items: center;
}
img{
  width: 16px;
  height: 16px;
}
</style>
