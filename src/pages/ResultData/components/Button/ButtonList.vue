<template>
  <div class="button-list">
    <el-icon :size="32" class="button-icon" @click="clickVideoReplay"><VideoPlay /></el-icon>
    <!-- 下拉框 -->
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        <el-icon :size="32" class="button-icon"><Fold /></el-icon>
      </span>
      <template #dropdown>
<!--        <el-dropdown-menu v-for="item in displayOptions" :key="item.value">-->
        <el-dropdown-menu>
<!--	        <el-dropdown-item :command="item.value">{{ item.label }}</el-dropdown-item>-->
          <el-dropdown-item command="map">地图</el-dropdown-item>
          <el-dropdown-item command="photo">图像</el-dropdown-item>
          <el-dropdown-item command="videotape">录像</el-dropdown-item>
          <el-dropdown-item command="video">图传视频</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
<!--	  <video style="width: 400px;height: 400px" class="ResultDataVideoFusion" id="ResultDataVideoFusion" muted="" autoplay="" loop="" crossorigin="" controls="">-->
<!--		  <source src="http://218.192.100.219:8080/live/livestream3/videofusiontest0711.mp4" type="video/mp4">-->
<!--	  </video>-->
    <!-- 选择器 -->
    <!-- <el-select v-model="displayType" placeholder="展示类型" @change="changeDisplayType">
      <el-option
        v-for="item in display0ptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Fold, VideoPlay } from '@element-plus/icons-vue'
import {getFlyTrajectoriesByPlanId} from '@/api/wayline'
import {TrackPath} from '@/pages/ResultData/components/Task/trackPath'
import {DrawPolyline, RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import {VideoFusion} from '@/components/mapTools/class/MapVideoFusionClass'
import * as Cesium from 'cesium'
//@ts-ignore
import droneModel from '@assets/models/airDrone.glb'
const route = useRoute();
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
    // router.push({
    //   path: '/default/result/task-list/video-replay',
    //   query: {
    //     device_sn: props.ResultDataButtonValue.device_sn,
    //     flightPlanId: props.ResultDataButtonValue.flightPlanId
    //   },
    // })
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
const displayOptions = [
  {
    value: 'map',
    label: '地图',
  },
  {
    value: 'photo',
    label: '图像',
  },
  {
    value: 'video',
    label: '视频',
  }
]
const changeDisplayType = (val: string) => {
  if(props.ResultDataButtonValue.flightPlanId) {
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
};
// watch(() => props.ResultDataButtonValue.flightPlanId, (newData, oldData) => {
//   displayType.value = ''
// }, { deep: true })

const showFlyPath = (flightPlanId: string) => {
	console.log('flightPlanId', flightPlanId)
	getFlyTrajectoriesByPlanId(flightPlanId).then(res => {
    if(res.code === 0) {
			if(res.data.length === 0) {
				// 没有飞行轨迹
				alert('此任务暂不支持航线回溯，请检查航线文件或点击其他任务')
			} else {
				console.log('res', res.data)
				const videoSource = document.getElementById('ResultDataVideoFusion')
				// const vf2 = new VideoFusion({
			  //   id: flightPlanId,
			  //   position: Cesium.Cartesian3.fromDegrees(Number(res.data[0].longitude), Number(res.data[0].latitude), Number(res.data[0].height)),
			  //   perspectiveFrustumType: {
			  //     fov: 90,
			  //     near: 1,
			  //     far: 120,
				//     aspectRatioWidth: 100,
				// 		aspectRatioHeight: 200,
			  //   },
			  //   hpr: [90, 180, 0],
				// 	videoSource: videoSource,
				// 	droneModelUri: droneModel,
				// 	show: true
			  // })
        res.data = res.data.filter(item => item.longitude !== 0);
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
  top: 0px;
  margin-top: $NavigationHeight;
  right: $ComponentGap;
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


// 选择器
// :deep(.el-input) {
//   width: 116px;
//   margin-right: 12px;
//   --el-input-bg-color: #333;
//   --el-input-text-color: #ccc;
// }
</style>
