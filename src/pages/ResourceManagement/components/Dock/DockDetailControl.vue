<template>
  <div class="dock-control">
<!--    设备属性调节模块-->
    <div class="dock-setting">
      <div class="dock-setting-title">
        设备属性设置
      </div>
      <div class="dock-setting-item" v-for="(item, index) in controlSetting" :key="item.id">
        <div class="dock-setting-item-left">
          <div class="item-label">{{ item.label }}</div>
          <div v-if="item.switch && item.value !== null" class="item-status">{{ item.status[item.value] }}</div>
          <div v-if="!item.switch && item.value !== null" class="item-status">{{ item.status }}米</div>
          <div v-if="item.switch && item.value === 'return_home'" class="item-status">{{ item.status }}</div>
          <div v-if="item.value === null">---</div>
        </div>
        <div>
          <el-popover v-if="item.value !== null && item.value !== 'return_home'" :visible="item.showDeviceSettingPopover" placement="top" :width="160">
            <div>
              <div v-if="!item.switch">
                <div>调节{{ item.label }}</div>
                <el-input v-model="item.status" :placeholder="item.status" />
              </div>
              <div v-if="item.switch">
                <div>{{ item.label }}</div>
                <el-switch v-model="item.value" active-value=0 inactive-value=1 inline-prompt active-text="开启" inactive-text="关闭"/>
              </div>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="small" type="danger" text @click="item.showDeviceSettingPopover =false">取消</el-button>
              <el-button size="small" type="primary" @click="item.showDeviceSettingPopover = false">确定</el-button>
            </div>
            <template #reference>
              <el-button style="border: none" size="small" @click="item.showDeviceSettingPopover = true">Edit</el-button>
            </template>
          </el-popover>
          <el-button v-if="item.value === null && item.value !== 'return_home'" disabled style="border: none" size="small">Edit</el-button>
          <el-button class="dock-setting-button-bg" v-if="item.value !== null && item.value === 'return_home'" size="small" type="primary" @click="sendCmdAction(item, index, 0)">{{ item.operateText }}</el-button>
        </div>
      </div>
    </div>
<!--    远程调试模块-->
    <div class="dock-setting">
      <div class="dock-setting-title">
        远程调试
        <!-- <el-switch :loading="debugLoading" :before-change="beforeShowChangeManage.bind" @change="debugModel(debugMode.DebugMode)" v-model="debugMode.DebugMode" class="mt-2" active-color="#13ce66" :active-value="debugMode.DebugModeOpen" :inactive-value="debugMode.DebugModeClose" style="margin-left: 24px" inline-prompt /> -->
        <el-switch :loading="debugLoading" :before-change="beforeShowChangeManage" v-model="debugMode.DebugMode" class="mt-2" active-color="#F9A100" :active-value="debugMode.DebugModeOpen" :inactive-value="debugMode.DebugModeClose" style="margin-left: 24px" inline-prompt />
      </div>
      <div class="dock-setting-item" v-for="(item, index) in deviceCmdItem" :key="index">
        <div class="dock-setting-item-left">
          <div class="item-label">{{ item.label }}</div>
          <div v-if="!item.loading" class="item-status">{{ item.status }}</div>
          <div v-if="item.loading" class="item-status">{{ item.operateText }}</div>
        </div>
        <div>
          <div v-if="debugMode.DebugMode === debugMode.DebugModeOpen">
            <el-button class="dock-setting-button-bg" :disabled="!item.active" v-if="!item.loading" size="small" :type="item.operateText" @click="sendCmdAction(item, index, 0)">{{ item.operateText }}</el-button>
            <el-button class="dock-setting-button-bg" :disabled="!item.active" v-if="item.loading" size="small" :type="item.status" @click="sendCmdAction(item, index, 1)">{{ item.status }}</el-button>
          </div>
          <div v-if="debugMode.DebugMode === debugMode.DebugModeClose">
            <el-button class="dock-setting-button" size="small" type="primary" disabled>{{ item.operateText }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postSendCmd, SendCmdParams, getBindingDeviceBySn } from '@/api/device'
