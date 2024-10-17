import request from '@/utils/request2'

const missionConfigURL = '/uavBackend/missionConfig'
const strategyConfigURL = '/uavBackend/strategyConfig'
const remoteURL = '/uavBackend/remote'


interface pageQueryParam {
    current: Number,
    pageSize: Number,
    siteId: string,
    type: string
}
// 飞行策略
export const getMissionConfigPagingList = async function (body: pageQueryParam) {
    const url = `${missionConfigURL}/getMissionConfigPagingList`
    const result = await request.post(url, body)
    return result.data
}
// 手动飞行任务策略的详细信息
export const getManualMissionConfigDetail = async function (body: any) {
    const url = `${missionConfigURL}/getManualMissionConfigDetail`
    const result = await request.post(url, body)
    return result.data
}

// 执行飞行任务
export const excuteMission = async function (body: { id:string }) {
    const url = `${remoteURL}/excuteMission`
    const result = await request.post(url, body)
    return result.data
}

// 获取飞行策略的详细信息
export const getStrategyConfigDetail = async function (body: { id:string }) {
    const url = `${strategyConfigURL}/getStrategyConfigDetail`
    const result = await request.post(url, body)
    return result.data
}

// 获取站点所有的飞行策略
export const getStrategyDictInfo = async function (body: {siteId: string}) {
    const url = `${strategyConfigURL}/getStrategyDictInfo`
    const result = await request.post(url, body)
    return result.data
}

// 新增飞行任务
export const submitManualMissionConfig = async function (body: any) {
    const url = `${missionConfigURL}/submitManualMissionConfig`
    const result = await request.post(url, body)
    return result.data
}

interface strategyConfigQueryParam {
    current: Number,
    pageSize: Number,
    siteId: string
}
// 分页获取飞行策略
export const getStrategyConfigPagingList = async function (body: strategyConfigQueryParam) {
    const url = `${strategyConfigURL}/getStrategyConfigPagingList`
    const result = await request.post(url, body)
    return result.data
}

// 删除飞行策略
export const removeStrategyConfig = async function (body: {id:string }) {
    const url = `${strategyConfigURL}/removeStrategyConfig`
    const result = await request.post(url, body)
    return result.data
}

// 删除飞行计划
export const removeMissionConfig = async function (body: {id:string }) {
    const url = `${missionConfigURL}/removeMissionConfig`
    const result = await request.post(url, body)
    return result.data
}
