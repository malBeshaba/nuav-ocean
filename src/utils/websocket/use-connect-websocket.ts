import { onMounted, onUnmounted } from 'vue'
import ConnectWebSocket, { MessageHandler } from './'
import { getCloadWebSocketURL } from '../config'
import store from '@/store'

// const store = useMyStore()
/**
 * 接收一个message函数
 * @param messageHandler
 */
export function useConnectWebSocket (messageHandler: MessageHandler) {
  const webSocket = new ConnectWebSocket(getCloadWebSocketURL())

  onMounted(() => {
    webSocket?.registerMessageHandler(messageHandler)
    webSocket?.initSocket()
  })

  onUnmounted(() => {
    webSocket?.close()
  })
}

export interface payloadType {
  biz_code: string,
  data: any,
  timestamp: number,
  version: string
}
export enum EBizCode {
  GatewayOsd = 'gateway_osd',
  DeviceOsd = 'device_osd',
  DockOsd = 'dock_osd',
  MapElementCreate = 'map_element_create',
  MapElementUpdate = 'map_element_update',
  MapElementDelete = 'map_element_delete',
  DeviceOnline = 'device_online',
  DeviceOffline = 'device_offline',
  DeviceHms = 'device_hms',

  // 机场任务
  FlightTaskProgress = 'flighttask_progress', // 机场任务执行进度
  FlightTaskMediaProgress = 'file_upload_callback', // 机场任务媒体上传进度
  FlightTaskMediaHighestPriority = 'highest_priority_upload_flighttask_media', // 机场任务媒体优先级上报

  // 设备指令
  DeviceReboot = 'device_reboot', // 机场重启
  DroneOpen = 'drone_open', // 飞行器开机
  DroneClose = 'drone_close', // 飞行器关机
  DeviceFormat = 'device_format', // 机场数据格式化
  DroneFormat = 'drone_format', // 飞行器数据格式化
  CoverOpen = 'cover_open', // 打开舱盖
  CoverClose = 'cover_close', // 关闭舱盖
  PutterOpen = 'putter_open', // 推杆展开
  PutterClose = 'putter_close', // 推杆闭合
  ChargeOpen = 'charge_open', // 打开充电
  ChargeClose = 'charge_close', // 关闭充电

  // 设备升级
  DeviceUpgrade = 'ota_progress', // 设备升级

  // 设备日志
  DeviceLogUploadProgress = 'fileupload_progress', // 设备日志上传上传
  // 飞行指令消息
  ControlSourceChange = 'control_source_change', // 控制权更新
  FlyToPointProgress = 'fly_to_point_progress', // 飞向目标点
  TakeoffToPointProgress = 'takeoff_to_point_progress', // 一键起飞
  JoystickInvalidNotify = 'joystick_invalid_notify', // 设备端退出drc模式
  DrcStatusNotify = 'drc_status_notify', // 飞行控制模式状态
}
export function messageHandler (payload: any) {
  if (!payload) {
    return
  }
  // console.log('payload', payload)
  switch (payload.biz_code) {
    case EBizCode.DockOsd:
      // console.log('dock', payload.data)
      store.commit('SET_DOCK_INFO', payload.data)
      break
    case EBizCode.DeviceOsd:
      store.commit('SET_DEVICE_INFO', payload.data)
      break
    case EBizCode.DeviceOffline:
      store.commit('CLEAR_DEVICE_INFO', payload.data.sn)
      break
    case EBizCode.FlightTaskProgress:
      //将sn号和飞行到的航点数绑定到一起
      let TemData={
        sn:payload.data.sn,
        num:parseFloat(payload.data.output.ext.current_waypoint_index)
      }
      store.commit("SET_CURRENT_WAYPOINT_INDEX",TemData)
      break
    default:
      break
  }
}
