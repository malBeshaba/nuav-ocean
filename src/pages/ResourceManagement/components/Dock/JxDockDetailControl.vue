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
          <el-popover v-if="item.value !== null && item.value !== 'return_home'"
                      :visible="item.showDeviceSettingPopover" placement="top" :width="160">
            <div>
              <div v-if="!item.switch">
                <div>调节{{ item.label }}</div>
                <el-input v-model="item.status" :placeholder="item.status"/>
              </div>
              <div v-if="item.switch">
                <div>{{ item.label }}</div>
                <el-switch v-model="item.value" active-value=0 inactive-value=1 inline-prompt active-text="开启"
                           inactive-text="关闭"/>
              </div>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="small" type="danger" text @click="item.showDeviceSettingPopover =false">取消</el-button>
              <el-button size="small" type="primary" @click="item.showDeviceSettingPopover = false">确定</el-button>
            </div>
            <template #reference>
              <el-button style="border: none" size="small" @click="item.showDeviceSettingPopover = true">Edit
              </el-button>
            </template>
          </el-popover>
          <el-button v-if="item.value === null && item.value !== 'return_home'" disabled style="border: none"
                     size="small">Edit
          </el-button>
          <el-button class="dock-setting-button-bg" v-if="item.value !== null && item.value === 'return_home'"
                     size="small" type="primary" @click="sendCmdAction(item, index, 0)">{{ item.operateText }}
          </el-button>
        </div>
      </div>
    </div>
    <!--    远程调试模块-->
    <div class="dock-setting">
      <div class="dock-setting-title">
        机库操作
      </div>
      <div class="dock-setting-item" v-for="(item, index) in dockControlList" :key="index">
        <div class="dock-setting-item-left">
          <div class="item-label">{{ item.label }}</div>
          <div v-if="!item.loading" class="item-status">{{ item.status }}</div>
          <div v-if="item.loading" class="item-status">{{ item.operateText }}</div>
        </div>
        <div>
          <el-button class="dock-setting-button-bg" :disabled="!item.active" v-if="!item.loading" size="small"
                     type="primary" @click="sendCmdAction(item, index, 0)">{{ item.operateText }}
          </el-button>
          <el-button class="dock-setting-button-bg" :disabled="!item.active" v-if="item.loading" size="small"
                     type="primary" @click="sendCmdAction(item, index, 1)">{{ item.status }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive, watch} from 'vue'
import {useRoute} from 'vue-router'
import {JxDeviceState, JxDockState} from "@/store/types/device";
import * as siteControl from "@/api/jiexiang/siteControl";
import {useMyStore} from "@/store"
import {send} from "vite";

const store = useMyStore()
const route = useRoute();

// 关闭页面
const emit = defineEmits(["closeControlPanel"]);
const closePanel = () => {
  emit("closeControlPanel", 1);
};

const siteId = ref('');
onMounted(() => {
  siteId.value = route.query.siteId as string;
});

const sendCmdAction = (item: any, index: number, flag: number) => {
  switch (index) {
    case 0:
      item.loading = true
      siteControl[item.status === '关闭' ? 'openHatch' : 'closeHatch']({id: siteId.value as string}).then((res: any) => {
        item.loading = false
      })
      break
    case 1:
      item.loading = true
      siteControl[item.status === '夹紧' ? 'openPushbeamXY' : 'closePushbeamXY']({id: siteId.value as string}).then((res: any) => {
        item.loading = false
      })
      break
    case 2:
      item.loading = true
      siteControl['resetPushbeam']({id: siteId.value as string}).then((res: any) => {
        item.loading = false
      })
      break
    case 3:
      item.loading = true
      siteControl[item.status === '关闭' ? 'openVentilator' : 'closeVentilator']({id: siteId.value as string}).then((res: any) => {
        item.loading = false
      })
      break
    case 4:
      item.loading = true
      if (item.status === '未充电') {
        siteControl['charge']({id: siteId.value as string}).then((res: any) => {
          item.loading = false
        })
      }
      break
    case 5:
      item.loading = true
      siteControl[item.status === '离线' ? 'takeOff' : 'droneOff']({id: siteId.value as string}).then((res: any) => {
        item.loading = false
      })
      break
  }
}

// 获得设备信息
let dockInfo = reactive({} as JxDockState)
let droneInfo = reactive({} as JxDeviceState)


// 属性设置
const inputControlSetting = ref('');
// TODO 无人机操控
const controlSetting = ref([{
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
      funcS: 'return_home',
      funcE: 'returnHome',
      loading: false,
    }]
)

