<template>
  <div class="task">
    <router-view name="wayline_list"></router-view>
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
// html {
//   box-sizing: border-box;
// }
// *, *::before, *::after {
//   box-sizing: inherit;
// }
.task {
  background: transparent;
  // box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  height: calc(100% - $NavigationHeight);
  left: $LeftWidth;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
  z-index: 2;
}
</style>
