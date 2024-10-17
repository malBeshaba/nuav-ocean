//@ts-nocheck
import { lineString, polygon } from '@turf/helpers'
import { lineIntersect } from '@turf/turf'

function generateEquidistantLines(polygonCoords: number[][], spacing: number): number[][][] {
  // 创建多边形对象
  const poly = polygon([polygonCoords]);
  // debugger

  // 生成多边形的外接矩形
  // const bbox = poly.bbox;
  const bbox = MinRectangle(polygonCoords);

  // 计算垂直方向的直线段数量
  const numVerticalLines = Math.floor((bbox[2] - bbox[0]) / spacing) + 1;

  // 生成垂直方向的直线段
  const verticalLines: number[][][] = [];
  for (let i = 0; i < numVerticalLines; i++) {
    const x = bbox[0] + i * spacing;
    const line = lineString([[x, bbox[1]], [x, bbox[3]]]);
    verticalLines.push(line.geometry.coordinates);
  }

  return verticalLines;
}

function findIntersection(polygonCoords: number[][], lineCoords: number[][]): number[][] | null {
  // 创建多边形对象
  const poly = polygon([polygonCoords]);

  // 创建直线对象
  const line = lineString(lineCoords);

  // 计算多边形和直线的交点
  const intersection = lineIntersect(poly, line);

  if (intersection.features.length === 0) {
    return null;
  } else {
    return intersection.features.map((feature) => feature.geometry.coordinates);
  }
}

// 最小外接矩形，代替bbox
function MinRectangle (polygonCoords: number[][]) {
  let lonArr: number[] = []
  let latArr: number[] = []
  polygonCoords.forEach((item: number[]) => {
    lonArr.push(item[0])
    latArr.push(item[1])
  })
  lonArr.sort((a, b) => a - b)
  latArr.sort((a, b) => a - b)
  const maxLon = lonArr[lonArr.length - 1]
  const minLon = lonArr[0]
  const maxLat = latArr[latArr.length - 1]
  const minLat = latArr[0]
  return [minLon, minLat, maxLon, maxLat]
}

// // 多边形顶点坐标
// const polygonCoords: number[][] = [[0, 1], [0, 4], [4, 3], [4, 0]];
//
// // 间距
// const spacing = 1.2;
//
// // 生成等间距的直线段
// const lines = generateEquidistantLines(polygonCoords, spacing);
//
// // 查找交点
// const intersection: (number[][] | null)[] = [];
// for (const line of lines) {
//   intersection.push(findIntersection(polygonCoords, line));
// }
//
// console.log(intersection);

export function creatAirBelt(polygonCoords: number[][], spacing: number) {
  // 生成等间距的直线段
  let spacingDegree = spacing / (6371004 * Math.PI / 180)
  const lines = generateEquidistantLines(polygonCoords, spacingDegree);
  // 查找交点
  const intersection: (number[][] | null)[] = [];
  lines.forEach((item, index) => {
    intersection.push(findIntersection(polygonCoords, item))
  })
  console.log('intersection', intersection)
  return intersection
}
