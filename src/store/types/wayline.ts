// 航线类型
export enum WaylineType {
  NormalWaypointWayline = 0, // 普通航点航线
  AccurateReshootingWayline = 1 // 精准复拍航线
}

export interface WaylineFile {
  id: string,
  name: string,
  drone_model_key: any,
  payload_model_keys: string[],
  template_types: WaylineType[],
  update_time: number,
  user_name: string,
}

export interface WayLineGlobalParams {
  globalParamsId?: string,
  waylineId?: string,
  flyToWaylineMode?: string,
  finishAction?: string,
  exitOnRCLost?: string,
  executeRCLostAction?:string,
  takeOffSecurityHeight?: number,
  globalTransitionalSpeed?: number,
  globalRTHHeight?:number,
  droneInfo?: droneInfo,
  payloadInfo?: payloadInfo,
  templateType?: string,
  autoFlightSpeed?: number,
  globalWaypointTurnMode?: string,
  globalUseStraightLine?: number,
  gimbalPitchMode?: string,
  globalHeight?: number,
  globalWaypointHeadingParam?: globalWaypointHeadingParam,
  executeHeightMode?: string,
  payloadParam?: payloadParam,
  createTime?: string,
  updateTime?: string,
}

export interface droneInfo {
  droneEnumValue?: number,
  droneSubEnumValue?: number,
}

export interface payloadInfo {
  payloadEnumValue?: number,
  payloadSubEnumValue?: number,
  payloadPositionIndex?: number,
}

export interface globalWaypointHeadingParam {
  waypointHeadingMode?: string,
  waypointPoiPoint?: string,
  waypointHeadingAngle?: number,
  waypointHeadingPathMode?: string,
  waypointHeadingPoiIndex?: string,
}

export interface payloadParam {
  payloadPositionIndex?: number,
  focusMode?: string,
  meteringMode?: string,
  dewarpingEnable?: number,
  returnMode?: string,
  samplingRate?: number,
  scanningMode?: string,
  modelColoringEnable?: number,
  imageFormat?: string,
}

export interface WayLinePointUpload {
  placemarkId?: string,
  globalParamsId: string,
  pointX: number,
  pointY: number,
  pIndex: number,
  executeHeight: number,
  waypointSpeed?: number,
  useGlobalSpeed?: number,
  useStraightLine?: number,
  useGlobalHeight?: number,
  useGlobalHeadingParam?: number,
  waypointHeadingParam?: WaypointHeadingParam,
  useGlobalTurnParam?: number,
  waypointTurnParam?: WayPointTurnParam,
  createTime?: string,
  updateTime?: string
}

export interface WaypointHeadingParam {
  waypointHeadingMode: string,
  waypointHeadingAngle: number,
  waypointPoiPoint: string,
  waypointHeadingAngleEnable: number,
  waypointHeadingPoiIndex: number
}

export interface WayPointTurnParam {
  waypointTurnMode: string,
  waypointTurnDampingDist: number,
}

export interface WayLinePoint {
  addManner: string,
  pointX: number,
  pointY: number,
  pointZ: number
}

export interface wayLinePointsDrawingActive {
  pointId: string,
  pointX: number,
  pointY: number,
  pointZ: number,
}

export interface Wayline{
  waylineId?: string,
  waylineName: string,
  waylineType?: string,
  waylineFileId?: string,
  createTime?: string,
  updateTime?: string
}

// 任务中航线
export interface taskFlightPlanInfo {
  flightPlanId: string,
  device_sn: string,
  taskState: boolean
}
