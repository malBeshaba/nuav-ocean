//在最前面写上使用方法，航点类的组成是参考大疆的航线文件中设置的
//主要是每一个航点作为数组中的一个对象
//每次新增航点只需要填完下面的属性即可
import {WayLinePoint} from "@/components/mapTools/class/MapWayLinePointClass";
import store from "@/store";
import {reactive} from "vue";

export interface WayPoint {
    WayPointParam?:WayPointParam
    //在后端的接口文档中有一项startActionGroup
    //这一项是飞向首航点的动作，现在我们的飞行系统中还没有可以设置这个动作的地方所以这里暂时不加上这一项
    WayPointActionList?:WayPointActionList
    WayPointID: string
    WayPointPosition?: WayLinePoint
}
export interface WayPointParam {
    Point?:{
        coordinates:string
    }
    index?:number
    // ellipsoidHeight:number 这两项暂时无需使用，不使用全局高度时才需要这两个属性
    // height:number
    executeHeight?:number
    waypointSpeed?:number
    // waypointHeadingParam:{
    //     waypointHeadingMode:string
    //     waypointHeadingAngle:number
    //     waypointPoiPoint:"0.000000,0.000000,0.000000"
    //     waypointHeadingPathMode:string
    //     waypointHeadingPoiIndex:number
    // } 在需要自定义航点转向模式的时候设置
    waypointTurnParam?:{
        waypointTurnMode?:string
        waypointTurnDampingDist?:number
    }
    useGlobalHeight?:1
    useGlobalSpeed?:1
    useGlobalHeadingParam?:1
    useGlobalTurnParam?:1
    useStraightLine?:1
}
//还需要将航点的动作加入到航点动作列表中
export interface WayPointActionList {
    //前面几项是动作组的参数
    //后面的列表存储航点的动作
    actionGroupId?:number
    actionGroupStartIndex?:number
    actionGroupEndIndex?:number
    actionGroupMode?:"sequence"
    //下面是动作的触发器
    actionTrigger?:{
        actionTriggerType?:string
        actionTriggerParam?:number
    }
    action?:WayPointaction[
        //这里是以数组形式存储的动作组
    ]
}
export interface WayPointaction{
    actionId?:number,
    actionName?:string,//这个是原来大疆的没有的，记得写成航线文件的时候删掉
    actionActuatorFunc?:string,
    actionActuatorFuncParam?:{
    }
}
export interface UpLoadWayPoint {
    //原来的waypoint多了一些在上传的时候不需要的内容
    WayPointParam?:WayPointParam
    WayPointActionList?:WayPointActionList
}

const dictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'


//下面的几个函数分别代表传入点在前面后面最后，这几个函数名字的最后面的英文字母代表插入的位置
//但是这几个函数的内部还有不少的冗余的代码懒得改了
export function InitializationWaypointLastPosition(coordinate:string, height:number, speed:number,pointInfo:any = null){
    if(store.state.EditingWayLine.WayLineList==undefined){
        store.state.EditingWayLine.WayLineList=[]
    }
    // console.log("store.state.EditingWayLine.WayLineList",store.state.EditingWayLine.WayLineList)
    // console.log("sy123",coordinate,height,speed,pointInfo)
    let waypointindex=store.state.EditingWayLine.WayLineList.length
    const waypointglobalpara=reactive({
        Point:{
            coordinates:coordinate
        },
        index:waypointindex,
        executeHeight:height,
        waypointSpeed:speed,
        waypointTurnParam:{
            waypointTurnMode:"toPointAndStopWithDiscontinuityCurvature",
            waypointTurnDampingDist:0.2
        },
        useGlobalHeadingParam:1,
        useGlobalHeight:1,
        useGlobalSpeed:1,
        useGlobalTurnParam:1,
        useStraightLine:1
    }as WayPointParam);
    const waypointactionlist=reactive({
        actionGroupId:waypointindex+1,
        actionGroupStartIndex:waypointindex,
        actionGroupEndIndex:waypointindex,
        actionGroupMode:"sequence",
        //下面是动作的触发器
        actionTrigger:{
            actionTriggerType:"reachPoint",
        },
        action: []
    }as WayPointActionList)
    console.log("sy123pointInfo",pointInfo)
    if (pointInfo!=null){
        waypointglobalpara.Point.coordinates=pointInfo.Point.coordinates
        waypointglobalpara.executeHeight=pointInfo.executeHeight
        waypointglobalpara.waypointSpeed=pointInfo.waypointSpeed
        waypointglobalpara.waypointTurnParam=pointInfo.waypointTurnParam
        if (pointInfo.actionGroup){
            waypointactionlist.actionGroupId = pointInfo.actionGroup[0].actionGroupId
            waypointactionlist.action = pointInfo.actionGroup[0].action
            if (waypointactionlist.action){
                for(let i=0;i<waypointactionlist.action.length;i++){
                    if(waypointactionlist.action[i].actionActuatorFunc == 'startRecord'){
                        waypointactionlist.action[i].actionName = 'StartRecord'
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'stopRecord'){
                        waypointactionlist.action[i].actionName = 'StopRecord'
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == ''){
                        waypointactionlist.action[i].actionName = 'StopEqualIntervalTakePhoto'
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'hover'){
                        waypointactionlist.action[i].actionName = 'Hover'
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'rotateYaw'){
                        waypointactionlist.action[i].actionName = 'DroneYaw'
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'gimbalRotate'){
                        if(waypointactionlist.action[i].actionActuatorFuncParam.gimbalYawRotateEnable){
                            waypointactionlist.action[i].actionName = 'GimbalYaw'
                        }else{
                            waypointactionlist.action[i].actionName = 'GimbalPitch'
                        }
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'takePhoto'){
                        if(waypointactionlist.action[i].actionActuatorFuncParam.hoverTime){
                            waypointactionlist.action[i].actionName = 'StartEqualDistanceIntervalTakePhoto'
                        }else{
                            waypointactionlist.action[i].actionName = 'TakePhoto'
                        }
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'zoom'){
                        waypointactionlist.action[i].actionName = 'Zoom'
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'customDirName'){
                        waypointactionlist.action[i].actionName = 'NewFolder'
                    }
                    else if(waypointactionlist.action[i].actionActuatorFunc == 'customFileName'){

                    }
                    // waypointactionlist.action[i].actionName = 'TakePhoto'
                }
            }

            // waypointactionlist.actionGroupId = pointInfo.actionGroup[0].actionGroupId
            // waypointactionlist.action = pointInfo.actionGroup[0].action
            // waypointactionlist.action[0].actionName = 'TakePhoto'
        }
    }
    console.log("sy123waypointactionlist",waypointactionlist)
    let coor = coordinate.split(",");
    // console.log("现在的坐标为：",coor)
    // 生成14位随机数，用于航点ID
    let randomID = ''
    for (let i = 0; i < 14; i++) {
        randomID += dictionary[Math.floor(Math.random() * dictionary.length)]
    }
    const tempoint=reactive({
        WayPointParam:waypointglobalpara,
        WayPointActionList:waypointactionlist,
        WayPointID: randomID,
    }as WayPoint)
    // console.log("st",waypointactionlist)
    // console.log("sy123tempoint",tempoint)
    if(store.state.EditingWayLine.FocusWayPoint!=null&&waypointindex!=0){
        //如果不是初始化的第一个点，还是先把航点的信息写回列表中
        store.commit("UPDATE_WAYPOINT_INFO")
    }
    store.state.EditingWayLine.FocusWayPoint=tempoint
    store.state.EditingWayLine.WayLineList.push(tempoint)
    // console.log("sy123store.state.EditingWayLine.FocusWayPoint",store.state.EditingWayLine.FocusWayPoint)
    // console.log("sy123store.state.EditingWayLine.WayLineList",store.state.EditingWayLine.WayLineList)
    // console.log("创建新航点成功")
}

