<template>
  <div class="DetailInformationPanel">
    <div class="PlanTitle">
      <div class="orange-dot"></div>
      <div class="PlanName">{{ planInfo.name }}</div>
    </div>
    <div class="PlanExecuteType">
      <img class="TypeImg" src="@assets/TaskDeployment/Mission.png">
      <div class="PlanExecutetypeText">{{ getTaskType(planInfo.type) }}</div>
    </div>
    <div class="PlanTextInformation">
      <div class="CompletionDegree">站点名称： {{ planInfo.siteName }}</div>
      <div class="TaskAccessTime">执行航线： {{ planInfo.strategyName }}</div>
      <div class="TaskAccessDuration">完成动作： {{ strategyConfigDetail.completeAct }}</div>
      <div class="EstimatedCompletionTime">控制模式： {{ strategyConfigDetail.controlMode }}</div>
      <div class="RemainingDuration">航点数量： {{ pointNum }}</div>
    </div>
    <div class="TableFirstRow">
      <div class="TableBox DroneElectricitLevel">
        <span class="table-title">无人机状态<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.uavState : str }}</span>
      </div>
      <div class="TableBox DroneElectricitLevel">
        <span class="table-title">经度<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.longitude : str }}</span>
      </div>
      <div class="TableBox DroneElectricitLevel">
        <span class="table-title">纬度<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.latitude : str }}</span>
      </div>

    </div>
    <div class="TableFirstRow">
      <div class="TableBox DroneElectricitLevel">
        <span class="table-title">无人机电量<br></span>
        <span
            class="table-content">{{
            deviceInfo.device ? String(deviceInfo.device.batteryPercent).split(',')[0] + '%' : str
          }}</span>
      </div>
      <div class="TableBox DroneElectricitLevel">
        <span class="table-title">电池温度<br></span>
        <span
            class="table-content">{{
            deviceInfo.device ? String(deviceInfo.device.batteryTemperature).split(',')[0] + '°' : str
          }}</span>
      </div>
      <div class="TableBox ">
        <span class="table-title">GNSS 卫星数<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.gpsCount : str }}</span>
      </div>
    </div>

    <!--    这里的类名实际上应当顺序为第二行第三行，但是为了少一点css所以还是写了重复的类名-->
    <div class="TableFirstRow">
      <div class="TableBox ">
        <span class="table-title">飞行高度<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.altitude + ' m' : str }}</span>
      </div>
      <div class="TableBox ">
        <span class="table-title">水平速度<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.horizontalSpeed : str }}</span>
      </div>
      <div class="TableBox ">
        <span class="table-title">垂直速度<br></span>
        <span
            class="table-content">{{ deviceInfo.device ? deviceInfo.device.verticalSpeed : str }}</span>
      </div>
    </div>
    <div class="TableFirstRow">
      <div class="TableBox ">
        <span class="table-title">水平速度 X<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.horizontalXSpeed : str }}</span>
      </div>
      <div class="TableBox ">
        <span class="table-title">水平速度 Y<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.horizontalYSpeed : str }}</span>
      </div>
      <div class="TableBox ">
        <span class="table-title">信号等级<br></span>
        <span class="table-content">{{ deviceInfo.device ? deviceInfo.device.gpsLevel : str }}</span>
      </div>
    </div>
    <div class="TableFirstRow">
      <div class="TableBox ">
        <span class="table-title">俯仰角<br></span>
        <span class="table-content">{{ deviceInfo.device ? Number(deviceInfo.device.pitch).toFixed(2) : str }}</span>
      </div>
      <div class="TableBox ">
        <span class="table-title">翻滚角<br></span>
        <span class="table-content">{{ deviceInfo.device ? Number(deviceInfo.device.roll).toFixed(2) : str }}</span>
      </div>
      <div class="TableBox ">
        <span class="table-title">偏航角<br></span>
        <span class="table-content">{{ deviceInfo.device ? Number(deviceInfo.device.yaw).toFixed(2) : str }}</span>
      </div>
    </div>

    <div class="TableFirstRow">
      <div class="dropDownBox ">
        <el-dropdown>
          <el-button type="primary" color="#e6a23c">
            直播选择<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeDeviceType('uav')">无人机</el-dropdown-item>
              <el-dropdown-item @click="changeDeviceType('dock')">机库</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <JxVideo :siteId="siteId" :device='deviceType'></JxVideo>

  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, reactive, onBeforeUnmount } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useMyStore} from "@/store"
import {JxDeviceState, JxDockState} from "@/store/types/device";
import JxVideo from "@/components/video/JxVideo.vue";
import {getStrategyConfigDetail} from "@/api/jiexiang/jxDronePlan";
// @ts-ignore
import droneModel from '@assets/models/airDrone.glb'
import {ArrowDown} from '@element-plus/icons-vue'
import {RemoveEntitiesByBatch} from "@/components/mapTools/BaseMapTools";

