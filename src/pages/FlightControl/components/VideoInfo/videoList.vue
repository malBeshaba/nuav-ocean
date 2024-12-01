<template>
<div class="video-list">
  <list-head title="无人机视频任务列表" />
	<div class="video-item">
		<div class="video-info">
			<el-table
				:data="video_list_data"
				@selection-change="handleSelectionChange"
				header-align="center"
				style="width: 100%; height: 100%"
			>
				<el-table-column type="selection" width="40" />
				<el-table-column label="任务名称" width="250">
					<template #default="scope">
						{{ video_list[scope.row.planId] ? video_list[scope.row.planId] : '未知计划，请检查任务列表' }}
					</template>
				</el-table-column>
				<el-table-column label="执行时间" sortable width="200">
					<template #default="scope">
						{{ scope.row.videoStartTime }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-link
							type="primary"
							@click="downloadByURL(scope.$index, scope.row)"
						>
							下载
						</el-link>
						<el-link
							style="margin-left: 10px"
							type="primary"
							@click="PreviewVideoByURL(scope.$index, scope.row)"
						>
							预览
						</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div v-if="is_showPreview" class="preview-window">
	      <div class="preview-content">
	        <video :src="PreviewVideoSRC" controls autoplay></video>
	        <button @click="is_showPreview = false" class="close-btn">关闭预览</button>
	      </div>
	    </div>
		</div>
		<div class="video-btn">
	    <el-button
		    type="primary"
		    size="small"
		    color="#BF6C00"
		    @click="downloadByURLs()"
		    plain
	    >
		    批量下载
	    </el-button>
	    <el-button
		    type="primary"
		    size="small"
		    @click="closeCreateTask()"
		    plain
	    >
		    取消
	    </el-button>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ListHead from '@/components/Head/ListHead.vue';
import {useRoute, useRouter} from 'vue-router';
import {getVideoListBySN, droneVideoInfoType} from '@/api/dronesVideo';
import {getFlightPlanById} from '@/api/droneFlightPlan'

const route = useRoute();
const router = useRouter();

const drone_sn = ref(route.query.device_sn as string);

const video_list_data = ref<droneVideoInfoType[]>([]);
const video_list = ref<{[key: string]: string}>({})

onMounted(() => {
	refreshVideoList();
})

const refreshVideoList = () => {
	getVideoListBySN(drone_sn.value).then( (res: any)  => {
		if(res.code === 0) {
			video_list_data.value = [];
			video_list_data.value = res.data.list;
			video_list_data.value.forEach((item: droneVideoInfoType) => {
				if(!video_list.value[item.planId]) {
					getFlightPlanById(item.planId).then(res => {
						video_list.value[item.planId] = res.data.planName;
					})
				}
			})
		}
	});
}

const downloadByURL = async (index: number, row: droneVideoInfoType) => {
	// download by url
	try {
    // 使用 fetch 获取视频文件
    const response = await fetch(row.videoPlayUrl);
    // 判断请求是否成功
    if (!response.ok) {
      throw new Error('无法下载视频');
    }
    // 获取视频数据作为 Blob
    const videoBlob = await response.blob();
    // 创建一个 URL 对象来指向这个 Blob
    const videoUrlObject = URL.createObjectURL(videoBlob);
    // 创建一个下载链接
    const link = document.createElement('a');
    // 设置下载文件的名称
    link.download = row.videoName;
    // 设置链接地址为 Blob 对象的 URL
    link.href = videoUrlObject;
    // 模拟点击该链接开始下载
    link.click();
    // 释放 Blob URL
    URL.revokeObjectURL(videoUrlObject);
	} catch (error) {
		ElMessage({
	    message: `下载失败:${error}`,
	    type: 'warning',
	  })
	}
}

const is_showPreview = ref(false);
const PreviewVideoSRC = ref('');
const PreviewVideoByURL = (index: number, row: droneVideoInfoType) => {
	is_showPreview.value = true;
	PreviewVideoSRC.value = row.videoPlayUrl;
}

const selected_video_list = ref<droneVideoInfoType[]>([]);
const handleSelectionChange = (val: droneVideoInfoType[]) => {
  selected_video_list.value = val
}

const downloadByURLs = () => {
	// download by url
	if(selected_video_list.value.length === 0) {
		ElMessage({
	    message: '请先选择需要下载的视频',
	    type: 'warning',
	  })
		return;
	}
	if(selected_video_list.value.length > 0) {
		selected_video_list.value.forEach((item: droneVideoInfoType) => {
			downloadByURL(0, item);
		});
	}
}

const closeCreateTask = () => {
	router.go(-1);
}

</script>

<style scoped lang="scss">
.video-list {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: calc(100% - $NavigationHeight - 800px);
  height: calc(100% - $NavigationHeight - 400px);
  left: 450px;
  width: calc($LeftWidth + 200px);
	background-color: #1c2127;
  margin-top: $NavigationHeight;
  z-index: 2;
}

.video-item {
	display: flex;
	width: 100%;
	align-items: center;
  justify-content: center;
	height: calc(100% - 50px);
	top: 20px;
	flex-direction: column;
}

.video-info {
	display: flex;
	flex: 10;
	width: 99%;
	align-items: center;
  justify-content: center;
}

.video-btn {
	display: flex;
	flex: 1;
	width: 99%;
	align-items: center;
  justify-content: center;
}

.preview-window {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  width: 400px;
  max-width: 700px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.preview-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

video {
  width: 100%; /* 播放器宽度自适应 */
  border-radius: 10px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #ff2222;
}
</style>
