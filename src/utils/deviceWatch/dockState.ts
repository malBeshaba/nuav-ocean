import store from '@/store'
import { watch } from 'vue'
import {DrawPointByBillboard, RemoveEntitiesById} from '@/components/mapTools/BaseMapTools'
import dockImage from '@/assets/map/dock.png'
import { getBindingDevices } from '@/api/device'

const getDockList = () => {
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 3,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      dockTotal.value = res.data.pagination.total
    }
  })
};
export function dockState() {
  // 创建一个watch的清理函数引用
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 3,
  }).then(res => {
    // console.log(res)
    if (res.code === 0) {
      console.log('res', res.data.pagination.total)
      const unwatch = watch(store.state.deviceState.dockInfo, (value) => {    
        if (Object.keys(value).length === res.data.pagination.total) {
          console.log('dock', store.state.checkDockState.length)
          if (store.state.checkDockState.length === res.data.pagination.total) {
            console.log('store', store?.state?.checkDockState)
    
            unwatch();
          }
    
          Object.keys(value).forEach((key: string) => {
            // console.log('dock', value[key])
            if (value[key].basic_osd) {
              const dock = {
                sn: key,
                position: {
                  longitude: value[key].basic_osd.longitude,
                  latitude: value[key].basic_osd.latitude,
                  height: value[key].basic_osd.height,
                },
                deviceSn: value[key].basic_osd.sub_device.device_sn,
                deviceType: value[key].basic_osd.sub_device.device_online_status
              }
              store.commit('SET_CHECK_DOCK_STATE', dock)
            }
    
            // RemoveEntitiesById(window.cesiumViewer, String(key) + 'dock')
            // DrawPointByBillboard(window.cesiumViewer, String(key) + 'dock', [value[key].basic_osd.longitude,value[key].basic_osd.latitude, value[key].basic_osd.height], 0, dockImage)
          })
        }
      }, {deep: true});
    }
  })
  
}

