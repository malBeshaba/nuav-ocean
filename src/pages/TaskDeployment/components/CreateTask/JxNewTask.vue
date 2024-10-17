<template>
  <div class="create-task">
    <div class="list-header">
      新建任务
    </div>
    <div class="list-main">
      <el-form :model="taskInfo" label-position="top">
        <el-form-item label="任务名称">
          <el-input v-model="taskInfo.name" placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-input disabled placeholder="手动任务"/>
        </el-form-item>
        <el-form-item label="执行航线">
          <el-col :span="17">
            <el-input v-model="taskInfo.waylineName" disabled  placeholder="请选择航线">
            </el-input>
          </el-col>

          <el-col :span="2" class="text-center">
            <span class="text-gray-500"> </span>
          </el-col>

          <el-col :span="3">
            <el-button plain size="small" @click="selectWayline()">选择航线</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="不上传图片和视频">
          <el-radio-group v-model="taskInfo.mediaUpoadFlag">
            <el-radio label="1" border>是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务备注">
          <el-input v-model="taskInfo.missionDesc" type="textarea" rows="12" placeholder="请输入任务备注"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-footer">
      <el-button type="primary" color="#BF6C00" @click="createTask()" plain>确定</el-button>
      <el-button type="primary" @click="closeCreateTask()" plain>取消</el-button>
    </div>
    <JxWayline></JxWayline>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router';
import JxWayline from "@/pages/TaskDeployment/components/WayLine/JxWayline.vue";

const route = useRoute();
const router = useRouter();
import {useMyStore} from "@/store"
import {getStrategyDictInfo,submitManualMissionConfig} from "@/api/jiexiang/jxDronePlan";

const store = useMyStore();

interface strategyDictInfo {
  dictDesc: string;
  dictKey: string;
  dictValue: string;
}

interface strategyDictInfoList {
  [index: number]: strategyDictInfo;
}

const dictInfo = ref({
  strategyDictInfoList: [] as strategyDictInfoList,
})
onMounted(() => {
  taskInfo.siteId = route.query.siteId as string
  taskInfo.mediaUpoadFlag = '0'
  taskInfo.type = '2'
  getStrategyDictInfo({siteId: route.query.siteId as string}).then(res => {
    dictInfo.value = res.data.list
  })
});

// 表单
interface MyObject {
  name: string;
  strategyId: string;
  siteId: string;
  type: string;
  mediaUpoadFlag: string;
  missionDesc: string;
  waylineName: string;
}

const taskInfo = reactive({} as MyObject)

// 返回
const closeCreateTask = () => {
  router.push({
    path: '/default/task/jx-task-list',
    query: {
      siteId: taskInfo.siteId
    },
  })
};

// 选择航线
const selectWayline = () => {
  router.push({
    path: '/default/task/jx-create/add-wayline',
    query: {
      siteId: taskInfo.siteId
    },
  })
};

function createTask() {
  if (taskInfo.name && taskInfo.strategyId && taskInfo.siteId && taskInfo.type && taskInfo.mediaUpoadFlag && taskInfo.missionDesc) {
    submitManualMissionConfig(taskInfo).then(res => {
      if (res.errorCode === '00000') {
        ElMessage.success('创建成功')
        router.push({
          path: '/default/task/jx-task-list',
          query: {
            siteId: taskInfo.siteId
          },
        })
      }
    })
  } else {
    // 如果有任何一个属性的值为空，则不执行 submitManualMissionConfig 方法
    ElMessage.warning('请填写完整信息')
  }
}

watch(() => store.state.selectJxWayline, (val: any, oldVal) => {
  taskInfo.waylineName = val.name
  taskInfo.strategyId = val.id as string
}, { deep: true })
</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

:root {
  --primary-color: $TouchColor
}

.create-task {
  width: 100%;
  height: 100%;
  background-color: $ComponentBackground;
  /* opacity: 0.38; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.list-header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: $ComponentHeadBackground;
  border-bottom: 1px solid $TouchColor;
  color: $FirstLevelTitleColor;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  font-family: $FirstLevelTitleFontFamily;
}

.list-main {
  width: 100%;
  flex-grow: 1;
  padding: 26px 18px;
  color: #FFFFFF;
}

.WeekDayCell {

}

.list-footer {
  width: 100%;
  height: 56px;
  border-top: 1px solid $TouchColor;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