import { DeviceInfo } from "@/store/types/device";
import { useMyStore } from "@/store"
import {DeviceCmd} from "@/store/types/device-cmd"
import { Close } from '@element-plus/icons-vue'
const store = useMyStore()
const route = useRoute();

// 关闭页面
const emit = defineEmits(["closeControlPanel"]);
const closePanel = () => {
  emit("closeControlPanel", 1);
};

const deviceSn = ref('');
onMounted(() => {
  deviceSn.value = route.query.device_sn as string;
  getDeviceInfo()
});

// 获得设备信息
let dockInfo = reactive({} as DeviceInfo)
let droneInfo = reactive({} as DeviceInfo)
const getDeviceInfo = async () => {
  getBindingDeviceBySn({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    device_sn: route.query.device_sn as string
  }).then(res => {
    // console.log(res)
    if(res.code === 0) {
      dockInfo = res.data
      getBindingDeviceBySn({
        workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
        device_sn: res.data.child_device_sn
      }).then(res => {
        if(res.code === 0) {
          droneInfo = res.data
        }
      })
    }
  })
};

// 属性设置
const inputControlSetting = ref('');
const controlSetting = ref(
  [{
    id: 1,
    label: "飞行器夜航灯",
    name: 'night_lights_state',
    status: ["开启", "关闭"],
    switch: true,
    value: null,
    showDeviceSettingPopover: false,
  }, {
    id: 2,
    label: "限高",
    name: 'height_limit',
    status: 100,
    switch: false,
    value: null,
    showDeviceSettingPopover: false,
  }, {
    id: 3,
    label: "限远",
    name: 'distance_limit_status',
    status: null,
    switch: false,
    value: null,
    showDeviceSettingPopover: false,
  }, {
    id: 4,
    label: "水平避障",
    name: 'obstacle_avoidance_horizon',
    status: ["开启", "关闭"],
    switch: true,
    value: null,
    showDeviceSettingPopover: false,
  }, {
    id: 5,
    label: "上视避障",
    name: 'obstacle_avoidance_upside',
    status: ["开启", "关闭"],
    switch: true,
    value: null,
    showDeviceSettingPopover: false,
  }, {
    id: 6,
    label: "下视避障",
    name: 'ostacle_avoidance_downside',
    status: ["开启", "关闭"],
    switch: true,
    value: null,
    showDeviceSettingPopover: false,
  }, {
    id: 7,
    active: true,
    value: 'return_home',
    label: '一键返航',
    status: '--',
    switch: true,
    operateText: '返航',
    cmdKey: 'return_home',
    func: 'returnHome',
    loading: false,
  }]
)
// 调试设置
const debugMode = reactive({
  DebugModeOpen: 'debug_mode_open', // 调试模式开启
  DebugModeClose: 'debug_mode_close', // 调试模式关闭
  DebugMode: 'debug_mode_close',
})
// 调试参数
const deviceCmdItem = ref(
  [{
    id: 0,
    active: false,
    label: '机场系统',
    status: '工作中',
    operateText: '重启',
    cmdKey: 'device_reboot',
    func: 'deviceReboot',
    loading: false,
  }, {
    id: 1,
    active: true,
    label: '飞行器',
    status: '关机',
    operateText: '开机',
    cmdKey: 'drone_open',
    oppositeCmdKey: 'drone_close',
    func: 'droneStatus',
    loading: false,
  }, {
    id: 2,
    active: true,
    label: '舱盖',
    status: '关闭',
    operateText: '开启',
    cmdKey: 'cover_open',
    oppositeCmdKey: 'cover_close',
    func: 'coverStatus',
    loading: false,
  }, {
    id: 3,
    active: true,
    label: '推杆',
    status: '闭合',
    operateText: '展开',
    cmdKey: 'putter_open',
    oppositeCmdKey: 'putter_close',
    func: 'putterStatus',
    loading: false,
  }, {
    id: 4,
    active: true,
    label: '充电状态',
    status: '未充电',
    operateText: '充电',
    cmdKey: 'charge_open',
    oppositeCmdKey: 'charge_close',
    func: 'chargeStatus',
    loading: false,
  },
  //     {
  //   id: 5,
  //   active: true,
  //   label: '一键返航',
  //   status: '--',
  //   operateText: '返航',
  //   cmdKey: 'return_home',
  //   func: 'returnHome',
  //   loading: false,
  // },
  {
    id: 6,
    active: false,
    label: '机场存储',
    status: '--',
    operateText: '格式化',
    cmdKey: 'device_format',
    func: 'deviceFormat',
    loading: false,
  }, {
    id: 7,
    active: false,
    label: '飞行器存储',
    status: '--',
    operateText: '格式化',
    cmdKey: 'drone_format',
    func: 'droneFormat',
    loading: false,
  }, {
    id: 8,
    active: true,
    label: '补光灯',
    status: '关',
    operateText: '打开',
    cmdKey: 'supplement_light_open',
    oppositeCmdKey: 'supplement_light_close',
    func: 'supplementLightStatus',
    loading: false,
  }, {
    id: 9,
    active: false,
    label: '机场声光报警',
    status: '关',
    operateText: '打开',
    cmdKey: 'alarm_state_switch',
    action: 1, // 开启, 0 关闭
    func: 'alarmState',
    loading: false,
  }, {
    id: 10,
    active: false,
    label: '机场电池存储模式',
    status: '计划',
    operateText: '应急',
    cmdKey: 'battery_store_mode_switch', // 电池保养
    action: 2, // 2 电池应急存储策略  1 电池计划存储策略
    func: 'batteryStoreMode',
    loading: false,
  }, {
    id: 11,
    active: false,
    label: '飞机电池保养',
    status: '--',
    operateText: '保养',
    cmdKey: 'battery_maintenance_switch', // 飞行器电池保养
    action: 1, // 开启, 0 关闭
    func: 'droneBatteryMode',
    loading: false,
    disabled: true,
  }, {
    id: 12,
    active: false,
    label: '4g 增强',
    status: '--',
    operateText: '开启',
    cmdKey: 'sdr_workmode_switch', // 增强图传
    action: 0, // sdr模式 1 4G融合模式
    func: 'sdrWorkMode',
    loading: false,
  }]
)

