import * as Cesium from 'cesium'


export class CreateFrustum{
    position:Cesium.Cartesian3;
    //viewHeading:Number;
    //viewPitch:Number;
    //viewRoll:Number;
    fov:number;
    near:number;
    far:number;
    aspectRatio:number;
    frustumPrimitive:any;
    outlinePrimitive:any;
    orientation:any;

    constructor(options:any){
        this.position = options.position;
        //this.viewHeading=options.heading,
        //this.viewPitch=options.pitch,
        //this.viewRoll=options.roll
        this.orientation = options.orientation
        this.fov = options.fov || 30;
        // this.near = options.near || 10;
        this.near = options.near;
        this.far = options.far || 100;
        this.aspectRatio = options.aspectRatio;
        // this.outlinePrimitive;
        // this.frustumPrimitive;
        this.add();
    }

    // 更新视锥体的姿态
    update(position:Cesium.Cartesian3, orientation:Cesium.Matrix3){
        this.position = position;
        this.orientation = orientation
        this.add();
    }

    // 创建视锥体和轮廓线
    add(){
        this.clear();
        this.addFrustum();
        this.addOutline();
    }

    // 清除视锥体和轮廓线
    clear(){
        this.clearFrustum();
        this.clearOutline();
    }



    // 清除视锥体
    clearFrustum(){
        if(this.frustumPrimitive){
            window.cesiumViewer.scene.primitives.remove(this.frustumPrimitive);
            this.frustumPrimitive = null;
        }
    }

    // 清除轮廓线
    clearOutline(){
        if(this.outlinePrimitive){
            window.cesiumViewer.scene.primitives.remove(this.outlinePrimitive);
            this.outlinePrimitive = null;
        }
    }

    // 创建视锥体
    addFrustum(){
        let frustum = new Cesium.PerspectiveFrustum({
            // 查看的视场角，绕Z轴旋转，以弧度方式输入
            // fov: Cesium.Math.PI_OVER_THREE,
            fov: Cesium.Math.toRadians(this.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.aspectRatio,
            // 近面距视点的距离
            near: this.near,
            // 远面距视点的距离
            far: this.far,
        });
        let geometry = new Cesium.FrustumGeometry({
            frustum: frustum,
            origin: this.position,
            orientation: this.orientation,
            vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
        });
        let instance = new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new Cesium.Color(0.0, 1.0, 0.0, 0.5)
                ),
            },
            id:"frustumPrimitive",
        });
        let primitive= new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
                closed: true,
                flat: true,
            }),
            asynchronous: false,
        });
        this.frustumPrimitive = window.cesiumViewer.scene.primitives.add(primitive,0);
    }

    // 创建轮廓线
    addOutline(){
        let frustum = new Cesium.PerspectiveFrustum({
            // 查看的视场角度，绕Z轴旋转，以弧度方式输入
            // The angle of the field of view (FOV), in radians.
            // This angle will be used as the horizontal FOV if the width is greater than the height, otherwise it will be the vertical FOV.
            fov: Cesium.Math.toRadians(this.fov),
            // 视锥体的宽度/高度
            aspectRatio: this.aspectRatio,
            // 近面距视点的距离
            near: this.near,
            // 远面距视点的距离
            far: this.far,
        });
        let geometry = new Cesium.FrustumOutlineGeometry({
            frustum: frustum,
            origin: this.position,
            orientation: this.orientation,
            // vertexFormat: Cesium.VertexFormat.POSITION_ONLY
        });
        let instance = new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                ),
            },
            id:"outlinePrimitive"
        });
        let primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
                closed: true,
                flat: true,
            }),
            asynchronous: false,
        });
        this.outlinePrimitive = window.cesiumViewer.scene.primitives.add(primitive,1);
    }
}

