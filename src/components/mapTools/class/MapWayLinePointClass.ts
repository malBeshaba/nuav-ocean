import * as Cesium from 'cesium'
import wayLinePointIcon from '@/assets/map/wayLinePointLabel.png'
import wayLineGroundIcon from '@/assets/map/wayLinePointGround.png'
import {SceneCoordinateToWgs84} from '@/components/mapTools/SeniorMapTools'
import store from '@/store'

const WayLinePointColor = {
  ground: '#134153',
  airText: '#902E2E',
  airTextBackground: '#2E828B',
  wayLine: '#8AD8ED',
  ConnectingCables: '#FCFAF1',
}

export class WayLinePoint {
  id: string
  textValue: string
  mapViewer: Cesium.Viewer | undefined
  public position: {
		longitude: number,
		latitude: number,
		height: number
  }
  isEmit: boolean
  // private
  textLabel: any
  connectingCableLabel: any
  heightValueLabel: any
  groundLabel: any
  perpendicularLabel: any

  //鼠标点击事件有关
  modelDragHandler: Cesium.ScreenSpaceEventHandler | null = null
  checkDragHandler: Cesium.ScreenSpaceEventHandler | null = null

  constructor(options:any) {
    this.id = options.id
    this.textValue = options.textValue
    this.mapViewer = options.mapViewer
    this.position = options.position
    this.isEmit = options.isEmit
    this.initWayPoint()
  }

  updatePosition(position: {longitude: number, latitude: number, height: number}) {
    this.position = position
    this.initWayPoint()
  }

  updateTextValue(textValue: string) {
    this.textValue = textValue
    this.initWayPoint()
  }

  setHeight(height: number) {
    this.position.height = height
    this.initWayPoint()
  }

  initWayPoint() {
    this.clear()
    this.addTextLabel()
    this.addGroundLabel()
    this.addConnectingCable().then(r => {})
    this.moveActionEntity(this.isEmit)
  }

  clear() {
    if(this.textLabel){
      this.mapViewer?.entities.remove(this.textLabel)
      this.textLabel = null
    }
    if(this.connectingCableLabel){
      this.mapViewer?.entities.remove(this.connectingCableLabel)
      this.connectingCableLabel = null
    }
    if(this.groundLabel){
      this.mapViewer?.entities.remove(this.groundLabel)
      this.groundLabel = null
    }
    if(this.heightValueLabel){
      this.mapViewer?.entities.remove(this.heightValueLabel)
      this.heightValueLabel = null
    }
  }

  getPosition() {
    return this.position
  }

