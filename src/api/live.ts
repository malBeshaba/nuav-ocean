import request from '@/utils/request'
const HTTP_PREFIX = '/manage/api/v1'
const AI_PREFIX = 'aiAlgorithm/execAlgorithm'
// 查直播流信息
export const getLivestatus = async function (livestreamName: string) {
    const url = `${HTTP_PREFIX}/live/streams/livestream/exit/${livestreamName}`
    const result = await request.get(url)
    return result.data
}

export const getAILive = async function (aicode: string, livestreamName: string) {
    const url = `${AI_PREFIX}?id=${aicode}&source=${livestreamName}&sourceout=${aicode+livestreamName}`
    const result = await request.get(url)
    return result.data
}

interface LiveParams {
    url_type?: string,
    video_quality?: string,
    url?: string,
    video_id?: string,
    video_type?: string
}

export const startLivestream = async function (body: LiveParams) {
    const url = `${HTTP_PREFIX}/live/streams/start`
    const result = await request.post(url, body)
    return result.data
}

export const stopLivestream = async function (body: LiveParams) {
    const url = `${HTTP_PREFIX}/live/streams/stop`
    const result = await request.post(url, body)
    return result.data
}

export const stopAlgorithm = async function (id: string) {
    const url = `aiAlgorithm/stopAlgorithm?id=${id}`
    const result = await request.get(url)
    return result.data
}

export const switchLive = async function (body: LiveParams) {
    const  url = `${HTTP_PREFIX}/live/streams/switch`
    const result = await request.post(url, body)
    return result.data
}

export const getLiveAddress = async function () {
    const url = `${HTTP_PREFIX}/live/streams/livestream/address`
    const result = await request.get(url)
    return result.data
}

export const setRedR = async function (device_sn: string, body: any) {
    const url = `${HTTP_PREFIX}/devices/${JSON.parse(localStorage.getItem('userInfo') as string).workspace_id}/devices/${device_sn}/property`
    const result = await request.put(url, body)
    return result.data
}
