<template>
  <div class="drone_block_parent">
    <div class="drone-info">
        <img :src="DronePng" style="padding-left: 15px;" />
        <div class="info-center">
          <div class="info-center__title">
            名称： {{ droneInfo.nickname }}
          </div>
          <div>
            型号：{{ droneInfo.device_name ? droneInfo.device_name : str }}
          </div>
        </div>
        <div class="info-right">
          <div class="circle" :style="deviceInfo?.device?.mode_code !== 14 ? 'background: #19BE6B;' : 'background: red;'"> </div>
          <div style="padding-left: 12px;width: 75%;"> {{ EDroneModeCode }} </div>
        </div>
    </div>
    <div class="drone-info_1">
      <div class="drone-control-header">
        <div class="orange-dot"></div>
        <div>无人机详情</div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox DroneElectricitLevel" >
          <svg t="1731571421599" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1328" width="200" height="200"><path d="M554.666667 512h128l-213.333334 298.666667v-213.333334H341.333333l213.333334-298.666666v213.333333z m-85.333334-256H298.666667v597.333333h426.666666V256h-170.666666V170.666667h-85.333334v85.333333zM384 170.666667V128a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667h128a42.666667 42.666667 0 0 1 42.666667 42.666666v682.666667a42.666667 42.666667 0 0 1-42.666667 42.666667H256a42.666667 42.666667 0 0 1-42.666667-42.666667V213.333333a42.666667 42.666667 0 0 1 42.666667-42.666666h128z" fill="#4bd0ff" p-id="1329"></path></svg>          
          <div class="table-item">
            <div class="table-title">无人机电量<br></div>
            <div class="table-content">{{!deviceInfo.device?.battery?.capacity_percent || deviceInfo.device.battery.capacity_percent === str ? str : deviceInfo.device.battery?.capacity_percent + ' %'}}</div>  
          </div>
        </div>
        
        <div class="TableBox DroneElectricitLevel" >
          <svg t="1731571019553" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1173" width="200" height="200"><path d="M630.6 941l-3.6-24.6-74.1-71.3 7.1-326.3 222.5 129-8.1-46.7L562 427.4l4.9-223.5c0-0.4 0.2-0.8 0.2-1.3 0-0.9-0.1-1.9-0.1-2.8l0.1-6.4h-0.5c-4.3-43.3-35.6-125.9-54.7-125.9-18.6 0-50.3 82.5-54.7 125.9h-0.5l0.1 6.4c0 0.9-0.1 1.9-0.1 2.8 0 0.5 0.2 0.8 0.2 1.3l4.9 223.5-212.4 173.7-8.1 46.7 222.5-129 7.1 326.3-74.1 71.3-3.6 24.6 118-80.5h1.3L630.6 941z" fill="#4bd0ff" p-id="1174"></path></svg>
          <div>
            <div class="table-title">飞行模式<br></div>
            <div class="table-content">{{EGear}}</div>
          </div>
        </div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox" >
          <svg t="1731571636731" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1332" width="200" height="200"><path d="M716.675 215.72c0 113.039-201.623 360.326-201.623 360.326S307.325 328.759 307.325 215.72 398.961 11.045 512 11.045s204.675 91.636 204.675 204.675zM512 106.613c-70.445 0-127.552 57.107-127.552 127.552s129.454 224.553 129.454 224.553 125.65-154.108 125.65-224.553S582.445 106.613 512 106.613z" fill="#4bd0ff" p-id="1333"></path><path d="M600.246 237.234c0 48.737-39.509 88.246-88.246 88.246s-88.246-39.509-88.246-88.246 39.509-88.246 88.246-88.246 88.246 39.51 88.246 88.246zM512 198.146c-21.588 0-39.088 17.5-39.088 39.088s17.5 39.088 39.088 39.088 39.088-17.5 39.088-39.088c0-21.587-17.5-39.088-39.088-39.088zM1006.814 1010.984H17.186l193.579-552.266h568.349l227.7 552.266zM744.188 536.097H246.732l-90.888 397.508h712.312L744.188 536.097z" fill="#4bd0ff" p-id="1334"></path><path d="M148.306 884.858l-0.153-1.716-3.675-41.325s40.596-147.428 172.32-214.048c33.074-16.728 155.239-72.693 295.317-52.876s223.978 63.492 223.978 63.492l16.049 180.48S685.351 718.433 490.283 700.151c-68.152-6.387-154.727 10.825-217.77 45.77-63.044 34.946-103.499 98.48-103.499 98.48l-20.708 40.457z" fill="#4bd0ff" p-id="1335"></path></svg>
          <div class="table-item">
            <div class="table-title">GPS<br></div>
            <div class="table-content">{{deviceInfo.device?.position_state.gps_number ? deviceInfo.device?.position_state.gps_number : str}}</div>  
          </div>
        </div>
        <div class="TableBox" >
          <svg t="1731571705177" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1491" width="200" height="200"><path d="M652.406405 1017.444299v-69.120839c159.604917 0 293.385469-130.014815 293.385468-289.661531v1.649172h70.918208c0 195.848708-164.400437 357.133197-364.303676 357.133198z m-4.79932-121.784154v-69.124638c46.746814 0 90.259883-18.102896 122.494741-49.37257 32.238658-31.273474 51.819729-73.072772 51.819729-118.501008h69.06764c0 130.018615-107.990385 236.998216-243.38211 236.998216z m174.071275-536.531981c-17.722902 19.748268-48.350387 19.748268-67.692063 0l-91.396063-95.454396-93.953421 96.40818 204.691159 209.186484c19.341675 15.332742 19.341675 49.171174 0 66.350684l-38.68335 39.500336c6.448492 8.234462 11.28581 19.752068 11.285811 31.273475 0 26.333557-20.033263 47.727198-48.350388 47.727198-11.28961 0-22.567821-3.290745-30.631285-9.876034l-45.128041 46.081825c-17.726702 19.748268-48.354187 19.748268-65.4387 0l-206.948322-209.015487-91.156668 93.809023 92.764041 95.458196c19.341675 18.102896 19.341675 49.37257 0 69.120838l-32.234858 32.918847c-17.722902 19.748268-48.354187 19.748268-67.695862 0L17.410478 633.973744c-19.337875-15.534139-19.337875-49.37257 0-69.120838l32.234858-32.915047c17.722902-19.748268 49.37637-19.748268 67.692062 0l93.486029 95.458196 91.863456-93.812824L99.021706 324.567745c-20.363858-18.102896-20.363858-49.37257 0-69.120839l150.485071-154.706799c17.722902-19.748268 48.350387-19.748268 67.692062 0l204.69116 209.015487 91.874855-93.809024-93.482228-95.454395c-16.947715-18.106696-16.947715-49.37257 0-69.124638l32.234858-32.918847c17.726702-17.156712 48.354187-17.156712 67.695862 0l233.703672 238.643589c21.051646 18.102896 21.051646 49.37257 0 69.120838l-32.238658 32.915047z" fill="#4bd0ff" p-id="1492"></path></svg>
          <div class="table-item">
            <div class="table-title">RTK<br></div>
            <div class="table-content">{{deviceInfo.device?.position_state.rtk_number ? deviceInfo.device?.position_state.rtk_number : str}}</div>  
          </div>
        </div>
      </div>

      <div class="TableFirstRow">
        <div class="TableBox " >
          <svg t="1731571873295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1644" width="200" height="200"><path d="M972.8 902.4h-768v-153.6c0-25.6-19.2-51.2-51.2-51.2-25.6 0-51.2 19.2-51.2 51.2v192c0 6.4 0 12.8 6.4 19.2 6.4 25.6 25.6 44.8 44.8 44.8h819.2c25.6 0 51.2-19.2 51.2-51.2s-19.2-51.2-51.2-51.2z" fill="#4bd0ff" p-id="1645"></path><path d="M294.4 748.8c6.4 12.8 12.8 25.6 25.6 32 6.4 6.4 12.8 6.4 25.6 6.4 19.2 0 32-12.8 44.8-25.6l192-377.6 89.6 352c6.4 19.2 19.2 32 44.8 38.4 19.2 0 38.4-12.8 44.8-25.6l64-128 76.8 147.2c6.4 19.2 25.6 25.6 44.8 25.6 6.4 0 19.2 0 25.6-6.4 12.8-6.4 19.2-19.2 25.6-32 6.4-12.8 0-25.6-6.4-38.4l-121.6-230.4c-6.4-19.2-25.6-25.6-44.8-25.6-19.2 0-32 12.8-44.8 25.6l-51.2 96-83.2-345.6c-6.4-19.2-25.6-38.4-51.2-38.4-19.2 0-32 12.8-44.8 25.6l-256 486.4c-6.4 12.8-6.4 25.6 0 38.4zM102.4 211.2c0 25.6 25.6 44.8 51.2 44.8s51.2-19.2 51.2-51.2V192l25.6 25.6c6.4 6.4 19.2 12.8 32 12.8s25.6-6.4 32-12.8c12.8-12.8 19.2-25.6 19.2-38.4 0-12.8-6.4-25.6-12.8-32L192 38.4C185.6 32 172.8 25.6 160 25.6s-25.6 6.4-32 12.8L12.8 147.2c-6.4 6.4-12.8 19.2-12.8 32s6.4 25.6 12.8 38.4c6.4 6.4 19.2 12.8 32 12.8s25.6-6.4 32-12.8l19.2-19.2v12.8zM204.8 345.6c0-25.6-19.2-51.2-51.2-51.2-25.6 0-51.2 25.6-51.2 51.2v64c0 25.6 19.2 51.2 51.2 51.2 25.6 0 51.2-19.2 51.2-51.2v-64zM153.6 499.2c-25.6 0-51.2 19.2-51.2 44.8v64c0 25.6 19.2 51.2 51.2 51.2 25.6 0 51.2-19.2 51.2-51.2v-64c0-25.6-25.6-44.8-51.2-44.8z" fill="#4bd0ff" p-id="1646"></path></svg>
          <div class="table-item">
            <div class="table-title">海拔高度<br></div>
            <div class="table-content">{{!deviceInfo.device?.height || deviceInfo.device?.height === str ? str : Number(deviceInfo.device?.height).toFixed(2) + ' m'}}</div>
  
          </div>
        </div>
        
        <div class="TableBox DroneElectricitLevel" >
          <svg t="1731571903426" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1798" width="200" height="200"><path d="M174.5 394.1h331.2c91 0 166-73.2 166.3-164.2 0.3-91-73.7-165.1-164.7-165.1-43.2 0-84 16.6-114.9 46.7-15.5 15.1-27.7 32.9-36.2 52.2-12.7 29.1 8.4 61.7 40.1 62.6 18.5 0.5 35.2-10.4 42.6-27.3 11.6-26.2 37.7-44.2 68.3-44.2 41.4 0 75.1 33.9 74.7 75.4-0.4 41.1-34.5 73.9-75.6 73.9H174.5c-24.9 0-45 20.1-45 45s20.2 45 45 45zM189.3 634.2l0.6 45-0.6-45zM682 626.9c-0.6 0-0.8 0-427.3 6.3-7.3 0.1-14.2 0.2-20.5 0.3-24.8 0.4-44.7 20.8-44.3 45.6 0.3 24.9 20.8 44.8 45.7 44.4 6.3-0.1 13.2-0.2 20.5-0.3 124.9-1.9 415.3-6.2 426.2-6.3 42.8 0.2 77.2 36.5 74.2 80-2.8 39.8-35.9 70-75.7 69.3-30.2-0.5-55.9-18.5-67.2-44.5-7.3-16.8-24.1-27.5-42.5-27-31.7 0.9-52.8 33.5-40.1 62.6 8.4 19.4 20.6 37.1 36.2 52.2 30.9 30.1 71.8 46.7 115 46.7 91.8-0.1 166.8-77 164.5-168.8-2.3-88.9-75.3-160.5-164.7-160.5z" fill="#4bd0ff" p-id="1799"></path><path d="M856.6 240.3c-29-11.5-60.5 10.1-60.5 41.4v1.3c0 18 10.9 34.4 27.6 41.1 27.5 11 47 38 47 69.4 0 41.2-33.5 74.7-74.7 74.7H112.6c-24.9 0-45 20.1-45 45s20.1 45 45 45h683.5c90.8 0 164.7-73.9 164.7-164.7-0.1-69.5-43.3-129-104.2-153.2z" fill="#4bd0ff" p-id="1800"></path></svg>
          <div class="table-item">
            <div class="table-title">风速<br></div>
            <div class="table-content">{{!deviceInfo.device?.wind_speed || deviceInfo.device?.wind_speed === str ? str : (Number(deviceInfo.device?.wind_speed) / 10).toFixed(2) + ' m/s'}}</div>
          </div>
        </div>
      </div>
      <div class="TableFirstRow">
        <div class="TableBox " >
          <svg t="1731571936213" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1956" width="200" height="200"><path d="M931.839691 926.529135H92.15722a10.253589 10.253589 0 0 0-10.253589 10.253589v76.778381a10.253589 10.253589 0 0 0 10.253589 10.253589H931.839691a10.253589 10.253589 0 0 0 10.253589-10.253589v-76.778381A10.253589 10.253589 0 0 0 931.839691 926.529135z m0-926.529135H92.15722A10.253589 10.253589 0 0 0 81.903631 10.253589v76.778381a10.253589 10.253589 0 0 0 10.253589 10.253589H931.839691a10.253589 10.253589 0 0 0 10.253589-10.253589V10.253589A10.253589 10.253589 0 0 0 931.839691 0zM638.438798 340.468573a9.265291 9.265291 0 0 0 7.288696-14.948004L516.69287 162.204367a9.141754 9.141754 0 0 0-14.453854 0L373.204391 325.520569a9.265291 9.265291 0 0 0 7.288696 14.948004h85.364218v343.062854h-80.299192a9.265291 9.265291 0 0 0-7.288696 14.948004l129.034625 163.192665a9.141754 9.141754 0 0 0 14.453854 0l129.034624-163.192665a9.265291 9.265291 0 0 0-7.288696-14.948004H558.139607V340.468573z" fill="#4bd0ff" p-id="1957"></path></svg>
          <div class="table-item">
            <div class="table-title">相对起飞点高度<br></div>
            <div class="table-content">{{!deviceInfo.device?.elevation || deviceInfo.device?.elevation === str ? str : Number(deviceInfo.device?.elevation).toFixed(2) + ' m'}}</div>  
          </div>
       </div>
        <div class="TableBox DroneElectricitLevel" >
          <svg t="1731572005550" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2109" width="200" height="200"><path d="M286.144 318.144h-168.106667a32 32 0 0 1-32-32v-168.106667a32 32 0 0 1 32-32h168.106667a32 32 0 0 1 32 32v168.106667a32 32 0 0 1-32 32z m-136.106667-64h104.106667v-104.106667h-104.106667v104.106667zM906.496 938.496h-168.106667a32 32 0 0 1-32-32v-168.128a32 32 0 0 1 32-32h168.106667a32 32 0 0 1 32 32v168.128a32 32 0 0 1-32 32z m-136.106667-64h104.106667v-104.128h-104.106667v104.128z" fill="#4bd0ff" p-id="2110"></path><path d="M738.389333 770.368c-8.192 0-16.384-3.114667-22.634666-9.365333L263.530667 308.778667a32 32 0 1 1 45.248-45.248l452.245333 452.224a32 32 0 0 1-22.634667 54.613333z" fill="#4bd0ff" p-id="2111"></path></svg>
          <div class="table-item">
            <div class="table-title">相距起飞点距离<br></div>
            <div class="table-content">{{!deviceInfo.device?.home_distance || deviceInfo.device.home_distance === str ? str : Number(deviceInfo.device?.home_distance).toFixed(2) + ' m'}}</div>
          </div>  
        </div>
      </div>
    </div>
    <div class="echarts" style="display: flex;">
      <div id="horizontal_speed" style="width: 175px; height: 175px;"></div>
      <div id="vertical_speed" style="width: 175px; height: 175px;"></div>
      <!-- <el-button type="primary" size="mini" @click="handleOnTry">水平速度</el-button> -->
    </div>
    <!-- <div class="drone_control">
      <drone-control :sn="control_sn" :device-info="deviceInfo"></drone-control>
      <pay-load-control :sn="control_sn" :device-info="deviceInfo"></pay-load-control>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount,defineEmits,defineExpose } from 'vue'
