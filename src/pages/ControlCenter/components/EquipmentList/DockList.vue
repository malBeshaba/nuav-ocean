<template>
  <div class="dock_list">
    <div class="head">
      <span class="title">机场列表</span>
    </div>
    <div class="list" v-for="item in dockInfo" :key="item">
      <DockItem :dock-info="item"></DockItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import DockItem from "@/components/Equipment/DockItem.vue";
import {getBindingDevices} from "@/api/device";
import {reactive, ref, onMounted} from "vue";
const dockInfo = reactive([]);
const currentPage = ref(1)
const currentSize = ref(6)
const getDockList = () => {
  dockInfo.splice(0, dockInfo.length);
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: currentPage.value,
    page_size: currentSize.value,
    domain: 3,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      res.data.list.forEach(item => {
        dockInfo.push(item)
      })
    }
  })
};
onMounted(() => {
  getDockList()
})
</script>

<style scoped>

</style>