// 调试参数
const dockControlList = ref(
    [{
      id: 0,
      active: true,
      label: '舱门',
      status: '关闭',
      operateText: '打开',
      funcS: 'openHatch',
      funcE: 'closeHatch',
      loading: false,
    }, {
      id: 1,
      active: true,
      label: '推杆',
      status: '夹紧',
      operateText: '松开',
      funcS: 'openPushbeamXY',
      funcE: 'closePushbeamXY',
      loading: false,
    }, {
      id: 2,
      active: true,
      label: '推杆复位',
      status: '--',
      operateText: '复位',
      funcS: 'resetPushbeam',
      funcE: 'resetPushbeam',
      loading: false,
    }, {
      id: 3,
      active: true,
      label: '空调',
      status: '关闭',
      operateText: '开启',
      funcS: 'openVentilator',
      funcE: 'closeVentilator',
      loading: false,
    }, {
      id: 4,
      active: true,
      label: '充电',
      status: '未充电',
      operateText: '充电',
      funcS: 'charge',
      funcE: 'charge',
      loading: false,
    },
      {
        id: 5,
        active: true,
        label: '无人机开机',
        status: '离线',
        operateText: '开机',
        funcS: 'takeOff',
        funcE: 'droneOff',
        loading: false,
      },
      {
        id: 6,
        active: true,
        label: '夜航灯',
        status: '关闭',
        operateText: '开启',
        funcS: 'lightOn',
        funcE: 'lightOff',
        loading: false,
      }, {
      id: 7,
      active: false,
      label: '远程重启上位机',
      status: '--',
      operateText: '重启',
      funcS: 'drone_format',
      funcE: 'droneFormat',
      loading: false,
    }, {
      id: 8,
      active: true,
      label: '远程重启下位机',
      status: '--',
      operateText: '重启',
      funcS: 'supplement_light_open',
      oppositeCmdKey: 'supplement_light_close',
      funcE: 'supplementLightStatus',
      loading: false,
    }, {
      id: 9,
      active: false,
      label: '远程更新上位机程序',
      status: '--',
      operateText: '上传',
      funcS: 'alarm_state_switch',
      action: 1, // 开启, 0 关闭
      funcE: 'alarmState',
      loading: false,
    }, {
      id: 10,
      active: false,
      label: '远程上传上位机日志',
      status: '--',
      operateText: '上传',
      funcS: 'battery_store_mode_switch', // 电池保养
      funcE: 'batteryStoreMode',
      loading: false,
    }, {
      id: 11,
      active: false,
      label: '远程清除上位机日志',
      status: '--',
      operateText: '清除',
      funcS: 'battery_maintenance_switch', // 飞行器电池保养
      funcE: 'droneBatteryMode',
      loading: false,
    }, {
      id: 12,
      active: false,
      label: '远程开启Display',
      status: '--',
      operateText: '开启',
      funcS: 'sdr_workmode_switch', // 增强图传
      funcE: 'sdrWorkMode',
      loading: false,
    }]
)


// 监听机场
watch(() => store.state.jxDockState[route.query.siteId as string], (val, oldVal) => {
  dockInfo = val
  if (dockInfo) {
    dockControlList.value.forEach((item: any) => {
      switch (item.id) {
        case 0:
          item.status = dockInfo.hatchState === '0' ? '关闭' : '开启'
          item.operateText = dockInfo.hatchState === '0' ? '打开' : '关闭'
          break
        case 1:
          item.status = dockInfo.pushbeamXState === '0' ? '夹紧' : '松开'
          item.operateText = dockInfo.pushbeamXState === '0' ? '松开' : '夹紧'
          break
        case 3:
          item.status = dockInfo.ventilatorState === '0' ? '关闭' : '开启'
          item.operateText = dockInfo.ventilatorState === '0' ? '打开' : '关闭'
          break
        case 4:
          item.status = dockInfo.wirelessChargeState === '0' ? '未充电' : '充电'
          break
      }
    })
  }
}, {deep: true})

// 监听无人机
watch(() => store.state.jxDeviceState[route.query.siteId as string], (val, oldVal) => {
  droneInfo = val
  if (droneInfo) {
    dockControlList.value.forEach((item: any) => {
      switch (item.id) {
        case 5:
          item.status = droneInfo.uavState === '在线' ? '在线' : '离线'
          break
      }
    })
  }
}, {deep: true})


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
  border: $DockControlSettingBorder;
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