import { DeviceInfo } from "@/store/types/device";
import { getBindingDeviceBySn,updateDroneInfo } from '@/api/device'
import { stopLivestream, getLiveAddress, startLivestream, getAILive, getLivestatus } from "@/api/live"
import { useRouter } from 'vue-router';
import { useMyStore } from "@/store";
import DronePng from '@/assets/images/drone.png';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;
var myChart1: echarts.ECharts;
var myChart2: echarts.ECharts;
const option1: EChartsOption = reactive({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true
      },
      splitLine: {
        show: false
      },
      axisTick: {
        distance: 2,
        splitNumber: 2
      },
      axisLabel: {
        show: false
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        fontSize: 18,
        color: 'white'
      },
      title: {
        offsetCenter: [0, '73%'],
        color: 'white'
      },
      data: [
        {
          value: 0,
          name: '水平速度'
        }
      ]
    }
  ]
});

const option2: EChartsOption = reactive({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true
      },
      splitLine: {
        show: false
      },
      axisTick: {
        distance: 2,
        splitNumber: 2
      },
      axisLabel: {
        show: false
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        fontSize: 18,
        color: 'white'
      },
      title: {
        offsetCenter: [0, '73%'],
        color: 'white'
      },
      max: 10,
      data: [
        {
          value: 0,
          name: '垂直速度'
        }
      ]
    }
  ]
});

