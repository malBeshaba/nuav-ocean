import request from '@/utils/request'
const HTTP_PREFIX = '/control/api/v1'

interface ConnectParams {
    clientId: string,
    expireSec: number
}
export const connectControl = async function (body: ConnectParams) {
    const url = `${HTTP_PREFIX}/workspaces/${JSON.parse(localStorage.getItem('userInfo') as string).workspace_id}/drc/connect`
    const result = await request.post(url, body)
    return result.data
}
interface enterParams {
    clientId: string,
    dockSn: string,
    expireSec: number,
    deviceInfo: {
        osdFrequency: number,
        hsiFrequency: number
    }
}
export const enterControl = async function (body: enterParams) {
    const url = `${HTTP_PREFIX}/workspaces/${JSON.parse(localStorage.getItem('userInfo') as string).workspace_id}/drc/enter`
    const result = await request.post(url, body)
    return result.data
}

export const exitControl = async function (body: enterParams) {
    const url = `${HTTP_PREFIX}/workspaces/${JSON.parse(localStorage.getItem('userInfo') as string).workspace_id}/drc/exit`
    const result = await request.post(url, body)
    return result.data
}
export const getFlightPower = async function (sn: string) {
    const url = `${HTTP_PREFIX}/devices/${sn}/authority/flight`
    const result = await request.post(url)
    return result.data
}
export const controlDock = async function (sn: string, service_identifier: string, body: any) {
    const url = `${HTTP_PREFIX}/devices/${sn}/jobs/${service_identifier}`
    const result = await request.post(url, body)
    return result.data
}
