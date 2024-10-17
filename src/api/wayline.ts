import request from '@/utils/request'
import { TaskType } from '@/store/types/task'
import { WaylineType, WayLinePointUpload, WayLineGlobalParams, Wayline } from '@/store/types/wayline'
const HTTP_PREFIX = '/wayline/api/v1'
const WayLineGlobalParamsURL = '/waylineGlobalParams'
import { CURRENT_CONFIG } from '@/utils/config'

export interface WaylineList {
    waylineId: string,
    waylineName: string,
    waylineFileId: string,
    createTime: string,
    updateTime: string,
    waylineStatus: number,
    waylineType: number
}

export interface templateContent {
    Folder: Folder,
    missionConfig: missionConfig
}

export interface Folder {
    autoFlightSpeed: number,
    caliFlightEnable: boolean,
    gimbalPitchMode: number,
    globalHeight: number,
    globalUseStraightLine: number,
    templateId: number,
    templateType: string,
    globalWaypointHeadingParam: {
        waypointHeadingAngle: number,
        waypointHeadingMode: string,
        waypointHeadingPathMode: string,
        waypointPoiPoint: string
    },
    globalWaypointTurnMode: string,
    placemark: Array<Placemark>,
    waypointTurnParam: {
        waypointTurnDampingDist: number,
        waypointTurnMode: string
    }
}

export interface Placemark {
    Point: {
        coordinates: string
    },
    executeHeight: number,
    index: number,
    useGlobalHeadingParam: number,
    useGlobalHeight: number,
    useGlobalSpeed: number,
    useGlobalTurnParam: number,
    useStraightLine: number,
    waypointSpeed: number,
}

export interface missionConfig {
    droneInfo: {
        droneEnumValue: number,
        droneSubEnumValue: number
    },
    executeRCLostAction: string,
    exitOnRCLost: string,
    finishAction: string,
    flyToWaylineMode: string,
    globalRTHHeight: number,
    globalTransitionalSpeed: number,
    takeOffSecurityHeight: number,
    payloadInfo: {
        payloadEnumValue: number,
        payloadPositionIndex: number,
        payloadSubEnumValue: number
    }
}

export const getWaylineList = async function (pageNo: number, pageSize: number) {
    const url = `/wayline/selectPage?pageNo=${pageNo}&pageSize=${pageSize}`
    const result = await request.get(url)
    return result.data
}

export const getWaylineById = async function (id: string) {
    const url = `/wayline/get/${id}`
    const result = await request.get(url)
    return result.data
}

// 新增航线
export const insertWayline = async function (body: Wayline) {
    const url = "/wayline/insert"
    const result = await request.post(url, body)
    return result.data
}

// 删除航线
export const deleteWaylineById = async function (id: string) {
    const url = `/wayline/delete/${id}`
    const result = await request.get(url)
    return result.data
}

interface updateWaylineParams {
    waylineId: string,
    waylineName: string,
    waylineStatus: number,
}
export const updateWayline = async function (body: updateWaylineParams) {
    const url = "/wayline/update"
    const result = await request.post(url, body)
    return result.data
}

// 新建航线全局参数
export const insertWaylineGlobalParams = async function (body: WayLineGlobalParams) {
    const url = `${WayLineGlobalParamsURL}/insert `
    const result = await request.post(url, body)
    return result.data
}

export const getWaylineGlobalParamsById = async function (id: string) {
    const url = `${WayLineGlobalParamsURL}/get/${id}`
    const result = await request.get(url)
    return result.data
}

export const getWaylineGlobalParamsByWaylineId = async function (waylineId: string) {
    const url = `${WayLineGlobalParamsURL}/select/${waylineId}`
    const result = await request.get(url)
    return result.data
}

export const deleteWaylineGlobalParamsByIds = async function ([id]: string[]) {
    const url = `${WayLineGlobalParamsURL}/delete/${id}`
    const result = await request.get(url)
    return result.data
}

export const updateWaylineGlobalParams = async function (body: WayLineGlobalParams) {
    const url = `${WayLineGlobalParamsURL}/update`
    const result = await request.post(url, body)
    return result.data
}

export const insertGenerateWaylineFile = async function (waylineId: string, deviceSn: string) {
    const url = `/wayline/generateWaylineFile/${waylineId}/${deviceSn}`
    const result = await request.post(url)
    return result.data
}

export const getFlyTrajectoriesByPlanId = async function (id: string) {
    const url = `/flyTrajectories/selectList/${id}`
    const result = await request.get(url)
    return result.data
}

export const findWaylinePlacemarkById = async function (workspace_id: string,wayline_id: string) {
    const url = `${HTTP_PREFIX}/workspaces/${workspace_id}/findWaylinePlacemarkById/${wayline_id}`
    const result = await request.get(url)
    return result.data
}
interface importWaylineParams{
    requestUrl: string,
    token: string,
    siteId: string,
    waylineFileId: string
}
export const importWayline = async function (body: importWaylineParams) {
    const url = `/other/importWayline`
    body.requestUrl = CURRENT_CONFIG.baseURL2 + 'uavBackend/strategyConfig/analysisKmzFileAndSaveInfo'
    const result = await request.post(url,body)
    return result.data
}


export const exportWaylineById = async function (workspace_id: string, id: string) {
    const url = `${HTTP_PREFIX}/workspaces/${workspace_id}/waylines/${id}/url`
    const result = await request.get(url, { responseType: 'blob' })
    if (result.data.type === 'application/json') {
        const reader = new FileReader()
        reader.onload = function (e) {
            const text = reader.result as string
            const result = JSON.parse(text)
            // ElMessage.error(result.message)
        }
        reader.readAsText(result.data, 'utf-8')
    } else {
        return result.data
    }
}