const emit = defineEmits(['show-info-changed']);

const store = useMyStore()
const router = useRouter();

// 设备信息
const str = ref('--')
const deviceInfo = reactive({
  device: {
    gear: -1,
    mode_code: 14,
    height: str,
    home_distance: str,
    horizontal_speed: str,
    vertical_speed: str,
    wind_speed: str,
    wind_direction: str,
    elevation: str,
    position_state: {
      gps_number: str,
      is_fixed: 0,
      rtk_number: str
    },
    battery: {
      capacity_percent: str,
      landing_power: str,
      remain_flight_time: 0,
      return_home_power: str,
    },
    latitude: 0,
    longitude: 0,
  },
  dock: {
    link_osd: {
      sdr: {
        up_quality: str,
        down_quality: str
      }
    }
  },
  waylineId: 'waylineId',
  deviceSn: 'deviceSn',
  createTime: 'createTime'
  });

const control_sn = ref()
const device_sn = ref("");

// 信息是否展开
const isShowInfo = ref(false)
const isShowControl = ref(false)

watch(isShowInfo,()=>{
  if(isShowInfo.value){
    emit('show-info-changed', isShowInfo.value);
    isShowControl.value = false
  }else {
    if(isShowControl.value === false){
      emit('show-info-changed', isShowInfo.value);
    }
  }
})

