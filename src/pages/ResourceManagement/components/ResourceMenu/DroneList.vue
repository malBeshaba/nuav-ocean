<template>
  <div class="drone-list">
    <div class="list-main">
      <div class="list-function">
        <div class="list-function-select">
          <el-select popper-class="selectForm" v-model="value" placeholder="全部无人机" size="small">
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
          <el-input v-model="input" placeholder="搜索无人机" :suffix-icon="Search" size="small"/>
        </div>
      </div>
      <div v-for="item in droneInfo" :key="item.device_sn">
        <DroneItem :droneInfo="item" @click="getDroneTask(item.device_sn)"></DroneItem>
      </div>
    </div>
    <div class="list-footer">
      <el-pagination
        :current-page="currentPage"
        :page-size="currentsize"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <router-view name="resource_drone"></router-view>
  </div>
</template>

<script setup lang="ts">
import DockItem from "@/components/Equipment/DockItem.vue";
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBindingDevices } from '@/api/device'
import { Search } from '@element-plus/icons-vue'

onMounted(() => {
  getDroneList()
});

// 获取无人机设备
const droneInfo = reactive([] as any[]);
const getDroneList = () => {
  droneInfo.splice(0, droneInfo.length);
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: currentPage.value,
    page_size: currentsize.value,
    domain: 0,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      total.value = res.data.pagination.total
      res.data.list.forEach((item: any) => {
        droneInfo.push(item)
      })
    }
  })
};
// 点击无人机，出现无人机任务列表
const route = useRoute();
const router = useRouter();
const getDroneTask = (device_sn: string) => {
  router.push({
    path: '/default/resource/drone/detail',
    query: {
      device_sn: device_sn
    },
  })
};
// 筛选框
const options = reactive([
  {
    value: '全部无人机',
    label: '全部无人机',
    id: 'all'
  },
  {
    value: '无人机',
    label: '无人机',
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
const currentsize = ref(6)
const total = ref()
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getDroneList()
}

</script>

<style scoped>
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.drone-list {
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
