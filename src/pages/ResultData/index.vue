<template>
  <div class="result">
    <router-view name="result_list"></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
onMounted(() => {
  // console.log('$router:', router.currentRoute.value.name);
});

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
.result {
  background: transparent;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  height: calc(100% - $NavigationHeight - 20px);
  left: 20px;
  width: $LeftWidth;
  display: flex;
  flex-direction: row;
  margin-top: $NavigationHeight;
  z-index: 2;
}
</style>