watch(isShowControl,()=>{
  if(isShowControl.value){
    emit('show-info-changed', isShowControl.value);
    isShowInfo.value = false
  }else{
    if(isShowInfo.value === false){
      emit('show-info-changed', isShowControl.value);
    }
  }
})

const closeAll =()=>{
  isShowInfo.value = false
  isShowControl.value = false
}

defineExpose({ closeAll });

const iframeDroneSn = computed(() => store.state.iframeDroneSn);

onMounted(() => {
  var chartDom = document.getElementById('horizontal_speed')!;
  myChart1 = echarts.init(chartDom);
  option1 && myChart1.setOption(option1);

  var chart2Dom = document.getElementById('vertical_speed')!;
  myChart2 = echarts.init(chart2Dom);
  option2 && myChart2.setOption(option2);

  isEditing.value = false
  if (iframeDroneSn.value) {
    device_sn.value = iframeDroneSn.value
    getDeviceInfo()
    getBindingDeviceBySn({
      workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
      // device_sn: '4TADL2L0010027'
      device_sn: device_sn.value
    }).then(res => {
      // console.log(res)
      if(res.code === 0) {
        if (res.data.child_device_sn == device_sn.value) {
          // control_sn.value = '4TADL2L0010027'
          control_sn.value = device_sn.value
        } else {
          control_sn.value = device_sn.value
        }
        console.log(control_sn.value) 
      }
    })
  }
})

