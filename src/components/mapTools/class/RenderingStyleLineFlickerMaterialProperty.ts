/**
 * @Description: 闪烁线材质
 * @Version: 1.0
 * @Author: Jack-Dong-Dong
 * @LastEditors: Jack-Dong-Dong
 */
import * as Cesium from 'cesium'

export class LineFlickerMaterialProperty {
  definitionChanged: Cesium.Event | undefined
  color: undefined | Cesium.Property
  speed: undefined | Cesium.Property
  constructor(options: any) {
    this.definitionChanged = new Cesium.Event()
    this.speed = options.speed
    this.color = options.color
  }

  get isConstant() {
    return false
  }

  get definitionChangedEvent() {
    return this.definitionChanged
  }

  getType(time: any) {
    return Cesium.Material.LineFlickerMaterialType
  }

  getValue(time: any, result: any) {
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color)
    result.speed = Cesium.Property.getValueOrClonedDefault(this.speed, time, 1.0, result.speed)
    return result
  }

  equals(other: any) {
    return this === other || (other instanceof LineFlickerMaterialProperty && Cesium.Property.equals(this.color, other.color) && Cesium.Property.equals(this.speed, other.speed))

  }

}

Object.defineProperties(LineFlickerMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
})

Cesium.LineFlickerMaterialProperty = LineFlickerMaterialProperty
Cesium.Material.LineFlickerMaterialProperty = 'LineFlickerMaterialProperty'
Cesium.Material.LineFlickerMaterialType = 'LineFlickerMaterialType'
Cesium.Material.LineFlickerMaterialSource =
    `
uniform vec4 color;
uniform float speed;
czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  float time = fract( czm_frameNumber  *  speed / 1000.0);
  vec2 st = materialInput.st;
  float scalar = smoothstep(0.0,1.0,time);
  material.diffuse = color.rgb * scalar;
  material.alpha = color.a * scalar ;
  return material;
}
`

Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlickerMaterialType, {
  fabric: {
    type: Cesium.Material.LineFlickerMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 5.0,
    },
    source: Cesium.Material.LineFlickerMaterialSource,
  },
  translucent: function (material: any) {
    return true
  }
})
