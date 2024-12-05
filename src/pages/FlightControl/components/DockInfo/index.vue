<template>
  <div class="dockInfo" style="display: flex; flex-direction: column;">
    <ListHead title="无人机机场"/>
    <el-select v-model="dockValue" placeholder="Select" class="select" @change="handleOnDockChange">
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
import { CesiumFlyTo } from '@/components/mapTools/BaseMapTools';
import { useMyStore } from '@/store';

const store = useMyStore();

const dockValue = ref('');
const dockOptions = ref([] as any[])
const emit = defineEmits(['transferSn'])

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
        return { value: item.device_sn, label: item.nickname }
      })
      dockValue.value = dockOptions.value[0].value
			handleOnDockChange(dockValue.value);
      flyToDock(dockValue.value)
    }
  })
};

const handleOnDockChange = (val: string) => {
  emit('transferSn', val)
  flyToDock(val)
}

const flyToDock = (sn: string) => {
  const dock = store.state.checkDockState.find((item: any) => item.sn === sn)
  CesiumFlyTo(window.cesiumViewer, {longitude: dock?.position?.longitude as number, latitude: dock?.position.latitude as number, height: 1500})
}

onMounted(() => {
  getDockList();
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