watch(() => iframeDroneSn.value, () => {
    if (iframeDroneSn.value) {
    device_sn.value = iframeDroneSn.value
    getDeviceInfo()
    getBindingDeviceBySn({
      workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
      // device_sn: '4TADL2L0010027'
      device_sn: device_sn.value
    }).then(res => {
      // console.log(res)
      if(res.code === 0) {
        if (res.data.child_device_sn == device_sn.value) {
          // control_sn.value = '4TADL2L0010027'
          control_sn.value = device_sn.value
        } else {
          control_sn.value = device_sn.value
        }
        console.log(control_sn.value) 
      }
    })
  }
})

// 获取设备信息
let droneInfo = reactive({} as DeviceInfo)
const getDeviceInfo = async () => {
  if (store.state.iframeDroneSn) {
    getBindingDeviceBySn({
      workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
      device_sn: store.state.iframeDroneSn as string
    }).then(res => {
      // console.log(res)
      if(res.code === 0) {
        droneInfo = res.data
        inputValue.value = droneInfo.nickname
      }
    })
  }
};

// 监听设备信息
watch(() => store.state.deviceState, (newData, oldData) => {
  if (newData.currentType === 2 && newData.deviceInfo[newData.currentSn]) {
    // console.log('drone', newData)
    deviceInfo.device = newData.deviceInfo[droneInfo.device_sn]
    // @ts-ignore
    option1.series[0].data[0].value = parseFloat(deviceInfo.device?.horizontal_speed).toFixed(2)
    // @ts-ignore
    option2.series[0].data[0].value = parseFloat(deviceInfo.device?.vertical_speed).toFixed(2)
    myChart1.setOption(option1)
    myChart2.setOption(option2)
      // videoFusionValue(deviceInfo.device, droneInfo.device_sn)1
      
  }
}, { deep: true, })

