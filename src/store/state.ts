import {GatewayOsd, DeviceOsd, DockOsd, checkDeviceState, checkDockState,JxDockState,JxDeviceState} from "./types/device";
import { MapCameraAttribute } from "./types/map";
import {taskFlightPlanInfo, Wayline, WayLinePoint, wayLinePointsDrawingActive} from "@/store/types/wayline";
import { waylinePlacemarkActionGroup, waylinePlacemarkAction,WayLineOriginAction } from "@/store/types/waylineAction"
import {WayLineV2, wayPointMoveV2} from "@/store/types/WayLineV2";
import {VideoFusion} from '@/components/mapTools/class/MapVideoFusionClass'
import {TilesetData} from '@/components/mapTools/class/Map3DtilesetClass'

const state = () => ({
    deviceState: {
        // remote controller, dock
        gatewayInfo: {} as {
            [sn: string]: GatewayOsd
        },
        // drone
        deviceInfo: {} as {
            [sn: string]: DeviceOsd
        },
        dockInfo: {} as {
            [sn: string]: DockOsd
        },
        currentSn: '',
        currentType: -1
    },
    deviceCurrentWaypointIndex: {} as {//存储飞机的现在飞到的航点
        [sn: string]: number
    },
    deviceTakeOffTime: {} as {//存储飞机执行任务起飞的时间
        [sn: string]: string
    },
    // 查看无人机、机场状态
    checkDeviceState: [] as checkDeviceState[],
    checkDockState: [] as checkDockState[],
    selectWayline: {} as Wayline,
    mapState: {
        mapCameraAttribute: {} as MapCameraAttribute,
    },
    wayLinePointsDrawing: [] as WayLinePoint[],
    wayLinePointsDrawingActive: {} as wayLinePointsDrawingActive,
    liveStreamState: {} as {[sn: string]: string},
    waylinePlacemarkActionGroup: {} as waylinePlacemarkActionGroup,
    waylinePlacemarkAction: [] as waylinePlacemarkAction[],
    mqttState: null as any, // mqtt 实例
    clientId: '', // mqtt 连接 唯一客户端id
    beforeprocesswaylineaction:[] as WayLineOriginAction[],
    // 执行中飞行计划信息
    taskFlightPlanInfo: [] as taskFlightPlanInfo[],
    EditingWayLine :{}as WayLineV2,
    videoFusionState: {} as {sn: string, state: boolean}[],
    jxDeviceState: {} as {[siteId: string]: JxDeviceState},
    jxDockState: {} as {[siteId: string]: JxDockState},
    selectJxWayline: {} as any,
    selectViewState: {} as {sn: string, state: boolean},
    // 新版航线规划-
    wayPointMove: {} as wayPointMoveV2,
    mapToolShow: { type: true },
    navigationType: { type: true },
    isComSaveCache: {
        isReady: false,
        isAllow: false,
        path: '',
        query: {} as any
    },
    focusWayPointByClass: {} as { id: string },
    executePlanId: '' as string,
    globalRTHHeight: 100 as number,
    executeHeight: 100 as number,
})
export type RootStateType = ReturnType<typeof state>
export default state
