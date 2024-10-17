import * as Cesium from 'cesium'

export const NotFlyPolylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#ffffff'),
  dashLength: 30.0,
  dashPattern: 255.0,
})

export const FlyingPolylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#65DDBC'),
  dashLength: 0.0,
  dashPattern: 255.0,
})

export const FlyingGlowPolylineLabel = new Cesium.PolylineGlowMaterialProperty({
  color: Cesium.Color.fromCssColorString('#65DDBC'),
  glowPower: 0.9,
  taperPower: 0.9,
})

export const ConnectPolylineLabel = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.fromCssColorString('#FBC85F'),
  dashLength: 10.0,
  dashPattern: 255.0,
})

export const publicTextLabel = new Cesium.LabelGraphics({
  // text: textLabelValue,
  font: '20px Helvetica',
  fillColor: Cesium.Color.fromCssColorString('#384B60'),
  outlineColor: Cesium.Color.fromCssColorString('#F7F6EE'),
  outlineWidth: 2,
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
})
