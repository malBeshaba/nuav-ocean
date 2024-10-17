import * as Cesium from 'cesium'
import WebrtcPlayer from '@/components/video/WebrtcPlayer.vue'
import { polygon } from '@turf/helpers'
import { log } from 'console'

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
    outlineEntityCollection:any
    polygonPoints:any | Cesium.Cartesian3[]

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
        this.clearOutline()
        this.addOutline()
        this.updateVideoRectangleAndUAV()
    }

    // 创建视锥体和轮廓线
    addAll(){
        this.clearAll()
        this.addOutline()
        this.addVideo()
        this.addUAVModel()
    }
    updateVideoRectangleAndUAV() {
        if(this.videoRectangle){

            this.videoRectangle.polygon.hierarchy = this.polygonPoints
            const rotation = Cesium.Math.toRadians(this.hpr[0])


            //让视频纹理和矩形实体一起转动
            this.videoRectangle.polygon.stRotation = new Cesium.CallbackProperty(function () {
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
        this.clearOutline()
        this.clearVideo()
        this.clearUAVModel()
    }

    // 清除轮廓线
    clearOutline(){
        if (this.outlineEntityCollection) {
            for(let i =0;i<4;i++){
                window.cesiumViewer.entities.remove(this.outlineEntityCollection.values[i])
            }

            window.cesiumViewer.entities.remove(this.outlineEntityCollection)
            this.outlineEntityCollection = null
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
        let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-90+this.hpr[0]), Cesium.Math.toRadians(this.hpr[1]), Cesium.Math.toRadians(this.hpr[2]));
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.position, hpr);
    }

    calculatesRectangle() {
        this.polygonPoints = []
        let tempPoints = []

        let geometry = new Cesium.FrustumOutlineGeometry({
            frustum: this.frustum,
            origin: this.position,
            orientation: this.orientation,
            // vertexFormat: Cesium.VertexFormat.POSITION_ONLY
        })
        // console.log("中心点的笛卡尔",this.position);

        let sy = Cesium.FrustumOutlineGeometry.createGeometry(geometry)
        let value = sy?.attributes.position.values
        let values = [].slice.call(value)

        let error = 0

        let pointsLength = values.length / 3; //数组中以笛卡尔坐标进行存储 每3个值一个坐标
        for (let i = 0; i < pointsLength; i++) {
            let xyz = new Cesium.Cartesian3(values[i * 3], values[i * 3 + 1], values[i * 3 + 2]); //笛卡尔
            if(i>=4){
                // let cartographic = Cesium.Cartographic.fromCartesian(xyz)
                let polygonPoint = analysisVisible([xyz,this.position])
                if(polygonPoint == undefined){
                    error = 1
                }
                // xyz= Cesium.Cartesian3.fromRadians(cartographic.longitude,cartographic.latitude,cartographic.height)
                tempPoints.push(polygonPoint);
            }
        }

        if (error == 0) {
            this.polygonPoints = tempPoints
        }
        // console.log(this.polygonPoints);
        return this.polygonPoints


    }

    addVideo() {
        let polygon = new Cesium.PolygonGraphics({
            hierarchy:this.polygonPoints,
            material:this.videoSource,
            stRotation:Cesium.Math.toRadians(90+360 - this.hpr[0])
        })

        this.videoRectangle = window.cesiumViewer.entities.add({
            id:this.id+'videoEntity',
            show:this.show,
            polygon:polygon
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
        this.calculatesRectangle()
        this.outlineEntityCollection = new Cesium.EntityCollection()
        this.polygonPoints.forEach( (point :any)=> {
            let entity =  window.cesiumViewer.entities.add(
                new Cesium.Entity({
                    polyline: {
                        positions: [point, this.position],
                        width: 2,
                        material:  Cesium.Color.GREEN,
                        depthFailMaterial:  Cesium.Color.GREEN
                    }
                })
            )
            this.outlineEntityCollection.add(entity)
        });


        window.cesiumViewer.entities.add(this.outlineEntityCollection)
    }
}

function analysisVisible(positions:any) {
    // 计算射线的方向
    let direction = Cesium.Cartesian3.normalize(
        Cesium.Cartesian3.subtract(
            positions[0],
            positions[1],
            new Cesium.Cartesian3()
        ),
        new Cesium.Cartesian3()
    );
    // 建立射线
    let ray = new Cesium.Ray(positions[1], direction);
    // 计算交互点，返回第一个
    // let result = window.Gviewer.scene.pickFromRay(ray);
    // let result =  Cesium.IntersectionTests.rayEllipsoid(ray,window.cesiumViewer.scene.globe.ellipsoid)
    // return Cesium.Ray.getPoint(ray,result.start)
    let result = window.cesiumViewer.scene.globe.pick(ray,window.cesiumViewer.scene)
    // console.log(result);

    return result
}
