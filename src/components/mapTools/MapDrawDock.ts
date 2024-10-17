import { watch } from 'vue'
import { useMyStore } from '@/store'
import * as Cesium from 'cesium'
const store = useMyStore()
export function DrawDock (mapViewer: Cesium.Viewer) {

  watch( () => store.state.deviceState.dockInfo, (value) => {
    console.log('dockInfo', value)
  }, { deep: true })
}
