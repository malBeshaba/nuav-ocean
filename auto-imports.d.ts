/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-auto-import
import * as Cesium from 'cesium';
export {}
declare global {
  const ElLoading: typeof import('element-plus/es')['ElLoading']
  const ElMessage: typeof import('element-plus/es')['ElMessage']
  const ElNotification: typeof import('element-plus/es')['ElNotification']
  /**
     * cesiumViewer: Cesium.Viewer 定义全局地图画布
     */
  interface Window {
      cesiumViewer: Cesium.Viewer;
      aerialView: Cesium.Viewer;
  }
}
