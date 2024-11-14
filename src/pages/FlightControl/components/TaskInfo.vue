<template>
    <div class="taskInfo">
	    <div style="flex: 1">
		    <list-head :title="title" />
	    </div>
	    <div class="tabs">
		    <div class="tabs-search">
	        <el-input style="width: 95%" v-model="search_by_task_name" placeholder="按任务名称搜索" :suffix-icon="Search" size="default"/>
	      </div>
		    <div class="tabs-create">
			    <el-button type="primary" size="small" @click="createTask()" style="color: white;"><el-icon><Plus /></el-icon>新建任务</el-button>
		    </div>
	    </div>
	    <div class="task-list">
		    <el-scrollbar>
					<div v-if="planInfo.length > 0" class="list-main">
							<el-row :gutter="2" style="width: 95%;">
				        <el-col
				          v-for="item in planInfo"
				          :key="item.flightPlanId"
				          :span="24"
				        >
				          <TaskItem
				            :planInfo="item"
				            @refresh="getTaskInfo"
				          ></TaskItem>
				        </el-col>
				      </el-row>
					</div>
			    <div v-else class="list-no-main">
				    无任务！
			    </div>
		    </el-scrollbar>

	    </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive, computed, watch} from 'vue';
import ListHead from '@/components/Head/ListHead.vue';
import {Plus, Search} from '@element-plus/icons-vue';
import {getFlightPlan} from '@/api/droneFlightPlan';
import TaskItem from '@/components/Task/TaskItem.vue';
import {useRouter} from 'vue-router'

const router = useRouter();

const title = ref('预设计划');

const search_by_task_name = ref('');
const Props = defineProps(
	{docksn: {type: String, default: '7CTDM7T00B00N8'}},
)
// 航线任务
const device_sn = computed(() => Props.docksn);
const selectValue = ref('1,2,5');
const planInfo = reactive([] as any[]);
const currentPage = ref(1)
const currentSize = ref(5)
const total = ref(20)


onMounted(() => {
	getTaskInfo();
});

const createTask = () => {
	router.push({
    path: '/default/info/create',
    query: {
      device_sn: device_sn.value
    },
  });
};

const getTaskInfo = async () => {
  planInfo.splice(0, planInfo.length);
  getFlightPlan(JSON.parse(localStorage.getItem('userInfo') as string).workspace_id, {
    pageNo: currentPage.value,
    pageSize: currentSize.value,
    deviceSn: device_sn.value,
    planStatus: selectValue.value
  }).then(res => {
    if (res.code === 0) {
      total.value = res.data.pagination.total
      res.data.list.forEach((item: any) => {
        planInfo.push(item)
      })
    }
  })
};

watch(() => device_sn.value, () => {
	getTaskInfo();
})

</script>

<style scoped lang="scss">
.taskInfo {
  position: relative;
	display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: $ComponentBackground;
}

.tabs {
	flex: 1;
	width: 100%;
	height: 40px;
	line-height: 40px;
	display: flex;
  flex-direction: row;
}

.tabs-search {
	flex: 3;
	width: 80%;
	text-align: center;
}

.tabs-create {
	flex: 1;
	text-align: center;
}

.task-list {
	width: 100%;
	flex: 3;
	height: calc(100% - 80px);
}

.list-main {
  flex-grow: 1;
  padding: 0 9px 9px 9px;
  font-family: $ContentFontFamily;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.list-no-main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: $ContentFontFamily;
  font-size: $ContentFontSize;
}
</style>
