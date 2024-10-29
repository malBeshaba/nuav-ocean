<template>
  <div class="button-list">
    <el-icon :size="32" class="button-icon" @click="clickVideoReplay"><VideoPlay /></el-icon>
    <!-- 下拉框 -->
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        <el-icon :size="32" class="button-icon"><Fold /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="map">地图</el-dropdown-item>
          <!-- <el-dropdown-item command="photo">图像</el-dropdown-item> -->
          <el-dropdown-item command="videotape">录像</el-dropdown-item>
          <el-dropdown-item command="video">AI检测</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Fold, VideoPlay } from '@element-plus/icons-vue'
import {getFlyTrajectoriesByPlanId} from '@/api/wayline'
import {TrackPath} from '@/pages/ResultData/components/Task/trackPath'
import {DrawPolyline, RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
const router = useRouter();

onMounted(() => {
});

const props = defineProps<{
	ResultDataButtonValue: {
		flightPlanId: string,
		isShow: boolean,
		device_sn: string,
	}
}>()
watch(props.ResultDataButtonValue, (val) => {
	displayType.value = ''
}, { deep: true })
// 监听路由

const clickVideoReplay = () => {
  if (props.ResultDataButtonValue.flightPlanId) {
	  showFlyPath(props.ResultDataButtonValue.flightPlanId)
  }
}
// 下拉框
const handleCommand = (val: string | number | object) => {

  if (props.ResultDataButtonValue.flightPlanId) {
    if(val == 'map') {
      router.push({
        path: '/default/result/task-list',
        query: {
          device_sn: props.ResultDataButtonValue.device_sn,
          flightPlanId: props.ResultDataButtonValue.flightPlanId
        },
      })
    }
    else if(val == 'photo') {
      router.push({
        path: '/default/result/task-list/photo',
        query: {
          device_sn: props.ResultDataButtonValue.device_sn,
          flightPlanId: props.ResultDataButtonValue.flightPlanId
        },
      })
    }
    else if(val == 'videotape') {
      router.push({
        path: '/default/result/task-list/videotape',
        query: {
          device_sn: props.ResultDataButtonValue.device_sn,
          flightPlanId: props.ResultDataButtonValue.flightPlanId
        },
      })
    }
    else if(val == 'video') {
      router.push({
        path: '/default/result/task-list/video',
        query: {
          device_sn: props.ResultDataButtonValue.device_sn,
          flightPlanId: props.ResultDataButtonValue.flightPlanId
        },
      })
    }
  }
}

// 选择器
const displayType = ref('')

const showFlyPath = (flightPlanId: string) => {
	console.log('flightPlanId', flightPlanId)
	getFlyTrajectoriesByPlanId(flightPlanId).then(res => {
    if(res.code === 0) {
			if(res.data.length === 0) {
				// 没有飞行轨迹
				alert('此任务暂不支持航线回溯，请检查航线文件或点击其他任务')
			} else {
				console.log('res', res.data)
        res.data = res.data.filter((item: any) => item.longitude !== 0);
				TrackPath(window.cesiumViewer, res.data, flightPlanId)
			}
    }
	})
}

onBeforeUnmount(() => {
	// 清除飞行轨迹
	RemoveEntitiesByBatch(window.cesiumViewer, 'ResultPath')
})

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.button-list {
  position: fixed;
  top: 20px;
  margin-top: $NavigationHeight;
  right: $ComponentGap + $RightWidth + 20px;
  gap: $ComponentGap;
  background-color: transparent;
  display: flex;
  overflow: hidden;
  z-index: 3;
}

.button-icon {
  color: $TouchColor;
  cursor: pointer;
  margin-top: 16px;
  border: none;
}
</style>
