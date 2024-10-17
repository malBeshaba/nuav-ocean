import request from '@/utils/request2'

const homePageURL = '/uavBackend/site'

// 关闭舱门
export const closeHatch = async function (body: {id: string}) {
    const url = `${homePageURL}/closeHatch`
    const result = await request.post(url, body)
    return result.data
}

// 开启舱门
export const openHatch = async function (body: {id: string}) {
    const url = `${homePageURL}/openHatch`
    const result = await request.post(url, body)
    return result.data
}

// 松开xy推杆
export const openPushbeamXY = async function (body: {id: string}) {
    const url = `${homePageURL}/openPushbeamXY`
    const result = await request.post(url, body)
    return result.data
}

// 夹紧xy推杆
export const closePushbeamXY = async function (body: {id: string}) {
    const url = `${homePageURL}/closePushbeamXY`
    const result = await request.post(url, body)
    return result.data
}

// 打开空调
export const openVentilator = async function (body: {id: string}) {
    const url = `${homePageURL}/openVentilator`
    const result = await request.post(url, body)
    return result.data
}

// 关闭空调
export const closeVentilator = async function (body: {id: string}) {
    const url = `${homePageURL}/closeVentilator`
    const result = await request.post(url, body)
    return result.data
}

// 打开无人机
export const takeOff = async function (body: {id: string}) {
    const url = `${homePageURL}/takeOff`
    const result = await request.post(url, body)
    return result.data
}

// 关闭无人机
export const droneOff = async function (body: {id: string}) {
    const url = `${homePageURL}/droneOff`
    const result = await request.post(url, body)
    return result.data
}

// 开始充电
export const charge = async function (body: {id: string}) {
    const url = `${homePageURL}/charge`
    const result = await request.post(url, body)
    return result.data
}

// 重置推杆
export const resetPushbeam = async function (body: {id: string}) {
    const url = `${homePageURL}/resetPushbeam`
    const result = await request.post(url, body)
    return result.data
}

// 同时打开舱门和推杆
export const openHatchAndPushbeam = async function (body: {id: string}) {
    const url = `${homePageURL}/openHatchAndPushbeam`
    const result = await request.post(url, body)
    return result.data
}

// 打开夜降灯
export const lightOn = async function (body: {id: string}) {
    const url = `${homePageURL}/lightOn`
    const result = await request.post(url, body)
    return result.data
}

// 关闭夜降灯
export const lightOff = async function (body: {id: string}) {
    const url = `${homePageURL}/lightOff`
    const result = await request.post(url, body)
    return result.data
}
