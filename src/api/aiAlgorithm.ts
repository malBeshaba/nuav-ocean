import request from '@/utils/request'
import {exp} from "mathjs";

export function getListByType(data: any) {
    return request({
        url: '/aiAlgorithm/selectPage',
        method: 'get',
        params: data,
    }).then(response => {
        return response.data // 返回响应数据中的 data 字段
    })
}

export function execAlgorithm(data: any) {
    return request({
        url: '/aiAlgorithm/execAlgorithm',
        method: 'get',
        params: data,
    })
}

export function stopAlgorithm(data: any) {
    return request({
        url: '/aiAlgorithm/stopAlgorithm',
        method: 'get',
        params: data,
    })
}

export function selectPage(data: any) {
    return request({
        url: '/aiAlgorithm/selectPage',
        method: 'get',
        params: data,
    })
}

interface bridegAIType {
    mediaFileIds: string[], planId: string, algorithmId: string
}
export const bridgeDetectAlgorithm = async function (body: bridegAIType) {
    const url = `/aiAlgorithm/${JSON.parse(localStorage.getItem('userInfo') as string).workspace_id}/bridgeDetectAlgorithm`
    const result = await request.post(url, body)
    return result.data
}

interface baResType {
    pageNo: number,
    pageSize: number,
    planId: string
}
export const bridgeAiResult = async function (body: baResType) {
    const url = '/aiResult/selectPage'
    const result = await request.get(url, {params: body})
    return result.data
}
