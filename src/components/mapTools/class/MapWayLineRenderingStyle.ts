import * as Cesium from 'cesium'
import {LineFlickerMaterialProperty} from '@/components/mapTools/class/RenderingStyleLineFlickerMaterialProperty'

export class WayLineRendering {
  mapViewer: Cesium.Viewer | undefined
  waylineId: string
  renderingType: {
    type: string,
    wayLineColor: string,
  }
  positions: number[]
  wayLineLabel: any

  constructor(options: any) {
    this.mapViewer = options.mapViewer
    this.renderingType = options.renderingType
    this.waylineId = options.waylineId
    this.positions = options.positions
  }

  drawWayLine() {
    if( this.renderingType.type === 'ground') {
      this.wayLineLabel = this.mapViewer?.entities.add({
        polyline: {
          width: 3,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positions),
          // material: new Cesium.LineFlickerMaterialProperty({
          //   color: Cesium.Color.fromCssColorString(this.renderingType.wayLineColor),
          //   speed: 10.0,
          // })
        }
      })
    }
  }
}
