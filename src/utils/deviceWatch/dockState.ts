import store from '@/store'
import { watch } from 'vue'
import {DrawPointByBillboard, RemoveEntitiesById} from '@/components/mapTools/BaseMapTools'
import dockImage from '@/assets/map/dock.png'
import { getBindingDevices } from '@/api/device'

export function dockState() {
  // 使用设备列表获取设备数量
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 3,
  }).then(res => {
    if (res.code === 0) {
      const unwatch = watch(store.state.deviceState.dockInfo, (value) => {    
        if (Object.keys(value).length === res.data.pagination.total) {
          // 完成dock位置信息获取后，停止监听
          if (store.state.checkDockState.length === res.data.pagination.total) {
            try {
              store?.state?.checkDockState.forEach((item: any) => {
                const dockPoint = window.cesiumViewer.entities.getById(String(item.sn) + 'dockCheck')
                if(dockPoint) {
                  window.cesiumViewer.entities.remove(dockPoint)
                  DrawPointByBillboard(window.cesiumViewer, String(item.sn) + 'dockCheck', [item.position.longitude - 0.00001,item.position.latitude + 0.00007, item.position.height], 0, dockImage)
                } else {
                  DrawPointByBillboard(window.cesiumViewer, String(item.sn) + 'dockCheck', [item.position.longitude - 0.00001,item.position.latitude + 0.00007, item.position.height], 0, dockImage)
                }
              })
            } catch (error) {
                console.log(error)
            }
            unwatch();
          }
          Object.keys(value).forEach((key: string) => {
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

