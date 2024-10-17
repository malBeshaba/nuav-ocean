import request from '@/utils/request'
const MEDIA_API_PREFIX = '/media/api/v1'
// 获取飞行任务
interface getFlightPlanParams {
    pageNo: number,
    pageSize: number,
    planName?: string,
    deviceSn?: string,
    taskType?: string,
    planStatus?: string
}
export const getFlightPlan = async function (workspace_id: string, body: getFlightPlanParams) {
    return request({
        url: `/droneFlightPlan/${workspace_id}/selectPage`,
        method: 'get',
        params: body
    }).then(response => {
        return response.data
    })
}

// 新增飞行任务
export interface insertFlightTaskParams {
    flightPlanId?: string,
    planName: string,
    waylineId: string,
    deviceSn: string,
    waylineType: number,
    taskType: number,
    planTaskType: number,
    executeTime?: number,
    rthAltitude: number,
    outOfControl: number,
    flyTrajectories?: number[],
}
export const insertFlightTask = async function (body: insertFlightTaskParams) {
    const url = "/droneFlightPlan/insert"
    const result = await request.post(url, body)
    return result.data
}


// 执行飞行任务
interface exectFlightTaskParams {
    planId: string,
    deviceType: number
}
export const exectFlightTask = async function (workspace_id: string, body: exectFlightTaskParams) {
    const url = `/droneFlightPlan/${workspace_id}/execFlightPlan`
    const result = await request.post(url, body)
    return result.data
}

export const getFlightPlanById = async function (id: string) {
    const url = `droneFlightPlan/get/${id}`
    const result = await request.get(url)
    return result.data
}

interface FlightPlanUpload {
    flightPlanId: string,
    flyTrajectories: string,
}
export const updateFlightPlan = async function (body: FlightPlanUpload) {
    const url = `/droneFlightPlan/update`
    const result = await request.post(url, body)
    return result.data
}

export const deleteFlightPlan = async function (ids: String) {
    const url = `/droneFlightPlan/delete/${ids}`
    const result = await request.get(url)
    return result.data
}
