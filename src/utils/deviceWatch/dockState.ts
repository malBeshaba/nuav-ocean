import store from '@/store'
import { watch } from 'vue'
import {DrawPointByBillboard, RemoveEntitiesById} from '@/components/mapTools/BaseMapTools'
import dockImage from '@/assets/map/dock.png'

export function dockState () {
  watch(store.state.deviceState.dockInfo, (value) => {
    if (Object.keys(value).length !== store.state.checkDockState.length && value) {
      // console.log('dock', value)

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
    } else {
    }
  }, {deep: true});
}
