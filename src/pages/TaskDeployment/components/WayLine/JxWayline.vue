<template>
  <div class="task">
    <router-view name="jx_wayline_list"></router-view>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
onMounted(() => {
  // console.log('$router:', router.currentRoute.value.name);
});

</script>

<style scoped lang="scss">
.task {
  background: transparent;
  overflow: hidden;
  position: fixed;
  top: 0px;
  height: calc(100% - $NavigationHeight);
  left: $LeftWidth;
  width: $LeftWidth;
  display: flex;
  margin-top: $NavigationHeight;
  z-index: 2;
}
</style>
