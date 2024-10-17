import * as Cesium from 'cesium'
import { log } from 'console'

/**
 * @describe 用于计算圆形航线中航点间的距离
 * @param focusDistance 焦距
 * @param flyHeight 无人机飞行的高度 单位m
 * @param pictureSize 画幅
 * @param courseOverlap 航向重叠度
 * @returns 航点间的距离
 */
export function computeWaypoint(focusDistance:number,pictureSize:number,courseOverlap:number = 0.8){
    //  let wayPointSpace:number = 0;
    return (1-courseOverlap)*(Math.PI-2*Math.atan(pictureSize/focusDistance))
}

export class AirBelt{
    id:string
    points:Cesium.Cartesian3[]
    mapViewer:Cesium.Viewer
    ariBelt:any
    granularity:number
    radius:number
    center:{
        lat:number,
        lon:number,
        height:number
    }
    pointEntities:any[]

    constructor(option:any){
        this.id=option.id
        this.mapViewer = option.mapViewer
        this.granularity = option.granularity
        this.center=option.center
        this.points = []
        this.pointEntities = []
        this.radius = option.radius
        this.initBelt()
    }

    initBelt(){
        let ellipse = new Cesium.EllipseOutlineGeometry({
            center: Cesium.Cartesian3.fromDegrees(this.center.lat, this.center.lon),//中心点
            semiMajorAxis: this.radius,//半径
            semiMinorAxis: this.radius,//半径
            granularity:this.granularity/(2*Math.PI),
            height:this.center.height
            // granularity: this.wayPointSpace/this.radius, //0~1 圆的弧度角
        });
         
          let geometry:any = Cesium.EllipseOutlineGeometry.createGeometry(ellipse);
          this.points = []
          let values = geometry.attributes.position.values; //获取到椭圆的轮廓 几何坐标数据
          if (!values) return;
          
          let pointsLength = values.length / 3; //数组中以笛卡尔坐标进行存储 每3个值一个坐标
          for (let i = 0; i < pointsLength; i++) {
            let xyz = new Cesium.Cartesian3(values[i * 3], values[i * 3 + 1], values[i * 3 + 2]); //笛卡尔
            this.points.push(xyz);
            this.pointEntities.push(this.mapViewer.entities.add({
                id:"wayLinePoint"+String(i),
                position:xyz,
                point:new Cesium.PointGraphics({
                    pixelSize: 4,
                    color: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                  })
            }))
          }

          this.points.push(new Cesium.Cartesian3(values[0], values[1], values[2]))
          this.ariBelt = this.mapViewer.entities.add(
            {
                id:this.id,
                show: true,
                polyline:{
                    positions:this.points,
                    width:2,
                    material:new Cesium.PolylineDashMaterialProperty({
                        color: Cesium.Color.fromCssColorString('#ffffff'),
                        dashLength: 10.0,
                        dashPattern: 255.0,
                      })
                }
            }
          )
        
    }

    getWayPoints(){
        let tempPoints = this.points.pop()
        return tempPoints
    }

    destroy(){
        this.pointEntities.forEach((item)=>{
            this.mapViewer.entities.remove(item)
        })
        this.mapViewer.entities.remove(this.ariBelt)
    }

    getPoints(){
        let points:number[] = []
        for(let i = 0;i<this.points.length-1;i++){
            let cartorgraphic = Cesium.Cartographic.fromCartesian(this.points[i]);
            points.push(Cesium.Math.toDegrees(cartorgraphic.longitude))
            points.push(Cesium.Math.toDegrees(cartorgraphic.latitude))
            points.push(cartorgraphic.height)
        }
        return points
    }

}