<template>
  <div class="navigation" v-show="showNavigation">
<!--      <div class="logo">-->
<!--&lt;!&ndash;          <el-avatar shape="square" :size="60" :src="logoPng" />&ndash;&gt;-->
<!--          <img :src="logoPng" alt="" class="logo_img" >-->
<!--      </div>-->
    <div class="Title" @click="clickTab('home')">
      <div class="title-zh">广东省海城海岛视频监控监测平台</div>
<!--      <div class="title-en">Low-altitude UAV Remote Sensing Platform</div>-->
    </div>
    <div class="tabs">
<!--      <TabSelector :ssr="controlimg" :src="controlIMG" name="控制中台" :selected="activeName==='control'" @click="clickTab('control')"></TabSelector>-->
      <TabSelector :ssr="planIMG" :src="planIMG" name="任务部署" :selected="activeName==='plan'" style="margin-left: 30px" @click="clickTab('plan')"></TabSelector>
      <TabSelector :ssr="resouceIMG" :src="resouceIMG" name="资源管理" :selected="activeName==='resource'" style="margin-left: 30px" @click="clickTab('resource')"></TabSelector>
      <TabSelector :ssr="dataIMG" :src="dataIMG" name="成果数据" :selected="activeName==='data'" style="margin-left: 30px" @click="clickTab('data')"></TabSelector>
    </div>
    <div class="master">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-image :src="masterIMG" style=""></el-image>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="log-out">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
import type { TabsPaneContext } from 'element-plus'
import TabSelector from "@/components/Tabs/TabSelector.vue";
import controlIMG from "@/assets/Tabs/control-s.png"
import controlimg from "@/assets/Tabs/control.png"
import planIMG from "@/assets/Tabs/plan.png"
import planimg from "@/assets/Tabs/plan-s.png"
import resouceIMG from "@/assets/Tabs/source.png"
import dataIMG from "@/assets/Tabs/data.png"
import masterIMG from "@/assets/Tabs/master.png"
import router from "@/router";
import logoPng from "@/assets/images/logo.png";
import {ElMessage} from "element-plus";
let activeName = ref('control')
import { useMyStore } from '@/store'
const store = useMyStore()

enum Tabs {
  ControlCenter = 'control',
  TaskDeployment = 'plan',
  ResourceManagement = 'resource',
  OutcomeData = 'data',
	Home = 'home'
}

const clickTab = (tab: string) => {
    if(String(activeName.value) == tab){
        router.push({path: '/default/home'})
        return
    }

  // console.log(tab)
  switch (tab) {
    case Tabs.ControlCenter:
      activeName.value = Tabs.ControlCenter;
      router.push({path: '/default/control/drone-list'});
      break
    case Tabs.TaskDeployment:
      activeName.value = Tabs.TaskDeployment;
      router.push({path: '/default/task'})
      break
    case Tabs.ResourceManagement:
      activeName.value = Tabs.ResourceManagement;
      router.push({path: '/default/resource'})
      break
    case Tabs.OutcomeData:
      activeName.value = Tabs.OutcomeData
      router.push({path: '/default/result'})
      break
	  case Tabs.Home:
		  activeName.value = Tabs.Home
      router.push({path: '/default/home'})
		  break
    default:
      break
  }
}
watch(() => router.currentRoute.value.path, (newValue, oldValue) => {
  // console.log('path', newValue, oldValue)
  if (newValue.includes('/default/control')) {
    activeName.value = Tabs.ControlCenter
  } else if (newValue.includes('/default/task')) {
    activeName.value = Tabs.TaskDeployment
  } else if (newValue.includes('/default/resource')) {
    activeName.value = Tabs.ResourceManagement
  } else if (newValue.includes('/default/result')) {
    activeName.value = Tabs.OutcomeData
  } else if (newValue.includes('edit-waypoint')) {
		store.commit('SET_NAVIGATION_TYPE', false)
  }	else if (newValue.includes('/default/home')) {
		activeName.value = Tabs.Home
    // ElMessage.error(newValue)
  } else {
		// ElMessage.error(newValue)
  }
}, {immediate: true})

const handleCommand = (command: string | number | object) => {
  // ElMessage(`click on item ${command}`)
  switch (command) {
    case 'log-out':
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      // localStorage.removeItem('Authorization');
      // localStorage.removeItem('userinfo2');
      router.go(0)
      // router.
  }
}

const showNavigation = ref(true)
watch(store?.state?.navigationType, (value) => {
	if (value.type) {
		showNavigation.value = value.type
	} else {
		showNavigation.value = value.type
	}
})
</script>

<style scoped lang="scss">
.navigation {
  width: 100%;
  height: $NavigationHeight;
  background: -webkit-linear-gradient(top, rgb(16, 53, 69) 0%, rgba(16, 53, 69, 0.6) 60%, rgba(16, 53, 69, 0) 99%);
  position: relative;
  display: flex;
}
.logo {
  display: flex;
  margin-left: 20px;
  margin-top: 12px;
  width: 60px;
  height: 70px;
}
.logo_img {
  width: 100%;
  height: 100%;
  background-size:contain ;
  background-repeat: no-repeat;
}
.Title {
	cursor: pointer;
  margin-left: 20px;
  padding-top: 20px;
}
.title-zh {
  font-family: $PlatformNameFontFamily-zh;
  font-size: $PlatformNameFontSize-zh;
  font-weight: $PlatformNameFontWeight-zh;
  color: $PlatformNameColor-zh;
}
.title-en {
  font-family: $PlatformNameFontFamily-en;
  font-size: $PlatformNameFontSize-en;
  font-weight: $PlatformNameFontWeight-en;
  color: $PlatformNameColor-en;
}
.tabs {
  display: flex;
  margin-top: 20px;
  margin-left: 650px;
}
.master {
  margin-top: 30px;
  margin-left: 40px;
}
</style>
