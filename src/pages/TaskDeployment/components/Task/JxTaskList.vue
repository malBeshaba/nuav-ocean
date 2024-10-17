<template>
  <div class="task-list">
    <div class="list-header">
      <div class="title">任务列表</div>
      <div class="title-function">
        <el-button type="warning" size="small" @click="createTask()">
          <el-icon>
            <Plus/>
          </el-icon>
          新建任务
        </el-button>
        <el-icon class="button-backward" :size="16" @click="backToEquipmentList()">
          <DArrowLeft/>
        </el-icon>
      </div>
    </div>
    <div class="list-function">
      <div class="list-function-select">
        <el-select v-model="selectValue" placeholder="任务状态" @change="selectChange" size="default">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
      <div class="list-function-input">
        <el-input v-model="input" placeholder="按任务名称搜索" :suffix-icon="Search" size="default"/>
      </div>
    </div>
    <div v-if="planInfo.length > 0" class="list-main">
      <el-row :gutter="20" style="width: 100%;">
        <el-col
            v-for="(item,index) in planInfo"
            :key="item.id"
            :span="24"
        >
          <JxTaskItem ref="taskItems" :planInfo="item" :site-id="siteId" @click="getTaskInformation(item,index)"
                      @getTaskInfo="getTaskInfo"></JxTaskItem>
        </el-col>
      </el-row>
    </div>
    <div v-else class="list-no-main">
      无任务！
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
    <router-view name="task_detail"></router-view>
  </div>
</template>

<script setup lang="ts">
import JxTaskItem from "@/components/Task/JxTaskItem.vue";
import {ref, onMounted, reactive, watch, onBeforeUnmount} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {getMissionConfigPagingList, getStrategyConfigDetail} from '@/api/jiexiang/jxDronePlan'
import {Search, Plus, DArrowLeft} from '@element-plus/icons-vue'
import {useMyStore} from '@/store'
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import {CheckWayLine} from '../WayLine/DrawJxWayline'


const store = useMyStore()

const route = useRoute();
const siteId = ref();
const router = useRouter();
const taskItems = ref();
const showInfo = ref(false);

onMounted(() => {
  siteId.value = route.query.siteId;
  getTaskInfo()
});

onBeforeUnmount(() => {
  RemoveEntitiesByBatch(window.cesiumViewer, String(siteId.value))
})

// 分页
const currentPage = ref(1)
const currentSize = ref(5)
const total = ref(20)
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getTaskInfo()
}
// 获取飞行计划
const planInfo = reactive([] as any[]);
const getTaskInfo = async () => {
  planInfo.splice(0, planInfo.length);
  getMissionConfigPagingList({
    current: 1,
    pageSize: 10,
    siteId: String(siteId.value),
    type: "2"
  }).then(res => {
    if (res.errorCode === '00000') {
      total.value = res.data.pagination.total
      planInfo.splice(0, planInfo.length);
      res.data.list.forEach((item: any) => {
        planInfo.push(item)
      })
    }
  })
};
// 监听路由
watch(() => route.query.siteId, (newData, oldData) => {
  siteId.value = newData;
  getTaskInfo()
}, {deep: true})

// 筛选框
enum planStatus {
  All = '1,2,5',
  Wait = '1',
  Carrying = '2',
  Fail = '5'
}

const options = reactive([
  {
    label: '全部',
    value: planStatus.All,
  }, {
    label: '待执行',
    value: planStatus.Wait,
  }, {
    label: '执行中',
    value: planStatus.Carrying,
  }, {
    label: '执行失败',
    value: planStatus.Fail,
  }
]);
const selectValue = ref('1,2,5');
const selectChange = (val: string) => {
  getTaskInfo()
};
// 搜索框
const input = ref('')

// 返回
const backToEquipmentList = () => {
  router.push('/default/task')
}

// 新建任务
const createTask = () => {
  router.push({
    path: '/default/task/jx-create',
    query: {
      siteId: siteId.value
    },
  })
}
// 任务详细信息
const getTaskInformation = (planInfo: any,index: number) => {
  // 选中项才显示详细的信息
  if(taskItems){
    for (let i = 0; i < taskItems.value.length; i++) {
      if (planInfo.id === store.state.executePlanId) {
        taskItems.value[index].switchShowInfo()
        continue
      }
      taskItems.value[i].hideShowInfo()
    }
  }

  // 绘制任务航线
  getStrategyConfigDetail({id: planInfo.strategyId}).then(res => {
    if (res.errorCode === '00000') {
      CheckWayLine(window.cesiumViewer, planInfo.strategyId, res.data.altitude, String(siteId.value), String(siteId.value) + 'Point')
    }
  })
};

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

.task-list {
  width: 100%;
  height: 100%;
  background-color: $ComponentBackground;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  width: 100%;
  height: $ComponenHeadHeight;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  border-bottom: $ComponentHeaderBorder;
  background: $ComponentHeadBackground;
  color: $FirstLevelTitleColor;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
}

.title {
  font-size: $FirstLevelTitleFontSize;
}

.title-function {
  display: flex;
  align-items: center;
  gap: 9px;
}

.title-function .button-backward {
  vertical-align: middle;
  width: 2em;
  height: 2em;
  font-size: 18px;
}

.title-function .button-backward:hover {
  cursor: pointer;
  background: #333;
  border: 1px dashed #ccc;
}

.list-function {
  width: 100%;
  padding: $ComponentGap;
  display: flex;
  gap: 10px;
}

.list-function .list-function-input {
  flex: 6;
  color: $TouchColor;
  background: $TouchColorBackground;
  border: 1px solid $TouchColorBackground;
  height: 36px;
}

.list-function .list-function-select {
  background: $TouchColorBackground;
  border: 1px solid $TouchColorBackground;
  flex: 4;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  font-size: $AnnotateFontSize;
  color: $TouchColor;
}

.list-main {
  height: 300px;
  flex-grow: 1;
  padding: 0 9px 9px 9px;
  font-family: $ContentFontFamily;
}

.list-no-main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: $ContentFontFamily;
  font-size: $ContentFontSize;
}

.list-footer {
  height: 42px;
  display: flex;
  justify-content: center;
}

:deep(.el-pager li:hover) {
  color: $SecondTouchColor;
}

:deep(.el-pager li.is-active) {
  color: $TouchColor;
}

:deep(.el-pagination button:hover) {
  color: $SecondTouchColor;
}

:deep(.el-pagination button.is-active) {
  color: $TouchColor;
}
</style>