// 监听机场
watch(() => store.state.deviceState, (val, oldVal) => {
  // console.log('val', val)
  if (val.currentType === 3 && val.dockInfo[val.currentSn]) {
    if (deviceSn.value === val.currentSn) {
      const deviceInfo = val.dockInfo[val.currentSn]
      // controlSetting.value.forEach((setting) => {
      //   if (deviceInfo[setting.name]) {
      //     setting.value = deviceInfo[setting.name]
      //   }
      // })
      deviceInfo.basic_osd.cover_state === 1 ? deviceCmdItem.value[2].loading = true : deviceCmdItem.value[2].loading = false
      deviceInfo.basic_osd.putter_state === 1 ? deviceCmdItem.value[3].loading = true : deviceCmdItem.value[3].loading = false
      deviceInfo.basic_osd.drone_charge_state.state === 1 ? deviceCmdItem.value[4].loading = true : deviceCmdItem.value[4].loading = false
      deviceInfo.basic_osd.supplement_light_state === 1 ? deviceCmdItem.value[8].loading = true : deviceCmdItem.value[8].loading = false
      deviceInfo.basic_osd.alarm_state === 1 ? deviceCmdItem.value[9].loading = true : deviceCmdItem.value[9].loading = false
      debugMode.DebugMode = deviceInfo.basic_osd.mode_code === 2 ? debugMode.DebugModeOpen : debugMode.DebugModeClose
      deviceCmdItem.value[1].loading = deviceInfo.basic_osd.sub_device.device_online_status === 1 ? true: false
      // deviceCmdItem.value[1].loading = val.deviceInfo[droneInfo.device_sn] ? true: false
    }
  }
}, { deep: true })

