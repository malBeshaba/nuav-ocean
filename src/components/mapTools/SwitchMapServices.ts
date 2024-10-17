import * as Cesium from "cesium";
import { loadTianDiTu3DTerrain,loadTianDiTuVector } from "./SwitchMapServicesLoadTianDiTu";
import { gaode2DImage, gaoDe2DShp } from "./SwitchMapServicesLoadGaoDeMap";
import { clearMapLayers } from "./ClearMapLayers";

export function switchTianDiTuMap(mapViewer: Cesium.Viewer, MapType: string) {  
  clearMapLayers();
  switch (MapType) {
    case 'TianDiTu3DTerrain':
      // 天地图三维地形图
      loadTianDiTu3DTerrain(mapViewer)
      break;
    case 'Gaode2DImage':
      // 高德影像图
      gaode2DImage(mapViewer)
      break;
    case 'GaoDe2DShp':
      // 高德影像图
      gaoDe2DShp(mapViewer)
      break;
    case 'TianDiTu2DShp':
      loadTianDiTuVector(mapViewer)
      break;
    default:
      break;
  } 

}