//index是指你要插入的点的位置
export function InitializationWaypointFrontPosition(coordinate:string, height:number, speed:number, PointIndex:number){
    //前面的代码还是初始化点的内部信息，三个函数的区别还是在插入的点的位置上
    if(store.state.EditingWayLine.WayLineList==undefined){
        store.state.EditingWayLine.WayLineList=[]
    }
    let waypointindex=PointIndex
    // console.log("现在的航点为：",waypointindex)
    const waypointglobalpara=reactive({
        Point:{
            coordinates:coordinate
        },
        index:waypointindex,
        executeHeight:height,
        waypointSpeed:speed,
        waypointTurnParam:{
            waypointTurnMode:"toPointAndStopWithDiscontinuityCurvature",
            waypointTurnDampingDist:0.2
        },
        useGlobalHeadingParam:1,
        useGlobalHeight:1,
        useGlobalSpeed:1,
        useGlobalTurnParam:1,
        useStraightLine:1
    }as WayPointParam);
    //上面是航点的全局信息，下面的是初始化航点的航点动作组
    const waypointactionlist=reactive({
        actionGroupId:waypointindex+1,
        actionGroupStartIndex:waypointindex,
        actionGroupEndIndex:waypointindex,
        actionGroupMode:"sequence",
        //下面是动作的触发器
        actionTrigger:{
            actionTriggerType:"reachPoint",
        },
        action:[]
    }as WayPointActionList)
    // 生成14位随机数，用于航点ID
    let randomID = ''
    for (let i = 0; i < 14; i++) {
        randomID += dictionary[Math.floor(Math.random() * dictionary.length)]
    }
    const tempoint=reactive({
        WayPointParam:waypointglobalpara,
        WayPointActionList:waypointactionlist,
        WayPointID: randomID,
    }as WayPoint)

    //初始化完成之后，就需要把焦点的信息先写回列表中，然后再把点插入到列表中
    store.commit("UPDATE_WAYPOINT_INFO")
    store.state.EditingWayLine.FocusWayPoint=tempoint
    store.commit("INSERT_WAYPOINT_WITH_RANDOM_INDEX",tempoint)

    // console.log("创建新航点成功")
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function InitializationWaypointByWaylineInfo (waylineInfo:any){
    console.log("sy",waylineInfo)
    for(let i =0;i<=waylineInfo.length-1;i++){
        // 写一下此处等待0.5s
        await delay(500)
        // if(i==0){
        InitializationWaypointLastPosition(waylineInfo[i].Point.coordinates,waylineInfo[i].executeHeight,waylineInfo[i].waypointSpeed,waylineInfo[i])
        // InitializationWaypointLastPositionWithAction(waylineInfo[i].Point.coordinates,waylineInfo[i].executeHeight,waylineInfo[i].waypointSpeed,waylineInfo[i],waylineInfo[i].actionGroup)
        // }else {
        //     InitializationWaypointFrontPosition(waylineInfo[i].Point.coordinates,waylineInfo[i].executeHeight,waylineInfo[i].waypointSpeed,i-1,waylineInfo[i])
        // }
    }
}
