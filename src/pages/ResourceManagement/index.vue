<template>
  <div class="resoucre">
    <!-- <DeviceList></DeviceList> -->
    <router-view name="resource_list"></router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.resoucre {
  background: transparent;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 20px;
  height: calc(100% - $NavigationHeight - 40px);
  left: 20px;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
  z-index: 2;
}
</style>
