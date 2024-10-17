import * as Cesium from 'cesium'
import store from '@/store'
import { SceneCoordinateToWgs84 } from '@/components/mapTools/SeniorMapTools'
import {LOG2E} from "mathjs";

// 监听地图元素点击事件
export function actionEntity(mapViewer: Cesium.Viewer) {
	let handler = new Cesium.ScreenSpaceEventHandler(mapViewer.scene.canvas)
	handler.setInputAction((event: any) => {
		let pick = mapViewer.scene.pick(event.position)
		if (pick && pick.id) {
			if (pick.id._id.includes('wayLineDrawingPoint')) {
				const entity = window.cesiumViewer.entities.getById(pick.id._id)
				let cartographic = Cesium.Cartographic.fromCartesian(entity.position._value)
				const value = {
					pointId: pick.id._id,
					pointX: Cesium.Math.toDegrees(cartographic.longitude),
					pointY: Cesium.Math.toDegrees(cartographic.latitude),
					pointZ: cartographic.height
				}
				store.commit('SET_WAY_LINE_POINT_DRAWING_ACTIVE', value)
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// 改变位置、高度

export function movePoint(mapViewer: Cesium.Viewer) {
	let pointIndex = String(-1)
	let modelDragHandler = new Cesium.ScreenSpaceEventHandler(mapViewer.scene.canvas)
	modelDragHandler.setInputAction((event: any) => {
		const pickInfo = mapViewer.scene.pick(event.position)
		if (pickInfo && pickInfo.id) {
			if (pickInfo.id._id.includes('wayLineDrawingPoint')) {
				const num = pickInfo.id._id.indexOf('_')
				pointIndex = pickInfo.id._id
				pointIndex = pointIndex.slice(num + 1,pointIndex.length)
			}
			if (pickInfo.id._id.includes('wayLineDrawingFlightController')) {
				// 将相机锁定，不然后续移动实体时相机也会动
				mapViewer.scene.screenSpaceCameraController.enableRotate = false
				modelDragHandler.setInputAction((arg: any) => {
					let cartographic = SceneCoordinateToWgs84(window.cesiumViewer, arg.endPosition.x, arg.endPosition.y, store.state.wayLinePointsDrawingActive.pointZ)
					const selectedEntity = mapViewer.entities.getById(pickInfo.id._id)
					if (selectedEntity?.id.includes('wayLineDrawingFlightController')) {
						// @ts-ignore
						selectedEntity.position = Cesium.Cartesian3.fromDegrees(cartographic[0], cartographic[1], cartographic[2])
						const value = {
							addManner: 'move',
							index: pointIndex,
							sendPoint: {
								addManner: 'move',
								pointX: cartographic[0],
								pointY: cartographic[1],
								pointZ: cartographic[2],
							}
						}
						store.commit('SET_WAY_LINE_POINT_DRAWING', value)
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
				modelDragHandler.setInputAction((arg2: any) => {
					mapViewer.scene.screenSpaceCameraController.enableRotate = true
					modelDragHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
					modelDragHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
				}, Cesium.ScreenSpaceEventType.LEFT_UP)
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN)
	let modelDragHandlerHeight = new Cesium.ScreenSpaceEventHandler(mapViewer.scene.canvas)
	modelDragHandlerHeight.setInputAction( (event: any) => {
		const pickInfo = mapViewer.scene.pick(event.position)
		if (pickInfo && pickInfo.id) {
			if (pickInfo.id._id.includes('wayLineDrawingPoint')) {
				const num = pickInfo.id._id.indexOf('_')
				pointIndex = pickInfo.id._id
				pointIndex = pointIndex.slice(num + 1,pointIndex.length)
			}
			if (pickInfo.id._id.includes('wayLineDrawingFlightController')) {
				// 将相机锁定，不然后续移动实体时相机也会动
				mapViewer.scene.screenSpaceCameraController.enableRotate = false
				modelDragHandlerHeight.setInputAction((arg: any) => {
					let cartographic = SceneCoordinateToWgs84(window.cesiumViewer, arg.endPosition.x, arg.endPosition.y, store.state.wayLinePointsDrawingActive.pointZ)
					const selectedEntity = mapViewer.entities.getById(pickInfo.id._id)
					const pointPosition = store.state.wayLinePointsDrawingActive
					if (arg.endPosition.y - arg.startPosition.y > 0) {
						pointPosition.pointZ = cartographic[2] - 0.5
					} else {
						pointPosition.pointZ = cartographic[2] + 0.5
					}
					if (selectedEntity?.id.includes('wayLineDrawingFlightController')) {
						// @ts-ignore
						selectedEntity.position = Cesium.Cartesian3.fromDegrees(pointPosition.pointX, pointPosition.pointY, pointPosition.pointZ)
						const value = {
							addManner: 'move',
							index: pointIndex,
							sendPoint: {
								addManner: 'move',
								pointX: pointPosition.pointX,
								pointY: pointPosition.pointY,
								pointZ: pointPosition.pointZ,
							}
						}
						store.commit('SET_WAY_LINE_POINT_DRAWING', value)
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.ALT)
				modelDragHandlerHeight.setInputAction((arg2: any) => {
					mapViewer.scene.screenSpaceCameraController.enableRotate = true
					modelDragHandlerHeight.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
					modelDragHandlerHeight.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
					modelDragHandlerHeight.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
				}, Cesium.ScreenSpaceEventType.LEFT_UP)
			}
		}
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.ALT)
}
