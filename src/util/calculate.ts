import { Point } from "../widget/someTypes";
import { VerbalWidget } from "../widget/verbalWidget";

const FLAG_CONST = Math.PI / 180;

/**
 * 射线法判断点是否在图形内部
 * @param x
 * @param y
 * @param widget
 * @returns
 */
export function judgePointOnWidget(
  x: number,
  y: number,
  widget: VerbalWidget
): boolean {
  const pathPoints = widget.getPathPoints();
  return judgePointOnShape(x, y, pathPoints);
}

/**
 * 判断点是否在一个图形中
 * @param x
 * @param y
 * @param points
 * @returns
 */
export function judgePointOnShape(x: number, y: number, points: Point[]) {
  let px1,
    px2,
    py1,
    py2,
    count = 0;
  for (let i = 1; i < points.length; ++i) {
    px1 = points[i].x;
    px2 = points[i - 1].x;
    if (px1 < x && px2 < x) continue;
    py1 = points[i].y;
    py2 = points[i - 1].y;
    if ((py1 < y && py2 > y) || (py1 > y && py2 < y)) ++count;
  }
  px1 = points[0].x;
  px2 = points[points.length - 1].x;
  if (px1 >= x || px2 >= x) {
    py1 = points[0].y;
    py2 = points[points.length - 1].y;
    if ((py1 < y && py2 > y) || (py1 > y && py2 < y)) ++count;
  }
  return (count & 1) === 1;
}

export function judgePointOnBounding(x: number, y: number, points: Point[]) {
  let px1,
    px2,
    py1,
    py2,
    count = 0;
  for (let i = 1; i < points.length; ++i) {
    px1 = points[i].x;
    px2 = points[i - 1].x;
    if (px1 < x && px2 < x) continue;
    py1 = points[i].y;
    py2 = points[i - 1].y;
    if ((py1 <= y && py2 >= y) || (py1 >= y && py2 <= y)) ++count;
  }
  return (count & 1) === 1;
}

/**
 * 将角度转成弧度
 * @param degree
 * @returns
 */
export function degreeToAngle(degree: number) {
  return degree * FLAG_CONST;
}

/**
 * (nx, ny) 绕 (ox, oy) 旋转 degree 之后的坐标
 * @param nx
 * @param ny
 * @param ox
 * @param oy
 * @param degree
 * @returns
 */
export function pointRotate(
  nx: number,
  ny: number,
  ox: number,
  oy: number,
  degree: number
): Point {
  const x = (nx - ox) * Math.cos(degree) - (ny - oy) * Math.sin(degree) + ox;
  const y = (nx - ox) * Math.sin(degree) + (ny - oy) * Math.cos(degree) + oy;
  return { x, y };
}

/**
 * 判断两个包围盒是否重叠
 * @param widget1
 * @param widget2
 */
export function judgeBoundingBoxOverlap(
  widget1: VerbalWidget,
  widget2: VerbalWidget
) {
  const boundingBoxPoints1: Point[] = widget1.getBoundingBoxPoints();
  const boundingBoxPoints2: Point[] = widget2.getBoundingBoxPoints();
}
