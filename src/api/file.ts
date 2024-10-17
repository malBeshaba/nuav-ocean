import request from '@/utils/request'

const MEDIA_API_PREFIX = '/media/api/v1'

/**
 * 获取文件列表
 */
interface getFilesListParams {
    page: string,
    page_size: string,
    device_sn?: string,
    planId?: string,
    fileTypes?: string
}
export const getFilesList  = async function (workspace_id: string, body: getFilesListParams) {
    return request({
        url: `${MEDIA_API_PREFIX}/files/${workspace_id}/getFilesList`,
        method: 'get',
        params: body
    }).then(response => {
        return response.data // 返回响应数据中的 data 字段
    })
}

/**
 * 根据id获取文件列表
 */
export const getFilesListByFlightPlanId  = async function (workspace_id: string, flight_plan_id: string, body: getFilesListParams) {
    return request({
        url: `${MEDIA_API_PREFIX}/files/${workspace_id}/${flight_plan_id}/getFilesListByFlightPlanId`,
        method: 'get',
        params: body
    }).then(response => {
        return response.data // 返回响应数据中的 data 字段
    })
}

/**
 * 获取录像文件列表
 */
interface getDronesVideoParams {
    pageNo: number,
    pageSize: number,
    flightPlanId?: string,
}
export const getDronesVideo  = async function (body: getDronesVideoParams) {
    return request({
        url: '/dronesVideo',
        method: 'get',
        params: body
    }).then(response => {
        return response.data // 返回响应数据中的 data 字段
    })
}