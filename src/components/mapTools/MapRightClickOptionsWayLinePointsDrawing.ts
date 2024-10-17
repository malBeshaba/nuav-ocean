import * as Cesium from 'cesium'
import { RemoveEntitiesById, DrawPolyline} from './BaseMapTools'
import { WayLinePoint } from '@/store/types/wayline'
import { DrawWayLinePoint } from './BaseMapToolsCreatePoint'

// 线属性
const polylineLabel = new Cesium.PolylineDashMaterialProperty({
	color: Cesium.Color.fromCssColorString('#65DDBC'),
	dashLength: 30.0,
	dashPattern: 255.0,
})

// 点属性
const pointLabel = new Cesium.PointGraphics({
	pixelSize: 10,
	color: Cesium.Color.RED,
	outlineColor: Cesium.Color.WHITE,
	outlineWidth: 2,
})

/**
 *
 * @param mapViewer:Cesium.Viewer 当前地图画布
 * @param newVal: WayLinePoint[] 航点数组
 * @param taskID: string 任务ID
 * @constructor
 */
export function WayLinePointsDrawing(mapViewer:Cesium.Viewer, newVal: WayLinePoint[], taskID: string) {

	// 清除之前的航点
	const entities = mapViewer.entities.values
	const wayLinePointID = taskID + 'wayLineDrawingPoint'
	const wayLinePointIDArr: string[] = []
	entities.forEach( (item) => {
		if (wayLinePointID.search(item.id)) {
			wayLinePointIDArr.push(item.id)
		}
	})

	wayLinePointIDArr.forEach( (item) => {
		if (item.includes(wayLinePointID) && !item.includes('flightController')) {
			RemoveEntitiesById(window.cesiumViewer, item)
		}
	})

	// 航线绘制
	const wayLineID = taskID + 'wayLineDrawing'
	const polyLine: number[] = []
	newVal.forEach( (item, index) => {
		polyLine.push(item.pointX)
		polyLine.push(item.pointY)
		polyLine.push(item.pointZ)
		DrawWayLinePoint(window.cesiumViewer, wayLinePointID + index, index + 1, [item.pointX, item.pointY, item.pointZ])
		// DrawPoint(window.cesiumViewer, wayLinePointID + index, [item.pointX, item.pointY, item.pointZ], pointLabel)
	})
	RemoveEntitiesById(window.cesiumViewer, wayLineID)
	DrawPolyline(window.cesiumViewer, wayLineID, polyLine, polylineLabel)
}
