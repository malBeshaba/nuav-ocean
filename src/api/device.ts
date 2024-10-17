import request from '@/utils/request'
import { DeviceCmd, DeviceCmdItemAction } from '@/store/types/device-cmd'

const HTTP_PREFIX = '/manage/api/v1'
const CMD_API_PREFIX = '/control/api/v1'

/**
 * 获取设备信息列表
 */
interface getDeviceParams {
    workspace_id: string,
    page: Number,
    page_size: Number,
    domain: Number
}
export const getBindingDevices = async function (body: getDeviceParams) {
    const url = `${HTTP_PREFIX}/devices/${body.workspace_id}/devices/bound?&page=${body.page}&page_size=${body.page_size}&domain=${body.domain}`
    const result = await request.get(url)
    return result.data
}

/**
 * 根据设备号获取设备信息列表
 */
interface getDeviceBySnParams {
    workspace_id: string,
    device_sn: string
}
export const getBindingDeviceBySn = async function (body: getDeviceBySnParams) {
    const url = `${HTTP_PREFIX}/devices/${body.workspace_id}/devices/${body.device_sn}`
    const result = await request.get(url)
    return result.data
}


/**
 * 发送机场控制指令
 * @param params
 * @returns
 */
export interface SendCmdParams {
    dock_sn: string,
    device_cmd: DeviceCmd,
}
interface PostSendCmdBody {
    action: DeviceCmdItemAction
}

// 发送指令
export async function postSendCmd (params: SendCmdParams, body?: PostSendCmdBody) {
    // console.log('body', typeof body)
    const url = `${CMD_API_PREFIX}/devices/${params.dock_sn}/jobs/${params.device_cmd}`
    if (body !== undefined) {
        const resp = await request.post(url, body)
        return resp.data
    } else {
        const resp = await request.post(url, {})
        return resp.data
    }
}

/**
 * 通过无人机设备号获取机场设备号
 * @param params
 * @returns
 */
// export
interface getDeviceSnByDroneSnParams {
    workspace_id: string,
    drone_sn: string
}
export const getDockSnByDroneSn = async function ( body: getDeviceSnByDroneSnParams ) {
    const url = `${HTTP_PREFIX}/devices/${body.workspace_id}/devices/${body.drone_sn}/getParentDevice`
    const result = await request.get(url)
    return result.data
}

export const updateDroneInfo = async function (body: any) {
    const url = `${HTTP_PREFIX}/devices/${body.workspace_id}/devices/${body.device_sn}`
    const result = await request.put(url, body)
    return result.data
}
