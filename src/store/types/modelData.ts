// 文件类型
export enum ModelTypeEnum {
  ObliquePhotography = 1, 
  VectorData = 2, 
  RemoteSensing = 3, 
  ThreeDimensionalModel = 4, 
  Other = 5,
}

// 模型数据
export interface ModelData {
  dataId?: string,
  workspaceId: string,
  dataName: string,
  dataDesc?: string,
  dataType?: ModelTypeEnum,
  outerDataUrl?: string,
  innerDataPath?: string,
  importTime?: string,
  createTime?: string,
  updateTime?: string,
}
