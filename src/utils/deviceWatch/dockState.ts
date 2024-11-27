import store from '@/store';
import { watch } from 'vue';
import {DrawPointByBillboard, makeBufferByPoint, RemoveEntitiesById} from '@/components/mapTools/BaseMapTools'
import dockImage from '@/assets/map/dock2.png';
import { getBindingDevices } from '@/api/device';
import * as Cesium from 'cesium';

let dockBuffer = {} as {
  [key: string]: {
    points_list: number[][],
    buffer_entity: bufferClass | null
  }
}

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
          try {
            store?.state?.checkDockState.forEach((item: any) => {
              const dockPoint = window.cesiumViewer.entities.getById(String(item.sn) + 'dockCheck')
              if(dockPoint) {
                window.cesiumViewer.entities.remove(dockPoint)
                DrawPointByBillboard(window.cesiumViewer, String(item.sn) + 'dockCheck', [item.position.longitude - 0.00001,item.position.latitude + 0.00007, item.position.height], 0, dockImage)
              } else {
                DrawPointByBillboard(window.cesiumViewer, String(item.sn) + 'dockCheck', [item.position.longitude - 0.00001,item.position.latitude + 0.00007, item.position.height], 0, dockImage)
              }
              if(!dockBuffer[item.sn]) {
                dockBuffer[item.sn] = {buffer_entity: null, points_list: []}
                const bufferPoints: number[][] = makeBufferByPoint([item.position.longitude - 0.00001,item.position.latitude + 0.00007], 5)
                dockBuffer[item.sn].points_list = bufferPoints
                let list_point: number[] = []
                bufferPoints.forEach((item: number[]) => {
                  list_point.push(item[0])
                  list_point.push(item[1])
                  list_point.push(0)
                })
                dockBuffer[item.sn].buffer_entity = new bufferClass({
                  mapViewer: window.cesiumViewer,
                  position: list_point
                })

              }
            })
          } catch (error) {
              console.log(error)
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

class bufferClass {
  _mapViewer: Cesium.Viewer
  _position: number[]
  _withAlpha: number
  _buffer: any | null
  constructor(options: any) {
    this._mapViewer = options.mapViewer
    this._position = options.position
    this._withAlpha = 0.5
    this.init()
  }

  // Cesium.Color.fromCssColorString('#b1845b').withAlpha(0.5)
  init() {
    this.destroy()
    this._withAlpha = 0.5
    let isShow = false
    this._buffer = this._mapViewer.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(this._position),
        material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(() => {
          if(this._withAlpha > 0.5) {
            isShow = true
          }
          if(this._withAlpha < 0) {
            isShow = false
          }
          if(isShow) {
            this._withAlpha -= 0.01
          } else {
            this._withAlpha += 0.01
          }
          return Cesium.Color.fromCssColorString('#b1845b').withAlpha(this._withAlpha)
        }, false)),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })
  }

  destroy() {
    if(this._buffer) {
      this._mapViewer.entities.remove(this._buffer)
      this._buffer = null
    }
  }

}

