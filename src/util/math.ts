import { Point, VerbalWidget } from "../widget/verbalWidget";

export class Vector2 {
  x: number = 0;
  y: number = 0;
}

const RAD_FLAG = Math.PI / 180;

/**
 * 判断点是否在图形中
 * @param px
 * @param py
 * @param points
 */
export function judgePointOnShape(px: number, py: number, points: Point[]) {
  let flag = false;
  for (let i = 0; i < points.length; ++i) {
    const nextIndex = i + 1 >= points.length ? 0 : i + 1;
    const sx = points[i].x;
    const tx = points[nextIndex].x;
    if (sx < px && tx < px) continue;
    const sy = points[i].y;
    const ty = points[nextIndex].y;
    if ((sx === px && sy === py) || (tx === px && ty === py)) return true;

    if (
      sy === ty &&
      sy === py &&
      ((sx > px && tx < px) || (sx < px && tx > px))
    )
      return true;

    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      let x = sx + ((py - sy) * (tx - sx)) / (ty - sy);
      if (x === px) return true;
      if (x > px) flag = !flag;
    }
  }
  return flag;
}

/**
 * 角度转弧度
 * @param degree
 * @returns
 */
export function degreeToRadian(degree: number) {
  return fourFiveTo(degree * RAD_FLAG);
}

/**
 * 框选框位置计算
 * @param p1
 * @param p2
 * @returns
 */
export function boxSelectCalPos(p1: Point, p2: Point) {
  const x = Math.min(p1.x, p2.x),
    y = Math.min(p1.y, p2.y);
  const width = Math.max(p1.x, p2.x) - x,
    height = Math.max(p1.y, p2.y) - y;
  return { x, y, width, height };
}

/**
 * 一个点绕着另一个点旋转一定角度之后的点
 * @param p
 * @param op
 * @param degree
 * @returns
 */
export function rotatePoint(p: Point, op: Point, degree: number) {
  const rad = degreeToRadian(degree);
  const sinRad = Math.sin(rad);
  const cosRad = Math.cos(rad);
  const x = (p.x - op.x) * cosRad - (p.y - op.y) * sinRad + op.x;
  const y = (p.x - op.x) * sinRad + (p.y - op.y) * cosRad + op.y;
  return { x: fourFiveTo(x), y: fourFiveTo(y) };
}

/**
 * 判断框选重叠情况
 * @param target 目标矩形 -- 可能有旋转
 * @param box 框选框 -- 不会有旋转
 */
export function boxSelectJudge(target: Point[], box: Point[]) {
  for (const point of target) {
    if (point.x < box[0].x || point.x > box[1].x) return false;
    if (point.y < box[0].y || point.y > box[2].y) return false;
  }
  return true;
}

/**
 * 框选之后计算总的组的位置
 * @param widgets
 * @returns
 */
export function boxSelectGroupPos(widgets: VerbalWidget[]) {
  const p1: Point[] = widgets[0].getBoundingBoxPoints();
  let xmin = p1[0].x,
    xmax = p1[0].x,
    ymin = p1[0].y,
    ymax = p1[0].y;
  for (let i = 1; i < p1.length; ++i) {
    xmin = Math.min(xmin, p1[i].x);
    xmax = Math.max(xmax, p1[i].x);
    ymin = Math.min(ymin, p1[i].y);
    ymax = Math.max(ymax, p1[i].y);
  }
  for (let i = 1; i < widgets.length; ++i) {
    const p = widgets[i].getBoundingBoxPoints();
    for (const point of p) {
      xmin = Math.min(xmin, point.x);
      xmax = Math.max(xmax, point.x);
      ymin = Math.min(ymin, point.y);
      ymax = Math.max(ymax, point.y);
    }
  }
  return { x: xmin, y: ymin, width: xmax - xmin, height: ymax - ymin };
}

/**
 * 计算向量夹角
 * @param v1
 * @param v2
 * @returns
 */
export function calVectorDegree(v1: Vector2, v2: Vector2) {
  const cos =
    (v1.x * v2.x + v1.y * v2.y) /
    (Math.sqrt(v1.x * v1.x + v1.y * v1.y) *
      Math.sqrt(v2.x * v2.x + v2.y * v2.y));
  const dir = v1.x * v2.y - v1.y * v2.x;
  const degree = fourFiveTo(Math.acos(cos) * 57.3);
  if (dir >= 0) return degree;
  return -degree;
}

/**
 * 返回一个精度为2的四舍五入后的数
 * @param num
 * @returns
 */
export function fourFiveTo(num: number) {
  num = Math.round(num * 100) / 100;
  return Number(num.toFixed(2));
}
