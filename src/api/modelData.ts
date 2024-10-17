import request from '@/utils/request'
import { ModelData } from '@/store/types/modelData'
import axios from "axios";
import {booleanClockwise} from "@turf/turf";

/**
 * 获取地图模型列表
 */
interface getModelDataParams {
    pageNo: number,
    pageSize: number,
}

export const getModelDataList  = async function (body: getModelDataParams) {
    return request({
        url: '/mapModelData/selectPage',
        method: 'get',
        params: body
    }).then(response => {
        return response.data // 返回响应数据中的 data 字段
    })
}



export const getResponseUrlData = async function (url: string) {
    let data=true
    await axios.get(url)
        .then( (res)  =>  {
            //console.log('1111',res,data)
        })
        .catch( (err)  =>  {
            data=false
            //console.log('2222',err,data)
        })
    return data
};
export const insertModelData = async function (body: ModelData) {
    const url = "/mapModelData/insert"
    const result = await request.post(url, body)
    return result.data
}
