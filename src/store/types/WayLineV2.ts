import {WayLineGlobalParams} from "@/store/types/wayline"
import {WayPoint} from "@/store/types/WayPoint";
//航线类总共有的参数包括：
// 全局航线参数
// 航点列表
// 当前聚焦航点
export interface WayLineV2 {
    GlobalWaylineparame?: WayLineGlobalParams
    WayLineList?:WayPoint[]
    FocusWayPoint?:WayPoint
    //下面这条是航线的业务数据，存储在数据库中需要的信息
    WayLineInfo?:WayLineServiceInfo
    //下面对应的是航线的无人机系列和无人机负载类型
    DroneName?:string
    PayLoadName?:string
}
export interface WayLineServiceInfo {
    waylineId?:string
    waylineName?:string
    waylineType?:number
    waylineStatus?:number
    waylineFileId?:string
}
export interface wayPointMoveV2 {
    id: string,
    position: {
        longitude: number,
        latitude: number,
        height: number
    }
}
