import {RootStateType} from "./state";
import {MutationTree} from "vuex";
import {DockOsd,JxDeviceState,JxDockState} from "@/store/types/device";
import {LiveStreamParams} from "@/store/types/live";
import * as Cesium from 'cesium'
import {RemoveEntitiesByBatch} from '@/components/mapTools/BaseMapTools'
import {WayLineV2} from "@/store/types/WayLineV2";
import {WayPointActionList} from "@/store/types/WayPoint";
import store from "@/store/index";
const mutations: MutationTree<RootStateType> = {
    SET_DOCK_INFO(state: RootStateType, data: any) {
        if (Object.keys(data.host).length === 0) {
            return
        }
        if (!state.deviceState.dockInfo[data.sn]) {
            state.deviceState.dockInfo[data.sn] = {} as DockOsd
        }
        state.deviceState.currentSn = data.sn
        state.deviceState.currentType = 3
        const dock = state.deviceState.dockInfo[data.sn]
        if (data.host.sdr) {
            dock.link_osd = data.host
            return
        }
        if (data.host.job_number) {
            dock.work_osd = data.host
            return
        }
        dock.basic_osd = data.host
    },
    SET_DEVICE_INFO (state, data) {
        state.deviceState.deviceInfo[data.sn] = data.host
        state.deviceState.currentSn = data.sn
        state.deviceState.currentType = 2
    },
    CLEAR_DEVICE_INFO (state, sn) {
        state.deviceState.deviceInfo = {}
        state.deviceState.currentType = 2
        state.deviceState.currentSn = sn
    },
    SET_MAP_CAMERA_ATTRIBUTE (state, data) {
        state.mapState.mapCameraAttribute = data
    },
    SET_CURRENT_WAYPOINT_INDEX (state, data) {
        state.deviceCurrentWaypointIndex[data.sn]=data.num
        console.log("====----====这是更新的当前点"+state.deviceCurrentWaypointIndex[data.sn])
    },
    SET_WAY_LINE_POINT_DRAWING (state, data) {
        switch (data.addManner) {
            case 'first':
                state.wayLinePointsDrawing = []
                state.wayLinePointsDrawing.push(data)
            break
            case 'end':
                state.wayLinePointsDrawing.push(data)
            break
            case 'before':
                let beforeIndex = state.wayLinePointsDrawing.length - 1
                state.wayLinePointsDrawing.forEach((item, index) => {
                  const drawingPoint = item.pointX.toFixed(12)
                  const activePoint = state.wayLinePointsDrawingActive.pointX.toFixed(12)
                  if (drawingPoint === activePoint) {
                    beforeIndex = index
                  }
                })
                state.wayLinePointsDrawing.splice(beforeIndex, 0, data)
            break
            case 'after':
                let afterIndex = state.wayLinePointsDrawing.length - 1
                state.wayLinePointsDrawing.forEach((item, index) => {
                  const drawingPoint = item.pointX.toFixed(12)
                  const activePoint = state.wayLinePointsDrawingActive.pointX.toFixed(12)
                  if (drawingPoint === activePoint) {
                    afterIndex = index
                  }
                })
                state.wayLinePointsDrawing.splice(afterIndex + 1, 0, data)
            break
            case 'move':
              state.wayLinePointsDrawing[data.index] = data.sendPoint
            break
        }
    },
    CLEAR_WAY_LINE_POINT_DRAWING (state, data) {
        state.wayLinePointsDrawing[0].addManner = 'remove'
        RemoveEntitiesByBatch(window.cesiumViewer, 'wayLineDrawing')
    },
    SET_WAY_LINE_POINT_DRAWING_ACTIVE (state, data) {
        if(state.wayLinePointsDrawing[0].addManner !== 'remove') {
            state.wayLinePointsDrawingActive = data
            state.wayLinePointsDrawingActive.pointZ
        }
    },
    SET_LIVE_STREAM (state, data) {
      state.liveStreamState[data.sn] = data.vid
    },
    SET_BEFORE_PROCESS_WAYLINE_ACTION(state,data){
        state.beforeprocesswaylineaction=data
    },
    SET_MQTT_STATE (state, mqttState) {
        state.mqttState = mqttState
    },
    SET_CLIENT_ID (state, clientId) {
        state.clientId = clientId
    },
    SET_CHECK_DOCK_STATE (state, data) {
        if(state.checkDockState.length === 0) {
            state.checkDockState = []
            state.checkDockState.push({
                sn: data.sn,
                isShow: false,
                position: data.position,
                deviceSn: data.deviceSn,
                deviceType: data.deviceType,
            })
        } else {
            state.checkDockState.forEach((item, index) => {
                if(item.sn === data.sn) {
                    // state.checkDockState[index].position = data.position,
                    // state.checkDockState[index].deviceSn = data.deviceSn,
                    // state.checkDockState[index].deviceType = data.deviceType
                } else {
                    state.checkDockState.push({
                        sn: data.sn,
                        isShow: false,
                        position: data.position,
                        deviceSn: data.deviceSn,
                        deviceType: data.deviceType,
                    })
                }
            })
        }
    },
    CHECK_DOCK_STATE (state, data) {
        state.checkDockState.forEach((item, index) => {
            if(item.sn === data.device_sn) {
                state.checkDockState[index].isShow = data.isShow
            } else {
                // ElMessage.error('机场/无人机离线')
            }
        })
    },
    SET_TASK_FLIGHT_PLAN_INFO (state, data) {
        if(state.taskFlightPlanInfo.length === 0) {
            state.taskFlightPlanInfo = []
            state.taskFlightPlanInfo.push({
                flightPlanId: data.flightPlanId,
                device_sn: data.device_sn,
                taskState: false
            })
        } else {
            state.taskFlightPlanInfo.forEach((item, index) => {
                if(item.flightPlanId === data.flightPlanId) {
                } else {
                    state.taskFlightPlanInfo.push({
                        flightPlanId: data.flightPlanId,
                        device_sn: data.device_sn,
                        taskState: false,
                    })
                }
            })
        }
    },
    CHANGE_TASK_FLIGHT_PLAN_STATE (state, data) {
        if(state.taskFlightPlanInfo.length !== 0) {
            state.taskFlightPlanInfo.forEach((item, index) => {
                if(item.flightPlanId === data.flightPlanId) {
                    state.taskFlightPlanInfo[index].taskState = false
                }
            })
        }
    },
  // ————————————————
    //下面是新的航线编辑的中函数
    UPDATE_WAYLINE_INFO(state, data){
        //整体的更新正在编辑的航线
        if(data==null){
            state.EditingWayLine={}as WayLineV2
        }else {
            state.EditingWayLine=data
        }
    },
    UPDATE_WAYLINE_GLOBAL_INFO(state, data){
        //更新正在编辑的航线的全局航线参数
        if(data==null){
            state.EditingWayLine.GlobalWaylineparame={}
        }else {
            state.EditingWayLine.GlobalWaylineparame=data
        }
    },
    INSERT_WAYLINE_POINT(state, data){
        //往航线中插入航点
        if(data==null){
            //如果插入空的航点就直接返回
            return
        }else {
            //先把当前聚焦的点的信息写回航线类中，相当于保存更新的信息
            // @ts-ignore
            let temindex=state.EditingWayLine.FocusWayPoint.WayPointParam.index
            // @ts-ignore
            state.EditingWayLine.WayLineList[temindex]=state.EditingWayLine.FocusWayPoint
            //然后把新的航点插入航线列表中,并聚焦到新的航点
            // @ts-ignore
            state.EditingWayLine.WayLineList.push(data)
            state.EditingWayLine.FocusWayPoint=data
        }
    },
    // 把修改的航点的信息写回航线的列表中
    UPDATE_WAYPOINT_INFO(state){
        // @ts-ignore
        let temindex=state.EditingWayLine.FocusWayPoint.WayPointParam.index
        // @ts-ignore
        state.EditingWayLine.WayLineList[temindex]=state.EditingWayLine.FocusWayPoint
    },
    UPDATE_WAYLINE_POINT_ACTIONLIST_INFO(state, data){
        //本函数用在初始化航点动作的航点动作列表中
        if(data==null){
            // @ts-ignore
            state.EditingWayLine.FocusWayPoint.WayPointActionList={}as WayPointActionList
        }else {
            // @ts-ignore
            state.EditingWayLine.FocusWayPoint.WayPointActionList=data
        }
    },
    SET_VIDEO_FUSION_STATE(state, data){
        state.videoFusionState = data
    },
    SWITCH_FOCUS(state, data){
        //切换航点行数，就是把焦点从航点列表中读出来
        // @ts-ignore
        if(data<0||data>=state.EditingWayLine.WayLineList?.length){
            console.log("超出航点的列表限制")
            return
        }else {
            console.log("切换哩")
                // @ts-ignore
          let temindex=state.EditingWayLine.FocusWayPoint.WayPointParam.index
                // @ts-ignore
          state.EditingWayLine.WayLineList[temindex]=state.EditingWayLine.FocusWayPoint
           // @ts-ignore
            state.EditingWayLine.FocusWayPoint=state.EditingWayLine.WayLineList[data]
        }
    },
    UPDATA_WAYLINE_ACTION(state,data){
        // @ts-ignore
        if (state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action) {
            state.EditingWayLine.FocusWayPoint.WayPointActionList.action[data[0]].actionActuatorFuncParam = data[1]
        }
    },
    DELETE_WAYPOINT(state,data){
        //传入index，删除航点并赋值
        // @ts-ignore
        console.log("删除的航点索引为",data)
        // @ts-ignore
        if (data >= 0 && data < state.EditingWayLine.WayLineList.length) {
            // @ts-ignore
            if(data!=state.EditingWayLine.WayLineList.length-1){
                // @ts-ignore
                for (let i = data; i < state.EditingWayLine.WayLineList.length-1; i++) {
                    // @ts-ignore
                    state.EditingWayLine.WayLineList[i]=state.EditingWayLine.WayLineList[i+1]
                    // @ts-ignore
                    state.EditingWayLine.WayLineList[i].WayPointParam.index=i
                }
            }
            state.EditingWayLine.WayLineList?.splice(state.EditingWayLine.WayLineList.length-1,1)
        }

        console.log("删除之后的列表为",state.EditingWayLine.WayLineList)
        // @ts-ignore
        if(data==0){
            // @ts-ignore
            state.EditingWayLine.FocusWayPoint=state.EditingWayLine.WayLineList[data]
        }else {
            // @ts-ignore
            state.EditingWayLine.FocusWayPoint=state.EditingWayLine.WayLineList[data-1]
        }
         },
    DELETE_ACTION_ITEM_AND_RESORT(state,data){
        console.log(data)
        //传入要删除的动作的id，然后把从这个序号之后的所有项都往前挪，并修改序号
        if (typeof data === "number") {
            //获取action数组的长度
            // @ts-ignore
            let length = state.EditingWayLine.FocusWayPoint.WayPointActionList.action.length;
            //检查data是否是最后一项
            if (data < length - 1) {
                //遍历action数组，从data+1开始到length-1
                for (let i = data + 1; i < length; i++) {
                    //将每一项往前挪，直接进行赋值
                    // @ts-ignore
                    state.EditingWayLine.FocusWayPoint.WayPointActionList.action[i - 1] = state.EditingWayLine.FocusWayPoint.WayPointActionList.action[i];
                    //将其中的actionId项的值改为原来的值减一
                    // @ts-ignore
                    state.EditingWayLine.FocusWayPoint.WayPointActionList.action[i - 1].actionId = i - 1;
                }
            }
            // @ts-ignore
            state.EditingWayLine.FocusWayPoint.WayPointActionList.action.pop();
        }
    },
     INSERT_WAYPOINT_WITH_RANDOM_INDEX(state,data){
        console.log(data)
        const index = data.WayPointParam.index;
        // 获取列表的长度
        // @ts-ignore
        const length = state.EditingWayLine.WayLineList.length;
        // 判断是否越界
        if (index < 0 ) {
            console.error("Invalid index");
            return;
        }
        // 遍历列表，从后往前挪动数据,在最后一位挪动数据的时候为了防止数组越位，使用push
        for (let i = length - 1; i >= index; i--) {
            // 获取当前数据
            // @ts-ignore
            const item = state.EditingWayLine.WayLineList[i];
            // 更新它的 index 属性
            // @ts-ignore
            item.WayPointParam.index= i + 1;
            // 将它放到下一个位置
            if(i==length-1){
                state.EditingWayLine.WayLineList?.push(item)
            }else {
                // @ts-ignore
                state.EditingWayLine.WayLineList[i + 1] = item;
            }
        }
        // 将 data 插入到指定位置
        // @ts-ignore
        state.EditingWayLine.WayLineList[index] = data;
        console.log(state.EditingWayLine.WayLineList)
    },
    // 新版航线规划-
    LISTEN_WAYLINEPOINT_POSITION_CHANGE(state, data){
        state.wayPointMove = data
    },
    UPDATE_WAYLINEPOINT_POSITION_BY_ID(state, data){
        state.EditingWayLine.WayLineList?.forEach((item,index)=>{
            if(item.WayPointID === data.id) {
                // @ts-ignore
                item.WayPointParam.Point.coordinates = String([data.position.longitude, data.position.latitude])
                // @ts-ignore
                item.WayPointParam.executeHeight = Number(data.position.height)
            }
        })
    },
    // 无人机视角、地图视角切换
    SELECT_VIEW_STATE(state, data) {
        state.selectViewState = data
    },
    SET_MAP_TOOL_SHOW(state, data) {
        state.mapToolShow.type = data
    },
    SET_NAVIGATION_TYPE(state, data) {
        state.navigationType.type = data
    },
    CHANGE_CACHE_STYLE(state, data) {
        state.isComSaveCache = data
    },
    UPDATE_FOCUSWAYPOINT_BY_CLASS(state, data){
        if( state.focusWayPointByClass.id !== data.id) {
            state.focusWayPointByClass = data
        }
    },
    // 捷翔机库
    SET_JIEXIANG_DEVICE_INFO(state, data) {
        state.jxDeviceState[data.siteId] = data
    },
    SET_JIEXIANG_DOCK_INFO(state, data) {
        state.jxDockState[data.siteId] = data
    },

    SET_GLOBAL_RTH_HEIGHT(state, height) {
        state.globalRTHHeight = height;
    },

    SET_EXECUTE_HEIGHT(state, height) {
        state.executeHeight = height;
    }

}
export default mutations
