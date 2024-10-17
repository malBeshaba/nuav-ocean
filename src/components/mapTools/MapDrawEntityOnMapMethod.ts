import * as Cesium from 'cesium'


// 多边形全部点的数组
let polygon_point_arr:any[] = [];
// 临时多边形entity
let temporary_polygon_entity: any = null;
let handler:any = null;
let point_arr:any[]=[];

export const cancel_draw_polygon = function (){
    // 清除所有事件
    if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    const entities = window.cesiumViewer.entities._entities._array;
    let length = entities .length
    for (let i = length - 1; i >= 0; i--) {
        if (entities [i]._name && entities [i]._name === "polygon") {
            // viewer.entities.remove(entitys[f]);
            let entity = entities [i]
            // console.log(entity._polygon._hierarchy._value)
            point_arr.push(entity._polygon._hierarchy._value.positions)
        }
    }
    let point_arr2:any[] = []
    point_arr[0].forEach((item:any)=>{
        let cartesian33 = new Cesium.Cartesian3(item.x, item.y, item.z)
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian33)
        let longitude = Cesium.Math.toDegrees(cartographic.longitude)
        let latitude = Cesium.Math.toDegrees(cartographic.latitude)
        point_arr2.push([longitude, latitude])
    })
    return point_arr2
}

// 开启绘制的方法
export const click_draw_polygon= function () {
    // 清除可能会用到的监听事件
    if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
    handler = new Cesium.ScreenSpaceEventHandler(window.cesiumViewer.scene.canvas);

    //鼠标左键--确定选中点
    handler.setInputAction((event:any) => {
        // 屏幕坐标转为空间坐标
        let cartesian = window.cesiumViewer.camera.pickEllipsoid(event.position, window.cesiumViewer.scene.globe.ellipsoid);
        // 判断是否定义（是否可以获取到空间坐标）
        if (Cesium.defined(cartesian)) {
            // 将点添加进保存多边形点的数组中，鼠标停止移动的时添加的点和，点击时候添加的点，坐标一样
            polygon_point_arr.push(cartesian);
            // 判断是否开始绘制动态多边形，没有的话则开始绘制
            if (temporary_polygon_entity == null) {
                // 绘制动态多边形
                draw_dynamic_polygon();
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //鼠标移动--实时绘制多边形
    handler.setInputAction((event:any) => {
        // 屏幕坐标转为空间坐标
        let cartesian = window.cesiumViewer.camera.pickEllipsoid(event.endPosition, window.cesiumViewer.scene.globe.ellipsoid);
        // 判断是否定义（是否可以获取到空间坐标）
        if (Cesium.defined(cartesian)) {
            // 判断是否已经开始绘制动态多边形，已经开始的话，则可以动态拾取鼠标移动的点，修改点的坐标
            if (temporary_polygon_entity) {
                // 只要元素点大于一，每次就删除一个点，因为实时动态的点是添加上去的
                if (polygon_point_arr.length > 1) {
                    // 删除数组最后一个元素（鼠标移动添加进去的点）
                    polygon_point_arr.pop();
                }
                // 将新的点添加进动态多边形点的数组中，用于实时变化，注意：这里是先添加了一个点，然后再删除点，再添加，这样重复的
                polygon_point_arr.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //鼠标右键--结束绘制
    handler.setInputAction((event:any) => {
        // 取消鼠标移动监听
        // handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 绘制结果多边形
        draw_polygon();
        // 清除动态绘制的多边形
        window.cesiumViewer.entities.remove(temporary_polygon_entity);
        // 删除保存的临时多边形的entity
        temporary_polygon_entity = null;
        // 清空多边形点数组，用于下次绘制
        polygon_point_arr = [];
        // 清除所有事件
        // if (handler) {
        //     handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //     handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //     handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        // }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

//绘制动态多边形
function draw_dynamic_polygon() {
    temporary_polygon_entity = window.cesiumViewer.entities.add({
        polygon: {
            hierarchy: new Cesium.CallbackProperty(() => {
                // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
                return new Cesium.PolygonHierarchy(polygon_point_arr);
            }, false),
            // extrudedHeight: 0,  // 多边体的高度（多边形拉伸高度）
            // height: 10,  // 多边形离地高度
            material: Cesium.Color.YELLOW.withAlpha(0.5),
            outline:true,
            outlineColor: Cesium.Color.GREEN,
            outlineWidth: 2
        },
    });
}

//绘制结果多边形
function draw_polygon() {
    // 删除最后一个动态添加的点，如果鼠标没移动，最后一个和倒数第二个是一样的，所以也要删除
    // polygon_point_arr.pop();
    // 三个点以上才能绘制成多边形
    if (polygon_point_arr.length >= 3) {
        let polygon_point_entity = window.cesiumViewer.entities.add({
            name:"polygon",
            id:"wayLinePolygonPolygon",
            polygon: {
                hierarchy: polygon_point_arr,
                // extrudedHeight: 0,  // 多边体的高度（多边形拉伸高度）
                // height: 10,  // 多边形离地高度
                material: Cesium.Color.YELLOW.withAlpha(0.5),
                outline:true,
                outlineColor: Cesium.Color.GREEN,
                outlineWidth: 2
            },
        });
        // console.log(polygon_point_entity.polygon.hierarchy)
        // 坐标转换--这里可以输出所有点位坐标，不需要就删除了
        // let point_arr:any[]=[]
        // polygon_point_arr.forEach(val => {
        //   let cartographic = window.cesiumViewer.scene.globe.ellipsoid.cartesianToCartographic(val)
        //     let polyObj = {
        //         lat:Cesium.Math.toDegrees(cartographic.longitude),
        //         lon:Cesium.Math.toDegrees(cartographic.latitude)
        //     }
        //   // polyObj.lon = Cesium.Math.toDegrees(cartographic.longitude)
        //   // polyObj.lat = Cesium.Math.toDegrees(cartographic.latitude)
        //   point_arr.push([polyObj.lon, polyObj.lat])
        // })
        // console.log(point_arr)
        // return point_arr;
    } else {
        return
    }
}
