<template>
  <div class="device-list">
    <list-head title="设备列表" style="width: 100%;"></list-head>
    <!-- <div class="list-title">
      设备列表（共计
      <span style="color: orange; ">
      {{ taskTotal }}
      </span>
      项任务）
    </div> -->
    <div class="list-function">
      <!-- <div class="list-function-select">
          <el-select v-model="selectValue" placeholder="请选择设备" @change="selectChange" size="default" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div> -->
      <div class="list-function-input">
        <el-input v-model="input" placeholder="请输入搜索内容" :suffix-icon="Search" size="default"/>
      </div>
    </div>
    <div class="list-main">
      <el-collapse v-model="activeName" @change="handleChange">
        <el-collapse-item name="drone" >
          <template #title>
            <div class="collapse-title" >
              <div class="orange-dot"></div>
              <div class="collapse-title-left">无人机</div>
              <div class="collapse-title-main"> </div>
              <div class="collapse-title-right">收起({{ droneTotal }})</div>
            </div>
          </template>
          <div v-if="droneInfo.length > 0">
            <div v-for="item in droneInfo" :key="item.device_sn">
              <DroneItem :droneInfo="item" @click="getDroneDetail(item.device_sn)"></DroneItem>
            </div>
          </div>
          <div v-else>
            无设备！
          </div>
        </el-collapse-item>

        <el-collapse-item name="dock" >
          <template #title>
            <div class="collapse-title">
              <div class="orange-dot"></div>
              <div class="collapse-title-left">停机坪</div>
              <div class="collapse-title-main"> </div>
              <div class="collapse-title-right">收起({{ dockTotal }})</div>
            </div>
          </template>
          <div v-for="item in dockInfo" :key="item.device_sn">
            <DockItem :dockInfo="item" @click="getDockDetail(item.device_sn)"></DockItem>
          </div>
<!--          <div v-for="item in jxDockInfo" :key="item.id">-->
<!--            <JxDockItem :dockInfo="item" @click="getjxDockDetail(item)"></JxDockItem>-->
<!--          </div>-->
        </el-collapse-item>

        <el-collapse-item name="user"  v-if="route.path.split('/')[2] == 'resource'">
          <template #title>
            <div class="collapse-title">
                <div class="orange-dot"></div>
              <div class="collapse-title-left">地勤人员</div>
              <div class="collapse-title-main"> </div>
              <div class="collapse-title-right">收起({{ userTotal }})</div>
            </div>
          </template>
            <el-scrollbar height="450px" >
                <div class="emptyTask" id="emptyTask">
                    <div class="addButton" id="addButton" @click="createUser">
                        <div class="block" id="block">+</div>
                        <div class="block_tail" id="block_tail">点击添加人员</div>
                    </div>
                </div>
              <div v-for="item in userInfos" :key="item.user_id">
                  <UserItem :userInfo="item" @delete-user="handleUserDelete"></UserItem>
              </div>
            </el-scrollbar>

        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import DroneItem from "@/components/Equipment/DroneItem.vue";
import DockItem from "@/components/Equipment/DockItem.vue";
import ListHead from "@/components/Head/ListHead.vue";
import UserItem  from "@/components/Equipment/UserItem.vue";
// import JxDockItem from "@/components/Equipment/JxDockItem.vue";
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBindingDevices } from '@/api/device'
import { getFlightPlan } from '@/api/droneFlightPlan'
import { CesiumFlyTo, DrawPointByBillboard } from '@/components/mapTools/BaseMapTools'
import { Search } from '@element-plus/icons-vue'
import { useMyStore } from '@/store'
import {getUsers,selectPage} from "@/api/adminUser";
import dockImage from '@/assets/map/dock.png'
// import { getHomepageSiteList } from '@/api/jiexiang/site'
import * as Cesium from 'cesium'
const store = useMyStore()

onMounted(() => {
  getDroneList();
  getDockList();
  getTaskInfo();
    getUserList()
  // getJxDockInfo();
});

// 获取无人机设备
const droneInfo = ref([] as any[]);
const droneTotal = ref('-');
const getDroneList = () => {
  droneInfo.value = []
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 0,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      droneTotal.value = res.data.pagination.total
      droneInfo.value = res.data.list
      // res.data.list.forEach((item: any) => {
      //   droneInfo.push(item)
      // })
    }
  })
};
// 获取机场
const dockInfo = ref([] as any[]);
const dockTotal = ref('-');
const getDockList = () => {
  dockInfo.value = []
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 3,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      dockTotal.value = res.data.pagination.total
      dockInfo.value = res.data.list
    }
  })
};

