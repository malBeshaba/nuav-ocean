// 文件类型
export enum FileTypeEnum {
  WideAngleImage = 1,
  ZoomImage = 2,
  InfraredImage = 3,
  WideAngleVideo = 4,
  ZoomVideo = 5,
  InfraredVideo = 6,
}

// Pilot上传的图像文件类型
export enum SubFileTypeEnum {
  NormalPicture = 0,
  Panorama = 1
}

// 媒体文件
export interface MediaFile {
  file_id: string,
  file_name: string,
  file_path: string,
  file_type?: FileTypeEnum,
  object_key: string,
  sub_file_type?: SubFileTypeEnum,
  is_original: boolean,
  drone: string,
  payload: string,
  tinny_fingerprint: string,
  fingerprint: string,
  create_time: string,
  job_id: string,
  planId?: string,
  waylineId?: string,
  preview_url: string
}

// 媒体文件
export interface VedioFile {
  videoId: string,
  planId: string,
  droneSn?: string,
  videoName?: string,
  videoFilePath?: string,
  videoPlayUrl?: string,
  videoCoverUrl?: string,
  videoDuration?: string,
  videoStartTime?: string,
  videoEndTime?: string,
  createTime: string,
  updateTime: string
}

enum PreviewEnum {
  notPreview = 0,
  isPreview = 1
}
interface FileManagementDTO  {
  id: string,
  fileName: string,
  fileType: string,
  fileSize: string,
  isNeedPreview: PreviewEnum,
  relativePath: string,
  bucketName: string,
  previewPath: string,
  dronesId: string,
  lng: number,
  lat: number,
  taskId: string,
  userTaskId: string,
  createTime: string,
  updateTime: string
}
export interface aiResultFile {
  aiResultId: string,
  planId: string,
  arithmeticId: string,
  resultFileId: string,
  rowFileId: string,
  createTime: string,
  updateTime: string,
  fileManagementDTO: FileManagementDTO
}