  moveActionEntity(isEmit: boolean) {
    this.isEmit = isEmit
    if(isEmit) {
      if(!this.modelDragHandler) {
        this.modelDragHandler = new Cesium.ScreenSpaceEventHandler(this.mapViewer?.scene.canvas)
        this.modelDragHandler.setInputAction((movement: any) => {
          const pickInfo = this.mapViewer?.scene.pick(movement.position)
          if (pickInfo && pickInfo.id) {
            if (pickInfo.id._id === this.textLabel.id || pickInfo.id._id === this.groundLabel.id) {
              // @ts-ignore
              this.mapViewer.scene.screenSpaceCameraController.enableRotate = false
              this.modelDragHandler?.setInputAction((event: any) => {
                // @ts-ignore
                let cartographic = SceneCoordinateToWgs84(this.mapViewer, event.endPosition.x, event.endPosition.y, this.position.height)
                this.position.longitude = cartographic[0]
                this.position.latitude = cartographic[1]
                this.position.height = cartographic[2]
                this.initWayPoint()
              }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
              this.modelDragHandler?.setInputAction((event2: any) => {
                // @ts-ignore
                this.mapViewer.scene.screenSpaceCameraController.enableRotate = true
                this.modelDragHandler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                this.modelDragHandler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
                store.commit('LISTEN_WAYLINEPOINT_POSITION_CHANGE', {id: this.id, position: this.position})
              }, Cesium.ScreenSpaceEventType.LEFT_UP)
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
      }
    } else {
      if(this.modelDragHandler) {
        this.modelDragHandler?.destroy()
        this.modelDragHandler = null
      }
    }
    this.checkEntity()
  }

  checkEntity() {
    if(this.modelDragHandler == null) {
      this.checkDragHandler = new Cesium.ScreenSpaceEventHandler(this.mapViewer?.scene.canvas)
      this.checkDragHandler.setInputAction((movement: any) => {
        const pickInfo = this.mapViewer?.scene.pick(movement.position)
        if (pickInfo && pickInfo.id) {
          if (pickInfo.id._id === this.textLabel.id || pickInfo.id._id === this.groundLabel.id) {
            store.commit('UPDATE_FOCUSWAYPOINT_BY_CLASS', {id: this.id})
            this.checkDragHandler?.setInputAction((event2: any) => {
              // @ts-ignore
              this.checkDragHandler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
            }, Cesium.ScreenSpaceEventType.LEFT_UP)
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    } else {
      if(this.checkDragHandler) {
        this.checkDragHandler?.destroy()
        this.checkDragHandler = null
      }
    }
  }

  addTextLabel() {
    const textLabel = new Cesium.LabelGraphics({
      font: '20px Helvetica',
      fillColor: Cesium.Color.fromCssColorString(WayLinePointColor.airText),
      outlineColor: Cesium.Color.fromCssColorString(WayLinePointColor.ConnectingCables),
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      text: this.textValue,
    })

    const groundModel = new Cesium.BillboardGraphics({
      image: wayLinePointIcon,
      width: 25,
      height: 25,
      color: Cesium.Color.WHITE.withAlpha(0.8),
    })

    this.textLabel = this.mapViewer?.entities.add({
      id: this.id + 'textLabel',
      //@ts-ignore
      position: new Cesium.CallbackProperty(() => {
        return Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height)
          },false),
      label: textLabel,
      billboard: groundModel,
    })
  }

  async addConnectingCable() {
    const connectLine = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.fromCssColorString(WayLinePointColor.ConnectingCables),
      dashLength: 5,
      // dashPattern: 250,
    })
    const heightTextLabel = new Cesium.LabelGraphics({
      font: '20px Helvetica',
      fillColor: Cesium.Color.fromCssColorString(WayLinePointColor.ConnectingCables),
      text: String(this.position.height) + 'm',
    })

    let location = Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude)
    //@ts-ignore
    let promise = await Cesium.sampleTerrainMostDetailed(this.mapViewer?.terrainProvider, location)
    let airPosition = Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height)

    this.connectingCableLabel = this.mapViewer?.entities.add({
      id: this.id + 'connectingCableLabel',
      polyline: {
        // @ts-ignore
        positions: new Cesium.CallbackProperty(() => {
          // @ts-ignore
          return Cesium.Cartesian3.fromDegreesArrayHeights([this.position.longitude, this.position.latitude, this.position.height, this.position.longitude, this.position.latitude, (airPosition.z - promise.z)])
          },false),
        // positions: Cesium.Cartesian3.fromDegreesArrayHeights([this.position.longitude, this.position.latitude, this.position.height, this.position.longitude, this.position.latitude, (airPosition.z - promise.z)]),
        width: 2,
        material: connectLine,
      },
    })
    this.heightValueLabel = this.mapViewer?.entities.add({
      // @ts-ignore
      position: new Cesium.CallbackProperty(() => {
        return Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.height / 2)
      }, false),
      label: heightTextLabel,
    })
  }

  addGroundLabel() {
    const groundLabel = new Cesium.BillboardGraphics({
      image: wayLineGroundIcon,
      width: 25,
      height: 25,
      color: Cesium.Color.WHITE.withAlpha(0.8),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    })

    this.groundLabel = this.mapViewer?.entities.add({
      id: this.id + 'groundLabel',
      //@ts-ignore
      position: new Cesium.CallbackProperty(() => {
        return Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude)
          },false),
      billboard: groundLabel,
    })
  }
}

export class WayLinePolyline {

}
