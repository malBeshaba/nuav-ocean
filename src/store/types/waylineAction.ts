export interface waylinePlacemarkActionGroup {
  placemarkActionGroupId?: string,
  placemarkId?: string,
  actionGroupId?: string,
  actionGroupStartIndex?: number,
  actionGroupEndIndex?: number,
  actionGroupMode?: string,
  actionTrigger?: actionTrigger,
  createTime?: string,
  updateTime?: string,
}

interface actionTrigger {
  actionTriggerType?: string,
  actionTriggerParam?: string,
}

export interface waylinePlacemarkAction {
  placemarkActionId?: string,
  placemarkActionGroupId?: string,
  actionId?: string,
  actionActuatorFunction?: string,
  takePhotoParam?: takePhotoParam,
  startRecordParam?: startRecordParam,
  stopRecordParam?: stopRecordParam,
  focusParam?: focusParam,
  zoomParam?: zoomParam,
  customDirNameParam?: customDirNameParam,
  gimbalRotateParam?: gimbalRotateParam,
  rotateYawParam?: rotateYawParam,
  hoverParam?: hoverParam,
  createTime?: string,
  updateTime?: string,
}

interface takePhotoParam {
  payloadPositionIndex?: number,
  fileSuffix?: string,
  payloadLensIndex?: string,
  useGlobalPayloadLensIndex?: number,
}

interface startRecordParam {
  payloadPositionIndex?: number,
  fileSuffix?: string,
  payloadLensIndex?: string,
  useGlobalPayloadLensIndex?: number,
}

interface stopRecordParam {
  payloadPositionIndex?: number,
  payloadLensIndex?: string,
}

interface focusParam {
  payloadPositionIndex?: number,
  isPointFocus?: number,
  focusX?: number,
  focusY?: number,
  focusRegionWidth?: number,
  focusRegionHeight?: number,
  isInfiniteFocus?: number,
}

interface zoomParam {
  payloadPositionIndex?: number,
  focalLength?: number,
}

interface customDirNameParam {
  payloadPositionIndex?: number,
  directoryName?: string,
}

interface gimbalRotateParam {
  payloadPositionIndex?: number,
  gimbalHeadingYawBase?: string,
  gimbalRotateMode?: string,
  gimbalPitchRotateEnable?: number,
  gimbalPitchRotateAngle?: number,
  gimbalRollRotateEnable?: number,
  gimbalRollRotateAngle?: number,
  gimbalYawRotateEnable?: number,
  gimbalYawRotateAngle?: number,
  gimbalRotateTimeEnable?: number,
  gimbalRotateTime?: number,
}

interface rotateYawParam {
  aircraftHeading?: number,
  aircraftPathMode?: string,
}

interface hoverParam {
  hoverTime?: number,
}

//下面是前端原始的航点的动作的数据结构
export interface WayLineOriginAction{
  index?:number,
  param?:object
}
