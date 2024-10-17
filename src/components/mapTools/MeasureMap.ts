import * as Cesium from "cesium";
import {Cartesian3} from "cesium";

var entityCollection: any[]=[];


// 标签实体
export function measureDistance(viewer:Cesium.Viewer){
    // 注册鼠标左击事件
    let positions : any[]=[]
    let labelEntity : any
    viewer.screenSpaceEventHandler.setInputAction(function (clickEvent:any) {
        var cartesian = viewer.scene.pickPosition(clickEvent.position); // 坐标
        // var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position), viewer.scene);
        if (!cartesian) {
            return;
        }
        console.log("positions的长度",positions)
        console.log("entityCollection",entityCollection)
        // 存储第一个点
        if (positions.length === 0) {
            positions.push(cartesian.clone());

            addPoint(viewer,cartesian);

            // 注册鼠标移动事件
            viewer.screenSpaceEventHandler.setInputAction(function (moveEvent:any) {
                var movePosition = viewer.scene.pickPosition(moveEvent.endPosition); // 鼠标移动的点
                // var movePosition = viewer.scene.globe.pick(viewer.camera.getPickRay(moveEvent.endPosition), viewer.scene);
                if (!movePosition) {
                    return;
                }
                if (positions.length == 2) {
                    positions.pop();
                    positions.push(movePosition);

                    // 绘制label
                    if (labelEntity) {
                        viewer.entities.remove(labelEntity);
                        entityCollection.splice(entityCollection.indexOf(labelEntity), 1);
                    }

                    // 计算中点
                    var centerPoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
                    // 计算距离
                    var lengthText = "距离：" + getLengthText(positions[0], positions[1]);

                    labelEntity = addLabel(viewer,centerPoint, lengthText);
                    entityCollection.push(labelEntity);

                } else {
                    positions.push(movePosition);
                    // 绘制线
                    addLine(viewer,positions);
                }
                viewer.scene.requestRender()
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        } else {
            // 存储第二个点
            positions.pop();
            positions.push(cartesian);
            addPoint(viewer,cartesian);
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export function measureLength(viewer:Cesium.Viewer){
    // 注册鼠标左击事件
    let positions : any[]=[]
    let labelEntity : any
    viewer.screenSpaceEventHandler.setInputAction(function (clickEvent:any) {
        // var cartesian = viewer.scene.pickPosition(clickEvent.position); // 坐标
        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position), viewer.scene);
        if (!cartesian) {
            return;
        }
        console.log("positions的长度",positions)
        console.log("entityCollection",entityCollection)
        // 存储第一个点
        if (positions.length === 0) {
            positions.push(cartesian.clone());

            addPoint(viewer,cartesian);

            // 注册鼠标移动事件
            viewer.screenSpaceEventHandler.setInputAction(function (moveEvent:any) {
                // var movePosition = viewer.scene.pickPosition(moveEvent.endPosition); // 鼠标移动的点
                var movePosition = viewer.scene.globe.pick(viewer.camera.getPickRay(moveEvent.endPosition), viewer.scene);
                if (!movePosition) {
                    return;
                }
                if (positions.length == 2) {
                    positions.pop();
                    positions.push(movePosition);

                    // 绘制label
                    if (labelEntity) {
                        viewer.entities.remove(labelEntity);
                        entityCollection.splice(entityCollection.indexOf(labelEntity), 1);
                    }

                    // 计算中点
                    var centerPoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
                    // 计算距离
                    var lengthText = "距离：" + getLengthText(positions[0], positions[1]);

                    labelEntity = addLabel(viewer,centerPoint, lengthText);
                    entityCollection.push(labelEntity);

                } else {
                    positions.push(movePosition);
                    // 绘制线
                    addLine(viewer,positions);
                }
                viewer.scene.requestRender()
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        } else {
            // 存储第二个点
            positions.pop();
            positions.push(cartesian);
            addPoint(viewer,cartesian);
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export function measureArea(viewer:Cesium.Viewer){
    let clickStatus :boolean = false
    let positions : any[]=[]
    let labelEntity : any

    viewer.screenSpaceEventHandler.setInputAction(function (clickEvent:any) {
        clickStatus = true;
        var cartesian = viewer.scene.pickPosition(clickEvent.position);
        // var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position), viewer.scene);
        if (!cartesian) {
            return;
        }
        switch (positions.length) {
            case 0:
                positions.push(cartesian.clone()); //鼠标左击 添加第1个点
                addPoint(viewer,cartesian);

                // 注册鼠标移动事件
                viewer.screenSpaceEventHandler.setInputAction(function (moveEvent:any) {
                    var movePosition = viewer.scene.pickPosition(moveEvent.endPosition);
                    // var movePosition = viewer.scene.globe.pick(viewer.camera.getPickRay(moveEvent.endPosition), viewer.scene);
                    if (!movePosition) {
                        return;
                    }

                    switch (positions.length) {
                        case 1:
                            positions.push(movePosition);
                            // addLine(viewer,positions);
                            break;

                        default:
                            if (clickStatus) {
                                positions.push(movePosition);
                            } else {
                                positions.pop();
                                positions.push(movePosition);
                            }
                            if (positions.length >= 3) {
                                // 绘制label
                                if (labelEntity) {
                                    viewer.entities.remove(labelEntity);
                                    entityCollection.splice(entityCollection.indexOf(labelEntity), 1);
                                }
                                var text = "面积：" + getArea(positions);
                                var centerPoint = getCenterOfGravityPoint(positions);
                                // 标注放高一点
                                var lnglat :any= cartographicToLnglat(
                                    Cesium.Cartographic.fromCartesian(centerPoint), viewer
                                );
                                let cartesian2 = Cesium.Cartesian3.fromDegrees(lnglat[0], lnglat[1], lnglat[2] + 20)
                                labelEntity = addLabel(viewer,cartesian2, text);
                                entityCollection.push(labelEntity);
                            }
                            break;
                    }
                    clickStatus = false;
                    viewer.scene.requestRender()
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                break;
            case 2:
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第3个点
                addPoint(viewer,cartesian);
                addPolyGon(viewer,positions);
                // 右击结束
                viewer.screenSpaceEventHandler.setInputAction(function (clickEvent:any) {
                    var clickPosition = viewer.scene.pickPosition(clickEvent.position);
                    // var clickPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position), viewer.scene);

                    positions.pop();
                    positions.push(clickPosition);
                    positions.push(positions[0]); // 闭合
                    addPoint(viewer,clickPosition);

                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                break;
            default:
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第2个点
                addPoint(viewer,cartesian);
                break;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
export function pickCartesian(viewer:Cesium.Viewer,windowPosition:Cesium.Cartesian2):PickResult{
    //根据窗口坐标，从场景的深度缓冲区中拾取相应的位置，返回笛卡尔坐标。
    const cartesianModel = viewer.scene.pickPosition(windowPosition);

    //场景相机向指定的鼠标位置（屏幕坐标）发射射线
    const ray = viewer.camera.getPickRay(windowPosition);
    //获取射线与三维球相交的点（即该鼠标位置对应的三维球坐标点，因为模型不属于球面的物体，所以无法捕捉模型表面）
    const cartesianTerrain = viewer.scene.globe.pick(ray,viewer.scene);

    const result = new PickResult();
    if(typeof(cartesianModel) !== 'undefined' && typeof(cartesianTerrain) !== 'undefined'){
        result.cartesian = cartesianModel || cartesianTerrain;
        result.CartesianModel = cartesianModel;
        result.cartesianTerrain = cartesianTerrain as Cesium.Cartesian3;
        result.windowCoordinates = windowPosition.clone();
        //坐标不一致，证明是模型，采用绝对高度。否则是地形，用贴地模式。
        result.altitudeMode = cartesianModel.z.toFixed(0) !== cartesianTerrain!.z.toFixed(0) ? Cesium.HeightReference.NONE:Cesium.HeightReference.CLAMP_TO_GROUND;
    }
    return result;
}
export function measureSquare(viewer:Cesium.Viewer){
    let clickStatus :boolean = false
    let positions : any[]=[]
    let labelEntity : any

    viewer.screenSpaceEventHandler.setInputAction(function (clickEvent:any) {
        clickStatus = true;
        // var cartesian = viewer.scene.pickPosition(clickEvent.position);
        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position), viewer.scene);
        if (!cartesian) {
            return;
        }
        switch (positions.length) {
            case 0:
                positions.push(cartesian.clone()); //鼠标左击 添加第1个点
                addPoint(viewer,cartesian);

                // 注册鼠标移动事件
                viewer.screenSpaceEventHandler.setInputAction(function (moveEvent:any) {
                    // var movePosition = viewer.scene.pickPosition(moveEvent.endPosition);
                    var movePosition = viewer.scene.globe.pick(viewer.camera.getPickRay(moveEvent.endPosition), viewer.scene);
                    if (!movePosition) {
                        return;
                    }

                    switch (positions.length) {
                        case 1:
                            positions.push(movePosition);
                            // addLine(viewer,positions);
                            break;

                        default:
                            if (clickStatus) {
                                positions.push(movePosition);
                            } else {
                                positions.pop();
                                positions.push(movePosition);
                            }
                            if (positions.length >= 3) {
                                // 绘制label
                                if (labelEntity) {
                                    viewer.entities.remove(labelEntity);
                                    entityCollection.splice(entityCollection.indexOf(labelEntity), 1);
                                }
                                var text = "面积：" + getArea(positions);
                                var centerPoint = getCenterOfGravityPoint(positions);
                                // 标注放高一点
                                var lnglat :any= cartographicToLnglat(
                                    Cesium.Cartographic.fromCartesian(centerPoint), viewer
                                );
                                let cartesian2 = Cesium.Cartesian3.fromDegrees(lnglat[0], lnglat[1], lnglat[2] + 20)
                                labelEntity = addLabel(viewer,cartesian2, text);
                                entityCollection.push(labelEntity);
                            }
                            break;
                    }
                    clickStatus = false;
                    viewer.scene.requestRender()
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                break;
            case 2:
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第3个点
                addPoint(viewer,cartesian);
                addPolyGon(viewer,positions);
                // 右击结束
                viewer.screenSpaceEventHandler.setInputAction(function (clickEvent:any) {
                    // var clickPosition = viewer.scene.pickPosition(clickEvent.position);
                    var clickPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position), viewer.scene);

                    positions.pop();
                    positions.push(clickPosition);
                    positions.push(positions[0]); // 闭合
                    addPoint(viewer,clickPosition);

                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                break;
            default:
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第2个点
                addPoint(viewer,cartesian);
                break;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
export function measureH(viewer:Cesium.Viewer){
    var positions:any=[]
    var labelEntity_1 : any = null // 标签实体
    var labelEntity_2 : any = null// 标签实体
    var labelEntity_3 : any = null// 标签实体

    // 注册鼠标左击事件
    viewer.screenSpaceEventHandler.setInputAction(function (clickEvent:any) {
        var cartesian = viewer.scene.pickPosition(clickEvent.position); // 坐标
        if (!cartesian) {
            return;
        }
        // 存储第一个点
        if (positions.length == 0) {
            positions.push(cartesian.clone());
            addPoint(viewer,cartesian);

            // 注册鼠标移动事件
            viewer.screenSpaceEventHandler.setInputAction(function (moveEvent:any) {
                var movePosition = viewer.scene.pickPosition(moveEvent.endPosition); // 鼠标移动的点
                if (!movePosition) {
                    return;
                }
                if (positions.length >= 2) {
                    positions.pop();
                    positions.pop();
                    positions.pop();

                    var cartographic = Cesium.Cartographic.fromCartesian(movePosition);
                    var height = Cesium.Cartographic.fromCartesian(positions[0]).height;

                    var verticalPoint = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), height);
                    positions.push(verticalPoint);
                    positions.push(movePosition);
                    positions.push(positions[0]);

                    // 绘制label
                    if (labelEntity_2) {
                        // viewer.entities.remove(labelEntity_1);
                        // entityCollection.splice(entityCollection.indexOf(labelEntity_1), 1);
                        viewer.entities.remove(labelEntity_2);
                        entityCollection.splice(entityCollection.indexOf(labelEntity_2), 1);
                        // viewer.entities.remove(labelEntity_3);
                        // entityCollection.splice(entityCollection.indexOf(labelEntity_3), 1);
                    }
                    // midpoint方法捕获到了错误

                    // // 计算中点
                    // var centerPoint_1 = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
                    // // 计算距离
                    // var lengthText_1 = "水平距离：" + getLengthText(positions[0], positions[1]);
                    //
                    // labelEntity_1 = addLabel(centerPoint_1, lengthText_1);
                    // entityCollection.push(labelEntity_1);

                    // 计算中点
                    var centerPoint_2 = Cesium.Cartesian3.midpoint(positions[1], positions[2], new Cesium.Cartesian3());
                    // 计算距离
                    var lengthText_2 = "垂直距离：" + getLengthText(positions[1], positions[2]);

                    labelEntity_2 = addLabel(viewer,centerPoint_2, lengthText_2);
                    entityCollection.push(labelEntity_2);

                    // // 计算中点
                    // var centerPoint_3 = Cesium.Cartesian3.midpoint(positions[2], positions[3], new Cesium.Cartesian3());
                    // // 计算距离
                    // var lengthText_3 = "直线距离：" + getLengthText(positions[2], positions[3]);
                    //
                    // labelEntity_3 = addLabel(centerPoint_3, lengthText_3);
                    // entityCollection.push(labelEntity_3);

                } else {
                    var verticalPoint = new Cesium.Cartesian3(movePosition.x, movePosition.y, positions[0].z);
                    positions.push(verticalPoint);
                    positions.push(movePosition);
                    positions.push(positions[0]);
                    // 绘制线
                    addLine(viewer,positions);
                }
                viewer.scene.requestRender()
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        } else {
            // 存储第二个点
            positions.pop();
            positions.pop();
            positions.pop();
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var height = Cesium.Cartographic.fromCartesian(positions[0]).height;

            var verticalPoint = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), height);
            positions.push(verticalPoint);
            positions.push(cartesian);
            positions.push(positions[0]);
            addPoint(viewer,cartesian);
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
function addPoint(viewer:Cesium.Viewer,position:any){
    console.log('addPoint', position)
    entityCollection.push(viewer.entities.add(new Cesium.Entity({
        position: position,
        point: {
            color: Cesium.Color.GREEN,
            pixelSize: 30,
            scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.0),
            translucencyByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.0)
        }
    })));
}


function addLine(viewer:Cesium.Viewer,positions: any[]){
    console.log('addLine', positions)
    var dynamicPositions = new Cesium.CallbackProperty(function () {
        return positions;
    }, false);
    entityCollection.push(viewer.entities.add(new Cesium.Entity({
        polyline: {
            positions: dynamicPositions,
            width: 4,
            material: Cesium.Color.RED
        }
    })));
    console.log(entityCollection.length)
}

function addPolyGon(viewer:Cesium.Viewer,positions: any[]){
    console.log('addPolyGon', positions)
    var dynamicPositions = new Cesium.CallbackProperty(function () {
        // https://github.com/CesiumGS/cesium/issues/8135
        // CallbackProperty no longer working for Polygon Entities #8135
        // 会报错 return positions;
        return new Cesium.PolygonHierarchy(positions);
    }, false);
    entityCollection.push(viewer.entities.add(new Cesium.Entity({
        name: '多边形',
        polygon: {
            clampToGround: true,
            hierarchy: dynamicPositions,
            /*  {
                positions: dynamicPositions.getValue()
            }, */
            material: Cesium.Color.RED.withAlpha(0.6),
            classificationType: Cesium.ClassificationType.BOTH // 贴地表和贴模型,如果设置了，这不能使用挤出高度
        },
    })));
}
function addLabel(viewer:Cesium.Viewer,centerPoint: Cartesian3, text: string){
    return viewer.entities.add(new Cesium.Entity({
        position: centerPoint,
        label: {
            text: text,
            font: '12pt sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
            fillColor: Cesium.Color.YELLOW,
            showBackground: true,//指定标签后面背景的可见性
            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8), // 背景颜色
            backgroundPadding: new Cesium.Cartesian2(6, 6),//指定以像素为单位的水平和垂直背景填充padding
            pixelOffset: new Cesium.Cartesian2(0, -25)
        }
    }));
}

function getLengthText(firstPoint:any, secondPoint:any){
    var length = Cesium.Cartesian3.distance(firstPoint, secondPoint);
    if (length > 1000) {
        var distance = (length / 1000).toFixed(2) + " 公里";
        // length = (length / 1000).toFixed(2) + " 公里";
    } else {
        var distance = length.toFixed(2) + " 米";
        // length = length.toFixed(2) + " 米";
    }
    return distance;
}

function getArea(points:any[]){
    var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
    var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

    /*角度*/
    function Angle(p1:any, p2:any, p3:any) {
        var bearing21 = Bearing(p2, p1);
        var bearing23 = Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    /*方向*/
    function Bearing(from:any, to:any) {
        from = Cesium.Cartographic.fromCartesian(from);
        to = Cesium.Cartographic.fromCartesian(to);

        var lat1 = from.latitude;
        var lon1 = from.longitude;
        var lat2 = to.latitude;
        var lon2 = to.longitude;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;
    }

    function distance(point1:any, point2:any) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }

    var res = 0;
    //拆分三角曲面

    for (var i = 0; i < points.length - 2; i++) {
        var j = (i + 1) % points.length;
        var k = (i + 2) % points.length;
        var totalAngle = Angle(points[i], points[j], points[k]);


        var dis_temp1 = distance(points[j], points[0]);
        var dis_temp2 = distance(points[k], points[0]);
        res += dis_temp1 * dis_temp2 * Math.sin(totalAngle) / 2;
        // console.log(res);
    }

    if (res < 1000000) {
        var area=Math.abs(res).toFixed(4) + " 平方米";
        // res = Math.abs(res).toFixed(4) + " 平方米";
    } else {
        var area=Math.abs(Number((res / 1000000.0).toFixed(4))) + " 平方公里";
        // res = Math.abs((res / 1000000.0).toFixed(4)) + " 平方公里";
    }
    return area;
}
/**
 * 计算多边形的中心（简单的处理）
 * @param mPoints
 * @returns {*[]}
 */
function getCenterOfGravityPoint(mPoints:any[]){
    var centerPoint = mPoints[0];
    for (var i = 1; i < mPoints.length; i++) {
        centerPoint = Cesium.Cartesian3.midpoint(centerPoint, mPoints[i], new Cesium.Cartesian3());
    }
    return centerPoint;
}
function cartographicToLnglat(cartographic:any, viewer:Cesium.Viewer) {
    if (!cartographic) return;
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var hei = cartographic.height;
    return [lng, lat, hei];
}

export function deleteAll(viewer:Cesium.Viewer){
    for (var i = 0; i < entityCollection.length; i++) {
        console.log(entityCollection[i])
        console.log("进行了",i)
        viewer.entities.remove(entityCollection[i]);
    }
    entityCollection = [];
    viewer.scene.requestRender()
    console.log("触发删除功能")
}