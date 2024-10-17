<template>
  <div class="dock-list">
    <div class="list-main">
      <div class="list-function">
        <div class="list-function-select">
          <el-select popper-class="selectForm" v-model="value" placeholder="全部机场" size="small">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            >
            <span style="font-weight: 500; color: black" @click="checkTaskType(item.id)">{{ item.value }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="list-function-input">
          <el-input v-model="input" placeholder="搜索机场" :suffix-icon="Search" size="small"/>
        </div>
      </div>
      <div v-for="item in dockInfo" :key="item.device_sn">
        <DockItem :dockInfo="item" @click="getDeviceTask(item.device_sn)"></DockItem>
      </div>
    </div>
    <div class="list-footer">
      <el-pagination
        :current-page="currentPage"
        :page-size="currentSize"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <router-view name="resoucre_dock"></router-view>
  </div>
</template>

<script setup lang="ts">
import DockItem from "@/components/Equipment/DockItem.vue";
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBindingDevices } from '@/api/device'
import { Search } from '@element-plus/icons-vue'

onMounted(() => {
  getDockList()
});

// 获取无人机设备
const dockInfo = reactive([] as any[]);
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
      res.data.list.forEach((item: any) => {
        dockInfo.push(item)
      })
    }
  })
};
// 点击无人机，出现无人机任务列表
const route = useRoute();
const router = useRouter();
const getDeviceTask = (device_sn: string) => {
  router.push({
    path: '/default/resource/dock/detail',
    query: {
      device_sn: device_sn
    },
  })
};
// 筛选框
const options = reactive([
  {
    value: '全部机场',
    label: '全部机场',
    id: 'all'
  },
  {
    value: '机场',
    label: '机场',
    id: 'drone'
  },
  {
    value: '机场无人机',
    label: '机场无人机',
    id: 'dock'
  }
]);
const value = ref('');
const checkTaskType = (id: string) => {
  // console.log(id)
};
// 搜索框
const input = ref('');
// 分页
const currentPage = ref(1)
const currentSize = ref(6)
const total = ref()
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getDockList()
}

</script>

<style scoped>
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.dock-list {
  width: 100%;
  height: 100%;
  /* background-color: #999; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.list-main {
  flex-grow: 1;
}

.list-function {
  height: 3.3%;
  display: flex;
  align-items: center;
  margin: 8px 12px;
}

.list-function .list-function-select {
  flex: 2;
  padding-right: 16px;
}

.list-function .list-function-input {
  flex: 7;
}

.list-footer {
  height: 42px;
}
</style>
