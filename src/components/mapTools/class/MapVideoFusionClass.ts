import * as Cesium from 'cesium'
import WebrtcPlayer from '@/components/video/WebrtcPlayer.vue'

export class VideoFusion{
    id:string
    position:Cesium.Cartesian3
    show: boolean
    perspectiveFrustumType: {
        fov: number
        // 近平面的距离
        near: number
        // 远平面的距离
        far: number
        // 宽度与长度纵横比
        aspectRatioWidth: number
        aspectRatioHeight: number
    };
    droneModelUri: string
    outlinePrimitive:any
    UAVModelEntity: any
    videoRectangle: any
    // 视锥体的姿态[heading, Pitch, Roll]
    hpr: [number, number, number]
    videoSource:any
    frustum: any | Cesium.PerspectiveFrustum
    orientation: any | Cesium.Quaternion

    constructor(options:any){
        this.id = options.id
        this.perspectiveFrustumType = options.perspectiveFrustumType
        this.droneModelUri = options.droneModelUri
        this.position = options.position
        this.hpr = options.hpr
        this.videoSource = options.videoSource
        this.show = options.show
        this.initFrustum()
        this.addAll()
    }

    // 更新视锥体的姿态
    update(position:any, hpr:[number, number, number], perspectiveFrustumType: {fov: number, near: number, far: number, aspectRatioWidth: number, aspectRatioHeight: number}, isShow: boolean) {
        this.position = position
        this.hpr = hpr
        this.show = isShow
        this.perspectiveFrustumType = perspectiveFrustumType
        this.initFrustum()
        // this.addAll()
        // this.clearOutline()
        // this.addOutline()
        this.updateVideoRectangleAndUAV()
    }

    // 创建视锥体和轮廓线
    addAll(){
        this.clearAll()
        // this.addOutline()
        this.addVideo()
        this.addUAVModel()
    }
    updateVideoRectangleAndUAV() {
        if(this.videoRectangle){
            const coordinates = Cesium.Rectangle.fromCartesianArray(this.calculatesRectangle())
            this.videoRectangle.rectangle.coordinates = new Cesium.CallbackProperty(function () {
                return coordinates
            }, false)
            const rotation = Cesium.Math.toRadians(360 - this.hpr[0])
            this.videoRectangle.rectangle.rotation = new Cesium.CallbackProperty(function () {
                return rotation
            }, false)

            //让视频纹理和矩形实体一起转动
            this.videoRectangle.rectangle.stRotation = new Cesium.CallbackProperty(function () {
                return rotation
            }, false)
            let position = this.position
            this.UAVModelEntity.position = new Cesium.CallbackProperty(function () {
                return position
            }, false)
            this.UAVModelEntity.orientation.setValue(this.orientation)
            this.videoRectangle.show = this.show
            this.UAVModelEntity.show = this.show
        } else {
            this.addVideo()
        }
    }

    // 清除视锥体和轮廓线
    clearAll(){
        // this.clearOutline()
        this.clearVideo()
        this.clearUAVModel()
    }

    // 清除轮廓线
    clearOutline(){
        if(this.outlinePrimitive){
            window.cesiumViewer.scene.primitives.remove(this.outlinePrimitive)
            this.outlinePrimitive = null
        }
    }

    clearVideo(){
        if(this.videoRectangle){
            window.cesiumViewer.entities.remove(this.videoRectangle)
            this.videoRectangle = null
        }
    }

    clearUAVModel(){
        if(this.UAVModelEntity){
            window.cesiumViewer.entities.remove(this.UAVModelEntity)
            this.UAVModelEntity = null
        }
    }

    initFrustum() {
        this.frustum = new Cesium.PerspectiveFrustum({
            // 查看的视场角度，绕Z轴旋转，以弧度方式输入
            fov: Cesium.Math.toRadians(this.perspectiveFrustumType.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.perspectiveFrustumType.aspectRatioWidth / this.perspectiveFrustumType.aspectRatioHeight,
            // 近面距视点的距离
            near: this.perspectiveFrustumType.near,
            // 远面距视点的距离
            far: this.perspectiveFrustumType.far,
        })
        let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(360 - this.hpr[0]), Cesium.Math.toRadians(this.hpr[1]), Cesium.Math.toRadians(this.hpr[2]));
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.position, hpr);
    }

    calculatesRectangle() {
        const cartographic = Cesium.Cartographic.fromCartesian(this.position)
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)

        const southwest = Cesium.Cartesian3.fromDegrees(longitude - (this.perspectiveFrustumType.aspectRatioHeight / 2) / 111319.9, latitude - (this.perspectiveFrustumType.aspectRatioWidth / 2) / 111319.9)
        const northeast = Cesium.Cartesian3.fromDegrees(longitude + (this.perspectiveFrustumType.aspectRatioHeight / 2) / 111319.9, latitude + (this.perspectiveFrustumType.aspectRatioWidth / 2) / 111319.9)
        return [southwest, northeast]
    }

    addVideo() {

        let rectangle = new Cesium.RectangleGraphics({
            coordinates: Cesium.Rectangle.fromCartesianArray(this.calculatesRectangle()),
            material: this.videoSource,
            rotation: Cesium.Math.toRadians(360 - this.hpr[0]),
        })

        this.videoRectangle = window.cesiumViewer.entities.add({
            id: this.id + 'videoEntity',
            rectangle: rectangle,
            show: this.show,
        })

    }

    addUAVModel() {
        let UAVModel = new Cesium.ModelGraphics({
            uri: this.droneModelUri,
            minimumPixelSize: 64,
            maximumScale: 20000,
        })
        this.UAVModelEntity = window.cesiumViewer.entities.add({
            id: this.id + 'UAVModelEntity',
            model: UAVModel,
            position: this.position,
            orientation: this.orientation,
            show: this.show,
        })
    }

    // 创建轮廓线
    addOutline(){
        let geometry = new Cesium.FrustumOutlineGeometry({
            frustum: this.frustum,
            origin: this.position,
            orientation: this.orientation,
            // vertexFormat: Cesium.VertexFormat.POSITION_ONLY
        })
        let instance = new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                ),
            },
            id: this.id + 'videoFusionOutline'
        })
        let primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
                closed: true,
                flat: true,
            }),
            asynchronous: false,
            show: this.show,
        })
        this.outlinePrimitive = window.cesiumViewer.scene.primitives.add(primitive,1)
    }
}
