import * as Cesium from 'cesium'
import WayLinePointLabel from '@assets/map/wayLinePointLabel.png'
import {ConnectPolylineLabel} from '@/components/mapTools/mapMaterial/mapMaterialStyle'


const textLabel = new Cesium.LabelGraphics({
  // text: textLabelValue,
  font: '25px Helvetica',
  fillColor: Cesium.Color.fromCssColorString('#8E4483'),
  outlineColor: Cesium.Color.fromCssColorString('#F7F6EE'),
  outlineWidth: 1,
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
})

const pointLabel = new Cesium.PointGraphics({
  pixelSize: 3,
  color: Cesium.Color.WHITE,
  outlineColor: Cesium.Color.WHITE,
  outlineWidth: 2,
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
})

const polylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#ffffff'),
  dashLength: 10.0,
  dashPattern: 255.0,
})

/**
 * 绘制航线点
 * @param mapViewer
 * @param pointId
 * @param textLabelValue
 * @param pointLocation
 * @constructor
 */
export function DrawWayLinePoint(mapViewer:Cesium.Viewer, pointId:string, textLabelValue: number, pointLocation: number[]) {
  // @ts-ignore
  textLabel.text = String(textLabelValue)
  mapViewer.entities.add({
    id: pointId + 'text_' + (textLabelValue - 1),
    position: Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1], pointLocation[2]),
    label: textLabel,
  })
  mapViewer.entities.add({
    id: pointId + 'land_' + (textLabelValue - 1),
    position: Cesium.Cartesian3.fromDegrees(pointLocation[0], pointLocation[1]),
    point: pointLabel,
  })
  const terrainHeight = mapViewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(pointLocation[0], pointLocation[1]))
  mapViewer.entities.add({
    id: pointId + 'label_' + (textLabelValue - 1),
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([pointLocation[0], pointLocation[1], pointLocation[2], pointLocation[0], pointLocation[1], Number(terrainHeight)], Cesium.Ellipsoid.WGS84,),
      width: 2,
      material: ConnectPolylineLabel,
    }
  })
}
