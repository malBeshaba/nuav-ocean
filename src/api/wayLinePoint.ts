import request from '@/utils/request'
import { TaskType } from '@/store/types/task'
import { WaylineType, WayLinePointUpload } from '@/store/types/wayline'
import {getWaylineGlobalParamsByWaylineId} from '@/api/wayline'
const HTTP_PREFIX = '/wayline/api/v1'

const urlIndex = "waylinePlacemark"




// 新增航点
export const insertWayLinePoint = async function (body: WayLinePointUpload) {
  const url = `${urlIndex}/insert`
  const result = await request.post(url, body)
  return result.data
}

export const getWayLinePointByGlobalParamsId = async function (globalParamsId: string) {
  const url = `${urlIndex}/select/${globalParamsId}`
  const result = await request.get(url)
  return result.data
}

export const  generatActionGroupId= async function (body: WayLinePointUpload) {
  const url = `waylinePlacemarkActionGroup/insert`
  const result = await request.post(url, body)
  return result.data
}
export const insertWaypointACtion= async function (body: any){
  const url = `waylinePlacemarkAction/insert`
  const result = await request.post(url, body)
  return result.data
}
//传入航线文件的全部信息，然后生成航线文件
export const insertWaypoint= async function (body: any){
  const url = `wayline/insert`
  const result = await request.post(url, body)
  return result.data
}
//传入航线文件的id,然后根据id生成航线文件
export const GeneratWaylinefile= async function (waylineId: string){
  const url = `wayline/generateWaylineFile/${waylineId}`
  const result = await request.post(url)
  return result.data
}

export const updateWaypoint= async function (body: any){
  const workspaceId: string = JSON.parse(localStorage.getItem('userInfo') as string).workspace_id || ''
  const url = `wayline/${workspaceId}/updateAll`
  const result = await request.post(url, body)
  return result.data
}

export const getWaylinePointByWaylineId = async function (waylineId: string) {
  const url = `/wayline/get/${waylineId}`
  const result = await request.get(url)
  return result.data
}

export const deleteWaylineFile = async function (waylineId: string) {
  const url = `/wayline/delete/${waylineId}`
  const result = await request.delete(url)
  return result.data
}