// // 监听路由
// watch(() => store.state.iframeDroneSn, (newData, oldData) => {
//   getDeviceInfo()
// }, { deep: true })

const SnName = computed (()=>{
  return droneInfo.device_name
})

const EModeCode = computed (()=>{
  switch (deviceInfo.device?.mode_code) {
    case 0:
      return '待命' // 新建计划
    case 1:
      return '准备中' // 已有计划
    case 2:
      return '已就绪'
    case 3:
      return '手动操作'
    case 4:
      return '自动操作'
    case 5:
      return '航点'
    case 6:
      return '全景'
    case 7:
      return '自动跟踪'
    case 8:
      return '广播式自动相关监视'
    case 9:
      return '返航中'
    case 10:
      return '着陆中'
    case 11:
      return '迫降中'
    case 12:
      return '三桨叶着陆中'
    case 13:
      return '升级中' //禁用
    case 14:
      return '未连接' //禁用
    default:
      return '未连接'
  }
})

const EGear = computed (()=>{
  switch (deviceInfo.device?.gear) {
    case 0:
      return 'A'
    case 1:
      return 'P'
    case 2:
      return 'NAV'
    case 3:
      return 'FPV'
    case 4:
      return 'FROM'
    case 5:
      return 'S'
    case 6:
      return 'F'
    case 7:
      return 'M'
    case 8:
      return 'G'
    case 9:
      return 'T'
    default:
      return '--'
  }
})

