import request from '@/utils/request'
const MEDIA_API_PREFIX = '/media/api/v1'

const API = '/dronesVideo'

export interface droneVideoInfoType {
  videoId: string,
  planId: string,
  droneSn: string,
  videoName: string,
  videoFilePath: string,
  videoPlayUrl: string,
  videoCoverUrl: string,
  videoDuration: number,
  videoStartTime: string,
  videoEndTime: string,
  createTime: string,
  updateTime: string
}

export const getVideoListBySN = async function (droneSn: string) {
  const url = `${API}`
  return request({
    url: url,
    method: 'get',
    params: {
      droneSn: droneSn
    },
  }).then(res => {
    return res.data
  })
}