const store = useMyStore()
const str = '--'
// 获取设备名
const route = useRoute();
const router = useRouter();
const pointNum = ref({} as number)
const source = ref('')
const strategyConfigDetail = ref({} as any)
const deviceInfo = ref({device: {} as JxDeviceState, dock: {} as JxDockState})
const deviceType = ref('uav' as string)

const Props = defineProps({
  planInfo: {
    type: Object,
  },
  siteId:{
    type: String
  }
})

onMounted(() => {
  getStrategyConfigDetailInfo()
});

let droneInfo = reactive({} as JxDeviceState)

function changeDeviceType(type:string){
    deviceType.value = type
}

watch(store.state.jxDeviceState, (newVal, oldVal) => {
  if (Props.siteId) {
    deviceInfo.value.device = newVal[Props.siteId]
  }
}, {deep: true})

watch(store.state.jxDockState, (newVal, oldVal) => {
  if (Props.siteId) {
    deviceInfo.value.dock = newVal[Props.siteId]
  }
}, {deep: true})

const getTaskType = (type: string) => {
  if (type === '1') {
    return '自动任务'
  } else if (type === '2') {
    return '手动任务'
  } else {
    return '快速任务'
  }
}

const getStrategyConfigDetailInfo = () => {
  if(Props.planInfo){
    getStrategyConfigDetail({id: Props.planInfo?.strategyId})
        .then(res => {
          strategyConfigDetail.value = res.data
          pointNum.value = res.data.strategyPointConfigList.length
        }).catch(err => {
      console.log(err)
    })
  }
}

onBeforeUnmount(()=>{
  RemoveEntitiesByBatch(window.cesiumViewer, String(Props.siteId))
})

</script>

<style scoped lang="scss">
.DetailInformationPanel {
  box-shadow: 8px 0px 4px 0px rgba(255, 120, 0, 1);
  background-color: $ComponentBackground;
  position: fixed;
  top: 139px;
  right: 0;
  width: 388px;
  height: 790px;
}

.PlanTitle {
  display: flex;
  width: 360px;
  height: 16px;
  padding-top: 22px;
  font-size: $FirstLevelTitleFontSize;
  text-align: left;
  line-height: 16px;
  /*margin-top: 10px;*/
  margin-left: 16px;
  margin-bottom: 15px;
}

.PlanName {
  white-space: nowrap;
  width: 130px;
  height: 17px;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  color: $FirstLevelTitleColor;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background-color: $TouchColor;
  margin-right: 15px;
  margin-top: 5px;
}

.CloseDetailInformationPanel {
  margin-left: 190px;
  font-size: 24px;
  font-weight: 100;
  color: white;
}

.PlanExecuteType {
  justify-content: center;
  align-items: center;
  margin-left: 27px;
  margin-top: 8px;
  display: flex;
  width: 78px;
  height: 20px;
  background: $TouchColor;
  opacity: 0.4;
  border-radius: 4px;
}

.PlanExecutetypeText {
  width: 54px;
  height: 11px;
  font-size: $ContentFontSize;
  padding-bottom: 3px;
  font-weight: $ContentFontWeight;
  color: $ContentColor;
}

.TypeImg {
  margin-left: 6px;
  width: 10px;
  height: 10px;
}

.PlanTextInformation {
  margin-left: 27px;
  margin-top: 14px;
  font-family: $InforFontFamily;
  font-size: $InforFontSize;
  font-weight: $InforFontWeight;
  color: $InforColor;
  line-height: 2;
  text-align: left;
}

.TableFirstRow {
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-family: $FirstLevelTitleFontFamily;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  color: $FirstLevelTitleColor;
}

.TableBox {
  width: 50%;
  text-align: center;
}

.dropDownBox{
  width: 40%;
  text-align: center;
}

.AssociatedDevice {
  display: flex;
  border-radius: 4px;
  width: 340px;
  height: 61px;
  background: $TouchColor;
  font-size: $ContentFontSize;
  padding-bottom: 3px;
  font-weight: $ContentFontWeight;
  margin-top: 17px;
  margin-right: 28px;
  margin-left: 20px;
}

.DeviceImg {
  margin-top: 18px;
  margin-left: 25px;
  width: 48px;
  height: 29px;
}

.DeviceName {
  margin-top: 14px;
  margin-left: 10px;
  line-height: 1.5;
  color: white;
  width: 100px;
}

.green-dot {
  width: 5px;
  height: 5px;
  background: #19BE6B;
  border-radius: 50%;
  margin-left: 80px;
  margin-top: 30px;
}

.DeviceState1 {
  margin-top: 24px;
  margin-left: 10px;
  line-height: 1.5;
  color: white;
}

.AssociatedDevice2 {
  display: flex;
  border-radius: 4px;
  width: 340px;
  height: 61px;
  background: $TouchColor;
  font-size: $ContentFontSize;
  padding-bottom: 3px;
  font-weight: $ContentFontWeight;
  margin-top: 17px;
  margin-right: 28px;
  margin-left: 20px;
}

.table-title {
  font-size: 12px;
}

.table-content {
  font-size: 18px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