// 获取用户
const userInfos = ref([] as any[]);
const userTotal = ref('-');
const getUserList = ()=>{
    userInfos.value = []
    selectPage({
        "page":1,
        "page_size":50,
    }).then(res=>{
        const response = res.data
        response.data.list.forEach(element => {
						userInfos.value.push(element);
        });
        userTotal.value = String(response.data.list.length)
    })
}

const choseGender = (value: boolean) => {
	if(value) {
		return '1'
	} else {
		return '0'
	}
}

const createUser = () => {
    // console.log('新建用户')
    router.push({
        path: '/default/resource/editOrCreateUser',
        query: {
            title: '新建用户',
            userInfo:JSON.stringify({
                user_id:"",
                username: "",
                workspace_name: "",
                user_type: "",
                mqtt_username: "",
                mqtt_password: "",
                create_time: "",
                icon: "",
                email: "",
                cellphone: "",
                nick_name: "",
                gender: true,
                note: "",
                status: true
            })
        }
    })
}

const handleUserDelete = (id: string) => {
    userInfos.value = userInfos.value.filter(item => item.user_id !== id)
    userTotal.value = String(userInfos.value.length)
}

// 获取飞行任务
const taskTotal = ref('-');
const getTaskInfo = async () => {
  getFlightPlan(JSON.parse(localStorage.getItem('userInfo')).workspace_id, {
    pageNo: 1,
    pageSize: 50,
    deviceSn: ''
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      taskTotal.value = res.data.pagination.total
    }
  })
};
// 点击设备，路由跳转
const route = useRoute();
const router = useRouter();
const getDroneDetail = (device_sn: string) => {
  // console.log('route', route.path.split('/')[2])
	checkDevice(device_sn)
  if (route.path.split('/')[2] == 'task') {
    goToTask(device_sn)
  } else if (route.path.split('/')[2] == 'resource') {
    router.push({
      path: '/default/resource/drone',
      query: {
        device_sn: device_sn
      }
    })
  } else if (route.path.split('/')[2] == 'result') {
    goToResult(device_sn)
  }
};
const getDockDetail = (device_sn: string) => {
  console.log(device_sn,'新建任务页面跳转')
  if(device_sn){
    checkDrone(device_sn)
    if (route.path.split('/')[2] == 'task') {
      goToTask(device_sn)
    } else if (route.path.split('/')[2] == 'resource') {
      router.push({
        path: '/default/resource/dock',
        query: {
          device_sn: device_sn
        }
      })
    } else if (route.path.split('/')[2] == 'result') {
      goToResult(device_sn)
    }
  }
};

// 捷翔机库跳转
const getjxDockDetail = (item: any) =>{
  const dockPoint = window.cesiumViewer.entities.getById(String(item.id) + 'dockCheck')
  if(dockPoint) {
    window.cesiumViewer.entities.remove(dockPoint)
  }
  DrawPointByBillboard(window.cesiumViewer, String(item.id) + 'dockCheck', [item.lon,item.lat, 30], 0, dockImage)
  CesiumFlyTo(window.cesiumViewer, {longitude:113.0231382461631, latitude:23.135108621871483, height: 1500})

  if (route.path.split('/')[2] == 'task') {
    router.push({
      path: '/default/task/jx-task-list',
      query: {
        siteId: item.id
      }
    })
    // TODO 先处理任务
  } else if (route.path.split('/')[2] == 'resource') {
    router.push({
      path: '/default/resource/jxdock',
      query: {
        siteId: item.id
      }
    })
  // } else if (route.path.split('/')[2] == 'result') {
  //   goToResult(device_sn)
  }
}
const goToTask = (device_sn: string) => {
  router.push({
    path: '/default/task/task-list',
    query: {
      device_sn: device_sn
    }
  })
};
const goToResult = (device_sn: string) => {
  router.push({
    path: '/default/result/task-list',
    query: {
      device_sn: device_sn
    }
  })
};
// 筛选框
const options = reactive([
  {
    label: '无人机',
    value: 'drone',
  },{
    label: '停机坪',
    value: 'dock',
  }
  ,{
    label: '地勤人员',
    value: 'user',
  }
]);
const selectValue = ref('');
const selectChange = (val: string) => {
  activeName.value = [];
  activeName.value.push(val)
};
// 搜索框
const input = ref('');
// 折叠面板
const activeName = ref(['drone']);
const handleChange = (val: string[]) =>{
  // console.log('val', val);
};