const isFull = ref(false)
const toFull_sc = (isF: any) => {
  isFull.value = isF
};

// deviceWatch(droneOutLiveStream, (val) => {
//   getAILive(droneInfo.device_sn).then(res => {
//     console.log('getAIlive', res)
//     this.aiDroneStream = res.data.webRtcStream
//   })
// })

// deviceWatch(() => props.deviceInfo, (newData, oldData) => {
//     if ( newData.device && !droneOutLiveStream.value && isloading.value ) {
//       getDroneLiveStream()
//     }
//   }, { deep: true }
// // )

const droneOutLiveStream = ref(false)
const aiDroneStream = ref(null)
const isloading = ref(false)

const getDroneLiveStream = async function () {
  let rtmpUrl = await getLiveAddress()
  isloading.value = !isloading.value

  const timestamp = store.state.iframeDroneSn
  let liveUrl = rtmpUrl.data + timestamp
  let videoID = droneInfo.device_sn + '/53-0-0/normal-0'
  let urlType = '1'
  let videoQ = '2'
  getLivestatus(timestamp as string).then(res => {
    // console.log(res)
    if (res.data.webRtcStream) {
      droneOutLiveStream.value = res.data.webRtcStream
      store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
    } else {
      startLivestream({
        url: liveUrl,
        video_id: videoID,
        url_type: urlType,
        video_quality: videoQ
      }).then(res => {
        // console.log('start', res)
        if (res.data.url) {
          droneOutLiveStream.value = res.data.url
          store.commit('SET_LIVE_STREAM', {sn: timestamp, vid: videoID})
        }
      })
    }
  })
}

const EDroneModeCode = computed(() => {
  switch (deviceInfo.device?.mode_code) {
    case 0:
      return '待命' // 新建计划
    case 1:
      return '准备中' // 已有计划
    case 2:
      return '已就绪'
    case 3:
      return '手动操作'
    case 4:
      return '自动操作'
    case 5:
      return '航点'
    case 6:
      return '全景'
    case 7:
      return '自动跟踪'
    case 8:
      return '广播式自动相关监视'
    case 9:
      return '返航中'
    case 10:
      return '着陆中'
    case 11:
      return '迫降中'
    case 12:
      return '三桨叶着陆中'
    case 13:
      return '升级中' //禁用
    case 14:
      return '未连接' //禁用
    default:
      return '未连接'
  }
})


onBeforeUnmount(() => {
  closeLiveStream()
});
const closeLiveStream = () => {
  if (droneInfo && store.state.liveStreamState[droneInfo.device_sn]) {
    stopLivestream({
      video_id: store.state.liveStreamState[droneInfo.device_sn]
    }).then(res => {
      console.log('无人机' + droneInfo.device_sn + '直播流已断开')
    })
  }
}
const back = () => {
  router.back()
}


// 设备名称更改
const isEditing = ref(true)
const toggleEdit = () => {
    if (isEditing.value) {
        // console.log("droneInfo",droneInfo)
        droneInfo.nickname = inputValue.value
        updateDroneInfo(droneInfo).then(res => {
            // console.log(res)
            if (res.code === 0) {
                ElMessage({
                    message: '修改成功',
                    type: 'success'
                })
            }else{
                ElMessage({
                    message: res.message,
                    type: 'error'
                })
            }
        })
        // 提交
        console.log('提交')
    } else {
        // 编辑
        console.log('编辑')
    }
  isEditing.value = !isEditing.value
  inputValue.value = droneInfo.nickname
}
const inputValue = ref("")

</script>

