import * as Cesium from 'cesium'
import {Quaternion} from 'cesium'

export class VideoFusion{
    id:string
    position:Cesium.Cartesian3
    perspectiveFrustumType: {
        fov: number
        // 近平面的距离
        near: number
        // 远平面的距离
        far: number
        // 宽度与长度纵横比
        aspectRatio: number
    };
    outlinePrimitive:any
    videoRectangle: any
    // 视锥体的姿态[heading, Pitch, Roll]
    hpr: [number, number, number]
    videoSource:any
    frustum: any | Cesium.PerspectiveFrustum
    orientation: any | Cesium.Quaternion

    constructor(options:any){
        this.id = options.id
        this.perspectiveFrustumType = options.perspectiveFrustumType
        this.position = options.position
        this.hpr = options.hpr
        this.videoSource = options.videoSource
        this.initFrustum()
        this.add()
    }

    // 更新视锥体的姿态
    update(position:any, hpr:[number, number, number]){
        this.position = position
        this.hpr = hpr
        this.initFrustum()
        this.add()
    }

    // 创建视锥体和轮廓线
    add(){
        this.clear()
        this.addVideo()
        this.addOutline()
    }

    // 清除视锥体和轮廓线
    clear(){
        this.clearOutline()
        this.clearVideo()
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
            window.cesiumViewer.scene.primitives.remove(this.videoRectangle)
            this.videoRectangle = null
        }
    }
    initFrustum() {
        this.frustum = new Cesium.PerspectiveFrustum({
            // 查看的视场角度，绕Z轴旋转，以弧度方式输入
            fov: Cesium.Math.toRadians(this.perspectiveFrustumType.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.perspectiveFrustumType.aspectRatio,
            // 近面距视点的距离
            near: this.perspectiveFrustumType.near,
            // 远面距视点的距离
            far: this.perspectiveFrustumType.far,
        })
        let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.hpr[0]), Cesium.Math.toRadians(this.hpr[1]), Cesium.Math.toRadians(this.hpr[2]));
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.position, hpr);
    }

    addVideo() {
        window.cesiumViewer.showRenderLoopErrors = false
        window.cesiumViewer.shouldAnimate = true
        // let geometry = new Cesium.FrustumGeometry({
        //     frustum: this.frustum,
        //     origin: this.position,
        //     orientation: this.orientation,
        //     vertexFormat: Cesium.VertexFormat.POSITION_ONLY
        // })
        // let instance = new Cesium.GeometryInstance({
        //     geometry: geometry,
        //     attributes: {
        //         color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        //             new Cesium.Color(0.0, 1.0, 0.0, 0.5)
        //         ),
        //     },
        //     id:"frustumPrimitive",
        // });
        // let video = new Cesium.Primitive({
        //     geometryInstances: instance,
        //     appearance: new Cesium.MaterialAppearance({
        //         material: this.videoSource,
        //         translucent: true,
        //     })
        // });
        // this.videoRectangle = window.cesiumViewer.scene.primitives.add(video,0)
        const list = [113.02268791320124, 23.14792830114777, 70, 113.02378411859915, 23.147718130297726, 70, 113.02693912888391, 23.148573088404905, 70]
        window.cesiumViewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(list, ),
          material: this.videoSource,
        },
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
        })
        this.outlinePrimitive = window.cesiumViewer.scene.primitives.add(primitive,1)
    }
}