const checkDrone = (device_sn: string) => {
	store?.commit('CHECK_DOCK_STATE', { device_sn: device_sn, isShow: true })
	store?.state?.checkDockState.forEach((item: any) => {
		if (item.sn == device_sn) {
			const dockPoint = window.cesiumViewer.entities.getById(String(device_sn) + 'dockCheck')
			if(dockPoint) {
				window.cesiumViewer.entities.remove(dockPoint)
				DrawPointByBillboard(window.cesiumViewer, String(device_sn) + 'dockCheck', [item.position.longitude,item.position.latitude, item.position.height], 0, dockImage)
			} else {
				DrawPointByBillboard(window.cesiumViewer, String(device_sn) + 'dockCheck', [item.position.longitude,item.position.latitude, item.position.height], 0, dockImage)
			}
		}
	})
	let centerPosition: number[] = []
	Object.keys(store.state.deviceState.dockInfo).forEach((key: string) => {
		if (key == device_sn) {
			centerPosition = [store.state.deviceState.dockInfo[key].basic_osd.longitude, store.state.deviceState.dockInfo[key].basic_osd.latitude]
		}
	})
	CesiumFlyTo(window.cesiumViewer, {longitude: centerPosition[0], latitude: (centerPosition[1] - 0.014), height: 1500})
}

const checkDevice = (device_sn: string) => {
	Object.keys(store.state.deviceState.deviceInfo).forEach((key: string) => {
		if(key === device_sn) {
			const centerPosition = [Number(store.state.deviceState.deviceInfo[key].longitude), Number(store.state.deviceState.deviceInfo[key].latitude)]
			CesiumFlyTo(window.cesiumViewer, {longitude:centerPosition[0], latitude:centerPosition[1] - 0.015, height: 1500})
		}
	})
}

</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.device-list {
  position: fixed;
  top: 0px;
  margin-top: $NavigationHeight;
  height: calc(100% - $NavigationHeight);
  width: $LeftWidth;
  background: $ComponentBackground;
  z-index: 2;
}

// 旧版本
// .list-title {
//   font-size: 16px;
//   font-family: Microsoft YaHei, sans-serif;
//   font-weight: 400;
//   color: #FFFFFF;
//   height: 17px;
//   border-left: 4px solid orange;
//   padding-left: 1rem;
// }

.list-function {
  display: flex;
  background: $ComponentBackground;
  width: 100%;
  padding: $ComponentGap;
  padding-bottom: 0px;
}

.list-function .list-function-select {
  position: absolute;
  left:15px;
  width: 166px;
  height: 36px;
  background: $TouchColorBackground;
  border: 1px solid $TouchColor;
  opacity: 0.8;
  /*padding: 0px;*/
  /*flex: 4;*/
  /*padding-right: 16px;*/
}

.list-function .list-function-input {
  /* left: 191px; */
  /* width: 196px; */
  color: $TouchColor;
  width: 100%;
  height: 36px;
  background: $TouchColorBackground;
  border: 1px solid $TouchColorBackground;
  /*padding: 0px;*/
  /*flex: 6;*/
}

:deep(.el-input__wrapper){
  box-shadow: none;
  /*background-color: black;*/
}

.list-main {
  padding: 1rem;
  flex-grow: 1;
  /* position: absolute; */
  /* width:400px ; */
}

.collapse-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* background: black; */
  font-size: $SecondLevelTitleFontSize;
  font-family: $SecondLevelTitleFontFamily;
  font-weight: $SecondLevelTitleFontWeight;
  color: $SecondLevelTitleColor;
  /*border: 1px solid #F9A100;*/
  /*background-color: #0A0B0E;*/
}
.collapse-title-main{
  flex-grow: 1;
  border: 1px dashed $AnnotateColor;
  margin: 0 4px;
  /*border:none;*/
}

.el-collapse.el-collapse-item__header is-active focusing {
  background-color: $ComponentBackground;
  border-bottom: none;
}

.el-collapse {
  --el-collapse-border-color: none;
  --el-collapse-content-bg-color: $ComponentBackground;
  border-top: none;
  border-bottom: none;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background: $TouchColor;
  margin-right: 6px;
}
.emptyTask{
  //position :absolute;
  width: 25%;
  //right :50%;
  bottom :0px;
  background-color :#222831;
  text-align :center;
  color: white;
}
.addButton{
  position :relative;
  display :flex;
  flex-direction :column;
  top :42%;
}

.block{
  line-height: 46px;
  margin-left: auto;
  margin-right :auto;
  text-align: center;
  width :46px;
  height :46px;
  border: 1px dashed white;
  border-radius :5px;
}

.block_tail{
    margin-top :8px;
  font-size: 10px;
  letter-spacing: 1.2px;
}
</style>