<style scoped lang="scss">
.drone_block_parent{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.editNickName{
  width:120px;
  font-size: 12px;
  color: white;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}
.drone_block {
  width: 95%;
  height: 100%;
  // overflow: hidden auto;
  background-color: $ComponentBackground;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.flex-display {
  display: flex;
  width: calc(100% - 16px);
  padding-top: 16px;
  padding-left: 16px;
}
.circle {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
}
.ml10 {
  margin-left: 10px;
  font-size: 14px;
  color: white;
}

.AssociatedDevice{
  display: flex;
  border-radius: 4px;
  width: 340px;
  height: 61px;
  background: #F9A100;
  font-size: 10px;
  padding-bottom: 3px;
  font-weight: 400;
  margin-top: 17px;
  margin-right: 28px;
  margin-left: 20px;
}
.DeviceImg{
  margin-top: 5px;
  margin-left: 12px;
}
.DeviceName{
  margin-top: 14px;
  margin-left:10px ;
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
.DeviceState1{
  margin-top: 24px;
  margin-left:10px ;
  line-height: 1.5;
  color: white;
}
.TableFirstRow{
  margin-top: 14px;
  display: flex;
  justify-content: center;
  width: 100%;
}
.TableBox{
  margin-left: 20px;
  width: 45%;
  display: flex;
  text-align: left;
  justify-content: left;
  align-items: center;
}

.icon {
  width: 30px; 
  height: 30px;
}
.table-item{
  padding-left: 8px;
}
.table-title {
  font-size: $AnnotateFontSize;
  font-family: $AnnotateFontFamily;
  color: $AnnotateColor;
  font-weight: $AnnotateFontWeight;
}
.table-content {
  padding-top: 16px;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
}
.BlockTitle{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 300px;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
  color: $FirstLevelTitleColor;
  font-weight: $FirstLevelTitleFontWeight;
  box-sizing: border-box;
}
.PlanName{
  width: 150px;
  flex: 1;
}
.orange-dot {
  width: 6px;
  height: 6px;
  background-color: $TouchColor;
}
.btn-backward {
  font-size: $IconSize;
  color: $IconColor;
}
.btn-backward:hover {
  cursor: pointer;
  color: $TouchColor;
}

/* 设备信息 */
.drone-info {
  width: 95%;
  height: 62px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 0px;
  box-sizing: border-box;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
  background: $TouchColor2;
  border-radius: 4px;
  box-sizing: border-box;
}

.drone-info_1{
  width: 95%;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
  border-radius: 4px;
  margin: 0px $ComponentGap;
}

.drone_control{
  width: 95%;
}

.info-left {
  width: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-center {
  flex-grow: 1;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
}

.info-center__title {
  color: $TouchColor;
  padding-bottom: 8px;
  font-size: 15px
}

.info-right {
  width: 76px;
  display: flex;
  align-items: center;
}

.circle {
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.BlockContent {
  overflow: hidden auto;
}

.BlockContent::-webkit-scrollbar {
  height: $ScrollbarHeight;
  width: $ScrollbarWidth;
}
.BlockContent::-webkit-scrollbar-thumb {
  border-radius: $ScrollbarBorderRadius;
  -webkit-box-shadow: $ScrollbarBoxShadow;
  background: $ScrollbarColor;
}
.BlockContent::-webkit-scrollbar-track {
  -webkit-box-shadow: $ScrollbarBoxShadow;
  border-radius: $ScrollbarBorderRadius;
  background: $ScrollbarBackgroundColor;
}

.TheEditIcon{
  position:absolute;
  background-image: url("../../../../assets/TaskDeployment/EditIcon.png");
  width: 20px;
  height: 20px;
  background-size: cover;
  left: 240px;
  top: 60px;
}

.drone-control-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-size: $FirstLevelTitleFontSize;
  font-family: $FirstLevelTitleFontFamily;
  color: $FirstLevelTitleColor;
  font-weight: $FirstLevelTitleFontWeight;
  padding: 16px 20px 0px 18px;
  box-sizing: border-box;
}

.orange-dot {
  width: 6px;
  height: 6px;
  background-color: $TouchColor;
}
</style>
  