// const switchType = (value: Number) => {
//   if (value === 0) {
//     return true;
//   } else if(value === 1){
//     return false;
//   }
// }
// const showDeviceSettingPopover1 = (id: String) => {
//   console.log(id)
// }

// 发送调试指令
const debugLoading = ref(false)
const debugModel = (val: DeviceCmd) => {
  postSendCmd({
    dock_sn: deviceSn.value,
    device_cmd: val
  }).then(res => {
    // console.log('res', res)
    if (res.code === 0) {
      ElMessage.success('发送成功！')
    } else {
      ElMessage.error('发送失败！')
    }
  })
}
const beforeShowChangeManage = () => {
  debugLoading.value = true
  return new Promise((resolve, reject)=>{
    try{
      // console.log('debugModel', debugMode.DebugMode)
      postSendCmd({
        dock_sn: deviceSn.value,
        device_cmd: debugMode.DebugMode === debugMode.DebugModeClose ? debugMode.DebugModeOpen as DeviceCmd: debugMode.DebugModeClose as DeviceCmd
      }).then(res => {
        debugLoading.value = false
        // console.log('res', res)
        if (res.code === 0) {
          debugMode.DebugMode === debugMode.DebugModeOpen ? debugMode.DebugModeClose : debugMode.DebugModeOpen
          ElMessage.success('发送成功！')
          // console.log('debugModel212', debugMode.DebugMode)
          resolve(true)
        } else {
          reject(false)
          ElMessage.error('发送失败！')
        }
      })
    }catch(err){
      debugLoading.value = false
      reject(false)
      ElMessage.error('发送失败！')
    }
  })
}

// 发送各种指令
const sendCmdAction = (item: any, index: number, type: number) => {
  let params = {} as SendCmdParams
  if(type === 1) {
    params = {
      dock_sn: deviceSn.value,
      device_cmd: item.oppositeCmdKey
    }
  } else {
    params = {
      dock_sn: deviceSn.value,
      device_cmd: item.cmdKey
    }
  }
  postSendCmd(params, item.action).then(res => {
    // console.log('res', res)
    if (res.code === 0) {
      if (item.cmdKey !== 'return_home') {
        deviceCmdItem.value[index].loading = !deviceCmdItem.value[index].loading
      }
      ElMessage.success('发送成功！')
    } else {
      ElMessage.error('发送失败！')
    }
  })
}
</script>

<style scoped lang="scss">
div {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
/* 整体 */
.dock-control {
  width: 100%;
  height: 100%;
  padding: 0px $ComponentGap;
  display: flex;
  flex-direction: column;
}

/* .dock-control-header {
  border-bottom: 1px solid #515151;
} */

.dock-setting {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* padding: 4px 10px; */
}

.dock-setting-title {
  width: 100%;
  height: 36px;
  font-size: $SecondLevelTitleFontSize;
  font-family: $SecondLevelTitleFontFamily;
  color: $SecondLevelTitleColor;
  font-weight: $SecondLevelTitleFontWeight;
  display: flex;
  align-items: center;
}

.dock-setting-item {
  width: 48%;
  height: 54px;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: $UsualBorder;
  margin: 4px 0;
  padding: 0 8px;
}

.dock-setting-item-left {
  display: flex;
  flex-direction: column;
}

// .item-label {
//   font-weight: $ContentFontWeight;
// }

.dock-setting-button {
  background-color: $TouchColor2;
  color: $TouchColor;
  border: none;
  //鼠标悬浮
  &:hover {
    background: $TouchColor2;
    color: $TouchColor;
    border: none;
  }
  &:focus {
    background: $TouchColor2;
    color: $TouchColor;
    border: none;
  }
}

// 这个是打开调试的状态
.dock-setting-button-bg {
  background: transparent;
  color: $TouchColor;
  border: 1px solid $TouchColor;
  //鼠标悬浮
  &:hover {
    background: $TouchColor2;
    border: 1px solid $TouchColor;
  }
  &:active {
    background: $TouchColor2;
    border: 1px solid $TouchColor;
  }
  &:focus {
    background: $TouchColor2;
    border: 1px solid $TouchColor;
  }
}

</style>
