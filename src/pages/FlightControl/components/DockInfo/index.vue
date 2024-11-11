<template>
  <div class="dockInfo" style="display: flex; flex-direction: column;">
    <ListHead title="无人机机场"/>
    <el-select v-model="dockValue" placeholder="Select" class="select">
      <el-option
        v-for="item in dockOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="content">
      <DockDetail v-if="dockValue" :deviceSn="dockValue"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ListHead from '@/components/Head/ListHead.vue';
import DockDetail from '@/pages/FlightControl/components/DockInfo/DockDetail.vue';
import { getBindingDevices } from '@/api/device'

const dockValue = ref('');
const dockOptions = ref([] as any[])

const getDockList = () => {
//   dockInfo.value = []
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 3,
  }).then(res => {
    if (res.code === 0) {
      dockOptions.value = res.data.list.map((item: any) => {
        return { value: item.device_sn, label: item.device_name }
      })
      dockValue.value = dockOptions.value[0].value
    }
  })
};

onMounted(() => {
  getDockList()
})
</script>

<style scoped lang="scss">
.dockInfo {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: $ComponentBackground;
}

.select {
    position: absolute;
    top: 4px;
    left: 35%;
    width: 120px;
}
</style>
  