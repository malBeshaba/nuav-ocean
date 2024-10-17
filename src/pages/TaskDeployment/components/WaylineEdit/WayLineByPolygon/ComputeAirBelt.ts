import * as Cesium from 'cesium'

export function MinRectangle (flightPolygon: number[][]) {
  let lonArr: number[] = []
  let latArr: number[] = []
  flightPolygon.forEach((item: number[]) => {
    lonArr.push(item[0])
    latArr.push(item[1])
  })
  lonArr.sort((a, b) => a - b)
  latArr.sort((a, b) => a - b)
  const maxLon = lonArr[lonArr.length - 1]
  const minLon = lonArr[0]
  const maxLat = latArr[latArr.length - 1]
  const minLat = latArr[0]
  return [maxLon, minLon, maxLat, minLat]
}

export function ComputeAirBelt (minRectangle: number[], groundLength: number) {
  // 航向条带数
  let CourseOverlap: number = minRectangle[5]
  // let tmp = Cesium.Cartesian3.lerp(new Cesium.Cartesian3(minRectangle[0], minRectangle[2], 100), new Cesium.Cartesian3(minRectangle[1], minRectangle[2], 100), 0.5, new Cesium.Cartesian3())
  console.log('航向条带数：', groundLength)
  // window.cesiumViewer.entities.add({
  //   id: 'tmpPolygonadfDFSDF',
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([minRectangle[0], minRectangle[3], 100, minRectangle[1], minRectangle[3], 100, minRectangle[1], minRectangle[2], 100, minRectangle[0], minRectangle[2], 100]),
  //     material: Cesium.Color.RED.withAlpha(0.5),
  //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  //   },
  //   show: true
  // })

}

class AirBelt {
  id: string
  points: number[]
  mapViewer: Cesium.Viewer
  ariBelt: any

  constructor(option: any) {
    this.id = option.id
    this.points = option.points
    this.mapViewer = option.mapViewer
  }

  initAirBelt() {
    this.ariBelt = this.mapViewer?.entities.add({
      id: this.id + 'AirBeltRectangle',
      polygon: {
        // hierarchy: Cesium.Cartesian3.fromArray(this.points),
      }
    })
  }

}
